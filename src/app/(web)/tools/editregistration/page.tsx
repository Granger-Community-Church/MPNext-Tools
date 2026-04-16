import { EditRegistration } from './edit-registration';
import { parseToolParams } from '@/lib/tool-params';

interface EditRegistrationPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function EditRegistrationPage({ searchParams }: EditRegistrationPageProps) {
  const params = await parseToolParams(await searchParams);

  return <EditRegistration params={params} />;
}
