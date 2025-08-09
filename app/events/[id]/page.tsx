import { EventPageContent } from './client-page';

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  return <EventPageContent eventId={id} />;
}