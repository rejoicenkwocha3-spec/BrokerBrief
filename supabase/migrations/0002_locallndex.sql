-- Locallndex data model migration
-- Adds: business_profiles, locations, visibility_snapshots, review_summaries,
--        tracked_competitors, ai_recommendations, subscriptions
-- Updates: profiles table with new fields

-- ============================================================
-- 1. Update profiles table
-- ============================================================
ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS first_name         text,
  ADD COLUMN IF NOT EXISTS last_name          text,
  ADD COLUMN IF NOT EXISTS job_title          text,
  ADD COLUMN IF NOT EXISTS phone              text,
  ADD COLUMN IF NOT EXISTS avatar_url         text,
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false;

-- ============================================================
-- 2. business_profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS business_profiles (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        text NOT NULL,
  category    text,
  address     text,
  city        text,
  website     text,
  phone       text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own business profiles"
  ON business_profiles
  FOR ALL
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- 3. locations
-- ============================================================
CREATE TABLE IF NOT EXISTS locations (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_profile_id uuid NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  name                text NOT NULL,
  address             text,
  city                text,
  country             text,
  google_place_id     text,
  created_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own locations"
  ON locations
  FOR ALL
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- 4. visibility_snapshots
-- ============================================================
CREATE TABLE IF NOT EXISTS visibility_snapshots (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_profile_id uuid NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  score               numeric(5,2) NOT NULL DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  local_rank          integer,
  search_impressions  integer,
  map_views           integer,
  recorded_at         timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE visibility_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own visibility snapshots"
  ON visibility_snapshots
  FOR ALL
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS visibility_snapshots_user_biz_idx
  ON visibility_snapshots(user_id, business_profile_id, recorded_at DESC);

-- ============================================================
-- 5. review_summaries
-- ============================================================
CREATE TABLE IF NOT EXISTS review_summaries (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_profile_id uuid NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  platform            text NOT NULL,
  rating              numeric(3,2) NOT NULL DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  total_reviews       integer NOT NULL DEFAULT 0,
  positive_pct        numeric(5,2),
  negative_pct        numeric(5,2),
  neutral_pct         numeric(5,2),
  summary_text        text,
  recorded_at         timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE review_summaries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own review summaries"
  ON review_summaries
  FOR ALL
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- 6. tracked_competitors
-- ============================================================
CREATE TABLE IF NOT EXISTS tracked_competitors (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_profile_id uuid NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
  competitor_name     text NOT NULL,
  competitor_website  text,
  competitor_category text,
  visibility_score    numeric(5,2),
  review_rating       numeric(3,2),
  total_reviews       integer,
  notes               text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE tracked_competitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own tracked competitors"
  ON tracked_competitors
  FOR ALL
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- 7. ai_recommendations
-- ============================================================
CREATE TABLE IF NOT EXISTS ai_recommendations (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_profile_id uuid REFERENCES business_profiles(id) ON DELETE SET NULL,
  priority            text NOT NULL DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
  category            text,
  title               text NOT NULL,
  description         text,
  action_items        jsonb,
  is_dismissed        boolean NOT NULL DEFAULT false,
  created_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own ai recommendations"
  ON ai_recommendations
  FOR ALL
  USING  (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================
-- 8. subscriptions
-- ============================================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan            text NOT NULL CHECK (plan IN ('starter','growth','scale')),
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','active','cancelled','expired')),
  selar_order_id  text UNIQUE,
  started_at      timestamptz,
  expires_at      timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscription (read-only: writes only via service-role webhook)
CREATE POLICY "Users read own subscription"
  ON subscriptions
  FOR SELECT
  USING (user_id = auth.uid());

-- Service role can write subscriptions (payment webhook uses service role key)
-- INSERT/UPDATE/DELETE require service role (no authenticated user policy intentionally)

-- ============================================================
-- 9. updated_at trigger helper
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'business_profiles_updated_at') THEN
    CREATE TRIGGER business_profiles_updated_at
      BEFORE UPDATE ON business_profiles
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'tracked_competitors_updated_at') THEN
    CREATE TRIGGER tracked_competitors_updated_at
      BEFORE UPDATE ON tracked_competitors
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'subscriptions_updated_at') THEN
    CREATE TRIGGER subscriptions_updated_at
      BEFORE UPDATE ON subscriptions
      FOR EACH ROW EXECUTE FUNCTION set_updated_at();
  END IF;
END;
$$;
