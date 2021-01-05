// the file contains all the possible scenarios for loading and performance testing

// The following config would have k6 ramping up from 1 to 10 VUs for 3 minutes,
// then staying flat at 10 VUs for 5 minutes, then ramping up from 10 to 35 VUs
// over the next 10 minutes before finally ramping down to 0 VUs for another
// 3 minutes

export let stagesRampUpandDownOption = {
  stages: [
    { duration: "30s", target: 20 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
    { duration: "1m", target: 400 }, // stay at 200 users for 10 minutes
    { duration: "1m", target: 800 },
    { duration: "3m", target: 2000 },
    { duration: "10m", target: 3000 },
    { duration: "5m", target: 1000 },
    { duration: "5m", target: 500 },
    { duration: "5m", target: 0 },
  ],
  thresholds: {
    http_req_duration: ["p(99)<1500"], // 99% of requests must complete below 1.5s
    "logged in successfully": ["p(99)<1500"], // 99% of requests must complete below 1.5s
  },
};

// run scripts for 600 seconds with 1000 virtual users

export let options2 = {
  vus: 4000,
  duration: "900s",
  iterations: 100,
};

export let options3 = {
  thresholds: {
    // Declare a threshold over all HTTP response times,
    // the 95th percentile should not cross 500ms
    http_req_duration: ["p(95)<500"],

    // Declare a threshold over HTTP response times for all data points
    // where the URL tag is equal to "http://httpbin.org/post",
    // the max should not cross 1000ms
    "http_req_duration{url:http://httpbin.org/post}": ["max<1000"],
  },
};

export let sharedUserIterationsOption = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: "per-vu-iterations",
      vus: 10,
      iterations: 20,
      maxDuration: "1h30m",
    },
  },
};

// Just like a loop when can run an iterations

export let iterationsOption = {
  iterations: 10,
};

// Each virtual user is going run for 10 times

export let usersAndIterationsOption = {
  vus: 10,
  iterations: 10,
};

export let upAndDownOption = {
  scenarios: {
    contacts: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "15s", target: 100 },
        { duration: "15s", target: 0 },
      ],
      gracefulRampDown: "0s",
    },
  },
};

export let constantRateOption = {
  scenarios: {
    open_model: {
      executor: "constant-arrival-rate",
      rate: 1,
      timeUnit: "1s",
      duration: "10m",
      preAllocatedVUs: 4500,
    },
  },
  vus: 4500,
};

export let constantUserIterationsOption = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: "per-vu-iterations",
      vus: 10,
      iterations: 20,
      maxDuration: "1h30m",
    },
  },
};

export let externallyControlledOption = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: "externally-controlled",
      vus: 0,
      maxVUs: 50,
      duration: "10m",
    },
  },
};

export let functionalTestsOption = {
  thresholds: {
    failedTestCases: [{ threshold: "count===0", abortOnFail: false }],
  },
  scenarios: {
    runFunctionalTests: {
      executor: "per-vu-iterations",
      vus: 1,
      iterations: 1,
    },
  },
};
