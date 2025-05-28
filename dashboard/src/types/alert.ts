type Environment = "Development" | "Production"

type Severity =
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

type Status =
  | "open"
  | "assign"
  | "ack"
  | "closed"
  | "expired"
  | "blackout"
  | "shelved"
  | "unknown"


export type Alert = AlertRaw & { // TO BE completed

  // id of alert given by ALerta
  id:string 

  lastReceiveTime: string

  duplicateCount?: number

}

type AlertRaw = {

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
  environment: Environment
  /**
  * Severity of alert (default normal)
  */
  severity: Severity
  /**
  * list of related event names
  */
  correlate?: string
  /**
  * Status of alert (default open)
  */
  status: Status
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

  /**
  * number of seconds before alert is considered stale
  */
  timeout?: number
  /**
  * unprocessed data eg. full syslog message or SNMP trap
  */
  rawData?: string

  /**
   * whenever an alert changes severity or status then a list of key alert attributes are appended to the history log
   */

  history?: HistoryEntry[] 

}


type ChangeType = "open" | "assing" | "ack" | "unack" | "shelve" | "unshelve" | "close" | "new" | "action" | "status" | "value" | "severity" | "note" | "dismiss" | "timeout" | "expired"


type HistoryEntry = {
  id:string; 
  event : string;
  severity: Severity;
  status: Status;
  test:string;
  type: ChangeType
  updateTime: string
  user: string
  value: string

}

export type AlertApiResponse = AlertCountApiResponse & {
    alerts: Alert[];   
    lastTime: string;
    more: boolean;
    page: number;
    pageSize: number;
    pages: number;   
  };

  export type AlertCountApiResponse = {  
    autoRefresh: boolean;
    severityCounts: Record<string, number>;
    status: string;
    statusCounts: Record<string, number>;
    total: number;
  };