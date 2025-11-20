'use client';

import * as React from 'react';
import ProfileFields from './ProfileFields';
import type { Me, MePatchPayload } from '@/types/me';
import { gatewayFetchViaProxy } from '@/lib/gateway/gatewayFetchViaProxy.client';
import { CountryOption } from '@/types/types';
import { normalizeErrorMessage } from '@/lib/utils/normalizeErrorMessage';

type Props = {
  me: Me | null;
  loading: boolean;
  onUpdated?: (updated: Partial<Me>) => void;
  openSnack: (msg: string, sev?: 'success' | 'error') => void;
};

const t = (v: string) => (v?.trim?.() ?? '') || null;

export default function ProfileForm({ me, loading, onUpdated, openSnack }: Props) {
  const [busy, setBusy] = React.useState(false);
  const [firstName, setFirstName] = React.useState(me?.firstName ?? '');
  const [lastName, setLastName] = React.useState(me?.lastName ?? '');
  const [email, setEmail] = React.useState(me?.email ?? '');
  const [title, setTitle] = React.useState(me?.title ?? '');
  const [tel, setTel] = React.useState(me?.tel ?? '');
  const [address, setAddress] = React.useState(me?.address ?? '');
  const [orcid, setOrcid] = React.useState(me?.orcid ?? '');
  const [countryId, setCountryId] = React.useState<number | null>(me?.country?.id ?? null);
  const [country, setCountry] = React.useState<CountryOption | null>(me?.country ?? null);
  const [hidePublic, setHidePublic] = React.useState<boolean>(!!me?.hideContactInfoFromPublic);

  React.useEffect(() => {
    setFirstName(me?.firstName ?? '');
    setLastName(me?.lastName ?? '');
    setEmail(me?.email ?? '');
    setTitle(me?.title ?? '');
    setTel(me?.tel ?? '');
    setAddress(me?.address ?? '');
    setOrcid(me?.orcid ?? '');
    setCountryId(me?.country?.id ?? null);
    setCountry(me?.country ?? null);
    setHidePublic(!!me?.hideContactInfoFromPublic);
  }, [me]);

  const refetchMe = React.useCallback(async (): Promise<Me | null> => {
    try {
      const fresh = await gatewayFetchViaProxy<Me>('GET', '/oceanops/auth/me');
      setFirstName(fresh?.firstName ?? '');
      setLastName(fresh?.lastName ?? '');
      setEmail(fresh?.email ?? '');
      setTitle(fresh?.title ?? '');
      setTel(fresh?.tel ?? '');
      setAddress(fresh?.address ?? '');
      setOrcid(fresh?.orcid ?? '');
      setCountryId(fresh?.country?.id ?? null);
      setCountry(fresh?.country ?? null);
      setHidePublic(!!fresh?.hideContactInfoFromPublic);
      return fresh ?? null;
    } catch {
      return null;
    }
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const payload: MePatchPayload = {
        firstName: t(firstName),
        lastName: t(lastName),
        title: t(title),
        tel: t(tel),
        address: t(address),
        orcid: t(orcid),
        countryId: countryId ?? null,
        hideContactInfoFromPublic: hidePublic,
        email: t(email),
      };

      await gatewayFetchViaProxy('PATCH', '/oceanops/auth/me', payload);

      const fresh = await refetchMe();
      if (fresh) onUpdated?.(fresh);
      openSnack('Profile updated', 'success');
    }  catch (err: unknown) {
      openSnack(normalizeErrorMessage(err), 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleReset = () => {
    setFirstName(me?.firstName ?? '');
    setLastName(me?.lastName ?? '');
    setEmail(me?.email ?? '');
    setTitle(me?.title ?? '');
    setTel(me?.tel ?? '');
    setAddress(me?.address ?? '');
    setOrcid(me?.orcid ?? '');
    setCountry(me?.country ?? null);
    setCountryId(me?.country?.id ?? null);
    setHidePublic(!!me?.hideContactInfoFromPublic);
  };

  return (
    <ProfileFields
      firstName={firstName}
      lastName={lastName}
      email={email}
      title={title}
      tel={tel}
      address={address}
      orcid={orcid}
      country={country}
      hidePublic={hidePublic}
      disabled={busy || loading}
      onChangeFirstName={setFirstName}
      onChangeLastName={setLastName}
      onChangeEmail={setEmail}
      onChangeTitle={setTitle}
      onChangeTel={setTel}
      onChangeAddress={setAddress}
      onChangeOrcid={setOrcid}
      onChangeCountryId={setCountryId}
      onToggleHidePublic={setHidePublic}
      onSubmit={handleSave}
      onReset={handleReset}
    />
  );
}
