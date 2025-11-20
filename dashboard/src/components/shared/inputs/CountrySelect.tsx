'use client';

import * as React from 'react';
import { Autocomplete, TextField, Chip, Box, CircularProgress } from '@mui/material';
import Image from 'next/image';
import { styled } from '@mui/system';
import type { CountryOption } from '@/types/types';
import fetchCountryOptions from '@/lib/fetchers/fetchCountryOptions.client';

type Value = CountryOption | CountryOption[] | null;

interface Props {
  label?: string;
  multiple?: boolean;
  value?: Value;
  onChange: (newValue: Value) => void;
  options?: CountryOption[];     // if provided, component uses them as-is
  autoFetch?: boolean;           // if true (and no options), component fetches countries on mount
  disabled?: boolean;

  // optional dropdown controls
  menuOpen?: boolean;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
  autoFocus?: boolean;
  placeholder?: string;
  openOnFocus?: boolean;
  fullWidth?: boolean;
  inputRef?:  React.RefObject<HTMLInputElement | null>
  inputName?: string;
  inputAutoComplete?: string;
}

const OCEANOPS_STATIC = 'https://www.ocean-ops.org/static';

const OptionBox = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  gap: 10,
});

const CountrySelect: React.FC<Props> = ({
  label = 'Country',
  multiple = false,
  value = multiple ? [] : null,
  onChange,
  options,
  autoFetch = false,
  disabled = false,
  menuOpen,
  onMenuOpen,
  onMenuClose,
  inputRef, 
  autoFocus,
  placeholder,
  openOnFocus,
  inputName,
  inputAutoComplete,
  fullWidth = true,
}) => {
  const [internalOptions, setInternalOptions] = React.useState<CountryOption[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [internalOpen, setInternalOpen] = React.useState<boolean>(!!menuOpen);

  // If autoFetch is enabled and no options were passed, fetch once.
  React.useEffect(() => {
    let alive = true;
    (async () => {
      if (!autoFetch) return;
      if (Array.isArray(options) && options.length > 0) return;

      setLoading(true);
      try {
        const data = await fetchCountryOptions(); // returns CountryOption[] in your project
        if (!alive) return;
        // defensive normalize + sort
        const normalized: CountryOption[] = (data ?? [])
        .filter((c) => c && c.id != null && c.name != null)
        .map((c) => ({
          id: c.id as string | number,
          name: c.name as string,
          code2: c.code2 ?? '',
        }))
        .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''));
        setInternalOptions(normalized);
      } catch {
        if (!alive) return;
        setInternalOptions([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [autoFetch, options]);

  const effectiveOptions = React.useMemo<CountryOption[]>(
    () => (options && options.length ? options : internalOptions),
    [options, internalOptions]
  );

  // To satisfy MUI typing, always return a string
  const getOptionLabel = (opt: CountryOption) => opt?.name ?? '';

  return (
    <Autocomplete<CountryOption, boolean, false, false>
      multiple={multiple}
      options={effectiveOptions}
      value={value as unknown as CountryOption | CountryOption[] | null}
      onChange={(_, newVal) => onChange(newVal as Value)}
      getOptionLabel={getOptionLabel}
      isOptionEqualToValue={(opt, val) => String(opt.id) === String(val.id)}
            open={openOnFocus ? internalOpen : menuOpen}
      onOpen={() => {
        if (openOnFocus) setInternalOpen(true);
        onMenuOpen?.();
      }}
      onClose={() => {
        if (openOnFocus) setInternalOpen(false);
        onMenuClose?.();
      }}
      autoFocus={autoFocus}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      loading={loading}
      renderTags={(vals, getTagProps) =>
        Array.isArray(vals)
          ? vals.map((option, index) => {
              const tagProps = Object.fromEntries(
                Object.entries(getTagProps({ index })).filter(([k]) => k !== 'key')
              );
              return (
                <Chip
                  key={option.id}
                  {...tagProps}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {option.code2 ? (
                        <Image
                          src={`${OCEANOPS_STATIC}/images/flags_iso/24/${option.code2.toLowerCase()}.png`}
                          alt=""
                          width={18}
                          height={18}
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : null}
                      {option.name}
                    </Box>
                  }
                />
              );
            })
          : null
      }
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <OptionBox>
            {option.code2 ? (
              <Image
                src={`${OCEANOPS_STATIC}/images/flags_iso/24/${option.code2.toLowerCase()}.png`}
                alt=""
                width={24}
                height={24}
                onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : null}
            {option.name}
          </OptionBox>
        </li>
      )}
      renderInput={(params) => (
        <TextField
          {...params}
          variant="outlined"
          label={label}
          inputRef={inputRef}
          placeholder={placeholder}
          name={inputName}
          autoComplete={inputAutoComplete}
          onFocus={(e) => {
            (
              params.inputProps?.onFocus as
                | React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>
                | undefined
            )?.(e as React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>);
            if (openOnFocus) setInternalOpen(true);
          }}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={18} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}        
        />
      )}
      sx={{
        minWidth: 240,
        '& .MuiOutlinedInput-root': {
          backgroundColor: 'background.default',
        },
      }}
    />
  );
};

export default CountrySelect;
