import { Search } from "lucide-react";
import { useState, FormEvent } from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import { LoadingSpinner } from "../LoadingSpinner";
import { ErrorMessage } from "../ErrorMessage";
import type { DomainDetails } from "../../types/checkout";

interface DomainRegistrationProps {
  domain: DomainDetails | null;
  onUpdateDomain: (domain: DomainDetails) => void;
  onNext: () => void;
}

interface SearchResultProps {
  checking_error: string | null;
  domain_name: string | null;
  is_available: boolean | null;
  register_price: number | null;
  renew_price: number | null;
  status: boolean | null;
}

interface SearchResultsProps {
  data: SearchResultProps[];
}

export function DomainRegistration({
  domain,
  onUpdateDomain,
  onNext,
}: DomainRegistrationProps) {
  const [searchTerm, setSearchTerm] = useState(domain?.name || "");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResultsProps | null>(
    null
  );

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();

    // Validate search term
    const sanitizedTerm = searchTerm.trim().toLowerCase();
    if (!sanitizedTerm) {
      setError("Please enter a domain name");
      return;
    }

    // Validate domain name format
    const domainRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
    if (!domainRegex.test(sanitizedTerm)) {
      setError("Invalid domain name. Use only letters, numbers, and hyphens.");
      return;
    }

    setIsLoading(true);
    setError("");

    const results = await fetch(
      `https://new-checkout-backend.onrender.com/domain-availability?domain=${sanitizedTerm}`
    );
    const data = await results.json();
    setSearchResults(data);
    console.log(data);

    const name = sanitizedTerm;
    onUpdateDomain({
      name,
      extension: "",
      available: false,
      price: 0,
    });

    setIsLoading(false);
  };

  console.log(domain);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-8">Find Your Domain</h2>

      <form onSubmit={handleSearch} className="space-y-6">
        <div className="relative">
          <Input
            type="search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value.toLowerCase());
              setError("");
            }}
            error={error}
            placeholder="Enter your desired domain name"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="absolute right-2 top-[30px] !p-2 !w-[42px] !h-[42px] rounded-full"
            disabled={isLoading}
          >
            <Search className="w-5 h-5" />
          </Button>
          {isLoading && <LoadingSpinner></LoadingSpinner>}
        </div>

        {error && <ErrorMessage message={error} />}

        {searchResults && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Available Domains</h3>
            <div className="grid grid-cols-1 gap-4">
              {searchResults.data.map((result) => (
                <div
                  key={result.domain_name}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    domain.extension ===
                    result.domain_name?.substring(
                      result.domain_name.indexOf(".")
                    )
                      ? "border-[#003B44] bg-[#003B44]/10"
                      : result.is_available
                      ? "border-gray-200 hover:border-[#003B44]/50"
                      : "border-gray-200 opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() =>
                    onUpdateDomain({
                      ...domain,
                      extension: result.domain_name?.substring(
                        result.domain_name.indexOf(".")
                      ),
                      available: result.is_available,
                      price: result.register_price
                        ? result.register_price * 3.36
                        : 0,
                    })
                  }
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">
                      {result.domain_name}
                    </span>
                    {result.is_available && (
                      <span className="text-sm font-medium">
                        £
                        {result.register_price &&
                          (result.register_price * 3.36).toFixed(2)}
                        /year
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-sm mt-1 ${
                      result.is_available ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {result.is_available ? "Available" : "Not available"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {domain && (
          <div className="flex justify-end">
            <Button
              type="button"
              onClick={onNext}
              disabled={!domain?.available}
            >
              Continue
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
