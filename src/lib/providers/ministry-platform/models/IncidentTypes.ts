/**
 * Interface for Incident_Types
* Table: Incident_Types
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: FileAttach, DataExport, SecureRecord
 * Generated from column metadata
 */
export interface IncidentTypes {

  Incident_Type_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 50 characters
   */
  Incident_Type: string /* max 50 chars */;
}

export type IncidentTypesRecord = IncidentTypes;
