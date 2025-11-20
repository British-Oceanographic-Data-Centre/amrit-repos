'use client';
import React, { useEffect, useState } from 'react';
import { SxProps, Theme} from '@mui/material';
import { TopicOption } from '@/types/types';
import fetchTopicOptions from '@/lib/fetchers/fetchTopicOptions.client';
import TopicSelectField from '@/components/shared/inputs/TopicSelectField';


interface Props {
  value: number | null;
  onChange: (newValue: number | null) => void;
  size?: 'small' | 'medium';
  sx?: SxProps<Theme>;
}




const FetchedTopicSelectField = ({ value, size, onChange, sx }: Props) => {
  const [topics, setTopics] = useState<TopicOption[]>([]);

  useEffect(() => {
    fetchTopicOptions().then((raw) => setTopics(raw));
  }, []);

 

  return (
    <TopicSelectField size={size} sx={sx} value={value} onChange={onChange } topics={topics} />
  );
};

export default FetchedTopicSelectField;
