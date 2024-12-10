import { FLOWLU_CONFIG, FLOWLU_ENDPOINTS } from "./config";
import { makeFlowluRequest } from "./request";
import type { FlowluResponse, FlowluOpportunityResponse } from "./types";
import type { CheckoutState } from "../../../types/checkout";

function generateOrderSummary(state: CheckoutState): string {
  let hosting = "",
    development = "";
  const userDetails = state.userDetails;
  switch (state.websitePackage) {
    case "lite":
      hosting = state.isYearlyWebsite ? "£150/year" : "£15/year";
      development = state.isYearlyWebsite ? "£369" : "£450";
      break;
    case "pro":
      hosting = state.isYearlyWebsite ? "£185/year" : "£19/year";
      development = state.isYearlyWebsite ? "£549" : "£675";
      break;
    case "premium":
      hosting = state.isYearlyWebsite ? "£299/year" : "£26/year";
      development = state.isYearlyWebsite ? "£820" : "£998";
  }
  // const hosting = plan === "monthly" ? "£15/month" : "£150/year";
  // const development = plan === "monthly" ? "£450" : "£369";

  return `
NEW ORDER SUMMARY
================

Plan Details
-----------
Hosting Plan: ${state.isYearlyWebsite ? "Yearly" : "Monthly"}
Website Development: ${development}
Hosting: ${hosting}
Domain Registration (${state.domain?.extension}): £${state.domain?.price}/year

Customer Details
--------------
Name: ${userDetails.firstName} ${userDetails.lastName}
Email: ${userDetails.email}
Phone: ${userDetails.phone}

Billing Address
--------------
${userDetails.address.line1}
${userDetails.address.line2 ? userDetails.address.line2 + "\n" : ""}${
    userDetails.address.city
  }
${userDetails.address.region}
${userDetails.address.postalCode}
${userDetails.address.country}
`.trim();
}

export async function createOpportunity(
  contactId: number,
  state: CheckoutState
): Promise<FlowluResponse<FlowluOpportunityResponse>> {
  const now = new Date().toISOString().split("T")[0];
  const description = generateOrderSummary(state);

  return makeFlowluRequest<FlowluOpportunityResponse>(
    FLOWLU_ENDPOINTS.OPPORTUNITY,
    {
      name: "NEW ORDER",
      customer_id: contactId,
      assignee_id: FLOWLU_CONFIG.ASSIGNEE_ID,
      start_date: now,
      created_date: now,
      pipeline_id: FLOWLU_CONFIG.PIPELINE_ID,
      pipeline_stage_id: FLOWLU_CONFIG.PIPELINE_STAGE_ID,
      auto_calc: 1,
      description,
    }
  );
}
