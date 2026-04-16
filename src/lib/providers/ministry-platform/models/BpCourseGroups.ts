/**
 * Interface for bp_Course_Groups
* Table: bp_Course_Groups
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: None
 * Generated from column metadata
 */
export interface BpCourseGroups {

  Course_Group_ID: number /* 32-bit integer */; // Primary Key

  Course_ID: number /* 32-bit integer */; // Foreign Key -> bp_Courses.Course_ID

  Group_ID: number /* 32-bit integer */; // Foreign Key -> Groups.Group_ID

  Start_Date: string /* ISO datetime */;

  End_Date?: string /* ISO datetime */ | null;
}

export type BpCourseGroupsRecord = BpCourseGroups;
