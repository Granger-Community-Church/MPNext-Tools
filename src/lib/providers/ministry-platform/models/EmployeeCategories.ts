/**
 * Interface for Employee_Categories
* Table: Employee_Categories
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: FileAttach, DataExport, SecureRecord
 * Generated from column metadata
 */
export interface EmployeeCategories {

  Employee_Category_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 50 characters
   */
  Employee_Category?: string /* max 50 chars */ | null;
}

export type EmployeeCategoriesRecord = EmployeeCategories;
