import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import * as mqtt from 'mqtt';
import { HttpService } from '@nestjs/axios';
import { MailerService } from '../../mailer/mailer.service';
import { createProxyRouteMap, ProxyRouteMap } from 'src/utils/proxy.routes';
import { ConfigService } from '@nestjs/config';
import { EmailFormatterService } from './email-formatter.service';
import { ContactMatcherService } from './contact-matcher.service';
import { AlertEvent } from '../../types/alert';

@Injectable()
export class AlertsMqttService implements OnModuleInit {
  private client!: mqtt.MqttClient;
  private activeEmail : boolean;
  private readonly proxyRoutes: ProxyRouteMap;
  private readonly logger = new Logger(AlertsMqttService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly mailer: MailerService,
    private readonly config: ConfigService,
    private readonly emailFormatter: EmailFormatterService,
    private readonly contactMatcher: ContactMatcherService,
  ) {
    this.proxyRoutes = createProxyRouteMap(config);
  }

  onModuleInit(): void {
    this.activeEmail = process.env.ACTIVE_EMAIL === 'true';
    this.client = mqtt.connect(process.env.ALERTS_MQTT_HOST_URL!, {
      username: process.env.ALERTS_MQTT_USERNAME_RO!,
      password: process.env.ALERTS_MQTT_PASSWORD_RO!,
      clean: true,
      protocol: 'wss',
    });

    this.client.on('connect', () => {
      this.client.subscribe('amrit/notification/processed/#', (err) => {
        if (!err) {
          this.logger.log('✅ Connected to MQTT broker');

		  // RECIEVE AND HANDLE MOCK ALERT FOR TESTING IN DEV (only if sending real email is not activated)
        if(!this.activeEmail) void this.testMockAlert(); 
          
      }
      });
    });

	this.client.on('message', (topic, message) => {
	void (async () => {
		try {
		const alert = JSON.parse(message.toString()) as AlertEvent;
		await this.handleAlert(alert);
		} catch (err) {
		this.logger.error('⚠️ Failed to parse or handle alert message', err);
		}
	})();
	});
  }

  async handleAlert(alert: AlertEvent): Promise<void> {
    this.logger.log ("alert received on mqtt : " + alert.data.resource +", "+alert.data.event+", "+alert.data.severity)
    if (alert?.data?.repeat === true) return;

    const payload = {
      alertCategory: alert?.data?.attributes?.alert_category,
      severity: alert?.data?.severity,
      resource: alert?.data?.resource,
      country: alert?.data?.attributes?.Country,
      time: alert?.time,
    };

    if (!payload.alertCategory) {
      this.logger.warn('🚫 Missing required alert data, skipping.');
      return;
    }

    try {
      const contacts = await this.contactMatcher.findMatchingContacts(alert);
      if (!Array.isArray(contacts) || contacts.length === 0) return;

      const emailContent = this.emailFormatter.formatAlertEmailContent(alert);

      for (const contact of contacts) {
        try {
          this.logger.log("send email to " + contact.email + " for alert resource "+alert.data.resource+ " event " + alert.data.event)
          await this.sendEmail(contact.email, alert, emailContent);
        } catch (emailError) {
          this.logger.error(`❌ Failed to send email to ${contact.email}`, emailError);
        }
      }
    } catch (err) {
      this.logger.error('❌ Contact matching or email formatting failed', err);
    }
  }

  async sendEmail(email: string, alert: AlertEvent, content: string): Promise<void> {
        
    if (this.activeEmail) {
    await this.mailer.sendMail(
      email,
      `Alert: ${alert.data.resource} - ${alert.data.event}`,
      content,
      'AMRIT Alerts',
    );
  } else {
    await this.mailer.sendTestEmail(
      email,
      `Alert: ${alert.data.resource} - ${alert.data.event}`,
      content,
      'AMRIT Alerts',
    );
  }
  }

  async testMockAlert(): Promise<void> {
    const mock: AlertEvent = {
      id: '3c26c52e-2605-47c9-a656-15c7abc46992',
      source: 'Coriolis Argo Technical data alerts',
      specversion: '1.0',
      type: 'FLAG_SUPRAHydraulicAlert_LOGICAL',
      datacontenttype: 'application/json',
      dataschema: null,
      subject: '5906990',
      time: '2025-06-04T14:40:01.654286Z',
      data: {
        resource: '5906990',
        event: 'FLAG_SUPRAHydraulicAlert_LOGICAL',
        environment: 'Development',
        severity: 'critical',
        correlate: [],
        status: 'open',
        service: ['Laboratory of Oceanography of Villefranche'],
        group: 'argo float alarm',
        value: null,
        text: 'Check hydraulic behaviour',
        tags: [],
        attributes: {
          Country: 'France',
          basin_id: null,
          alert_category: 'Technical issue',
          mqtt_topic: 'operational',
          ArgoType: 'PSEUDO',
          LastStationDate: '24-05-2025',
          url: 'https://fleetmonitoring.euro-argo.eu/float/5906990',         
          lastCycleNumberToRaiseAlarm: '107',
        },
        origin: 'Coriolis Argo Technical data alerts',
        type: 'argo float alert demo',
        createTime: '2025-03-19T14:12:06.001Z',
        timeout: 1209600,
        rawData: null,
        id: 'ce553efa-dd95-4edc-b065-a00d2539011f',
        customer: null,
        duplicateCount: 33,
        repeat: false,
        previousSeverity: 'indeterminate',
        trendIndication: 'moreSevere',
        receiveTime: '2025-03-19T14:12:06.004Z',
        lastReceiveId: '79ca61a2-21f1-4d15-acdf-ec395a43d316',
        updateTime: '2025-03-19T14:12:06.004Z',
  		lastReceiveTime: '2025-03-19T14:12:06.004Z',
        history: [],
      },
      data_base64: null,
    };

    await this.handleAlert(mock);
  }
}
