/**
 * Interface for vw_gcc_mp_donors
* Table: vw_gcc_mp_donors
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface VwGccMpDonors {

  Contact_ID: number /* 32-bit integer */;

  Donor_ID: number /* 32-bit integer */;

  /**
   * Max length: 50 characters
   */
  Donation_Frequency?: string /* max 50 chars */ | null;

  /**
   * Max length: 50 characters
   */
  Donation_Level?: string /* max 50 chars */ | null;

  _First_Donation_Date?: string /* ISO datetime */ | null; // Read Only

  _Last_Donation_Date?: string /* ISO datetime */ | null; // Read Only
}

export type VwGccMpDonorsRecord = VwGccMpDonors;
