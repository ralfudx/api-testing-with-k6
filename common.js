// This file contains defaults and data that is common to all the individual test cases.
import { check, fail, sleep } from "k6";
import http from "k6/http";
import encoding from "k6/encoding";
import * as r from "./request.js";
import * as p from "./prop.js";
import * as d from "./data.js";

export function bfxSignUp(testID) {
  let signUpPayload = d.generateBFXUserPayload(testID);
  let requestpayload = {
      email: signUpPayload.email,
      name: signUpPayload.companyName,
      password: signUpPayload.password
  };
  let signUpResponse = r.bfxSignUpRequest(requestpayload)
  check(signUpResponse, {
    "status code must be 200": (res) => res.status === 200,
  });
  return {
    response: signUpResponse
  }
}

export function bfxLogin(_email, _password) {
  let payload = {
    email: _email,
    password: _password
  };
  let loginResponse = r.bfxLoginRequest(payload)
  return {
    response: loginResponse
  }
}

export function bfxOnboard() {
  let signUpResponse = bfxSignUp(testID)
  let email = signUpResponse.response.json().email
  let password = signUpResponse.response.json().password
  let loginResponse = bfxLogin(email, password)
  let accessToken = loginResponse.response.json().access_token
  r.bfxUserInformationRequest(payload, accessToken)
  let onboardResponse = r.bfxVerificationRequest(accessToken)
  return {
    response: onboardResponse
  }
}

export const onboardAPITradeBFX = (data, accountData) => {
  cy.log(data)
  signUpAPITradeBFX(data)
  cy.log(data)
  loginAPITradeBFX(data)
  cy.get('@body').then(signUpBody => {
      cy.get('@tokens').then(tokens => {
          submitUserInformationAPI(data, accountData, signUpBody, tokens)
          uploadDocumentsAPI(documentsTypes[0], tokens)
          uploadDocumentsAPI(documentsTypes[1], tokens)
          uploadDocumentsAPI(documentsTypes[2], tokens)
          uploadDocumentsAPI(documentsTypes[3], tokens)
          uploadDocumentsAPI(documentsTypes[4], tokens)
          uploadDocumentsAPI(documentsTypes[5], tokens)
          sendForVerificationAPI(tokens)
      }) 
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