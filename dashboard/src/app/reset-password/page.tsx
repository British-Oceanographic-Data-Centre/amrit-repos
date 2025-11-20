import ResetPasswordForm from '@/components/modules/auth/ResetPasswordForm';

type SP = { token?: string | string[] };

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SP>;
}) {
  const sp = await searchParams;
  const raw = sp?.token;
  const token =
    typeof raw === 'string' ? raw : Array.isArray(raw) ? raw[0] : '';

  return <ResetPasswordForm token={token} />;
}