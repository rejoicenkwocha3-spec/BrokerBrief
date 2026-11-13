import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-12 h-12 text-base' };

export function Avatar({ firstName, lastName, imageUrl, size = 'md', className }: AvatarProps) {
  const initials = getInitials(firstName, lastName);
  if (imageUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={imageUrl} alt={initials} className={cn('rounded-full object-cover', sizes[size], className)} />;
  }
  return (
    <div className={cn('rounded-full bg-forest text-white flex items-center justify-center font-semibold flex-shrink-0', sizes[size], className)}>
      {initials}
    </div>
  );
}
