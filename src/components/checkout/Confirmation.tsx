import { Check } from "lucide-react";
import { Button } from "../Button";
import { PaymentSelection } from "./PaymentSelection";
import { WebsitePackages } from "./WebsitePackages";
import { formatCurrency } from "../../utils/currency";
import type {
  CheckoutState,
  PaymentMethod,
  WebsitePackage,
} from "../../types/checkout";

interface ConfirmationProps {
  state: CheckoutState;
  onSelectPaymentMethod: (method: PaymentMethod) => void;
  onSelectWebsitePackage: (pkg: WebsitePackage, isYearly?: boolean) => void;
  onBack: () => void;
  onConfirm: () => void;
  onCustomerId: (customerId: number) => void;
}

export function Confirmation({
  state,
  onSelectPaymentMethod,
  onSelectWebsitePackage,
  onBack,
  onConfirm,
  onCustomerId,
}: ConfirmationProps) {
  const username =
    state.userDetails.firstName +
    state.userDetails.lastName +
    Math.floor(1000 + Math.random() * 9000).toString();

  const getEmailPrice = () => {
    switch (state.emailPlan) {
      case "basic":
        return 19.2;
      case "standard":
        return 43.2;
      case "business":
        return 69.99;
      default:
        return 0;
    }
  };

  const getEmailPlanName = () => {
    switch (state.emailPlan) {
      case "basic":
        return "Basic";
      case "standard":
        return "Standard";
      case "business":
        return "Business";
      default:
        return "None";
    }
  };

  const getWebsitePackageDetails = () => {
    if (!state.websitePackage) return null;
    const pkg = {
      lite: {
        name: "Lite",
        monthly: { price: 15, development: 450 },
        yearly: { price: 150, development: 369 },
      },
      pro: {
        name: "Pro",
        monthly: { price: 19, development: 675 },
        yearly: { price: 185, development: 549 },
      },
      premium: {
        name: "Premium",
        monthly: { price: 26, development: 998 },
        yearly: { price: 299, development: 820 },
      },
    }[state.websitePackage];

    return pkg;
  };

  const calculateTotal = () => {
    let total = state.domain?.price || 0; // Domain registration

    // Add email hosting cost if selected
    if (state.emailPlan) {
      total += getEmailPrice();
    }

    // Add website package cost if selected
    const websitePackage = getWebsitePackageDetails();
    if (websitePackage) {
      const pricing = state.isYearlyWebsite
        ? websitePackage.yearly
        : websitePackage.monthly;
      total += pricing.development;
      if (state.isYearlyWebsite) {
        total += pricing.price;
      }
    }

    return total;
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold">Review Your Order</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>
                Domain Registration ({state.domain?.name}
                {state.domain?.extension})
              </span>
              <span className="font-medium">
                £{state.domain?.price.toFixed(2)}/year
              </span>
            </div>
            {state.emailPlan && (
              <div className="flex justify-between">
                <span>Email Hosting ({getEmailPlanName()})</span>
                <span className="font-medium">
                  {formatCurrency(getEmailPrice())}/year
                </span>
              </div>
            )}
            {state.websitePackage && (
              <>
                <div className="flex justify-between">
                  <span>
                    Website Hosting ({getWebsitePackageDetails()?.name})
                  </span>
                  <span className="font-medium">
                    {formatCurrency(
                      state.isYearlyWebsite
                        ? getWebsitePackageDetails()?.yearly.price || 0
                        : getWebsitePackageDetails()?.monthly.price || 0
                    )}
                    /{state.isYearlyWebsite ? "year" : "month"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Website Development</span>
                  <span className="font-medium">
                    {formatCurrency(
                      state.isYearlyWebsite
                        ? getWebsitePackageDetails()?.yearly.development || 0
                        : getWebsitePackageDetails()?.monthly.development || 0
                    )}
                  </span>
                </div>
              </>
            )}
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-left">
            Do you want a website built for you?
          </h3>
          <WebsitePackages
            selectedPackage={state.websitePackage}
            onSelectPackage={onSelectWebsitePackage}
          />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <PaymentSelection
            selectedMethod={state.paymentMethod}
            onSelectMethod={onSelectPaymentMethod}
            total={calculateTotal()}
            state={state}
            onCustomerId={onCustomerId}
          />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Account Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">
                {state.userDetails.firstName} {state.userDetails.lastName}
              </p>
              <p className="font-medium">
                Customer ID: {state.customerId !== 0 && state.customerId}
              </p>
              <p className="font-medium">
                Username: {state.customerId !== 0 && username}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{state.userDetails.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{state.userDetails.phone}</p>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600">Address</p>
            <p className="font-medium">{state.userDetails.address.line1}</p>
            {state.userDetails.address.line2 && (
              <p className="font-medium">{state.userDetails.address.line2}</p>
            )}
            <p className="font-medium">
              {state.userDetails.address.city},{" "}
              {state.userDetails.address.region}{" "}
              {state.userDetails.address.postalCode}
            </p>
            <p className="font-medium">{state.userDetails.address.country}</p>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="secondary" onClick={onBack}>
            Back
          </Button>
          <Button onClick={onConfirm} disabled={!state.paymentMethod}>
            Confirm Order
          </Button>
        </div>
      </div>
    </div>
  );
}
