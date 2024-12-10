import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { LoadingSpinner } from "../LoadingSpinner";
import { CheckoutState } from "../../types/checkout";
import { createFlowluClient } from "../../services/api/flowlu/index";

interface CardPaymentFromProps {
  total: number;
  state: CheckoutState;
  onCustmerId: (id: number) => void;
}
export const CardPaymentForm = ({
  total,
  state,
  onCustmerId,
}: CardPaymentFromProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const domain = state.domain && state.domain?.name + state.domain?.extension;

  console.log(state);
  const handleSubmit = async (event: React.FormEvent) => {
    event?.preventDefault();
    if (!stripe || !elements) {
      setError("Stripe has not loaded yet.");
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError("Card element is not found.");
      setIsProcessing(false);
      return;
    }

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          name: "Customer Name",
        },
      });

      if (error) {
        throw error;
      }

      const paymentMethodId = paymentMethod.id;
      console.log(paymentMethodId);

      const { clientSecret, payment_succeed, newerror, transactionId } =
        await createPaymentIntent(paymentMethodId, total);
      console.log("payment status ", {
        clientSecret,
        payment_succeed,
        newerror,
        transactionId,
      });

      if (clientSecret) {
        const { error, paymentIntent } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: {
              card: cardElement,
            },
          }
        );
        if (error) {
          setError("Payment Failed");
          setIsProcessing(false);
          return;
        } else if (paymentIntent.status === "succeeded") {
          const registerDomainResponse = await registerDomain();
          if (registerDomainResponse.response.status) {
            onCustmerId(registerDomainResponse.customerId);
            if (state.websitePackage) {
              await createFlowluClient(state);
            }
          } else {
            setError("Failed to register domain and email");
          }
          setIsProcessing(false);
          return;
        }
      }
      if (payment_succeed) {
        const registerDomainResponse = await registerDomain();
        console.log(registerDomainResponse);
        if (registerDomainResponse.response.status) {
          onCustmerId(registerDomainResponse.customerId);
          if (state.websitePackage) {
            await createFlowluClient(state);
          }
        } else {
          setError("Failed to register domain and email");
        }
        setIsProcessing(false);
        return;
      }
      if (newerror) {
        setError("Payment Failed. Please try again");
        setIsProcessing(false);
        return;
      }
    } catch (error) {
      console.error(error);
    }
  };

  async function createPaymentIntent(
    paymentMethodId: string,
    totalPrice: number
  ) {
    try {
      const response = await fetch(
        "https://new-checkout-backend.onrender.com/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ paymentMethodId, totalPrice }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create payment intent");
      }

      const { clientSecret, payment_succeed, transactionId, error } =
        await response.json();
      return { clientSecret, payment_succeed, transactionId, newerror: error };
    } catch (error) {
      console.error("Error creating payment intent:", error);
      return {
        clientSecret: null,
        payment_succeed: false,
        transactionId: "",
        newerror: error,
      };
    }
  }

  async function registerDomain() {
    const response = await fetch(
      `https://new-checkout-backend.onrender.com/register-domain`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain,
          emailPlan: state.emailPlan,
          userDetails: state.userDetails,
        }),
      }
    );

    const result = await response.json();
    return result;
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="error">{error}</div>}

      <div className="mb-4">
        <label>Card Details</label>
        <CardElement
          options={{
            style: {
              base: {
                color: "#32325d",
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#fa755a",
                iconColor: "#fa755a",
              },
            },
            hidePostalCode: false,
          }}
        />
      </div>

      <button
        type="submit"
        disabled={isProcessing || !stripe}
        className="w-full bg-[#003B44] text-white py-2 px-4 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isProcessing ? (
          <div className="flex items-center justify-center">
            <LoadingSpinner />
            <span className="ml-2">Processing payment...</span>
          </div>
        ) : (
          "Pay Now"
        )}
      </button>
    </form>
  );
};
