/**
 * Interface for _PledgeImportElkhart
* Table: _PledgeImportElkhart
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface Pledgeimportelkhart {

  /**
   * Max length: 255 characters
   */
  Donor_Last?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Donor_First?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Spouse_Last?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Spouse_First?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Organization?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Campus?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Phone?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  "Street Address"?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  City?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  State?: string /* max 255 chars */ | null;

  Zip?: number /* decimal */ | null;

  /**
   * Max length: 255 characters
   */
  "E-mail"?: string /* max 255 chars */ | null;

  Birthday?: string /* ISO datetime */ | null;

  "Normal Gft"?: number /* decimal */ | null;

  "Expanded Gift"?: number /* decimal */ | null;

  "Total Yearly"?: number /* decimal */ | null;

  Kickstart?: number /* decimal */ | null;

  "Total Gift"?: number /* decimal */ | null;

  /**
   * Max length: 255 characters
   */
  "Next Step"?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  ContactMe?: string /* max 255 chars */ | null;
}

export type PledgeimportelkhartRecord = Pledgeimportelkhart;
