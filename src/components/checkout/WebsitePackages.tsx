import { Check, X } from 'lucide-react';
import { Button } from '../Button';
import { Toggle } from '../Toggle';
import { cn } from '../../utils/cn';
import { useState } from 'react';

export type WebsitePackage = 'lite' | 'pro' | 'premium' | null;

interface WebsitePackagesProps {
  selectedPackage: WebsitePackage;
  onSelectPackage: (pkg: WebsitePackage, isYearly?: boolean) => void;
}

const packages = {
  lite: {
    id: 'lite',
    name: 'Lite',
    monthly: {
      price: 15,
      development: 450,
    },
    yearly: {
      price: 150,
      development: 369,
    },
    features: {
      'Page Design': '5 Pages',
      'CRM Included': true,
      'SEO On-Page': true,
      'Online Booking': true,
      'E-Commerce': false,
      'Products/Services': false,
      'Payment Methods': false,
      'Custom Checkouts': false,
      'Customer Portal': false,
      'Email Marketing': false,
      'Automation & Flows': false,
      'Memberships': false,
      'Subscriptions': false,
    },
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    monthly: {
      price: 19,
      development: 675,
    },
    yearly: {
      price: 185,
      development: 549,
    },
    features: {
      'Page Design': '10 Pages',
      'CRM Included': true,
      'SEO On-Page': true,
      'Online Booking': true,
      'E-Commerce': true,
      'Products/Services': '100 Products',
      'Payment Methods': 'Klarna, Clearpay, Stripe, PayPal',
      'Custom Checkouts': true,
      'Customer Portal': true,
      'Email Marketing': true,
      'Automation & Flows': false,
      'Memberships': false,
      'Subscriptions': true,
    },
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    monthly: {
      price: 26,
      development: 998,
    },
    yearly: {
      price: 299,
      development: 820,
    },
    features: {
      'Page Design': '20 Pages',
      'CRM Included': true,
      'SEO On-Page': 'Full Website',
      'Online Booking': true,
      'E-Commerce': true,
      'Products/Services': 'Unlimited',
      'Payment Methods': 'All Payment Methods',
      'Custom Checkouts': true,
      'Customer Portal': true,
      'Email Marketing': true,
      'Automation & Flows': true,
      'Memberships': true,
      'Subscriptions': true,
    },
  },
};

export function WebsitePackages({ selectedPackage, onSelectPackage }: WebsitePackagesProps) {
  const [isYearly, setIsYearly] = useState(false);
  const showPackages = selectedPackage !== null;

  const handleToggleBilling = (yearly: boolean) => {
    setIsYearly(yearly);
    if (selectedPackage) {
      onSelectPackage(selectedPackage, yearly);
    }
  };

  const handleSelectPackage = (pkg: WebsitePackage) => {
    onSelectPackage(pkg, isYearly);
  };

  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        <Button
          onClick={() => handleSelectPackage(selectedPackage || 'lite')}
          variant={showPackages ? 'primary' : 'outline'}
          className={cn(
            "w-40 h-12 text-lg",
            showPackages && "!bg-[#003B44] !text-white"
          )}
        >
          Yes
        </Button>
        <Button
          onClick={() => handleSelectPackage(null)}
          variant={!showPackages ? 'primary' : 'outline'}
          className={cn(
            "w-40 h-12 text-lg",
            !showPackages && "!bg-[#003B44] !text-white"
          )}
        >
          No
        </Button>
      </div>

      {showPackages && (
        <>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Switch between Monthly/Yearly Pricing</span>
            <Toggle enabled={isYearly} onChange={handleToggleBilling} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.values(packages).map((pkg) => {
              const pricing = isYearly ? pkg.yearly : pkg.monthly;
              return (
                <div
                  key={pkg.id}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all cursor-pointer',
                    selectedPackage === pkg.id
                      ? 'border-[#003B44] bg-[#003B44]/10'
                      : 'border-gray-200 hover:border-[#003B44]/50'
                  )}
                  onClick={() => handleSelectPackage(pkg.id as WebsitePackage)}
                >
                  <div className="mb-4 text-left">
                    <h3 className="text-lg font-bold mb-1">{pkg.name}</h3>
                    <p className="text-sm font-medium">
                      £{pricing.price}/{isYearly ? 'Year' : 'Month'}
                    </p>
                    <p className="text-xs text-gray-600">
                      Website Development £{pricing.development}
                    </p>
                  </div>

                  <ul className="space-y-2 mb-4 text-xs text-left">
                    {Object.entries(pkg.features).map(([feature, value]) => (
                      <li key={feature} className="flex items-start gap-2">
                        {value ? (
                          <Check className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                        )}
                        <span>
                          {typeof value === 'string' ? value : feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}