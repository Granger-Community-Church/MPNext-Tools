'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import type {
  ProductOptionGroup,
  ProductOptionPrice,
  InvoiceDetailRow,
} from '@/lib/dto';

interface ProductOptionsSectionProps {
  groups: ProductOptionGroup[];
  prices: ProductOptionPrice[];
  invoiceDetails: InvoiceDetailRow[];
  selectedOptions: Map<number, number>;
  onOptionChange: (groupId: number, priceId: number, invoiceDetailId: number, lineTotal: number) => void;
}

function formatPrice(price: number): string {
  if (price === 0) return 'Free';
  return `$${price.toFixed(2)}`;
}

export function ProductOptionsSection({
  groups,
  prices,
  invoiceDetails,
  selectedOptions,
  onOptionChange,
}: ProductOptionsSectionProps) {
  if (groups.length === 0) return null;

  const getGroupPrices = (groupId: number) =>
    prices.filter((p) => p.Product_Option_Group_ID === groupId);

  const getCurrentSelection = (groupId: number): number | null => {
    if (selectedOptions.has(groupId)) {
      return selectedOptions.get(groupId)!;
    }
    const groupPriceIds = new Set(
      getGroupPrices(groupId).map((p) => p.Product_Option_Price_ID),
    );
    const match = invoiceDetails.find(
      (d) => d.Product_Option_Price_ID !== null && groupPriceIds.has(d.Product_Option_Price_ID),
    );
    return match?.Product_Option_Price_ID ?? null;
  };

  const getInvoiceDetailForGroup = (groupId: number): InvoiceDetailRow | undefined => {
    const groupPriceIds = new Set(
      getGroupPrices(groupId).map((p) => p.Product_Option_Price_ID),
    );
    return invoiceDetails.find(
      (d) => d.Product_Option_Price_ID !== null && groupPriceIds.has(d.Product_Option_Price_ID),
    );
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-semibold">Product Options</Label>
      {groups.map((group) => {
        const groupPrices = getGroupPrices(group.Product_Option_Group_ID);
        const currentSelection = getCurrentSelection(group.Product_Option_Group_ID);
        const invoiceDetail = getInvoiceDetailForGroup(group.Product_Option_Group_ID);

        if (groupPrices.length === 0) return null;

        if (group.Mutually_Exclusive) {
          return (
            <div key={group.Product_Option_Group_ID} className="space-y-2">
              <Label className="text-sm font-medium">
                {group.Option_Group_Name}
                {group.Required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              <RadioGroup
                value={currentSelection?.toString() ?? ''}
                onValueChange={(value) => {
                  const priceId = parseInt(value, 10);
                  const price = groupPrices.find((p) => p.Product_Option_Price_ID === priceId);
                  if (invoiceDetail && price) {
                    onOptionChange(
                      group.Product_Option_Group_ID,
                      priceId,
                      invoiceDetail.Invoice_Detail_ID,
                      price.Option_Price * invoiceDetail.Item_Quantity,
                    );
                  }
                }}
              >
                {groupPrices.map((price) => (
                  <div key={price.Product_Option_Price_ID} className="flex items-center gap-2">
                    <RadioGroupItem
                      value={price.Product_Option_Price_ID.toString()}
                      id={`option-${price.Product_Option_Price_ID}`}
                    />
                    <Label
                      htmlFor={`option-${price.Product_Option_Price_ID}`}
                      className="font-normal cursor-pointer"
                    >
                      {price.Option_Title}
                      {price.Option_Price !== 0 && (
                        <span className="text-muted-foreground ml-2">
                          ({formatPrice(price.Option_Price)})
                        </span>
                      )}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          );
        }

        return (
          <div key={group.Product_Option_Group_ID} className="space-y-2">
            <Label className="text-sm font-medium">
              {group.Option_Group_Name}
              {group.Required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <div className="space-y-2">
              {groupPrices.map((price) => {
                const isChecked = currentSelection === price.Product_Option_Price_ID;
                return (
                  <div key={price.Product_Option_Price_ID} className="flex items-center gap-2">
                    <Checkbox
                      id={`option-${price.Product_Option_Price_ID}`}
                      checked={isChecked}
                      onCheckedChange={() => {
                        if (invoiceDetail) {
                          onOptionChange(
                            group.Product_Option_Group_ID,
                            price.Product_Option_Price_ID,
                            invoiceDetail.Invoice_Detail_ID,
                            price.Option_Price * invoiceDetail.Item_Quantity,
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor={`option-${price.Product_Option_Price_ID}`}
                      className="font-normal cursor-pointer"
                    >
                      {price.Option_Title}
                      {price.Option_Price !== 0 && (
                        <span className="text-muted-foreground ml-2">
                          ({formatPrice(price.Option_Price)})
                        </span>
                      )}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
