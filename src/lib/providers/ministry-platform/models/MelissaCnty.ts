/**
 * Interface for _Melissa_CNTY
* Table: _Melissa_CNTY
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface MelissaCnty {

  /**
   * Max length: 5 characters
   */
  FIPS?: string /* max 5 chars */ | null;

  /**
   * Max length: 25 characters
   */
  NAME?: string /* max 25 chars */ | null;

  /**
   * Max length: 2 characters
   */
  STATE?: string /* max 2 chars */ | null;

  /**
   * Max length: 2 characters
   */
  T_Z?: string /* max 2 chars */ | null;

  /**
   * Max length: 1 characters
   */
  CNTY_TYPE?: string /* max 1 chars */ | null;

  /**
   * Max length: 28 characters
   */
  COUNTYSEAT?: string /* max 28 chars */ | null;

  /**
   * Max length: 1 characters
   */
  NAME_TYPE?: string /* max 1 chars */ | null;

  /**
   * Max length: 5 characters
   */
  ELEVATION?: string /* max 5 chars */ | null;

  PERNS_HOUS?: number /* decimal */ | null;

  POPULATION?: number /* decimal */ | null;

  AREA_SQ_MI?: number /* decimal */ | null;

  HOUSEHOLDS?: number /* decimal */ | null;

  WHITE?: number /* decimal */ | null;

  BLACK?: number /* decimal */ | null;

  HISPANIC?: number /* decimal */ | null;

  INCOM_HHLD?: number /* decimal */ | null;

  HOUSE_VAL?: number /* decimal */ | null;
}

export type MelissaCntyRecord = MelissaCnty;
