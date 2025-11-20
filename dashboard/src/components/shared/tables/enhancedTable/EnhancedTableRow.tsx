"use client";

import React from "react";
import {
  Checkbox,
  ChipProps,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { TableViewConfig } from "@/config/tableConfigs";
import EnhancedTableCell from "../EnhancedTableCell";

type ChipColor = NonNullable<ChipProps["color"]>;

type LocalColumn<T> = {
  key: keyof T;
  label?: string;
  chipColor?: Record<string, ChipColor>;
};

type LocalConfig<T> = {
  mainColumns: Array<LocalColumn<T>>;
};

interface EnhancedTableRowProps<T extends Record<string, unknown>> {
  rowData: T;
  columnsConfig: TableViewConfig<T>;
  isItemSelected: boolean;
  handleClickOnRow?: (event: React.MouseEvent<unknown>, id: string) => void;
  rowId: string;
  onRowNavigate?: (id: string) => void;
  onToggleSelect?: (id: string) => void;
  collapsingComponent?: React.ReactNode;
}

function EnhancedTableRow<T extends Record<string, unknown>>({
  rowData,
  columnsConfig,
  isItemSelected,
  handleClickOnRow,
  rowId,
  onRowNavigate,
  onToggleSelect,
  collapsingComponent,
}: EnhancedTableRowProps<T>) {
  const [open, setOpen] = React.useState(false);

  const columns = (columnsConfig as unknown as LocalConfig<T>).mainColumns;

  const handleRowClick = (event: React.MouseEvent<unknown>) => {
    if (onRowNavigate) {
      onRowNavigate(rowId);
      return;
    }
    if (handleClickOnRow) {
      handleClickOnRow(event, rowId);
      return;
    }
    onToggleSelect?.(rowId);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (onToggleSelect) {
      onToggleSelect(rowId);
    } else if (handleClickOnRow) {
      // fallback to existing row selection handler
      handleClickOnRow(e as unknown as React.MouseEvent<unknown>, rowId);
    }
  };

  return (
    <>
      <TableRow
        hover
        onClick={handleRowClick}
        role="row"
        tabIndex={-1}
        key={rowId}
        selected={isItemSelected}
        sx={{
          cursor: "pointer",
          ...(open ? { "& > *": { borderBottom: "unset !important" } } : {}),
        }}
      >
        {collapsingComponent && (
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setOpen((prev) => !prev);
              }}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        )}

        <TableCell padding="checkbox" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            color="primary"
            checked={isItemSelected}
            onChange={handleCheckboxChange}
            slotProps={{
              input: {
                "aria-label": "Select row",
                "aria-labelledby": `row-${rowId}`,
              },
            }}
          />
        </TableCell>


            {columnsConfig.mainColumns.map((col, index) => 
            
            <EnhancedTableCell 
              key={`cell-${rowId}-${index}`} 
              rowData={rowData} 
              col={col} 
              index={index} 
              rowId={rowId} />
             )}   

        </TableRow>

      {collapsingComponent && (
        <TableRow
          sx={{ "& > *": { borderBottom: "unset !important", paddingTop: 0, paddingBottom: 0 } }}
          style={{ border: 0 }}
        >
          <TableCell
            width="100%"
            style={{ paddingBottom: 0, paddingTop: 0 }}
            colSpan={columns.length + 2}
          >
            <Collapse in={open} timeout="auto" unmountOnExit>
              {collapsingComponent}
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export default EnhancedTableRow;
