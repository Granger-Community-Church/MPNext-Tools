/**
 * Interface for _MC3_People_Import
* Table: _MC3_People_Import
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface Mc3PeopleImport {

  /**
   * Max length: 255 characters
   */
  Last_Name?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  First_Name?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Address_Line_1?: string /* max 255 chars */ | null;

  Postal_Code?: number /* decimal */ | null;

  Birthdate?: string /* ISO datetime */ | null;

  Date_of_Birth?: string /* ISO date (YYYY-MM-DD) */ | null;

  /**
   * Max length: 255 characters
   */
  Mobile_Phone?: string /* max 255 chars */ | null;

  Gender_ID?: number /* decimal */ | null;

  /**
   * Max length: 255 characters
   */
  Gender?: string /* max 255 chars */ | null;
}

export type Mc3PeopleImportRecord = Mc3PeopleImport;
