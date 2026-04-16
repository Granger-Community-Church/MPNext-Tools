/**
 * Interface for vw_gcc_mp_household_facts
* Table: vw_gcc_mp_household_facts
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface VwGccMpHouseholdFacts {

  Household_ID: number /* 32-bit integer */;

  _First_Donation?: string /* ISO datetime */ | null; // Read Only

  _Last_Donation?: string /* ISO datetime */ | null; // Read Only

  /**
   * Max length: 25 characters
   */
  Home_Phone?: string /* max 25 chars */ | null;

  Address_ID?: number /* 32-bit integer */ | null;

  Driving_Distance?: number /* decimal */ | null;

  Driving_Time?: number /* decimal */ | null;

  Family_Size?: number /* 32-bit integer */ | null;

  Minor_Children?: number /* 32-bit integer */ | null;

  Children_Under_12?: number /* 32-bit integer */ | null;

  Children_13_to_18?: number /* 32-bit integer */ | null;

  Household_Source_ID?: number /* 32-bit integer */ | null;

  Head_Age?: number /* 32-bit integer */ | null;

  Bulk_Mail_Opt_Out: boolean;

  /**
   * Max length: 50 characters
   */
  Congregation_Name?: string /* max 50 chars */ | null;
}

export type VwGccMpHouseholdFactsRecord = VwGccMpHouseholdFacts;
