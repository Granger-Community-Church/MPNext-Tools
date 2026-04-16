import { EventCheckin } from './event-checkin';
import { parseToolParams } from '@/lib/tool-params';

interface EventCheckinPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EventCheckinPage({ searchParams }: EventCheckinPageProps) {
  const params = await parseToolParams(await searchParams);

  return <EventCheckin params={params} />;
}
