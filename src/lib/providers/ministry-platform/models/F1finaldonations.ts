/**
 * Interface for _F1FinalDonations
* Table: _F1FinalDonations
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface F1finaldonations {

  /**
   * Max length: 255 characters
   */
  "Transaction ID"?: string /* max 255 chars */ | null;

  "Giving Unit_ID"?: number /* decimal */ | null;

  /**
   * Max length: 255 characters
   */
  "Giving Unit Name"?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  "Giving Unit_Last Name"?: string /* max 255 chars */ | null;

  Contributor_ID?: number /* decimal */ | null;

  /**
   * Max length: 255 characters
   */
  "Contributor Name"?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  "Contributor _Last Name"?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  "Fund Code"?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Fund?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  "Fund Type"?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  "SubFund Code"?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  SubFund?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  "Fund Account Reference Desc"?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  "General Ledger"?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  "Originating Source"?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Frequency?: string /* max 255 chars */ | null;

  Created_Date?: string /* ISO datetime */ | null;

  Created_Time?: string /* ISO datetime */ | null;

  Received_Date?: string /* ISO datetime */ | null;

  Received_Time?: string /* ISO datetime */ | null;

  "Transmit_ Date"?: number /* decimal */ | null;

  "Last Updated_Date"?: number /* decimal */ | null;

  /**
   * Max length: 255 characters
   */
  Type?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  SubType?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  "Bank Card_Type"?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  "Bank Card # Last 4"?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Reference?: string /* max 255 chars */ | null;

  Amount?: number /* currency amount */ | null;

  "Batch Variance"?: number /* decimal */ | null;

  /**
   * Max length: 255 characters
   */
  "True Value"?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  "Liquidation Costs"?: string /* max 255 chars */ | null;

  /**
   * Max length: 2147483647 characters
   */
  Memo?: string /* max 2147483647 chars */ | null;
}

export type F1finaldonationsRecord = F1finaldonations;
