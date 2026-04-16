/**
 * Interface for Pantry_Assistance
* Table: Pantry_Assistance
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: None
 * Generated from column metadata
 */
export interface PantryAssistance {

  Pantry_Assistance_ID: number /* 32-bit integer */; // Primary Key

  Household_ID: number /* 32-bit integer */; // Foreign Key -> Households.Household_ID

  Contact_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Contacts.Contact_ID

  Assistance_Date?: string /* ISO date (YYYY-MM-DD) */ | null; // Has Default

  Food_Boxes: number /* 32-bit integer */; // Has Default

  Care_Boxes: number /* 32-bit integer */; // Has Default

  Diaper_Boxes: number /* 32-bit integer */; // Has Default

  /**
   * Max length: 2000 characters
   */
  Assistance_Notes?: string /* max 2000 chars */ | null;

  Delivered_By?: number /* 32-bit integer */ | null; // Foreign Key -> Contacts.Contact_ID

  Delivered?: boolean | null;

  /**
   * Max length: 2000 characters
   */
  Delivery_Notes?: string /* max 2000 chars */ | null;
}

export type PantryAssistanceRecord = PantryAssistance;
