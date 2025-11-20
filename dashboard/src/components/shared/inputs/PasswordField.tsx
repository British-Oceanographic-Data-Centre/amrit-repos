'use client';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import * as React from 'react';

type Props = {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
  setShow: (v: boolean) => void;
  disabled?: boolean;
  autoComplete?: string;
  helperText?: string;
};

export default function PasswordField({
  label, value, onChange, show, setShow, disabled, autoComplete, helperText
}: Props) {
  return (
    <TextField
      fullWidth
      label={label}
      type={show ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      required
      disabled={disabled}
      helperText={helperText}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label={`toggle ${label.toLowerCase()} visibility`}
              onClick={() => setShow(!show)}
              edge="end"
              tabIndex={-1}
            >
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
}