/**
 * Interface for _mailchimp_import
* Table: _mailchimp_import
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface MailchimpImport {

  /**
   * Max length: 50 characters
   */
  Email?: string /* max 50 chars */ | null;

  /**
   * Max length: 50 characters
   */
  FirstName?: string /* max 50 chars */ | null;

  /**
   * Max length: 50 characters
   */
  LastName?: string /* max 50 chars */ | null;

  Birthday?: string /* ISO datetime */ | null;

  /**
   * Max length: 50 characters
   */
  MEMBER_RATING?: string /* max 50 chars */ | null;

  /**
   * Max length: 50 characters
   */
  OPTIN_TIME?: string /* max 50 chars */ | null;

  /**
   * Max length: 50 characters
   */
  OPTIN_IP?: string /* max 50 chars */ | null;

  /**
   * Max length: 50 characters
   */
  CONFIRM_TIME?: string /* max 50 chars */ | null;

  /**
   * Max length: 50 characters
   */
  CONFIRM_IP?: string /* max 50 chars */ | null;

  /**
   * Max length: 50 characters
   */
  LATITUDE?: string /* max 50 chars */ | null;

  /**
   * Max length: 50 characters
   */
  LAST_CHANGED?: string /* max 50 chars */ | null;
}

export type MailchimpImportRecord = MailchimpImport;
