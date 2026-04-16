/**
 * Interface for Employees
* Table: Employees
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: FileAttach, DataExport, SecureRecord
 * Generated from column metadata
 */
export interface Employees {

  Employee_ID: number /* 32-bit integer */; // Primary Key

  Contact: number /* 32-bit integer */; // Foreign Key -> Contacts.Contact_ID

  /**
   * Max length: 250 characters
   */
  Job_Title?: string /* max 250 chars */ | null;

  Extension?: number /* 32-bit integer */ | null;

  Employment_Status?: number /* 32-bit integer */ | null; // Foreign Key -> Employment_Statuses.Employment_Status_ID

  Start_Date?: string /* ISO date (YYYY-MM-DD) */ | null;

  End_Date?: string /* ISO date (YYYY-MM-DD) */ | null;

  _Years_Of_Service?: number /* decimal */ | null; // Read Only, Computed

  Employee_Category?: number /* 32-bit integer */ | null; // Foreign Key -> Employee_Categories.Employee_Category_ID

  Department_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Ministries.Ministry_ID

  Supervisor_ID?: number /* 32-bit integer */ | null; // Foreign Key -> Employees.Employee_ID

  Frontline_Leader: boolean; // Has Default

  Last_Hot_Seat?: string /* ISO date (YYYY-MM-DD) */ | null;
}

export type EmployeesRecord = Employees;
