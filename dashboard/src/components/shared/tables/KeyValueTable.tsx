"use client";

import * as React from "react";
import { Box, Typography, Paper, PaperProps } from "@mui/material";

export type KeyValueItem = {
  label: string;
  value: React.ReactNode;
};

interface KeyValueTableProps {
  items: KeyValueItem[];
  dense?: boolean;
  bordered?: boolean;
  elevation?: number;
}

export default function KeyValueTable({
  items,
  dense = false,
  bordered = true,
  elevation = 0,
}: KeyValueTableProps) {
  const Wrapper: React.ElementType<PaperProps> = elevation > 0 ? Paper : Box;

  return (
    <Wrapper
      elevation={elevation > 0 ? elevation : undefined}
      sx={{
        px: 2,
        py: dense ? 1 : 2,
        borderRadius: 1,
        ...(bordered && elevation === 0 ? { border: 1, borderColor: "divider" } : {}),
      }}
    >
      {items.map((it, idx) => (
        <Box key={idx} sx={{ py: dense ? 0.5 : 1 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "180px 1fr" },
              columnGap: 2,
              rowGap: 0.5,
              alignItems: "baseline",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 500, pr: { sm: 2 } }}
            >
              {it.label}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                wordBreak: "break-word",
                overflowWrap: "anywhere",
              }}
            >
              {it.value ?? ""}
            </Typography>
          </Box>
        </Box>
      ))}
    </Wrapper>
  );
}
