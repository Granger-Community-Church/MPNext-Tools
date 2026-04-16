/**
 * Interface for Camp_Import
* Table: Camp_Import
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: FileAttach, DataExport, SecureRecord
 * Generated from column metadata
 */
export interface CampImport {

  Camp_Import_ID: number /* 32-bit integer */; // Primary Key

  Camper_Contact?: number /* 32-bit integer */ | null; // Foreign Key -> Contacts.Contact_ID

  Entity_Contact?: number /* 32-bit integer */ | null; // Foreign Key -> Contacts.Contact_ID

  Event_ID: number /* 32-bit integer */; // Foreign Key -> Events.Event_ID

  RegistrationID?: number /* 32-bit integer */ | null;

  /**
   * Max length: 255 characters
   */
  EnrollmentStatusName?: string /* max 255 chars */ | null;

  OnlineEnrollment: boolean;

  EventDivisionID?: number /* 32-bit integer */ | null;

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

  RangeMin?: number /* 32-bit integer */ | null;

  RangeMax?: number /* 32-bit integer */ | null;

  EventID?: number /* 32-bit integer */ | null;

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

  EntityID?: number /* 32-bit integer */ | null;

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

  BirthDate?: string /* ISO date (YYYY-MM-DD) */ | null;

  Age?: number /* 32-bit integer */ | null;

  /**
   * Max length: 255 characters
   */
  Gender?: string /* max 255 chars */ | null;

  GradeLevelID?: number /* 32-bit integer */ | null;

  CabinID?: number /* 32-bit integer */ | null;

  /**
   * Max length: 255 characters
   */
  CabinName?: string /* max 255 chars */ | null;

  Capacity?: number /* 32-bit integer */ | null;

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

  AttendeeZip?: number /* 32-bit integer */ | null;

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

  ARBalance?: number /* 32-bit integer */ | null;

  ARBalanceDisplay?: number /* 32-bit integer */ | null;

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

  ItineraryEntityID?: number /* 32-bit integer */ | null;

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

  BillingZip?: number /* 32-bit integer */ | null;

  /**
   * Max length: 255 characters
   */
  BillingCounty?: string /* max 255 chars */ | null;

  /**
   * Max length: 255 characters
   */
  BillingEmail?: string /* max 255 chars */ | null;

  EntityCommunicationMechanismID?: number /* 32-bit integer */ | null;

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

  YearsAtCamp?: number /* 32-bit integer */ | null;

  YearsAttendedByEventType?: number /* 32-bit integer */ | null;
}

export type CampImportRecord = CampImport;
