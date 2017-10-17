export const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAxxgk5COTKPCnLvU06xr96TLYdRAF1WDI",
  authDomain: "myionic-ac8e7.firebaseapp.com",
  databaseURL: "https://myionic-ac8e7.firebaseio.com",
  projectId: "myionic-ac8e7",
  storageBucket: "myionic-ac8e7.appspot.com",
  messagingSenderId: "547920515268"
};

/**
 * Each period is 30 minutes or 1800000 miliseconds.
 */
export const PERIOD_LENGTH = 1800000;

/**
 * User can book room for current date and next 7 days.
 */
export const MAX_ADVANCE_BOOKING_DAY = 7;

/**
 * The day key format in the days list of a room.
 */
export const DAY_KEY_FORMAT = 'dd_MM_yyyy';