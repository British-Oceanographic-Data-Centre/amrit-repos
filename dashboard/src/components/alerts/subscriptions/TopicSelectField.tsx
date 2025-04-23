'use client';
// TO DO : make this server component to fetch topics data in server side (need to cut in 2 parts : a wrapper server side which fetch data and the client component with select )
import React, { useEffect, useState } from 'react';
import { SxProps, Theme, MenuItem, Select } from '@mui/material';
import { TopicOption } from '@/types/types';
import fetchTopicOptions from '@/lib/alertSubscriptions/fetchTopicOptions.client';


interface Props {
  value: number | null;
  onChange: (newValue: number) => void;
  size?: 'small' | 'medium';
  sx?: SxProps<Theme>;
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

const TopicSelectField = ({ value, size, onChange, sx }: Props) => {
  const [topics, setTopics] = useState<TopicOption[]>([]);

  useEffect(() => {
    fetchTopicOptions().then((raw) => setTopics(buildTopicTree(raw)));
  }, []);

  const renderOptions = (options: TopicOption[], level = 0): React.ReactNode[] =>
    options.flatMap((opt) => [
      <MenuItem key={opt.id} value={opt.id} sx={{ pl: 2 + level * 4 }}>
        {opt.label}
      </MenuItem>,
      ...(opt.children ? renderOptions(opt.children, level + 1) : []),
    ]);

  return (
    <Select
      value={value ?? ''}
      onChange={(e) => onChange(Number(e.target.value))}
      size={size ?? 'small'}
	  sx={{ ...sx }}
	  displayEmpty
    >
		<MenuItem disabled value="">
		 <em>Select a topic</em>
		</MenuItem>
      {renderOptions(topics)}
    </Select>
  );
};

export default TopicSelectField;
