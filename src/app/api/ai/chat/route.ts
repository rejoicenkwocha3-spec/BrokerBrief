import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data: membership } = await supabase
      .from('organisation_members')
      .select('organisation_id, organisations(name)')
      .eq('user_id', user.id)
      .limit(1)
      .single();

    if (!membership) return NextResponse.json({ error: 'No organisation' }, { status: 403 });

    const orgId = membership.organisation_id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orgRaw = (membership as any).organisations;
    const orgName: string = (Array.isArray(orgRaw) ? orgRaw[0]?.name : orgRaw?.name) ?? 'your brokerage';

    const { messages, conversationId } = await request.json() as {
      messages: { role: string; content: string }[];
      conversationId?: string;
    };

    if (!messages?.length) return NextResponse.json({ error: 'No messages' }, { status: 400 });

    const userMessage = messages[messages.length - 1];
    const userQuery = userMessage.content;

    // Fetch context data
    const [
      { data: clients },
      { data: deals },
      { data: meetings },
      { data: tasks },
    ] = await Promise.all([
      supabase.from('clients').select('id, first_name, last_name, email, company, status').eq('organisation_id', orgId).limit(50),
      supabase.from('deals').select('id, title, stage, value, probability, expected_close_date, clients(first_name, last_name)').eq('organisation_id', orgId).limit(50),
      supabase.from('meetings').select('id, title, status, scheduled_at, notes, ai_summary, clients(first_name, last_name)').eq('organisation_id', orgId).order('scheduled_at', { ascending: false }).limit(20),
      supabase.from('tasks').select('id, title, status, priority, due_date').eq('organisation_id', orgId).neq('status', 'completed').limit(30),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const normalizeClient = (raw: any) => Array.isArray(raw) ? (raw[0] ?? null) : (raw ?? null);

    const contextData = `
CLIENTS (${clients?.length ?? 0} total):
${clients?.map((c: any) => `- ${c.first_name} ${c.last_name}${c.company ? ` (${c.company})` : ''} — ${c.status}`).join('\n') ?? 'None'}

DEALS (${deals?.length ?? 0} total):
${deals?.map((d: any) => {
  const client = normalizeClient(d.clients);
  return `- ${d.title}${client ? ` / ${client.first_name} ${client.last_name}` : ''} — Stage: ${d.stage}${d.value ? ` / $${d.value}` : ''}${d.probability != null ? ` / ${d.probability}% probability` : ''}`;
}).join('\n') ?? 'None'}

MEETINGS (recent):
${meetings?.map((m: any) => {
  const client = normalizeClient(m.clients);
  return `- ${m.title}${client ? ` with ${client.first_name} ${client.last_name}` : ''} — ${m.status}${m.scheduled_at ? ` on ${new Date(m.scheduled_at).toLocaleDateString()}` : ''}${m.notes ? `\n  Notes: ${m.notes.substring(0, 200)}` : ''}`;
}).join('\n') ?? 'None'}

TASKS (open):
${tasks?.map((t) => `- ${t.title} — ${t.status} / ${t.priority} priority${t.due_date ? ` / due ${new Date(t.due_date).toLocaleDateString()}` : ''}`).join('\n') ?? 'None'}
`;

    const systemPrompt = `You are BrokerBrief AI Associate, an intelligent business assistant for ${orgName}. You have access to live business data from their brokerage management platform.

Your role is to help the brokerage team with:
- Analysing client relationships and identifying follow-up needs
- Reviewing deal pipeline status and recommending actions
- Summarising meeting notes and extracting insights
- Highlighting tasks and priorities
- Answering business questions about the brokerage

IMPORTANT RULES:
- Only use the data provided. Never make up client names, deal values, or meeting details.
- Be concise and actionable. Business users need quick, clear answers.
- When data is empty, say so and suggest next steps.
- Format responses clearly with bullet points or numbered lists when appropriate.

CURRENT BUSINESS DATA:
${contextData}

Today's date: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`;

    // Save or get conversation
    let convId = conversationId;
    if (!convId) {
      const { data: conv } = await supabase
        .from('ai_conversations')
        .insert({ organisation_id: orgId, user_id: user.id, title: userQuery.substring(0, 60) })
        .select('id')
        .single();
      convId = conv?.id;
    }

    if (convId) {
      await supabase.from('ai_messages').insert({ conversation_id: convId, role: 'user', content: userQuery });
    }

    // Call Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        message: "AI Associate is not configured. Please add your GEMINI_API_KEY environment variable to enable AI features.",
        conversationId: convId,
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL ?? 'gemini-2.0-flash-exp',
      systemInstruction: systemPrompt,
    });

    const chatHistory = messages.slice(0, -1).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history: chatHistory });
    const result = await chat.sendMessage(userQuery);
    const responseText = result.response.text();

    if (convId) {
      await supabase.from('ai_messages').insert({ conversation_id: convId, role: 'assistant', content: responseText });
    }

    return NextResponse.json({ message: responseText, conversationId: convId });
  } catch (err) {
    console.error('AI chat error:', err);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
