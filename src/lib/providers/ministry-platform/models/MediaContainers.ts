/**
 * Interface for Media_Containers
* Table: Media_Containers
 * Access Level: Read
 * Special Permissions: None
 * Generated from column metadata
 */
export interface MediaContainers {

  Media_Container_ID: number /* 32-bit integer */;

  /**
   * Max length: 50 characters
   */
  Container_Name: string /* max 50 chars */;
}

export type MediaContainersRecord = MediaContainers;
