"use client";

import * as React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import BasicTable from "@/components/shared/tables/basicTable/BasicTable";
import Link from "@mui/material/Link";
import {
  ALERTS_ATTRIBUTES_TABLE_CONFIG,
  ALERTS_DETAILS_GENERAL_INFO_TABLE_CONFIG,
  ALERTS_HISTORY_TABLE_CONFIG,
  ALERTS_MAIN_TABLE_CONFIG,
  ALERTS_NOTES_TABLE_CONFIG,
} from "@/config/tableConfigs/alertTableConfig";
import { gatewayFetchViaProxy } from "@/lib/gateway/gatewayFetchViaProxy.client";
import { Alert, Note, NoteApiResponse } from "@/types/alert";
import { TableViewConfig } from "@/config/tableConfigs";
import KeyValueTable, { KeyValueItem } from "@/components/shared/tables/KeyValueTable";
import { isValidUrl, extractHost } from "@/lib/utils/stringUtils";

type LayoutMode = "inline" | "page";

interface AlertDetailsProps {
  /** If provided, the component will fetch the alert by id (full-page inspect) */
  id?: string;
  /** If provided, the component will render these alert details directly (inline collapse) */
  data?: Alert;
  /** Adjusts paddings depending on context */
  layout?: LayoutMode;
  /** Show the top summary panel (matches inbox columns) */
  showSummaryRow?: boolean;
  /** Override which columns to show in the summary (defaults to inbox config) */
  summaryColumnsConfig?: TableViewConfig<Alert>;
}

/** Render-friendly stringify (keeps strings, numbers, booleans) */
export const toDisplay = (v: unknown): React.ReactNode => {
  if (v == null) return "";

  // Handle arrays
  if (Array.isArray(v)) {
    return v.map((item, i) => (
      <span key={i}>
        {i > 0 && ", "}
        {toDisplay(item)}
      </span>
    ));
  }

  // Handle primitives
  switch (typeof v) {
    case "string":
      // 🧭 If it looks like a URL, render as a clickable link
      if (isValidUrl(v)) {
        return (
          <a
            href={v}
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#1976d2", textDecoration: "none", fontWeight: 500 }}
          >
            {extractHost(v)}
          </a>
        );
      }
      return v;
    case "number":
    case "boolean":
      return String(v);
    default:
      // Fallback for objects, etc.
      return JSON.stringify(v);
  }
};

/** Local read-only view of columns if your global type is looser */
type LocalColumn<T> = {
  key: keyof T;
  label?: string;
  subKey?: string;
  link?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
};
type LocalConfig<T> = { mainColumns: Array<LocalColumn<T>> };

const isObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === "object" && v !== null && !Array.isArray(v);

export const mapConfigToKeyValues = <T,>(
  row: T,
  cfg: TableViewConfig<T> | LocalConfig<T>
): KeyValueItem[] => {
  const cols = (cfg as LocalConfig<T>).mainColumns;

  return cols.map((col) => {
    const key = col.key as keyof T;
    type V = T[typeof key];

    const raw = row[key] as V;

    // Resolve subKey first (only if raw is an object)
    const resolved: unknown =
      col.subKey && isObject(raw) && Object.prototype.hasOwnProperty.call(raw, col.subKey)
        ? (raw as Record<string, unknown>)[col.subKey]
        : (raw as unknown);

    const label = col.label ?? String(key as string);

    // 🔧 Helper to call render with a widened signature to avoid TS2345
    const renderValue = (val: unknown): React.ReactNode =>
      col.render
        ? (col.render as (value: unknown, row: T) => React.ReactNode)(val, row)
        : toDisplay(val);

    const baseValue: React.ReactNode = renderValue(resolved);

    // 🌐 Linkify if the *resolved* value is a URL string
    let value: React.ReactNode = baseValue;
    if (typeof resolved === "string" && isValidUrl(resolved)) {
      value = (
        <Link
          href={resolved}
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
          underline="hover"
        >
          {extractHost(resolved)}
        </Link>
      );
    }

    return { label, value };
  });
};

const AlertDetails: React.FC<AlertDetailsProps> = ({
  id,
  data,
  layout = "inline",
  showSummaryRow = true,
  summaryColumnsConfig = ALERTS_MAIN_TABLE_CONFIG,
}) => {
  const [alert, setAlert] = React.useState<Alert | undefined>(data);
  const [loadingAlert, setLoadingAlert] = React.useState<boolean>(!data && !!id);
  const [error, setError] = React.useState<string | null>(null);

  const [notes, setNotes] = React.useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = React.useState(false);

  // Fetch alert by id if needed
  React.useEffect(() => {
    if (alert || !id) return;
    let active = true;
    const controller = new AbortController();

    (async () => {
      setLoadingAlert(true);
      setError(null);
      try {
        type AlertaByIdResponse = { status: string; total?: number; alert: Alert };
        const res = await gatewayFetchViaProxy<AlertaByIdResponse>(
          "GET",
          `/alerta/alert/${id}`,
          undefined,
          controller.signal
        );
        if (!active) return;
        setAlert(res.alert);
      } catch {
        if (!active) return;
        setError("Failed to load alert.");
      } finally {
        if (active) setLoadingAlert(false);
      }
    })();

    return () => {
      active = false;
      controller.abort();
    };
  }, [id, alert]); // keep deps minimal

  // Fetch notes when we know the alert id
  React.useEffect(() => {
    const alertId = alert?.id;
    if (!alertId) return;

    let isLatestRequest = true;
    const controller = new AbortController();

    (async () => {
      setNotesLoading(true);
      try {
        const notesApiResponse = await gatewayFetchViaProxy<NoteApiResponse>(
          "GET",
          `/alerta/alert/${alertId}/notes`,
          undefined,
          controller.signal
        );
        if (isLatestRequest) {
          const sorted = notesApiResponse.notes.slice().sort(
            (a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
          );
          setNotes(sorted);
        }
      } catch {
        // ignore
      } finally {
        if (isLatestRequest) setNotesLoading(false);
      }
    })();

    return () => {
      isLatestRequest = false;
      controller.abort();
    };
  }, [alert]);

  // History sorted
  const sortedHistoryByDate = React.useMemo(() => {
    return [...(alert?.history ?? [])].sort(
      (a, b) => new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime()
    );
  }, [alert?.history]);

  // Layout spacing
  const wrapperSx = layout === "page" ? { p: 2, pb: 4 } : { marginInline: 2, marginBottom: 4 };

  if (loadingAlert) {
    return (
      <Box sx={{ ...wrapperSx, display: "flex", alignItems: "center", gap: 2 }}>
        <CircularProgress size={20} />
        <Typography>Loading alert…</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={wrapperSx}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!alert) {
    return (
      <Box sx={wrapperSx}>
        <Typography color="text.secondary">No alert to display.</Typography>
      </Box>
    );
  }

  // Build panels
  const summaryItems = mapConfigToKeyValues(alert, summaryColumnsConfig);
  const generalItems = mapConfigToKeyValues(alert, ALERTS_DETAILS_GENERAL_INFO_TABLE_CONFIG);

  type AlertAttributes = NonNullable<Alert["attributes"]> extends Record<string, unknown>
    ? NonNullable<Alert["attributes"]>
    : Record<string, unknown>;
  const attributes: AlertAttributes = (alert.attributes ?? {}) as AlertAttributes;

  const attributesItems: KeyValueItem[] =
    ALERTS_ATTRIBUTES_TABLE_CONFIG?.mainColumns?.length
      ? ALERTS_ATTRIBUTES_TABLE_CONFIG.mainColumns.map((col) => {
          const k = col.key as keyof AlertAttributes;
          const label = col.label ?? String(k as string);
          const raw = attributes[k];

          // Example: FleetMonitoringLink contains HTML markup
          const value =
            (k as string) === "FleetMonitoringLink" && typeof raw === "string" ? (
              <span dangerouslySetInnerHTML={{ __html: raw }} />
            ) : (
              toDisplay(raw)
            );

          return { label, value };
        })
      : (Object.entries(attributes) as Array<[keyof AlertAttributes, unknown]>).map(([k, v]) => ({
          label: String(k),
          value: toDisplay(v),
        }));

  return (
    <Box sx={wrapperSx}>
      {/* Summary + General: side-by-side on md+, stacked on xs */}
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: showSummaryRow ? "1fr 1fr" : "1fr" },
        }}
      >
        {showSummaryRow && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Alert Summary
            </Typography>
            <KeyValueTable items={summaryItems} elevation={2}/>
          </Box>
        )}

        <Box>
          <Typography variant="h6" gutterBottom>
            General information
          </Typography>
          <KeyValueTable items={generalItems} elevation={2}/>
        </Box>
      </Box>

      <Typography sx={{ mt: 3 }} variant="h6" gutterBottom>
        Alert attributes
      </Typography>
      <KeyValueTable items={attributesItems}  elevation={2}/>

      <Typography sx={{ mt: 3 }} variant="h6" gutterBottom>
        Alert&apos;s current notes
      </Typography>
      {notesLoading ? (
        <CircularProgress />
      ) : (
        <BasicTable colmunsConfiguration={ALERTS_NOTES_TABLE_CONFIG} data={notes} />
      )}

      <Typography sx={{ mt: 3 }} variant="h6" gutterBottom>
        History
      </Typography>
      <BasicTable colmunsConfiguration={ALERTS_HISTORY_TABLE_CONFIG} data={sortedHistoryByDate} />
    </Box>
  );
};

export default AlertDetails;
