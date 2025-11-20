'use client';

import * as React from 'react';
import {
  Stack,
  TextField,
  Switch,
  FormControlLabel,
  Box,
  Card,
  CardContent,
  CardHeader,
  Button,
} from '@mui/material';
import CountrySelect from '@/components/shared/inputs/CountrySelect';
import { CountryOption } from '@/types/types';

type Props = {
  firstName: string;
  lastName: string;
  email: string;
  title: string | null;
  tel: string | null;
  address: string | null;
  orcid: string | null;
  country: CountryOption | null;
  hidePublic: boolean;
  disabled: boolean;

  onChangeFirstName: (v: string) => void;
  onChangeLastName: (v: string) => void;
  onChangeEmail: (v: string) => void;
  onChangeTitle: (v: string) => void;
  onChangeTel: (v: string) => void;
  onChangeAddress: (v: string) => void;
  onChangeOrcid: (v: string) => void;
  onChangeCountryId: (v: number | null) => void;
  onToggleHidePublic: (v: boolean) => void;

  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
};

export default function ProfileFields({
  firstName,
  lastName,
  email,
  title,
  tel,
  address,
  orcid,
  hidePublic,
  disabled,
  country,
  onChangeFirstName,
  onChangeLastName,
  onChangeEmail,
  onChangeTitle,
  onChangeTel,
  onChangeAddress,
  onChangeOrcid,
  onChangeCountryId,
  onToggleHidePublic,
  onSubmit,
  onReset,
}: Props) {
  
  return (
    <Card variant="outlined">
      <CardHeader title="Profile" subheader="Update your basic information" />
      <CardContent>
        <Box component="form" onSubmit={onSubmit}>
          <Stack spacing={2}>
            {/* --- Basic info --- */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="First name"
                value={firstName}
                onChange={(e) => onChangeFirstName(e.target.value)}
                disabled={disabled}
                required
                fullWidth
              />
              <TextField
                label="Last name"
                value={lastName}
                onChange={(e) => onChangeLastName(e.target.value)}
                disabled={disabled}
                required
                fullWidth
              />
            </Stack>

            {/* --- Email + title --- */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => onChangeEmail(e.target.value)}
                fullWidth
                disabled={disabled}
              />
              <TextField
                label="Title"
                value={title ?? ''}    
                onChange={(e) => onChangeTitle(e.target.value)}
                disabled={disabled}
                fullWidth
                placeholder="e.g. Dr., Prof., Mr., Ms."
              />
            </Stack>

            {/* --- Phone + ORCID --- */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Phone"
                value={tel ?? ''}    
                onChange={(e) => onChangeTel(e.target.value)}
                disabled={disabled}
                fullWidth
              />
              <TextField
                label="ORCID"
                value={orcid ?? ''}    
                onChange={(e) => onChangeOrcid(e.target.value)}
                disabled={disabled}
                fullWidth
              />
            </Stack>

            {/* --- Address --- */}
            <TextField
              label="Address"
              value={address ?? ''}   
              onChange={(e) => onChangeAddress(e.target.value)}
              disabled={disabled}
              fullWidth
              multiline
              minRows={2}
            />

            {/* --- Country Select --- */}
            <CountrySelect
              label="Country"
              multiple={false}
              autoFetch
              value={country}
              onChange={(newValue) => {
                const v = Array.isArray(newValue) ? newValue[0] : newValue;
                onChangeCountryId(v ? Number(v.id) : null);
              }}
              disabled={disabled}
              inputName="country"
              inputAutoComplete="country-name"
            />

            {/* --- Public info switch --- */}
            <FormControlLabel
              control={
                <Switch
                  checked={hidePublic}
                  onChange={(e) => onToggleHidePublic(e.target.checked)}
                />
              }
              label="Hide my contact info from public"
            />

            {/* --- Buttons --- */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button type="submit" variant="contained" disabled={disabled}>
                Save
              </Button>
              <Button
                type="button"
                variant="outlined"
                disabled={disabled}
                onClick={onReset}
              >
                Reset
              </Button>
            </Box>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
