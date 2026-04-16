/**
 * Interface for _MediaArchiveImport
* Table: _MediaArchiveImport
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface Mediaarchiveimport {

  /**
   * Max length: 255 characters
   */
  Media_Title?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Media_Description?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Category_ID?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Media_Type?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Media_Label?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Label_ID?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Container_ID?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Location?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Source?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Originator_Name?: string /* max 255 chars */ | null;

  Media_Year?: number /* 32-bit integer */ | null;

  CheckIn_Date?: string /* ISO datetime */ | null;

  /**
   * Max length: 255 characters
   */
  CheckOut_Date?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Checked_Out_To?: string /* max 255 chars */ | null;
}

export type MediaarchiveimportRecord = Mediaarchiveimport;
