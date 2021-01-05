import { group, check, sleep, fail } from "k6";
import http from "k6/http";
import {
  createAnApplication,
  createPaymentMethod,
  getServiceToken,
} from "../common.js";
import {
  sendTransactionAuthorizeRequest,
  sendTransactionSettleRequest,
  sendApplicationCheckoutRequest,
  sendPaymentRequest,
  getPaymentAgreementInfo,
} from "../request.js";
import {
  base_url,
  getApplicationInfoTrend,
  transactionAuthorizeTrend,
  transactionSettleTrend,
  applicationCheckoutTrend,
  timestamp,
  paymentRequestTrend,
  paymentMethodRequestTrend,
  timeout,
} from "../prop.js";

export let options = {
  vus: 100,
  duration: "30s",
};

export default function () {
  const authJWT = getServiceToken();
  const sleep_duration = 0.3;
  const ebgID = "59501d55-66ac-443e-a9f7-472de5783b4a";

  group("One time loan payment scenario", (_) => {
    // create an application
    let applicationResponse = createAnApplication();
    let applicationID = applicationResponse.applicationID;
    let buyerID = applicationResponse.buyerID;
    let agreementID = applicationResponse.agreementID;
    let buyerJWT = applicationResponse.buyerJWT;
    let primaryContactID = applicationResponse.primaryContactID;
    let checksum = applicationResponse.checksum;
    sleep(sleep_duration);

    // checkout an application
    let checkoutResponse = sendApplicationCheckoutRequest(
      buyerJWT,
      primaryContactID,
      applicationID,
      agreementID,
      checksum
    );
    check(checkoutResponse, {
      "status code must be 200": (res) => res.status === 200,
      "application status should be Checkout Completed": (res) =>
        res.json().response.status === "CHECKOUT_COMPLETED",
    }) || fail("application checkout request failed");
    applicationCheckoutTrend.add(checkoutResponse.timings.duration);
    sleep(sleep_duration);

    // Get transaction id from the application
    let transactionResponse = http.get(
      `${base_url}/api/transaction/application/${applicationID}`,
      {
        headers: { Authorization: `Bearer ${authJWT}` },
        tags: {
          name: `${base_url}/api/transaction/application/:applicationID`,
        },
        timeout: timeout,
      }
    );
    check(transactionResponse, {
      "transaction response should be 200": (res) => res.status === 200,
      "transaction status should be pending": (res) =>
        res.json().status === "PENDING",
    });
    let transactionID = transactionResponse.json().id;
    getApplicationInfoTrend.add(transactionResponse.timings.duration);
    sleep(sleep_duration);

    // full authorize a transaction
    let payload = {
      amount: {
        value: 150000,
        currency: "CAD",
      },
      merchantOfRecordID: `${ebgID}`,
      isVirtualCard: false,
    };
    let authorizeResponse = sendTransactionAuthorizeRequest(
      transactionID,
      payload,
      authJWT
    );
    check(authorizeResponse, {
      "authorize status should be 200": (res) => res.status === 200,
      "transaction should be authorized": (res) =>
        res.json().status === "AUTHORIZED",
    }) || fail("authorize transaction request failed");
    transactionAuthorizeTrend.add(authorizeResponse.timings.duration);

    // full settle a transaction
    let settleResponse = sendTransactionSettleRequest(
      transactionID,
      payload,
      authJWT
    );
    check(settleResponse, {
      "authorize status should be 200": (res) => res.status === 200,
      "transaction should  be settle": (res) => res.json().status === "SETTLED",
    }) || fail("settle transaction request failed");
    transactionSettleTrend.add(settleResponse.timings.duration);
    sleep(sleep_duration);

    // Payment agreement should be outstanding after transaction settle
    let paymentAgreementID = settleResponse.json().paymentAgreementID;
    let waitCount = 0;
    while (true) {
      let paymentAgreementResponse = getPaymentAgreementInfo(
        paymentAgreementID,
        authJWT
      );
      let status = paymentAgreementResponse.json().payment_agreement.status;
      if (status === "OUTSTANDING") {
        break;
      } else if (waitCount >= 60) {
        fail(
          "payment agreement info remained in the review status after timeout"
        );
      } else {
        console.log(`status of the payment agreement is ${status}`);
      }
      waitCount += 1;
      sleep(1);
    }

    // create a payment method for the buyer and pay off loan
    let paymentRequest = createPaymentMethod(buyerID, buyerJWT);
    paymentMethodRequestTrend.add(paymentRequest.response.timings.duration);
    let paymentMethodID = paymentRequest.response.json().payment_method.id;
    // make a one time full payment
    payload = {
      payment_method_id: paymentMethodID,
      payment_agreement_id: agreementID,
      amount: {
        currency: "CAD",
        value: "150000",
      },
      request_type: "PAYOFF",
      acknowledgement: {
        acknowledged_at: `${timestamp}`,
        checksum:
          "e9b6dddf-3fdc-4f0e-9dd3-8c82b529eb70:mZFLkyvTelC5g8XnyQrpOw==",
      },
    };
    let paymentResponse = sendPaymentRequest(payload, buyerJWT, agreementID);
    check(paymentResponse, {
      "payment one time status code must be 200": (res) => res.status === 200,
    }) || fail("payment one time response failed!!");
    paymentRequestTrend.add(settleResponse.timings.duration);
  });
}
