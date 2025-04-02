export type Alert = {

    // id of alert given by ALerta
    id:string

      /**
   * Unique identifier of resource under alarm.
   */
  resource: string
  /**
   * event name
   */
  event: string
  /**
   * Environment, used to namespace the resource. Development or Production.
   */
  environment: "Development" | "Production"
  /**
   * Severity of alert (default normal)
   */
  severity:
    | "security"
    | "critical"
    | "major"
    | "minor"
    | "warning"
    | "informational"
    | "debug"
    | "trace"
    | "indeterminate"
    | "cleared"
    | "normal"
    | "ok"
    | "unknown"
  /**
   * list of related event names
   */
  correlate?: string
  /**
   * Status of alert (default open)
   */
  status:
    | "open"
    | "assign"
    | "ack"
    | "closed"
    | "expired"
    | "blackout"
    | "shelved"
    | "unknown"
  /**
   * list of effected services (array must contain at least one element)
   */
  service: [string, ...string[]]
  /**
   * event group used to group events of similar type
   */
  group?: string
  /**
   * event value eg. 100%, Down, PingFail, 55ms, ORA-1664
   */
  value?: string
  /**
   * freeform text description
   */
  text?: string
  /**
   * set of tags in any format eg. aTag, aDouble:Tag, a:Triple=Tag
   */
  tags?: string[]
  /**
   * Dictionary of key-value pairs
   */
  attributes?: {
    [k: string]: unknown
  }
  /**
   * ame of monitoring component that generated the alert
   */
  origin?: string
  /**
   * alert type eg. snmptrapAlert, syslogAlert, gangliaAlert
   */
  type?: string
  /**
   * UTC date-time the alert was generated in ISO8601 format
   */
  createTime?: string

  lastReceiveTime: string

  /**
   * number of seconds before alert is considered stale
   */
  timeout?: number
  /**
   * unprocessed data eg. full syslog message or SNMP trap
   */
  rawData?: string

}


export type AlertApiResponse = {
    alerts: Alert[];
    autoRefresh: boolean;
    lastTime: string;
    more: boolean;
    page: number;
    pageSize: number;
    pages: number;
    severityCounts: Record<string, number>;
    status: string;
    statusCounts: Record<string, number>;
    total: number;
  };