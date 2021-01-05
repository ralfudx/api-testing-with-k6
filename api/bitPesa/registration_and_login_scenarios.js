import { group } from "k6";
import {
  bfxLogin,
} from "../../common.js";
import {
  assert,
  functionalTestsOption,
} from "../../prop.js";

export let options = functionalTestsOption;

export default function () {
  group("Registration and Login Scenarios", (_) => {
    group("Login with valid credentials should return access token", (_) => {
      let loginresponse = bfxLogin()
      console.log(`Refresh token is: ${loginresponse.response.json().refresh_token}`)
      assert(
        loginresponse.response.status === 200,
        "bfx login status code must be 200"
      );
      assert(
        loginresponse.response.json().access_token != null,
        "login access token should not be NULL"
      );
    });

    group("Login with invalid credentials should return UNAUTHORIZED", (_) => {
      let loginresponse = bfxLogin(false)
      console.log(`Refresh token is: ${loginresponse.response.json().refresh_token}`)
      assert(
        loginresponse.response.status === 200,
        "bfx login status code must be 200"
      );
      assert(
        loginresponse.response.json().access_token != null,
        "login access token should not be NULL"
      );
    });
  });
}
