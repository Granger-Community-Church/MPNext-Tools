/**
 * Interface for _PledgeImportGranger
* Table: _PledgeImportGranger
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface Pledgeimportgranger {

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
  Street_Address?: string /* max 255 chars */ | null;

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
  Email?: string /* max 255 chars */ | null;

  Birthday?: string /* ISO datetime */ | null;

  Normal_Gft?: number /* decimal */ | null;

  Expanded_Gift?: number /* decimal */ | null;

  Total_Yearly?: number /* decimal */ | null;

  Kickstart?: number /* decimal */ | null;

  Total_Pledge?: number /* decimal */ | null;

  /**
   * Max length: 255 characters
   */
  Next_Step?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  ContactMe?: string /* max 255 chars */ | null;

  Pledge_Campaign_ID?: number /* decimal */ | null;

  Pledge_Status_ID?: number /* decimal */ | null;

  Installments_Planned?: number /* decimal */ | null;

  Installments_Per_Year?: number /* decimal */ | null;

  First_Installment_Date?: string /* ISO datetime */ | null;
}

export type PledgeimportgrangerRecord = Pledgeimportgranger;
