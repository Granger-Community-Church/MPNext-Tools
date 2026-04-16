import { MPHelper } from '@/lib/providers/ministry-platform';
import type {
  EventSummary,
  EventParticipantRow,
  ParticipationStatus,
} from '@/lib/dto';

const PARTICIPANT_SELECT = [
  'Event_Participant_ID',
  'Event_Participants.Event_ID',
  'Event_Participants.Participant_ID',
  'Participation_Status_ID_TABLE.Participation_Status',
  'Event_Participants.Participation_Status_ID',
  'Time_In',
  '"Check-in_Station"',
  'Participant_ID_TABLE_Contact_ID_TABLE.First_Name',
  'Participant_ID_TABLE_Contact_ID_TABLE.Last_Name',
  'Participant_ID_TABLE_Contact_ID_TABLE.Nickname',
  'Participant_ID_TABLE_Contact_ID_TABLE.Display_Name',
  'Participant_ID_TABLE.Contact_ID',
].join(', ');

export class EventCheckinService {
  private static instance: EventCheckinService;
  private mp: MPHelper;

  private constructor() {
    this.mp = new MPHelper();
  }

  public static async getInstance(): Promise<EventCheckinService> {
    if (!EventCheckinService.instance) {
      EventCheckinService.instance = new EventCheckinService();
    }
    return EventCheckinService.instance;
  }

  async getEventSummary(eventId: number): Promise<EventSummary | null> {
    const rows = await this.mp.getTableRecords<EventSummary>({
      table: 'Events',
      select: [
        'Event_ID',
        'Event_Title',
        'Event_Start_Date',
        'Event_End_Date',
        'Congregation_ID_TABLE.Congregation_Name',
      ].join(', '),
      filter: `Event_ID = ${eventId}`,
      top: 1,
    });

    return rows[0] ?? null;
  }

  async getEventParticipants(eventId: number): Promise<EventParticipantRow[]> {
    return this.mp.getTableRecords<EventParticipantRow>({
      table: 'Event_Participants',
      select: PARTICIPANT_SELECT,
      filter: `Event_ID = ${eventId}`,
      orderBy: 'Participant_ID_TABLE_Contact_ID_TABLE.Last_Name, Participant_ID_TABLE_Contact_ID_TABLE.First_Name',
    });
  }

  async getParticipationStatuses(): Promise<ParticipationStatus[]> {
    return this.mp.getTableRecords<ParticipationStatus>({
      table: 'Participation_Statuses',
      select: 'Participation_Status_ID, Participation_Status',
      orderBy: 'Participation_Status',
    });
  }

  async updateParticipationStatus(
    eventParticipantIds: number[],
    participationStatusId: number,
    timeIn: string | null,
  ): Promise<void> {
    const records = eventParticipantIds.map((id) => ({
      Event_Participant_ID: id,
      Participation_Status_ID: participationStatusId,
      ...(timeIn !== null ? { Time_In: timeIn } : {}),
    }));

    await this.mp.updateTableRecords('Event_Participants', records);
  }
}
