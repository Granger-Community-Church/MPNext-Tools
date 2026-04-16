/**
 * Interface for _Melissa_DST
* Table: _Melissa_DST
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface MelissaDst {

  /**
   * Max length: 5 characters
   */
  ZIP?: string /* max 5 chars */ | null;

  RES?: number /* decimal */ | null;

  RES_POB?: number /* decimal */ | null;

  BUS?: number /* decimal */ | null;

  BUS_POB?: number /* decimal */ | null;

  GRP_DEL?: number /* decimal */ | null;

  GEN_DEL?: number /* decimal */ | null;
}

export type MelissaDstRecord = MelissaDst;
