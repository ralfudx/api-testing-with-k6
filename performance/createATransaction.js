import { check, sleep, group, fail } from "k6";
import {  } from "../common.js";
import {  } from "../request.js";

export let options = {
  stages: [
    { duration: "30s", target: 20 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
    { duration: "1m", target: 20 }, // stay at 200 users for 10 minutes
    { duration: "1m", target: 50 },
    { duration: "3m", target: 50 },
    { duration: "3m", target: 100 },
    { duration: "3m", target: 100 },
    { duration: "3m", target: 200 },
    { duration: "3m", target: 200 },
    { duration: "2m", target: 300 },
    { duration: "2m", target: 300 },
    { duration: "3m", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(99)<1500"], // 99% of requests must complete below 1.5s
    "logged in successfully": ["p(99)<1500"], // 99% of requests must complete below 1.5s
  },
};

export default function () {
  group("Create a TransferZero Transaction Scenario", (_) => {
  });
}
