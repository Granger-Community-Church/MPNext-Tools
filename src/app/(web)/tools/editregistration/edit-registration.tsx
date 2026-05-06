'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ToolContainer } from '@/components/tool';
import { ParticipantSelector } from '@/components/edit-registration/participant-selector';
import { ProductOptionsSection } from '@/components/edit-registration/product-options-section';
import { MoveEventSection } from '@/components/edit-registration/move-event-section';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { AlertTriangle, Loader2, Save, Copy, Check } from 'lucide-react';
import {
  fetchRegistrationData,
  fetchParticipantDetails,
  saveRegistrationEdits,
} from '@/components/edit-registration/actions';
import type { ToolParams } from '@/lib/tool-params';
import type {
  RegistrationEvent,
  RegistrationParticipant,
  ParticipantGridRow,
  ProductOptionGroup,
  ProductOptionPrice,
  InvoiceDetailRow,
  ProductOptionUpdate,
  MoveProductOptionMapping,
} from '@/lib/dto';
import type { ParticipationStatus } from '@/lib/dto';

const CHECKOUT_BASE_URL = process.env.NEXT_PUBLIC_CHECKOUT_BASE_URL ?? '';

function PaymentBalanceBanner({
  amount,
  invoiceGuid,
}: {
  amount: number;
  invoiceGuid: string;
}) {
  const [copied, setCopied] = useState(false);
  const checkoutUrl = `${CHECKOUT_BASE_URL}?id=${invoiceGuid}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(checkoutUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="text-sm text-amber-900 bg-amber-50 rounded-md p-3 space-y-2">
      <div className="flex items-start gap-2">
        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
        <span>
          Balance due: <strong>${amount.toFixed(2)}</strong>. Share the checkout link below with the registrant to collect payment.
        </span>
      </div>
      {CHECKOUT_BASE_URL && invoiceGuid && (
        <div className="flex items-center gap-2 ml-6">
          <code className="text-xs bg-amber-100 rounded px-2 py-1 break-all">
            {checkoutUrl}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 text-amber-700 hover:text-amber-900"
            title="Copy link"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      )}
    </div>
  );
}

interface EditRegistrationProps {
  params: ToolParams;
}

export function EditRegistration({ params }: EditRegistrationProps) {
  const router = useRouter();
  const eventId = params.recordID;

  // Event-level state
  const [event, setEvent] = useState<RegistrationEvent | null>(null);
  const [gridRows, setGridRows] = useState<ParticipantGridRow[]>([]);
  const [allParticipants, setAllParticipants] = useState<RegistrationParticipant[]>([]);
  const [statuses, setStatuses] = useState<ParticipationStatus[]>([]);
  const [eventProductGroups, setEventProductGroups] = useState<ProductOptionGroup[]>([]);
  const [eventProductPrices, setEventProductPrices] = useState<ProductOptionPrice[]>([]);

  // Selected participant state
  const [selectedParticipantId, setSelectedParticipantId] = useState<number | null>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetailRow[]>([]);

  // Dirty state
  const [dirtyStatus, setDirtyStatus] = useState<number | null>(null);
  const [dirtyOptions, setDirtyOptions] = useState<Map<number, ProductOptionUpdate>>(new Map());
  const [moveToEventId, setMoveToEventId] = useState<number | null>(null);
  const [moveMappings, setMoveMappings] = useState<Map<number, MoveProductOptionMapping>>(new Map());

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<{
    newTotal: number;
    totalPaid: number;
    invoiceGuid: string;
  } | null>(null);

  const selectedParticipant = allParticipants.find(
    (p) => p.Event_Participant_ID === selectedParticipantId,
  ) ?? null;

  const loadEventData = useCallback(async () => {
    if (!eventId || eventId === -1) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchRegistrationData(eventId);
      setEvent(data.event);
      setGridRows(data.participants);
      setAllParticipants(data.allParticipants);
      setStatuses(data.statuses);
      setEventProductGroups(data.productOptionGroups);
      setEventProductPrices(data.productOptionPrices);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load event data');
    } finally {
      setIsLoading(false);
    }
  }, [eventId]);

  const loadParticipantDetails = useCallback(
    async (epId: number) => {
      setIsLoadingDetails(true);
      setError(null);
      setSuccessMessage(null);
      setPaymentInfo(null);
      setDirtyStatus(null);
      setDirtyOptions(new Map());
      setMoveToEventId(null);
      setMoveMappings(new Map());
      try {
        const data = await fetchParticipantDetails(
          epId,
          event?.Online_Registration_Product ?? null,
        );
        setInvoiceDetails(data.invoiceDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load participant details');
      } finally {
        setIsLoadingDetails(false);
      }
    },
    [event],
  );

  useEffect(() => {
    loadEventData();
  }, [loadEventData]);

  const handleParticipantSelect = (epId: number) => {
    if (epId === selectedParticipantId) {
      // Toggle closed
      setSelectedParticipantId(null);
      return;
    }
    setSelectedParticipantId(epId);
    loadParticipantDetails(epId);
  };

  const handleStatusChange = (value: string) => {
    const statusId = parseInt(value, 10);
    if (selectedParticipant && statusId === selectedParticipant.Participation_Status_ID) {
      setDirtyStatus(null);
    } else {
      setDirtyStatus(statusId);
    }
  };

  const handleOptionChange = (
    groupId: number,
    priceId: number,
    invoiceDetailId: number,
    lineTotal: number,
  ) => {
    setDirtyOptions((prev) => {
      const next = new Map(prev);
      next.set(groupId, {
        invoiceDetailId,
        newProductOptionPriceId: priceId,
        newLineTotal: lineTotal,
      });
      return next;
    });
  };

  const selectedOptionsMap = new Map<number, number>();
  for (const [groupId, update] of dirtyOptions) {
    selectedOptionsMap.set(groupId, update.newProductOptionPriceId);
  }

  const hasDirtyChanges =
    dirtyStatus !== null || dirtyOptions.size > 0 || moveToEventId !== null;

  const handleSave = async () => {
    if (!selectedParticipantId || !hasDirtyChanges) return;
    setIsSaving(true);
    setError(null);
    setSuccessMessage(null);
    setPaymentInfo(null);
    try {
      const result = await saveRegistrationEdits({
        eventParticipantId: selectedParticipantId,
        participationStatusId: dirtyStatus ?? undefined,
        productOptionUpdates:
          dirtyOptions.size > 0 ? Array.from(dirtyOptions.values()) : undefined,
        moveToEventId: moveToEventId ?? undefined,
        moveProductOptionMappings:
          moveMappings.size > 0 ? Array.from(moveMappings.values()) : undefined,
      });

      if (!result.success) {
        setError(result.error);
        return;
      }

      const wasMove = moveToEventId !== null;
      setSuccessMessage(
        wasMove
          ? 'Registration moved successfully.'
          : 'Registration updated successfully.',
      );
      if (result.paymentInfo) {
        setPaymentInfo(result.paymentInfo);
      }
      setDirtyStatus(null);
      setDirtyOptions(new Map());
      setMoveToEventId(null);
      setMoveMappings(new Map());

      if (wasMove) {
        setSelectedParticipantId(null);
        setInvoiceDetails([]);
      }

      await loadEventData();

      if (!wasMove && selectedParticipantId) {
        await loadParticipantDetails(selectedParticipantId);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    router.back();
  };

  const formatEventDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  if (!eventId || eventId === -1) {
    return (
      <ToolContainer title="Edit Registration" onClose={handleClose} hideFooter>
        <div className="px-6 py-4 text-sm text-muted-foreground">
          This tool must be launched from an Event record.
        </div>
      </ToolContainer>
    );
  }

  const currentStatusId =
    dirtyStatus ?? selectedParticipant?.Participation_Status_ID ?? undefined;

  const renderEditPanel = () => {
    if (!selectedParticipant) return null;

    return (
      <div className="space-y-5">
        {/* Status */}
        <div className="space-y-2">
          <Label className="text-base font-semibold">Participation Status</Label>
          <Select
            value={currentStatusId?.toString() ?? ''}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-full max-w-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem
                  key={s.Participation_Status_ID}
                  value={s.Participation_Status_ID.toString()}
                >
                  {s.Participation_Status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Product Options — hidden when move is engaged */}
        {!moveToEventId && (
          <ProductOptionsSection
            groups={eventProductGroups}
            prices={eventProductPrices}
            invoiceDetails={invoiceDetails}
            selectedOptions={selectedOptionsMap}
            onOptionChange={handleOptionChange}
          />
        )}

        {/* Move to Another Event */}
        <MoveEventSection
          eventId={eventId!}
          currentProductId={event?.Online_Registration_Product ?? null}
          invoiceDetails={invoiceDetails}
          currentGroups={eventProductGroups}
          currentPrices={eventProductPrices}
          selectedEventId={moveToEventId}
          productMappings={moveMappings}
          onEventChange={setMoveToEventId}
          onMappingChange={setMoveMappings}
        />

        {/* Save button */}
        {hasDirtyChanges && (
          <div className="flex items-center gap-3 pt-2 border-t">
            <Button onClick={handleSave} disabled={isSaving} size="sm">
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
            {dirtyStatus !== null && (
              <span className="text-xs text-muted-foreground">
                Status changed
              </span>
            )}
            {dirtyOptions.size > 0 && (
              <span className="text-xs text-muted-foreground">
                {dirtyOptions.size} option(s) changed
              </span>
            )}
            {moveToEventId !== null && (
              <span className="text-xs text-muted-foreground">
                Moving to another event
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <ToolContainer
      title="Edit Registration"
      onClose={handleClose}
      hideFooter
    >
      <div className="px-6 py-4 space-y-4 max-w-5xl">
        {event && (
          <div className="text-sm text-muted-foreground">
            {event.Event_Title}
            {event.Congregation_Name ? ` (${event.Congregation_Name})` : ''} &mdash;{' '}
            {formatEventDate(event.Event_Start_Date)}
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading event data...
          </div>
        ) : (
          <>
            {error && (
              <div className="text-sm text-red-600 bg-red-50 rounded-md p-3">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="text-sm text-green-700 bg-green-50 rounded-md p-3">
                {successMessage}
              </div>
            )}

            {paymentInfo && paymentInfo.totalPaid < paymentInfo.newTotal && (
              <PaymentBalanceBanner
                amount={paymentInfo.newTotal - paymentInfo.totalPaid}
                invoiceGuid={paymentInfo.invoiceGuid}
              />
            )}

            {paymentInfo && paymentInfo.totalPaid > paymentInfo.newTotal && (
              <div className="text-sm text-blue-800 bg-blue-50 rounded-md p-3">
                A refund of <strong>${(paymentInfo.totalPaid - paymentInfo.newTotal).toFixed(2)}</strong> may need to be issued.
              </div>
            )}

            <ParticipantSelector
              participants={gridRows}
              selectedId={selectedParticipantId}
              isLoadingDetails={isLoadingDetails}
              onSelect={handleParticipantSelect}
              renderEditPanel={renderEditPanel}
            />
          </>
        )}
      </div>
    </ToolContainer>
  );
}
