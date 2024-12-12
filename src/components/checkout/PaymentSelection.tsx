import { CreditCard } from "lucide-react";
import type { PaymentMethod } from "../../types/checkout";
import { StripeWrapper } from "./StripeWrapper";
import type { CheckoutState } from "../../types/checkout";

interface PaymentSelectionProps {
  selectedMethod: PaymentMethod | null;
  onSelectMethod: (method: PaymentMethod) => void;
  total: number;
  state: CheckoutState;
  onCustomerId: (customerId: number) => void;
  onPaymentStatusChange: (paymentStatus: number) => void;
}

export function PaymentSelection({
  selectedMethod,
  onSelectMethod,
  total,
  state,
  onCustomerId,
  onPaymentStatusChange,
}: PaymentSelectionProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Payment Method</h3>

      <div
        className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
          selectedMethod === "card"
            ? "border-[#003B44] bg-[#003B44]/10"
            : "border-gray-200 hover:border-[#003B44]/50"
        }`}
        onClick={() => onSelectMethod("card")}
      >
        <div className="flex items-center gap-3 mb-2">
          <CreditCard className="w-5 h-5 text-[#003B44]" />
          <span className="font-medium">Pay by Card</span>
        </div>
        <p className="text-sm text-gray-600">
          Secure payment via credit/debit card
        </p>
      </div>

      {selectedMethod === "card" && (
        <div className="mt-6 p-6 border border-gray-200 rounded-lg">
          <StripeWrapper
            total={total}
            state={state}
            onCustomerId={onCustomerId}
            onPaymentStatusChange={onPaymentStatusChange}
          />
        </div>
      )}
    </div>
  );
}
