import { group } from "k6";
import {
  bfxLogin,
  bfxSignUp,
} from "../../common.js";
import {
  assert,
  functionalTestsOption,
  timestamp,
} from "../../prop.js";
import {
  generateBFXLoginPayload,
} from "../../data.js";

export let options = functionalTestsOption;

export default function () {
  group("Registration and Login Scenarios", (_) => {
    group("Sign up new user should return sender ID", (_) => {
      let testID = timestamp
      let signUpResponse = bfxSignUp(testID)
      assert(
        signUpResponse.response.status === 200,
        "bfx sign-up status code must be 200"
      );
      assert(
        signUpResponse.response.json().data.sender_id != null,
        "sign-up sender ID should not be NULL"
      );
    });

    group("Login with valid credentials should return access token", (_) => {
      let loginPayload = generateBFXLoginPayload();
      let loginResponse = bfxLogin(loginPayload.email, loginPayload.password)
      console.log(`Refresh token is: ${loginResponse.response.json().refresh_token}`)
      assert(
        loginResponse.response.status === 200,
        "bfx login status code must be 200"
      );
      assert(
        loginResponse.response.json().access_token != null,
        "login access token should not be NULL"
      );
    });

    group("Login with invalid credentials should return unauthorized", (_) => {
      let loginPayload = generateBFXLoginPayload();
      let loginResponse = bfxLogin(loginPayload.invalidEmail, loginPayload.password)
      console.log(`Refresh token is: ${loginResponse.response.json().refresh_token}`)
      assert(
        loginResponse.response.status === 401,
        "bfx invalid login status code must be 401"
      );
      assert(
        loginResponse.response.json().error === 'unauthorized',
        "response error message should be unauthorized"
      );
    });
  });
}
