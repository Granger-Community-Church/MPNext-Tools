/**
 * Interface for _2016CampGrangerWk1v1
* Table: _2016CampGrangerWk1v1
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface _2016campgrangerwk1v1 {

  RegistrationID?: number /* decimal */ | null;

  /**
   * Max length: 255 characters
   */
  EnrollmentStatusName?: string /* max 255 chars */ | null;

  OnlineEnrollment: boolean;

  EventDivisionID?: number /* decimal */ | null;

  /**
   * Max length: 255 characters
   */
  EventDivisionFullName?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  EventDivisionAbbreviation?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  EventDivisionType?: string /* max 255 chars */ | null;

  BalanceDueDate?: string /* ISO datetime */ | null;

  RangeMin?: number /* decimal */ | null;

  RangeMax?: number /* decimal */ | null;

  EventID?: number /* decimal */ | null;

  /**
   * Max length: 255 characters
   */
  EventName?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  EventFullName?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  EventAbbreviation?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  EventType?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  EventCostCenter?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  EventLocation?: string /* max 255 chars */ | null;

  BeginDate?: string /* ISO datetime */ | null;

  EndDate?: string /* ISO datetime */ | null;

  EntityID?: number /* decimal */ | null;

  /**
   * Max length: 255 characters
   */
  LastName?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  FirstName?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  MiddleName?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  PreferredName?: string /* max 255 chars */ | null;

  Age?: number /* decimal */ | null;

  /**
   * Max length: 255 characters
   */
  Gender?: string /* max 255 chars */ | null;

  GradeLevelID?: number /* decimal */ | null;

  CabinID?: number /* decimal */ | null;

  /**
   * Max length: 255 characters
   */
  CabinName?: string /* max 255 chars */ | null;

  Capacity?: number /* decimal */ | null;

  /**
   * Max length: 255 characters
   */
  AttendeeAddress1?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  AttendeeAddress2?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  AttendeeCity?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  AttendeeState?: string /* max 255 chars */ | null;

  AttendeeZip?: number /* decimal */ | null;

  /**
   * Max length: 255 characters
   */
  AttendeeCounty?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  AttendeeEmail?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  AttendeePhone?: string /* max 255 chars */ | null;

  ARBalance?: number /* decimal */ | null;

  ARBalanceDisplay?: number /* decimal */ | null;

  /**
   * Max length: 255 characters
   */
  GiftCardBalance?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  Signature?: string /* max 255 chars */ | null;

  SignatureDate?: string /* ISO datetime */ | null;

  NotImmunized: boolean;

  ItineraryEntityID?: number /* decimal */ | null;

  /**
   * Max length: 255 characters
   */
  ItineraryEntityName?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  ItineraryEntityTypeName?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  ItinerarySignature?: string /* max 255 chars */ | null;

  ItinerarySignedDate?: string /* ISO datetime */ | null;

  /**
   * Max length: 255 characters
   */
  ItineraryBillingName?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  EntityTypeName?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  BillingAddress1?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  BillingAddress2?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  BillingCity?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  BillingState?: string /* max 255 chars */ | null;

  BillingZip?: number /* decimal */ | null;

  /**
   * Max length: 255 characters
   */
  BillingCounty?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  BillingEmail?: string /* max 255 chars */ | null;

  EntityCommunicationMechanismID?: number /* decimal */ | null;

  /**
   * Max length: 255 characters
   */
  BillingPhone?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  ChurchName?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  ChurchCity?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  SchoolName?: string /* max 255 chars */ | null;

  FirstEnrollmentDate?: string /* ISO datetime */ | null;

  EntryDate?: string /* ISO datetime */ | null;

  YearsAtCamp?: number /* decimal */ | null;

  YearsAttendedByEventType?: number /* decimal */ | null;
}

export type _2016campgrangerwk1v1Record = _2016campgrangerwk1v1;
