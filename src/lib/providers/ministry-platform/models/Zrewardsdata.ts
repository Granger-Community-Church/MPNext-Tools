/**
 * Interface for zRewardsData
* Table: zRewardsData
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface Zrewardsdata {

  /**
   * Max length: 255 characters
   */
  INDIVIDUAL_last_name?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  INDIVIDUAL_first_name?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  INDIVIDUAL_goes_by?: string /* max 255 chars */ | null;

  INDIVIDUAL_date_of_birth?: string /* ISO datetime */ | null;

  /**
   * Max length: 255 characters
   */
  Preferred_Email?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Preferred_Phone?: string /* max 255 chars */ | null;

  Contact_ID?: number /* 32-bit integer */ | null;
}

export type ZrewardsdataRecord = Zrewardsdata;
