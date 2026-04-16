/**
 * Interface for vw_kpm_event_options_summary
* Table: vw_kpm_event_options_summary
 * Access Level: Read
 * Special Permissions: DataExport
 * Generated from column metadata
 */
export interface VwKpmEventOptionsSummary {

  Read_Only_PK?: number /* 64-bit integer */ | null; // Primary Key

  Event_ID: number /* 32-bit integer */; // Foreign Key -> Events.Event_ID

  Max_Qty?: number /* 32-bit integer */ | null;

  Committed: number /* 32-bit integer */;

  Remaining?: number /* 32-bit integer */ | null;

  Awaiting?: number /* 32-bit integer */ | null;

  Cancelled?: number /* 32-bit integer */ | null;

  Product_Option_Price_ID: number /* 32-bit integer */; // Foreign Key -> Product_Option_Prices.Product_Option_Price_ID

  Product_Option_Group_ID: number /* 32-bit integer */; // Foreign Key -> Product_Option_Groups.Product_Option_Group_ID
}

export type VwKpmEventOptionsSummaryRecord = VwKpmEventOptionsSummary;
