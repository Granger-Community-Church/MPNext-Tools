/**
 * Interface for _Twilio_Import_20200217
* Table: _Twilio_Import_20200217
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface TwilioImport20200217 {

  Contact_ID: number /* 32-bit integer */; // Foreign Key -> Contacts.Contact_ID, Has Default

  /**
   * Max length: 50 characters
   */
  FromNumber?: string /* max 50 chars */ | null;

  /**
   * Max length: 50 characters
   */
  Contact_Number?: string /* max 50 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Body?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Status?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  SentDate?: string /* max 255 chars */ | null;
}

export type TwilioImport20200217Record = TwilioImport20200217;
