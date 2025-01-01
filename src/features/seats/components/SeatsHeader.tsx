import { Header } from '@/shared/components/Header';
import type { Session } from '@/features/sessions/types/session';

interface SeatsHeaderProps {
  session: Session;
}

export function SeatsHeader({ session }: SeatsHeaderProps) {
  return (
    <Header
      title={session.movieTitle}
      subtitle={`${session.room} • ${session.technology} • ${session.time}`}
    />
  );
} 