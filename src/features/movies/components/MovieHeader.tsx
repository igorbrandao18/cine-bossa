import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Header } from '@/shared/components/Header';
import type { Session } from '@/features/sessions/types/session';

interface MovieHeaderProps {
  session: Session;
}

export function MovieHeader({ session }: MovieHeaderProps) {
  const formattedDate = format(
    new Date(session.date),
    "EEEE, d 'de' MMMM",
    { locale: ptBR }
  );

  return (
    <Header
      title={session.movieTitle}
      details={[
        { icon: 'calendar', text: formattedDate },
        { icon: 'clock-outline', text: session.time },
        { icon: 'theater', text: `Sala ${session.room}` }
      ]}
    />
  );
} 