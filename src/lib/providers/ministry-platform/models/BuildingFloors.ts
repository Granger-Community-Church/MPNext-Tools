/**
 * Interface for Building_Floors
* Table: Building_Floors
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: None
 * Generated from column metadata
 */
export interface BuildingFloors {

  Building_Floor_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 50 characters
   */
  Floor_Name: string /* max 50 chars */;

  Building_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Buildings.Building_ID
}

export type BuildingFloorsRecord = BuildingFloors;
