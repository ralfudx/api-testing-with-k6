import { Counter, Trend } from "k6/metrics";
import { check } from "k6";
import { generateTimestamp } from "./data.js";

export let bfx_url = `https://services-staging.tradebfx.com`;
export let api_url = `https://api-staging.bitpesa.co/v1`;
export let api_key = `HhHFLqJcX8VYkyKK5PqwAATFaN5LdScsILjLWi1NiV6Mfs+AMQUIKeHBthSBAxweh0ibaJ0vLLZRIDFF87Sduw==`;
export let api_secret = `WEUPNQEzfznymW3r1jX8n+IFmUWi+FVh9L5eXVot6Ed57FsKsLYrrA7MwDEb5pbkuJPYcwdFVALoWfZ/5EFdWg==`;
// export let bfx_url = `${__ENV.BFX_URL}`;
// export let api_url = `${__ENV.API_URL}`;
// export let api_key = `${__ENV.API_KEY}`;
// export let api_secret = `${__ENV.API_SECRET}`;

export let timestamp = generateTimestamp();
export let timeout = 420000
let failedTestCases = new Counter("failedTestCases");
export let bfxLoginTrend = new Trend('/auth/login');
export let bfxSignUpTrend = new Trend('/auth/login');
export let headers = {
  "Content-Type": "application/json",
};


export let assert = function (result, name) {
  check(null, { [name]: result }); // to record a check
  failedTestCases.add(!result);
  return result;
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
