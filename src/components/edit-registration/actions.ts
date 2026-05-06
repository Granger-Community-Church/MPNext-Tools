'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { EditRegistrationService } from '@/services/editRegistrationService';
import { getCurrentUserIdFromSession } from '@/components/shared-actions/user';
import type {
  RegistrationEvent,
  RegistrationParticipant,
  ProductOptionGroup,
  ProductOptionPrice,
  InvoiceDetailRow,
  UpdateRegistrationPayload,
  MoveTargetEvent,
  ParticipantGridRow,
} from '@/lib/dto';
import type { ParticipationStatus } from '@/lib/dto';

async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) throw new Error('Unauthorized');
  return session;
}

export async function fetchRegistrationData(eventId: number): Promise<{
  event: RegistrationEvent | null;
  participants: ParticipantGridRow[];
  allParticipants: RegistrationParticipant[];
  statuses: ParticipationStatus[];
  productOptionGroups: ProductOptionGroup[];
  productOptionPrices: ProductOptionPrice[];
}> {
  await getSession();

  const service = await EditRegistrationService.getInstance();
  const [event, participants, statuses] = await Promise.all([
    service.getRegistrationEvent(eventId),
    service.getEventParticipants(eventId),
    service.getParticipationStatuses(),
  ]);

  let productOptionGroups: ProductOptionGroup[] = [];
  let productOptionPrices: ProductOptionPrice[] = [];
  let allInvoiceDetails: InvoiceDetailRow[] = [];

  if (event?.Online_Registration_Product) {
    productOptionGroups = await service.getProductOptionGroups(event.Online_Registration_Product);
    const groupIds = productOptionGroups.map((g) => g.Product_Option_Group_ID);
    productOptionPrices = await service.getProductOptionPrices(groupIds);

    const epIds = participants.map((p) => p.Event_Participant_ID);
    allInvoiceDetails = await service.getAllInvoiceDetailsForEvent(eventId, epIds);
  }

  const priceIdToTitle = new Map<number, string>();
  for (const price of productOptionPrices) {
    priceIdToTitle.set(price.Product_Option_Price_ID, price.Option_Title);
  }
  const validPriceIds = new Set(productOptionPrices.map((p) => p.Product_Option_Price_ID));

  const gridRows: ParticipantGridRow[] = participants.map((p) => {
    const epDetails = allInvoiceDetails.filter(
      (d) => d.Event_Participant_ID === p.Event_Participant_ID,
    );
    const options: string[] = [];
    for (const d of epDetails) {
      if (d.Product_Option_Price_ID && validPriceIds.has(d.Product_Option_Price_ID)) {
        const title = priceIdToTitle.get(d.Product_Option_Price_ID);
        if (title) options.push(title);
      }
    }
    return {
      Event_Participant_ID: p.Event_Participant_ID,
      Display_Name: p.Display_Name,
      Participation_Status: p.Participation_Status,
      Participation_Status_ID: p.Participation_Status_ID,
      ProductOptions: options,
    };
  });

  return {
    event,
    participants: gridRows,
    allParticipants: participants,
    statuses,
    productOptionGroups,
    productOptionPrices,
  };
}

export async function fetchParticipantDetails(
  eventParticipantId: number,
  productId: number | null,
): Promise<{
  productOptionGroups: ProductOptionGroup[];
  productOptionPrices: ProductOptionPrice[];
  invoiceDetails: InvoiceDetailRow[];
}> {
  await getSession();

  const service = await EditRegistrationService.getInstance();
  const invoiceDetails = await service.getInvoiceDetails(eventParticipantId);

  if (!productId) {
    return { productOptionGroups: [], productOptionPrices: [], invoiceDetails };
  }

  const productOptionGroups = await service.getProductOptionGroups(productId);
  const groupIds = productOptionGroups.map((g) => g.Product_Option_Group_ID);
  const productOptionPrices = await service.getProductOptionPrices(groupIds);

  return { productOptionGroups, productOptionPrices, invoiceDetails };
}

export async function fetchMoveTargetEvents(eventId: number): Promise<MoveTargetEvent[]> {
  await getSession();

  const service = await EditRegistrationService.getInstance();
  const event = await service.getRegistrationEvent(eventId);
  if (!event) return [];

  return service.getMoveTargetEvents(event);
}

export async function fetchProductOptionsForProduct(productId: number): Promise<{
  groups: ProductOptionGroup[];
  prices: ProductOptionPrice[];
}> {
  await getSession();

  const service = await EditRegistrationService.getInstance();
  const groups = await service.getProductOptionGroups(productId);
  const groupIds = groups.map((g) => g.Product_Option_Group_ID);
  const prices = await service.getProductOptionPrices(groupIds);

  return { groups, prices };
}

export async function saveRegistrationEdits(
  payload: UpdateRegistrationPayload,
): Promise<
  | { success: true; paymentInfo?: { newTotal: number; totalPaid: number; invoiceGuid: string } }
  | { success: false; error: string }
> {
  const session = await getSession();
  const userId = await getCurrentUserIdFromSession(session);

  try {
    const service = await EditRegistrationService.getInstance();

    // Get the EP record to know the Group_Participant_ID (needed for group sync)
    const epRecord = await service.getEventParticipants_byId(payload.eventParticipantId);
    const groupParticipantId = epRecord?.Group_Participant_ID ?? null;

    let paymentInfo: { newTotal: number; totalPaid: number; invoiceGuid: string } | undefined;

    if (payload.participationStatusId !== undefined) {
      await service.updateParticipationStatus(
        payload.eventParticipantId,
        payload.participationStatusId,
        userId,
      );
    }

    if (payload.productOptionUpdates && payload.productOptionUpdates.length > 0) {
      for (const update of payload.productOptionUpdates) {
        await service.updateInvoiceDetailOption(
          update.invoiceDetailId,
          update.newProductOptionPriceId,
          update.newLineTotal,
          userId,
        );

        const detail = await service.getInvoiceDetails(payload.eventParticipantId);
        const updatedDetail = detail.find((d) => d.Invoice_Detail_ID === update.invoiceDetailId);
        if (updatedDetail) {
          await service.adjustPaymentForInvoice(
            updatedDetail.Invoice_ID,
            update.invoiceDetailId,
            update.newLineTotal,
            userId,
          );
          const result = await service.recalculateInvoiceTotal(updatedDetail.Invoice_ID, userId);
          if (result) paymentInfo = result;
        }

        // Sync group membership based on new option's Add_to_Group
        if (groupParticipantId !== null) {
          await service.syncGroupForOptionChange(
            payload.eventParticipantId,
            groupParticipantId,
            update.newProductOptionPriceId,
            userId,
          );
        }
      }
    }

    if (payload.moveToEventId !== undefined) {
      const targetEvent = await service.getRegistrationEvent(payload.moveToEventId);
      const targetProductId = targetEvent?.Online_Registration_Product;

      // Remap individual option selections if mappings were provided
      const mappedDetailIds = new Set<number>();
      if (targetProductId && payload.moveProductOptionMappings && payload.moveProductOptionMappings.length > 0) {
        for (const mapping of payload.moveProductOptionMappings) {
          mappedDetailIds.add(mapping.sourceInvoiceDetailId);

          await service.updateInvoiceDetailProductAndOption(
            mapping.sourceInvoiceDetailId,
            targetProductId,
            mapping.targetProductOptionPriceId,
            mapping.targetLineTotal,
            userId,
          );

          await service.adjustPaymentForInvoice(
            (await service.getInvoiceDetails(payload.eventParticipantId))
              .find((d) => d.Invoice_Detail_ID === mapping.sourceInvoiceDetailId)?.Invoice_ID ?? 0,
            mapping.sourceInvoiceDetailId,
            mapping.targetLineTotal,
            userId,
          );

          // Sync group membership for the remapped option
          if (groupParticipantId !== null) {
            await service.syncGroupForOptionChange(
              payload.eventParticipantId,
              groupParticipantId,
              mapping.targetProductOptionPriceId,
              userId,
            );
          }
        }
      }

      // Update Product_ID on all remaining invoice details (base product, promocodes, etc.)
      if (targetProductId) {
        const allDetails = await service.getInvoiceDetails(payload.eventParticipantId);
        const unmappedDetails = allDetails.filter(
          (d) => !mappedDetailIds.has(d.Invoice_Detail_ID),
        );
        if (unmappedDetails.length > 0) {
          await service.updateInvoiceDetailProduct(
            unmappedDetails.map((d) => d.Invoice_Detail_ID),
            targetProductId,
            userId,
          );
        }

        // Recalculate invoice total after all changes
        if (allDetails.length > 0) {
          const result = await service.recalculateInvoiceTotal(allDetails[0].Invoice_ID, userId);
          if (result) paymentInfo = result;
        }
      }

      await service.moveParticipantToEvent(
        payload.eventParticipantId,
        payload.moveToEventId,
        userId,
      );
    }

    return { success: true, paymentInfo };
  } catch (error) {
    console.error('saveRegistrationEdits error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to save registration edits',
    };
  }
}
