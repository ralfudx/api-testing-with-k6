import tradeBFXTest from "./api/tradeBFX/init.js";
import { functionalTestsOption } from "./prop.js";

export let options = functionalTestsOption;

export default function () {
  tradeBFXTest();
}
