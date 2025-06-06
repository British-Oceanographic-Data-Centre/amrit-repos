// src/alerts/email-formatter.service.ts
import { Injectable } from '@nestjs/common';
import { AlertEvent, Alert, AlertAttributes } from '../../types/alert';

@Injectable()
export class EmailFormatterService {
  formatAlertEmailContent(alert: AlertEvent): string {
    const  data: Alert = alert?.data || {};
    const attrs: AlertAttributes = data.attributes ?? {};
    const summaryLines: string[] = [];
    const statusLines: string[] = [];
    const metadataLines: string[] = [];

    const addLine = (label: string, array: string[], value?: any, style?: string) => {
      if (value !== undefined && value !== null && value !== '') {
        array.push(`<p><strong>${label}:</strong> <span style="${style || ''}">${value}</span></p>`);
      }
    };

    addLine('📍 Resource', summaryLines, data.resource);
    addLine('🌍 Country', summaryLines, attrs.Country);
    addLine('📅 Date/Time', summaryLines, alert.time);
    addLine('🔧 Event', summaryLines, data.event);

    addLine('📊 Severity', statusLines, data.severity);
    addLine('📦 Status', statusLines, data.status);
    addLine('🔁 Duplicate Count', statusLines, data.duplicateCount);

    addLine('Argo Type', metadataLines, attrs.ArgoType);
    addLine('Last Cycle Number', metadataLines, attrs.lastCycleNumberToRaiseAlarm);
    addLine('Last Station Date', metadataLines, attrs.LastStationDate);
    addLine('Service', metadataLines, Array.isArray(data.service) ? data.service.join(', ') : undefined);
    addLine('Origin', metadataLines, data.origin);

	const fleetLink = typeof attrs.FleetMonitoringLink === 'string'
	? `<p><strong>🔗 Fleet Monitoring:</strong> ${attrs.FleetMonitoringLink}</p>`
	: '';

    return `
      <link href="https://fonts.googleapis.com/css2?family=Lexend:wght@400;600&display=swap" rel="stylesheet">

      <div style="font-family: Lexend, Arial, sans-serif; line-height: 1.5; color: #333;">
        <h2 style="color: #c0392b;">🚨 AMRIT Alert Notification</h2>

        <div style="margin-bottom: 20px; padding-bottom: 10px; border-bottom: 1px solid #ccc;">
          <p style="margin: 4px 0; color: #555;"><strong>ALERT TYPE: </strong>${alert.type || 'Alert'}</h2>
          <p style="margin: 4px 0; color: #555;"><strong>ALERT CATEGORY: </strong> ${attrs.alert_category}</p>
          <p style="margin: 4px 0; color: #555;"><strong>ALERT ID: </strong> ${alert.id}</p>
        </div>

        <h3 style="color:rgb(71, 137, 236);">Summary</h3>
        ${summaryLines.join('')}

        <h3 style="color:rgb(71, 137, 236);">Status / Severity</h3>
        ${statusLines.join('')}

        <h3 style="color:rgb(71, 137, 236);">Metadata</h3>
        ${metadataLines.join('')}

        <h3 style="color:rgb(71, 137, 236);">Message</h3>
        <p style="background: #f9f9f9; padding: 12px; border-left: 4px solid #ccc;"><em>${data.text}</em></p>

         ${fleetLink}

        <hr style="margin: 24px 0;" />

        <p style="font-size: 0.9em; color: #888;">
          This is an automated message sent from the AMRIT Alert System.<br/>
          Please do not reply directly to this email.
        </p>
      </div>
    `.replace(/undefined/g, '');
  }
}
