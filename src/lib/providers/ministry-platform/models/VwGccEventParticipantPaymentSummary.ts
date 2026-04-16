/**
 * Interface for vw_gcc_event_participant_payment_summary
* Table: vw_gcc_event_participant_payment_summary
 * Access Level: Read
 * Special Permissions: DataExport
 * Generated from column metadata
 */
export interface VwGccEventParticipantPaymentSummary {

  Read_Only_PK: number /* 32-bit integer */; // Primary Key

  Event_Participant_ID: number /* 32-bit integer */; // Foreign Key -> Event_Participants.Event_Participant_ID

  Event_ID: number /* 32-bit integer */;

  Product_ID: number /* 32-bit integer */; // Foreign Key -> Products.Product_ID

  Invoice_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Invoices.Invoice_ID

  Participant_Owed?: number /* currency amount */ | null;

  Participant_Paid: number /* currency amount */;

  Participant_Unpaid?: number /* currency amount */ | null;

  Last_Payment_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Payments.Payment_ID
}

export type VwGccEventParticipantPaymentSummaryRecord = VwGccEventParticipantPaymentSummary;
