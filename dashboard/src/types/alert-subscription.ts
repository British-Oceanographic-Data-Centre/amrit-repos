export interface AlertSubscription {
	id: number;
	contactId: number;
	sendEmail: boolean | null;
  
	topicId: number;
	topicName: string;
  
	minSeverityId: number | null;
	minSeverityLabel: string | null;
  
	countryId: number | null;
	countryName: string | null;
  
	basinId: number | null;
	basinName: string | null;
  
	wigosId: string | null;
  
	minTime: string | null; // ISO date string
	maxTime: string | null;
  }
  