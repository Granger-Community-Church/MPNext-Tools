export interface EventSummary {
  Event_ID: number;
  Event_Title: string;
  Event_Start_Date: string;
  Event_End_Date: string | null;
  Congregation_Name: string | null;
}

export interface EventParticipantRow {
  Event_Participant_ID: number;
  Event_ID: number;
  Participant_ID: number;
  Participation_Status: string;
  Participation_Status_ID: number;
  Time_In: string | null;
  'Check-in_Station': string | null;
  First_Name: string;
  Last_Name: string;
  Nickname: string | null;
  Display_Name: string;
  Contact_ID: number;
}

export interface ParticipationStatus {
  Participation_Status_ID: number;
  Participation_Status: string;
}

export type NametagLayout = 'first-last-initial' | 'first-last-full';

export interface NametagConfig {
  layout: NametagLayout;
  startPosition: number;
}

export interface NametagData {
  firstName: string;
  lastName: string;
  eventTitle: string;
  eventDate: string;
  layout: NametagLayout;
}

export interface StatusUpdatePayload {
  eventParticipantIds: number[];
  participationStatusId: number;
  timeIn: string | null;
}
