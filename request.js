import http from "k6/http";
import * as p from "./prop.js";
import { generateOrderInfo } from "./data.js";

export function bfxSignUpRequest(
  payload
) {
  return http.post(
    `${p.bfx_url}/auth/user`,
    JSON.stringify(payload),
    {
      headers: p.headers,
      tags: {
        name: `${p.bfx_url}/auth/user`,
      },
      timeout: p.timeout,
    }
  );
}

export function bfxLoginRequest(
  payload
) {
  return http.post(
    `${p.bfx_url}/auth/login`,
    JSON.stringify(payload),
    {
      headers: p.headers,
      tags: {
        name: `${p.bfx_url}/auth/login`,
      },
      timeout: p.timeout,
    }
  );
}

export function bfxUploadDocumentRequest(
  type, accessToken
) {
  let payload = {
    upload_file_name: "dummy.pdf",
    upload: getDocumentUploadData(),
    document_type: type, 
    uploaded: true
  } 
  return http.post(
    `${p.bfx_url}/auth/sender/documents`,
    JSON.stringify(payload),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      tags: {
        name: `${p.bfx_url}/sender/documents`,
      },
      timeout: p.timeout,
    }
  );
}

export function bfxVerificationRequest(
  accessToken
) {
  return http.post(
    `${p.bfx_url}/auth/confirmations/verification`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      tags: {
        name: `${p.bfx_url}/auth/confirmations/verification`,
      },
      timeout: p.timeout,
    }
  );
}

export function bfxUserInformationRequest(
  payload, accessToken
) {
  return http.patch(
    `${p.bfx_url}/auth/sender`,
    JSON.stringify(payload),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      tags: {
        name: `${p.bfx_url}/auth/sender`,
      },
      timeout: p.timeout,
    }
  );

}

export const submitUserInformationAPI = (data, accountData, body, tokens) => {
  cy.request({
      method: 'PATCH',
      url: Cypress.env('apiUrl') + '/auth/sender',
      headers: {
          Authorization: `Bearer ${tokens.access_token}`
      },
      body: {
          "sender": {
              "id": body.id,
              "email": data.email,
              "created_at": null,
              "mfa_enabled": null,
              "email_confirmed": null,
              "persistance_token": body.persistance_token,
              "refresh_token": tokens.refresh_token,
              "refresh_token_expires_at": "2020-05-19T08:55:10.285Z",
              "acknowledged_at": null,
              "sender_id": body.sender_id,
              "verification_requested_at": null,
              "password_reset_token_expires_at": null,
              "state": "incomplete",
              "onboarding_status": "email_confirmed",
              "name": data.companyName,
              "country": "AL",
              "street": null,
              "postal_code": null,
              "city": null,
              "phone_country": accountData.phoneCountry,
              "phone_number": accountData.phoneNumber,
              "legal_entity_type": accountData.legalEntityType,
              "registration_date": accountData.registrationDate,
              "registration_number": accountData.registrationNumber,
              "nature_of_business": accountData.natureOfBusiness,
              "core_business_activity": accountData.coreBusinessActivity,
              "purpose_of_opening_account": null,
              "office_phone": null,
              "trading_country": accountData.tradingCountry,
              "trading_address": accountData.tradingAddress,
              "number_monthly_transactions": accountData.numberMonthlyTransactions,
              "amount_monthly_transactions": accountData.amountMonthlyTransactions,
              "first_name": accountData.firstName,
              "middle_name": accountData.middleName,
              "last_name": accountData.lastName,
              "occupation": accountData.role,
              "source_of_funds": accountData.sourceOfFunds,
              "vat_registration_number": "",
              "financial_regulator": "",
              "regulatory_licence_number": "",
              "banned": false
          }
      }
  }).then((resp) => {
      expect(resp.status).to.eq(200)
  })
}

const uploadDocumentsAPI = (type, tokens) => {
  cy.request({
      method: 'POST',
      url: Cypress.env('apiUrl') + '/auth/sender/documents',
      headers: {
          Authorization: `Bearer ${tokens.access_token}`
      },
      body: {
          "upload_file_name": "dummy.pdf",
          "upload": getDocumentUploadData(),
          "document_type": type, 
          "uploaded": true
      }
  }).then((resp) => {
      expect(resp.status).to.eq(201)
  })
}
