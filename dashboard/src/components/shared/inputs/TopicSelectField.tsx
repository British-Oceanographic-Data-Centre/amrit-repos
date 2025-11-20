import React from 'react';
import { SxProps, Theme, MenuItem, Select, FormControl, InputLabel, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import { TopicOption } from '@/types/types';
import { ClearIcon } from '@mui/x-date-pickers';



interface Props {
  value: number | null;
  onChange: (newValue: number | null) => void;
  size?: 'small' | 'medium';
  sx?: SxProps<Theme>;
  topics: TopicOption[];
  label?: string;
  showClearIcon?:boolean
}


const buildTopicTree = (flatOptions: TopicOption[]): TopicOption[] => {
  const map = new Map<number, TopicOption & { children?: TopicOption[] }>();
  const roots: TopicOption[] = [];

  flatOptions.forEach((item) => map.set(item.id, { ...item }));
  map.forEach((item) => {
    if (item.parentId && map.has(item.parentId)) {
      const parent = map.get(item.parentId)!;
      if (!parent.children) parent.children = [];
      parent.children.push(map.get(item.id)!);
    } else {
      roots.push(map.get(item.id)!);
    }
  });

  return roots;
};

const TopicSelectField = ({ value, size, onChange, sx={  width: 'auto', minWidth: 300, maxWidth: 900 }, topics, label, showClearIcon=false }: Props) => {

  const renderOptions = (options: TopicOption[], level = 0): React.ReactNode[] =>
    options.flatMap((opt) => [
      <MenuItem key={opt.id} value={opt.id} sx={{ pl: 2 + level * 4 }}>
        {opt.label}
      </MenuItem>,
      ...(opt.children ? renderOptions(opt.children, level + 1) : []),
    ]);

  return (
   <FormControl fullWidth size={size ?? 'small'} sx={sx}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        value={value ?? ''}
        onChange={(e) => onChange(Number(e.target.value))}
        input={
          <OutlinedInput
            label={value ? label : ''}
            endAdornment={
              (value && showClearIcon) ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange(null);
                    }}
                    edge="end"
                    sx={{ mr: 2 }}
                  >
                    <ClearIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : null
            }
          />
        }
        displayEmpty
      >      
        {renderOptions(buildTopicTree(topics))}
      </Select>
    </FormControl>
  );
};

export default TopicSelectField;
