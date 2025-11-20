import AlertInspectClient from '@/components/modules/alerts/[id]/AlertInspectClient';
import { verifySession } from '@/app/_lib/session';
import type { Session } from '@/types/types';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string>>;
}) {
  const { id } = await params;
  const qsObj = (await searchParams) ?? {};
  const qs = new URLSearchParams(qsObj).toString();

  const session: Session | null = await verifySession();

  return <AlertInspectClient id={id} qs={qs} session={session} />;
}