import { MPHelper } from '@/lib/providers/ministry-platform';
import type {
  RegistrationEvent,
  RegistrationParticipant,
  ProductOptionGroup,
  ProductOptionPrice,
  InvoiceDetailRow,
  MoveTargetEvent,
} from '@/lib/dto';
import type { ParticipationStatus } from '@/lib/dto';

const PROMOCODE_NAMES = ['promocode', 'promocodes'];

const PARTICIPANT_SELECT = [
  'Event_Participant_ID',
  'Event_Participants.Event_ID',
  'Event_Participants.Participant_ID',
  'Event_Participants.Participation_Status_ID',
  'Participation_Status_ID_TABLE.Participation_Status',
  'Participant_ID_TABLE_Contact_ID_TABLE.First_Name',
  'Participant_ID_TABLE_Contact_ID_TABLE.Last_Name',
  'Participant_ID_TABLE_Contact_ID_TABLE.Nickname',
  'Participant_ID_TABLE_Contact_ID_TABLE.Display_Name',
  'Participant_ID_TABLE.Contact_ID',
  'Event_Participants.Group_Participant_ID',
  '_Invoice_ID',
].join(', ');

export class EditRegistrationService {
  private static instance: EditRegistrationService;
  private mp: MPHelper;

  private constructor() {
    this.mp = new MPHelper();
  }

  public static async getInstance(): Promise<EditRegistrationService> {
    if (!EditRegistrationService.instance) {
      EditRegistrationService.instance = new EditRegistrationService();
    }
    return EditRegistrationService.instance;
  }

  async getRegistrationEvent(eventId: number): Promise<RegistrationEvent | null> {
    const rows = await this.mp.getTableRecords<RegistrationEvent>({
      table: 'Events',
      select:
        'Event_ID, Event_Title, Event_Start_Date, Online_Registration_Product, Registration_Form, Program_ID, Congregation_ID_TABLE.Congregation_Name',
      filter: `Event_ID = ${eventId}`,
      top: 1,
    });
    return rows[0] ?? null;
  }

  async getEventParticipants(eventId: number): Promise<RegistrationParticipant[]> {
    return this.mp.getTableRecords<RegistrationParticipant>({
      table: 'Event_Participants',
      select: PARTICIPANT_SELECT,
      filter: `Event_ID = ${eventId}`,
      orderBy: 'Participant_ID_TABLE_Contact_ID_TABLE.Last_Name, Participant_ID_TABLE_Contact_ID_TABLE.First_Name',
    });
  }

  async getEventParticipants_byId(eventParticipantId: number): Promise<RegistrationParticipant | null> {
    const rows = await this.mp.getTableRecords<RegistrationParticipant>({
      table: 'Event_Participants',
      select: PARTICIPANT_SELECT,
      filter: `Event_Participant_ID = ${eventParticipantId}`,
      top: 1,
    });
    return rows[0] ?? null;
  }

  async getParticipationStatuses(): Promise<ParticipationStatus[]> {
    return this.mp.getTableRecords<ParticipationStatus>({
      table: 'Participation_Statuses',
      select: 'Participation_Status_ID, Participation_Status',
      orderBy: 'Participation_Status',
    });
  }

  async getProductOptionGroups(productId: number): Promise<ProductOptionGroup[]> {
    const groups = await this.mp.getTableRecords<ProductOptionGroup>({
      table: 'Product_Option_Groups',
      select: 'Product_Option_Group_ID, Product_ID, Option_Group_Name, Mutually_Exclusive, Required',
      filter: `Product_ID = ${productId}`,
      orderBy: 'Online_Sort_Order, Option_Group_Name',
    });
    return groups.filter(
      (g) => !PROMOCODE_NAMES.includes(g.Option_Group_Name.toLowerCase()),
    );
  }

  async getProductOptionPrices(groupIds: number[]): Promise<ProductOptionPrice[]> {
    if (groupIds.length === 0) return [];
    return this.mp.getTableRecords<ProductOptionPrice>({
      table: 'Product_Option_Prices',
      select: 'Product_Option_Price_ID, Product_Option_Group_ID, Option_Title, Option_Price, Active, Add_to_Group',
      filter: `Product_Option_Group_ID IN (${groupIds.join(',')})`,
      orderBy: 'Sort_Order, Option_Title',
    });
  }

  async getInvoiceDetails(eventParticipantId: number): Promise<InvoiceDetailRow[]> {
    return this.mp.getTableRecords<InvoiceDetailRow>({
      table: 'Invoice_Detail',
      select: 'Invoice_Detail_ID, Invoice_ID, Event_Participant_ID, Product_ID, Product_Option_Price_ID, Line_Total, Item_Quantity',
      filter: `Event_Participant_ID = ${eventParticipantId}`,
    });
  }

  async getAllInvoiceDetailsForEvent(eventId: number, participantIds: number[]): Promise<InvoiceDetailRow[]> {
    if (participantIds.length === 0) return [];
    return this.mp.getTableRecords<InvoiceDetailRow>({
      table: 'Invoice_Detail',
      select: 'Invoice_Detail_ID, Invoice_ID, Event_Participant_ID, Product_ID, Product_Option_Price_ID, Line_Total, Item_Quantity',
      filter: `Event_Participant_ID IN (${participantIds.join(',')})`,
    });
  }

  async updateParticipationStatus(
    eventParticipantId: number,
    participationStatusId: number,
    userId: number,
  ): Promise<void> {
    await this.mp.updateTableRecords(
      'Event_Participants',
      [
        {
          Event_Participant_ID: eventParticipantId,
          Participation_Status_ID: participationStatusId,
        },
      ],
      { $userId: userId },
    );
  }

  async updateInvoiceDetailOption(
    invoiceDetailId: number,
    productOptionPriceId: number,
    lineTotal: number,
    userId: number,
  ): Promise<void> {
    await this.mp.updateTableRecords(
      'Invoice_Detail',
      [
        {
          Invoice_Detail_ID: invoiceDetailId,
          Product_Option_Price_ID: productOptionPriceId,
          Line_Total: lineTotal,
        },
      ],
      { $userId: userId },
    );
  }

  async recalculateInvoiceTotal(
    invoiceId: number,
    userId: number,
  ): Promise<{
    newTotal: number;
    totalPaid: number;
    invoiceGuid: string;
  } | null> {
    const allDetails = await this.mp.getTableRecords<{
      Invoice_Detail_ID: number;
      Line_Total: number;
    }>({
      table: 'Invoice_Detail',
      select: 'Invoice_Detail_ID, Line_Total',
      filter: `Invoice_ID = ${invoiceId}`,
    });
    if (allDetails.length === 0) return null;

    const newTotal = allDetails.reduce((sum, d) => sum + d.Line_Total, 0);

    // Sum all payments linked to this invoice's detail rows
    const detailIds = allDetails.map((d) => d.Invoice_Detail_ID);
    const paymentDetails = await this.mp.getTableRecords<{ Payment_Amount: number }>({
      table: 'Payment_Detail',
      select: 'Payment_Amount',
      filter: `Invoice_Detail_ID IN (${detailIds.join(',')})`,
    });
    const totalPaid = paymentDetails.reduce((sum, pd) => sum + pd.Payment_Amount, 0);

    // Determine invoice status
    let statusId: number;
    if (totalPaid >= newTotal) {
      statusId = 3; // Paid in Full
    } else if (totalPaid <= 0) {
      statusId = 1; // None Paid
    } else {
      statusId = 2; // Some Paid
    }

    // Fetch Invoice_GUID
    const invoiceRows = await this.mp.getTableRecords<{ Invoice_GUID: string }>({
      table: 'Invoices',
      select: 'Invoice_GUID',
      filter: `Invoice_ID = ${invoiceId}`,
      top: 1,
    });
    const invoiceGuid = invoiceRows[0]?.Invoice_GUID ?? '';

    await this.mp.updateTableRecords(
      'Invoices',
      [
        {
          Invoice_ID: invoiceId,
          Invoice_Total: newTotal,
          Invoice_Status_ID: statusId,
        },
      ],
      { $userId: userId },
    );

    return { newTotal, totalPaid, invoiceGuid };
  }

  async adjustPaymentForInvoice(
    invoiceId: number,
    invoiceDetailId: number,
    newLineTotal: number,
    userId: number,
  ): Promise<void> {
    // Find payment details linked to this invoice detail
    const paymentDetails = await this.mp.getTableRecords<{
      Payment_Detail_ID: number;
      Payment_ID: number;
      Payment_Amount: number;
      Invoice_Detail_ID: number;
    }>({
      table: 'Payment_Detail',
      select: 'Payment_Detail_ID, Payment_ID, Payment_Amount, Invoice_Detail_ID',
      filter: `Invoice_Detail_ID = ${invoiceDetailId}`,
    });

    if (paymentDetails.length === 0) return;

    // Update each payment detail to match the new line total
    // If there's a single payment detail for this line, set it to the new amount
    // If multiple, adjust the most recent one
    const totalCurrentPayment = paymentDetails.reduce((sum, pd) => sum + pd.Payment_Amount, 0);
    const diff = newLineTotal - totalCurrentPayment;

    if (diff === 0) return;

    // Adjust the last payment detail
    const lastPd = paymentDetails[paymentDetails.length - 1];
    const newPaymentAmount = lastPd.Payment_Amount + diff;

    await this.mp.updateTableRecords(
      'Payment_Detail',
      [
        {
          Payment_Detail_ID: lastPd.Payment_Detail_ID,
          Payment_Amount: newPaymentAmount,
        },
      ],
      { $userId: userId },
    );

    // Recalculate the parent Payment_Total
    const allPaymentDetails = await this.mp.getTableRecords<{
      Payment_Amount: number;
    }>({
      table: 'Payment_Detail',
      select: 'Payment_Amount',
      filter: `Payment_ID = ${lastPd.Payment_ID}`,
    });

    const newPaymentTotal = allPaymentDetails.reduce((sum, pd) => sum + pd.Payment_Amount, 0);
    await this.mp.updateTableRecords(
      'Payments',
      [
        {
          Payment_ID: lastPd.Payment_ID,
          Payment_Total: newPaymentTotal,
        },
      ],
      { $userId: userId },
    );
  }

  async getMoveTargetEvents(event: RegistrationEvent): Promise<MoveTargetEvent[]> {
    const conditions = [
      `Event_ID <> ${event.Event_ID}`,
      `Program_ID = ${event.Program_ID}`,
      `Event_Start_Date > GETDATE()`,
      `Cancelled = 0`,
    ];

    if (event.Registration_Form !== null) {
      conditions.push(`Registration_Form = ${event.Registration_Form}`);
    } else {
      conditions.push('Registration_Form IS NULL');
    }

    return this.mp.getTableRecords<MoveTargetEvent>({
      table: 'Events',
      select:
        'Event_ID, Event_Title, Event_Start_Date, Online_Registration_Product, Congregation_ID_TABLE.Congregation_Name',
      filter: conditions.join(' AND '),
      orderBy: 'Event_Start_Date',
    });
  }

  async moveParticipantToEvent(
    eventParticipantId: number,
    newEventId: number,
    userId: number,
  ): Promise<void> {
    await this.mp.updateTableRecords(
      'Event_Participants',
      [
        {
          Event_Participant_ID: eventParticipantId,
          Event_ID: newEventId,
        },
      ],
      { $userId: userId },
    );
  }

  async updateInvoiceDetailProduct(
    invoiceDetailIds: number[],
    newProductId: number,
    userId: number,
  ): Promise<void> {
    if (invoiceDetailIds.length === 0) return;
    await this.mp.updateTableRecords(
      'Invoice_Detail',
      invoiceDetailIds.map((id) => ({
        Invoice_Detail_ID: id,
        Product_ID: newProductId,
      })),
      { $userId: userId },
    );
  }

  async updateInvoiceDetailProductAndOption(
    invoiceDetailId: number,
    newProductId: number,
    newProductOptionPriceId: number,
    newLineTotal: number,
    userId: number,
  ): Promise<void> {
    await this.mp.updateTableRecords(
      'Invoice_Detail',
      [
        {
          Invoice_Detail_ID: invoiceDetailId,
          Product_ID: newProductId,
          Product_Option_Price_ID: newProductOptionPriceId,
          Line_Total: newLineTotal,
        },
      ],
      { $userId: userId },
    );
  }

  async getProductOptionPriceById(priceId: number): Promise<{ Add_to_Group: number | null } | null> {
    const rows = await this.mp.getTableRecords<{ Product_Option_Price_ID: number; Add_to_Group: number | null }>({
      table: 'Product_Option_Prices',
      select: 'Product_Option_Price_ID, Add_to_Group',
      filter: `Product_Option_Price_ID = ${priceId}`,
      top: 1,
    });
    return rows[0] ?? null;
  }

  async syncGroupForOptionChange(
    eventParticipantId: number,
    groupParticipantId: number | null,
    newProductOptionPriceId: number,
    userId: number,
  ): Promise<void> {
    const optionPrice = await this.getProductOptionPriceById(newProductOptionPriceId);
    if (!optionPrice) return;

    const newGroupId = optionPrice.Add_to_Group;
    if (newGroupId === null) return;

    // 1. Update Event_Participants.Group_ID to the new group
    await this.mp.updateTableRecords(
      'Event_Participants',
      [
        {
          Event_Participant_ID: eventParticipantId,
          Group_ID: newGroupId,
        },
      ],
      { $userId: userId },
    );

    // 2. Update the linked Group_Participants record to match the same group
    if (groupParticipantId !== null) {
      await this.mp.updateTableRecords(
        'Group_Participants',
        [
          {
            Group_Participant_ID: groupParticipantId,
            Group_ID: newGroupId,
          },
        ],
        { $userId: userId },
      );
    }
  }
}
