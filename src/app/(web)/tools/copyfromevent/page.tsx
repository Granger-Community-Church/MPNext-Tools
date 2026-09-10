import { CopyFromEvent } from './copy-from-event';
import { parseToolParams } from '@/lib/tool-params';

interface CopyFromEventPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CopyFromEventPage({ searchParams }: CopyFromEventPageProps) {
  const params = await parseToolParams(await searchParams);

  return <CopyFromEvent params={params} />;
}

export async function generateMetadata() {
  return {
    title: 'Copy From Event',
  };
}
