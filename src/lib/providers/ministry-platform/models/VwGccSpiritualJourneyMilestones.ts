/**
 * Interface for vw_gcc_spiritual_journey_milestones
* Table: vw_gcc_spiritual_journey_milestones
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface VwGccSpiritualJourneyMilestones {

  Participant_ID: number /* 32-bit integer */;

  Contact_ID: number /* 32-bit integer */;

  Baptism?: string /* ISO datetime */ | null;

  Child_Dedication?: string /* ISO datetime */ | null;

  Smooth_Stone_Award?: string /* ISO datetime */ | null;
}

export type VwGccSpiritualJourneyMilestonesRecord = VwGccSpiritualJourneyMilestones;
