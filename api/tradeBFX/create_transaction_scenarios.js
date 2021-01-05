import { group } from "k6";
import {
} from "../../common.js";
import {
  assert,
  functionalTestsOption,
} from "../../prop.js";

export let options = functionalTestsOption;

export default function () {
  group("Create Transaction Scenarios", (_) => {
  });
}
