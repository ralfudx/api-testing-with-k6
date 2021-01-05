import moment from "cdnjs.com/libraries/moment.js/2.18.1";
import faker from "cdnjs.com/libraries/Faker";

export function generateTimestamp() {
  return moment().utc().format();
}

export function findTimeDifference(time1, time2) {
  let a = moment(time1);
  let b = moment(time2);
  return a.diff(b, "minutes");
}

export function generateBFXUserPayload(testID) {
  return {
    email: `autoApiTesting+${testID}@gmail.com`,
    password: 'test@1Test',
    companyName: 'approve' + generateRandomText(10),
    newPassword: 'test@1Test#'
  }
}

export function generateBFXLoginPayload() {
  return {
    email: `autoApiTesting+2021-01-05T10:00:55Z@gmail.com`,
    password: 'test@1Test',
    invalidEmail: `wrongemail@gmail.com`
  }
}

export function generateRandomNumber(len) {
  let x = "";
  for (let i = 0; i < len; i++) {
    x += Math.floor(Math.random() * 10);
  }
  return x;
}

export function randomChoice(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}

export function generatePhoneNumber() {
  return Math.floor(Math.random() * 9000000000) + 1000000000;
}

export function generateSenderAddress() {
  const COUNTRY = "UG";
  return {
    address1: faker.address.streetName(),
    address2: "",
    locality: faker.address.city(),
    postalCode: faker.address.zipCode(),
    country: COUNTRY,
  };
}

function generateRandomText(length) {
  let result = "";
  let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function genDateOfBirth(age) {
  // give dob for age number
  return `${new Date().getFullYear() - age}-02-12`; 
}
