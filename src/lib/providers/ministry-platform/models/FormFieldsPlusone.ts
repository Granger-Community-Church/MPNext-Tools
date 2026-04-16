/**
 * Interface for Form_Fields_PlusOne
* Table: Form_Fields_PlusOne
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface FormFieldsPlusone {

  Form_Fields_PlusOne_ID: number /* 32-bit integer */; // Primary Key

  /**
   * Max length: 50 characters
   */
  PlusOne_Type: string /* max 50 chars */;

  /**
   * Max length: 500 characters
   */
  PlusOne_Notes?: string /* max 500 chars */ | null;
}

export type FormFieldsPlusoneRecord = FormFieldsPlusone;
