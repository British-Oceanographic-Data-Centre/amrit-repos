import { Chip, IconButton, TableCell, Tooltip } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";
import React, { ReactNode } from "react";
import { TableColumnConfig } from "@/config/tableConfigs";
import { extractHost, isValidUrl } from "@/lib/utils/stringUtils";

interface EnhancedTableCellProps<T> {
  rowData: T;
  col: TableColumnConfig<T>; // ensure TableColumnConfig<T> has: key: keyof T; subKey?: string; link?: boolean; chipColor?: Record<string, "default" | "primary" | ...>;
  index: number;
  rowId: string | number; // allow number too
}

function EnhancedTableCell<T>({ rowData, col, index, rowId }: EnhancedTableCellProps<T>) {
  // Helper
  const isObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null && !Array.isArray(v);

  // Safely read the raw cell value
  const raw = rowData[col.key as keyof T] as unknown;

  // Optional subKey extraction if the cell value is an object
  const subVal =
    col.subKey && isObject(raw) && Object.prototype.hasOwnProperty.call(raw, col.subKey)
      ? (raw as Record<string, unknown>)[col.subKey]
      : undefined;

  // Decide what to display (avoid rendering objects)
  const displayVal =
    typeof subVal === "string" || typeof subVal === "number"
      ? subVal
      : typeof raw === "string" || typeof raw === "number"
      ? raw
      : "";

  // Build link (only show icon when valid URL)
  const hrefCandidate =
    col.link && typeof displayVal === "string" && isValidUrl(displayVal) ? displayVal : undefined;

  let contentNode: ReactNode;
  if (col.link) {
    contentNode = hrefCandidate ? (
      <Tooltip title={`See more on ${extractHost(hrefCandidate)}`}>
        <IconButton
          color="primary"
          onClick={(e) => {
            e.stopPropagation();
            window.open(hrefCandidate, "_blank", "noopener,noreferrer");
          }}
          aria-label="external link"
        >
          <LinkIcon />
        </IconButton>
      </Tooltip>
    ) : (
      "" // or "—"
    );
  } else {
    contentNode = displayVal;
  }

  // Optional chip
  if (col.chipColor) {
    const chipKey = String(displayVal ?? "");
    contentNode = <Chip label={contentNode || chipKey} color={col.chipColor[chipKey] ?? "default"} />;
  }

  return (
    <TableCell
      key={`${String(col.key)}-${String(rowId)}`}
      component={index === 0 ? "th" : undefined}
      scope={index === 0 ? "row" : undefined}
      padding={col.padding ?? "normal"}
      align={index !== 0 ? "left" : undefined}
    >
      {contentNode}
    </TableCell>
  );
}

export default EnhancedTableCell;
