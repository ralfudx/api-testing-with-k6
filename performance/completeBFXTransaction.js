import { group, check, sleep } from "k6";
import { bfxLogin } from "../common.js";
import { bfxLoginRequest } from "../request.js";
import { bfxLoginTrend } from "../prop.js";

export let options = {
  vus: 50,
  duration: "120s",
  iterations: 500
};

let count = 0;

export default function () {
  group("Full TradeBFX Transaction Scenario", (_) => {
    count += 1;
    let loginResponse = bfxLogin();
    // let accessToken = loginresponse.response.json().access_token;
    // let refreshToken = loginresponse.response.json().refresh_token;
    // let tokentype = loginresponse.response.json().token_type;
    
    check(loginResponse, {
      "performance status code must be 200": (res) => res.status === 200,
    });
    //bfxLoginTrend.add(loginResponse.timings.duration);
    sleep(1);
  });
}
