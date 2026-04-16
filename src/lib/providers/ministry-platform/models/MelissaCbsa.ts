/**
 * Interface for _Melissa_CBSA
* Table: _Melissa_CBSA
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface MelissaCbsa {

  /**
   * Max length: 5 characters
   */
  CODE?: string /* max 5 chars */ | null;

  /**
   * Max length: 4 characters
   */
  TYPE?: string /* max 4 chars */ | null;

  /**
   * Max length: 50 characters
   */
  TITLE?: string /* max 50 chars */ | null;

  /**
   * Max length: 29 characters
   */
  LEVEL?: string /* max 29 chars */ | null;

  /**
   * Max length: 1 characters
   */
  STATUS?: string /* max 1 chars */ | null;
}

export type MelissaCbsaRecord = MelissaCbsa;
