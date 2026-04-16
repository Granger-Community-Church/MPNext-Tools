/**
 * Interface for _Melissa_MSA
* Table: _Melissa_MSA
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface MelissaMsa {

  /**
   * Max length: 4 characters
   */
  CODE?: string /* max 4 chars */ | null;

  /**
   * Max length: 4 characters
   */
  TYP?: string /* max 4 chars */ | null;

  /**
   * Max length: 60 characters
   */
  NAME?: string /* max 60 chars */ | null;

  /**
   * Max length: 2 characters
   */
  CMSA?: string /* max 2 chars */ | null;

  POP?: number /* decimal */ | null;
}

export type MelissaMsaRecord = MelissaMsa;
