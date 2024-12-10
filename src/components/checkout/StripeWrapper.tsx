import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { STRIPE_CONFIG } from "../../config/stripe";
import { CardPaymentForm } from "./CardPaymentForm";
import type { CheckoutState } from "../../types/checkout";

interface StripeWrapperProps {
  total: number;
  state: CheckoutState;
  onCustomerId: (customerId: number) => void;
}

export const StripeWrapper = ({
  total,
  state,
  onCustomerId,
}: StripeWrapperProps) => {
  const [stripePromise, setStripePromise] = useState<any>(null);
  console.log(total);

  useEffect(() => {
    const loadStripeAsync = async () => {
      const stripe = await loadStripe(STRIPE_CONFIG.publishableKey);
      setStripePromise(stripe);
    };

    loadStripeAsync();
  }, []);

  if (!stripePromise) {
    return <div>Loading...</div>;
  }

  return (
    <Elements stripe={stripePromise}>
      <CardPaymentForm total={total} state={state} onCustmerId={onCustomerId} />
    </Elements>
  );
};
