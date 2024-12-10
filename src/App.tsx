import { useEffect, useState } from "react";
import { Steps } from "./components/Steps";
import { UserRegistration } from "./components/checkout/UserRegistration";
import { DomainRegistration } from "./components/checkout/DomainRegistration";
import { EmailHosting } from "./components/checkout/EmailHosting";
import { Confirmation } from "./components/checkout/Confirmation";
import { setupIframeResizer } from "./utils/iframe";
import type {
  CheckoutState,
  UserDetails,
  DomainDetails,
  EmailPlan,
  PaymentMethod,
  WebsitePackage,
} from "./types/checkout";

const STEPS = ["Domain", "Email", "Account", "Confirm"];

function App() {
  const [state, setState] = useState<CheckoutState>({
    userDetails: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: {
        line1: "",
        line2: "",
        city: "",
        region: "",
        postalCode: "",
        country: "",
      },
    },
    domain: null,
    emailPlan: null,
    websitePackage: null,
    isYearlyWebsite: false,
    paymentMethod: null,
    currentStep: 0,
    customerId: 0,
  });

  const [showSteps, setShowSteps] = useState(false);

  // Set up iframe resizer
  useEffect(() => {
    const cleanup = setupIframeResizer();
    return cleanup;
  }, []);

  const handleUpdateUserDetails = (userDetails: UserDetails) => {
    setState((prev) => ({ ...prev, userDetails }));
  };

  const handleUpdateDomain = (domain: DomainDetails) => {
    setShowSteps(true);
    setState((prev) => ({ ...prev, domain }));
  };

  const handleSelectEmailPlan = (emailPlan: EmailPlan) => {
    setState((prev) => ({ ...prev, emailPlan }));
  };

  const handleSelectWebsitePackage = (
    websitePackage: WebsitePackage,
    isYearly = false
  ) => {
    setState((prev) => ({
      ...prev,
      websitePackage,
      isYearlyWebsite: isYearly,
    }));
  };

  const handleSelectPaymentMethod = (paymentMethod: PaymentMethod) => {
    setState((prev) => ({ ...prev, paymentMethod }));
  };

  const handleNext = () => {
    setState((prev) => ({ ...prev, currentStep: prev.currentStep + 1 }));
  };

  const handleBack = () => {
    setState((prev) => ({ ...prev, currentStep: prev.currentStep - 1 }));
  };

  const handleConfirm = () => {
    // Handle confirmation logic
    alert("Order confirmed! Thank you for your purchase.");
  };

  const handleCustomerId = (customerId: number) => {
    setState((prev) => ({ ...prev, customerId }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:py-12">
      <div className="max-w-4xl mx-auto">
        <Steps
          steps={STEPS}
          currentStep={state.currentStep}
          visible={showSteps}
        />

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
          {state.currentStep === 0 && (
            <DomainRegistration
              domain={state.domain}
              onUpdateDomain={handleUpdateDomain}
              onNext={handleNext}
            />
          )}

          {state.currentStep === 1 && (
            <EmailHosting
              selectedPlan={state.emailPlan}
              onSelectPlan={handleSelectEmailPlan}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {state.currentStep === 2 && (
            <UserRegistration
              userDetails={state.userDetails}
              onUpdateDetails={handleUpdateUserDetails}
              onNext={handleNext}
              onBack={handleBack}
            />
          )}

          {state.currentStep === 3 && (
            <Confirmation
              state={state}
              onSelectPaymentMethod={handleSelectPaymentMethod}
              onSelectWebsitePackage={handleSelectWebsitePackage}
              onBack={handleBack}
              onConfirm={handleConfirm}
              onCustomerId={handleCustomerId}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
