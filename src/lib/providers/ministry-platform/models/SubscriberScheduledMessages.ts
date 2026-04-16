/**
 * Interface for Subscriber_Scheduled_Messages
* Table: Subscriber_Scheduled_Messages
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: FileAttach, DataExport, SecureRecord
 * Generated from column metadata
 */
export interface SubscriberScheduledMessages {

  Subscriber_Scheduled_Message_ID: number /* 32-bit integer */; // Primary Key

  Publication_ID: number /* 32-bit integer */; // Foreign Key -> dp_Publications.Publication_ID

  Communication_Template_ID: number /* 32-bit integer */; // Foreign Key -> dp_Communication_Templates.Communication_Template_ID

  Include_Opt_Outs: boolean; // Has Default

  Send_On: string /* ISO datetime */;

  /**
   * Max length: 254 characters
   */
  Subject_Token_Text?: string /* max 254 chars */ | null;

  /**
   * Max length: 4000 characters
   */
  Body_Token_Text?: string /* max 4000 chars */ | null;

  Communication_ID?: number /* 32-bit integer */ | null; // Foreign Key -> dp_Communications.Communication_ID
}

export type SubscriberScheduledMessagesRecord = SubscriberScheduledMessages;
