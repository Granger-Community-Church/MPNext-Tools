/**
 * Interface for gcc_vw_core_milestones
* Table: gcc_vw_core_milestones
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface GccVwCoreMilestones {

  Participant_ID: number /* 32-bit integer */;

  Contact_ID: number /* 32-bit integer */;

  Core_101_Graduate?: string /* ISO datetime */ | null;

  Core_201_Graduate?: string /* ISO datetime */ | null;

  Core_301_Graduate?: string /* ISO datetime */ | null;

  Core_401_Graduate?: string /* ISO datetime */ | null;

  I_Am_Committed?: string /* ISO datetime */ | null;

  Membership?: string /* ISO datetime */ | null;

  SHAPE_Covenant?: string /* ISO datetime */ | null;

  Disciple?: string /* ISO datetime */ | null;
}

export type GccVwCoreMilestonesRecord = GccVwCoreMilestones;
