/**
 * Interface for vw_gcc_mp_contact_family
* Table: vw_gcc_mp_contact_family
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface VwGccMpContactFamily {

  Contact_ID: number /* 32-bit integer */;

  Spouse_Contact_ID?: number /* 32-bit integer */ | null;

  /**
   * Max length: 50 characters
   */
  Spouse_Nickname?: string /* max 50 chars */ | null;

  /**
   * Max length: 50 characters
   */
  Spouse_First_Name?: string /* max 50 chars */ | null;

  /**
   * Max length: 50 characters
   */
  Spouse_Last_Name?: string /* max 50 chars */ | null;

  /**
   * Max length: 125 characters
   */
  Spouse_Display_Name?: string /* max 125 chars */ | null;

  /**
   * Max length: 254 characters
   */
  Spouse_Email_Address?: string /* email, max 254 chars */ | null;

  /**
   * Max length: 25 characters
   */
  Spouse_Mobile_Phone?: string /* max 25 chars */ | null;
}

export type VwGccMpContactFamilyRecord = VwGccMpContactFamily;
