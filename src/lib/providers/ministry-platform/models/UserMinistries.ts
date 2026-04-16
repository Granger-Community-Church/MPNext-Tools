/**
 * Interface for User_Ministries
* Table: User_Ministries
 * Access Level: ReadWriteAssignDelete
 * Special Permissions: None
 * Generated from column metadata
 */
export interface UserMinistries {

  User_Ministry_ID: number /* 32-bit integer */; // Primary Key

  User_ID: number /* 32-bit integer */; // Foreign Key -> dp_Users.User_ID

  Ministry_ID: number /* 32-bit integer */; // Foreign Key -> Ministries.Ministry_ID

  Default_Ministry: boolean; // Has Default

  Discontinued: boolean; // Has Default
}

export type UserMinistriesRecord = UserMinistries;
