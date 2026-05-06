'use client';

import { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { fetchMoveTargetEvents, fetchProductOptionsForProduct } from './actions';
import type {
  MoveTargetEvent,
  ProductOptionGroup,
  ProductOptionPrice,
  InvoiceDetailRow,
  MoveProductOptionMapping,
} from '@/lib/dto';

interface MoveEventSectionProps {
  eventId: number;
  currentProductId: number | null;
  invoiceDetails: InvoiceDetailRow[];
  currentGroups: ProductOptionGroup[];
  currentPrices: ProductOptionPrice[];
  selectedEventId: number | null;
  productMappings: Map<number, MoveProductOptionMapping>;
  onEventChange: (eventId: number | null) => void;
  onMappingChange: (mappings: Map<number, MoveProductOptionMapping>) => void;
}

function formatEventDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function formatPrice(price: number): string {
  if (price === 0) return 'Free';
  return `$${price.toFixed(2)}`;
}

export function MoveEventSection({
  eventId,
  currentProductId,
  invoiceDetails,
  currentGroups,
  currentPrices,
  selectedEventId,
  productMappings,
  onEventChange,
  onMappingChange,
}: MoveEventSectionProps) {
  const [targetEvents, setTargetEvents] = useState<MoveTargetEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Target product options (loaded when target has different product)
  const [targetGroups, setTargetGroups] = useState<ProductOptionGroup[]>([]);
  const [targetPrices, setTargetPrices] = useState<ProductOptionPrice[]>([]);
  const [isLoadingTargetOptions, setIsLoadingTargetOptions] = useState(false);

  const selectedTarget = targetEvents.find((e) => e.Event_ID === selectedEventId) ?? null;
  const needsRemapping =
    selectedTarget !== null &&
    selectedTarget.Online_Registration_Product !== currentProductId;

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchMoveTargetEvents(eventId)
      .then((events) => {
        if (!cancelled) {
          setTargetEvents(events);
          setLoaded(true);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  // Fetch target product options when target event changes to a different product
  useEffect(() => {
    if (!selectedTarget || !needsRemapping || !selectedTarget.Online_Registration_Product) {
      setTargetGroups([]);
      setTargetPrices([]);
      return;
    }

    let cancelled = false;
    setIsLoadingTargetOptions(true);
    fetchProductOptionsForProduct(selectedTarget.Online_Registration_Product)
      .then(({ groups, prices }) => {
        if (!cancelled) {
          setTargetGroups(groups);
          setTargetPrices(prices);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingTargetOptions(false);
      });
    return () => {
      cancelled = true;
    };
  }, [selectedTarget, needsRemapping]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Label className="text-base font-semibold">Move to Another Event</Label>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading compatible events...
        </div>
      </div>
    );
  }

  if (loaded && targetEvents.length === 0) {
    return (
      <div className="space-y-3">
        <Label className="text-base font-semibold">Move to Another Event</Label>
        <p className="text-sm text-muted-foreground">
          No compatible future events found with the same program and form.
        </p>
      </div>
    );
  }

  // Build current selections from invoice details, paired with best-matching target group
  const currentSelections: Array<{
    sourceGroupId: number;
    groupName: string;
    optionTitle: string;
    invoiceDetailId: number;
    targetGroup: ProductOptionGroup | null;
  }> = [];

  const usedTargetGroupIds = new Set<number>();

  for (const group of currentGroups) {
    const groupPriceIds = new Set(
      currentPrices
        .filter((p) => p.Product_Option_Group_ID === group.Product_Option_Group_ID)
        .map((p) => p.Product_Option_Price_ID),
    );
    const matchedDetail = invoiceDetails.find(
      (d) => d.Product_Option_Price_ID !== null && groupPriceIds.has(d.Product_Option_Price_ID),
    );
    if (matchedDetail && matchedDetail.Product_Option_Price_ID) {
      const price = currentPrices.find(
        (p) => p.Product_Option_Price_ID === matchedDetail.Product_Option_Price_ID,
      );
      if (price) {
        // Match target group by name first
        const nameMatch = targetGroups.find(
          (tg) =>
            tg.Option_Group_Name.toLowerCase() === group.Option_Group_Name.toLowerCase() &&
            !usedTargetGroupIds.has(tg.Product_Option_Group_ID),
        );
        const matched = nameMatch ?? null;
        if (matched) usedTargetGroupIds.add(matched.Product_Option_Group_ID);

        currentSelections.push({
          sourceGroupId: group.Product_Option_Group_ID,
          groupName: group.Option_Group_Name,
          optionTitle: price.Option_Title,
          invoiceDetailId: matchedDetail.Invoice_Detail_ID,
          targetGroup: matched,
        });
      }
    }
  }

  // For any source groups that didn't match by name, assign remaining target groups by position
  const unmatchedTargets = targetGroups.filter((tg) => !usedTargetGroupIds.has(tg.Product_Option_Group_ID));
  let unmatchedIdx = 0;
  for (const sel of currentSelections) {
    if (!sel.targetGroup && unmatchedIdx < unmatchedTargets.length) {
      sel.targetGroup = unmatchedTargets[unmatchedIdx++];
    }
  }

  const handleTargetOptionSelect = (
    sourceInvoiceDetailId: number,
    targetPriceId: number,
  ) => {
    const price = targetPrices.find((p) => p.Product_Option_Price_ID === targetPriceId);
    if (!price) return;

    const sourceDetail = invoiceDetails.find((d) => d.Invoice_Detail_ID === sourceInvoiceDetailId);
    const qty = sourceDetail?.Item_Quantity ?? 1;

    const next = new Map(productMappings);
    next.set(sourceInvoiceDetailId, {
      sourceInvoiceDetailId,
      targetProductOptionPriceId: targetPriceId,
      targetLineTotal: price.Option_Price * qty,
    });
    onMappingChange(next);
  };

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Move to Another Event</Label>
      <Select
        value={selectedEventId?.toString() ?? 'none'}
        onValueChange={(value) => {
          onEventChange(value === 'none' ? null : parseInt(value, 10));
          onMappingChange(new Map());
        }}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Keep in current event" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">Keep in current event</SelectItem>
          {targetEvents.map((e) => (
            <SelectItem key={e.Event_ID} value={e.Event_ID.toString()}>
              {e.Event_Title}
              {e.Congregation_Name ? ` (${e.Congregation_Name})` : ''} &mdash;{' '}
              {formatEventDate(e.Event_Start_Date)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {needsRemapping && (
        <div className="space-y-3 mt-2">
          <div className="flex items-start gap-2 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>
              The target event uses a different product. Please map each current option to the new product&apos;s options below.
            </span>
          </div>

          {isLoadingTargetOptions ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading target product options...
            </div>
          ) : (
            <div className="space-y-4">
              {currentSelections.map(
                ({ sourceGroupId, groupName, optionTitle, invoiceDetailId, targetGroup }) => {
                  const mapping = productMappings.get(invoiceDetailId);
                  const tgPrices = targetGroup
                    ? targetPrices.filter(
                        (p) => p.Product_Option_Group_ID === targetGroup.Product_Option_Group_ID,
                      )
                    : [];

                  return (
                    <div
                      key={sourceGroupId}
                      className="grid grid-cols-2 gap-4 rounded-md border p-3"
                    >
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Current ({groupName})
                        </p>
                        <p className="text-sm font-medium">{optionTitle}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">
                          Map to{targetGroup ? ` (${targetGroup.Option_Group_Name})` : ''}
                        </p>
                        {tgPrices.length > 0 ? (
                          <RadioGroup
                            value={mapping?.targetProductOptionPriceId?.toString() ?? ''}
                            onValueChange={(val) =>
                              handleTargetOptionSelect(
                                invoiceDetailId,
                                parseInt(val, 10),
                              )
                            }
                          >
                            {tgPrices.map((tp) => (
                              <div
                                key={tp.Product_Option_Price_ID}
                                className="flex items-center gap-2"
                              >
                                <RadioGroupItem
                                  value={tp.Product_Option_Price_ID.toString()}
                                  id={`move-${invoiceDetailId}-${tp.Product_Option_Price_ID}`}
                                />
                                <Label
                                  htmlFor={`move-${invoiceDetailId}-${tp.Product_Option_Price_ID}`}
                                  className="font-normal cursor-pointer text-sm"
                                >
                                  {tp.Option_Title}
                                  {tp.Option_Price !== 0 && (
                                    <span className="text-muted-foreground ml-1">
                                      ({formatPrice(tp.Option_Price)})
                                    </span>
                                  )}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No matching options available
                          </p>
                        )}
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
