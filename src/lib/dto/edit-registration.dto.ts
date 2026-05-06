export interface RegistrationEvent {
  Event_ID: number;
  Event_Title: string;
  Event_Start_Date: string;
  Online_Registration_Product: number | null;
  Registration_Form: number | null;
  Program_ID: number;
  Congregation_Name: string | null;
}

export interface RegistrationParticipant {
  Event_Participant_ID: number;
  Event_ID: number;
  Participant_ID: number;
  Participation_Status_ID: number;
  Participation_Status: string;
  First_Name: string;
  Last_Name: string;
  Nickname: string | null;
  Display_Name: string;
  Contact_ID: number;
  Group_Participant_ID: number | null;
  _Invoice_ID: number | null;
}

export interface ProductOptionGroup {
  Product_Option_Group_ID: number;
  Product_ID: number;
  Option_Group_Name: string;
  Mutually_Exclusive: boolean;
  Required: boolean;
}

export interface ProductOptionPrice {
  Product_Option_Price_ID: number;
  Product_Option_Group_ID: number;
  Option_Title: string;
  Option_Price: number;
  Active: boolean;
  Add_to_Group: number | null;
}

export interface InvoiceDetailRow {
  Invoice_Detail_ID: number;
  Invoice_ID: number;
  Event_Participant_ID: number | null;
  Product_ID: number;
  Product_Option_Price_ID: number | null;
  Line_Total: number;
  Item_Quantity: number;
}

export interface ProductOptionUpdate {
  invoiceDetailId: number;
  newProductOptionPriceId: number;
  newLineTotal: number;
}

export interface UpdateRegistrationPayload {
  eventParticipantId: number;
  participationStatusId?: number;
  productOptionUpdates?: ProductOptionUpdate[];
  moveToEventId?: number;
  moveProductOptionMappings?: MoveProductOptionMapping[];
}

export interface MoveTargetEvent {
  Event_ID: number;
  Event_Title: string;
  Event_Start_Date: string;
  Online_Registration_Product: number | null;
  Congregation_Name: string | null;
}

export interface MoveProductOptionMapping {
  sourceInvoiceDetailId: number;
  targetProductOptionPriceId: number;
  targetLineTotal: number;
}

export interface ParticipantGridRow {
  Event_Participant_ID: number;
  Display_Name: string;
  Participation_Status: string;
  Participation_Status_ID: number;
  ProductOptions: string[];
}
