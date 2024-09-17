import { defineStore } from 'pinia';
import { UserData } from 'src/typings/data-types';

function parseAustralianPhoneNumber(phoneNumber: string) {
  // Remove all non-numeric characters (except '+')
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');

  // Handle phone numbers starting with '+61'
  if (cleaned.startsWith('+61')) {
    return cleaned;
  }

  // Handle phone numbers starting with '61'
  if (cleaned.startsWith('61')) {
    return '+' + cleaned;
  }

  // Handle phone numbers starting with '04' (convert to '+614')
  if (cleaned.startsWith('04')) {
    return '+61' + cleaned.slice(1);
  }

  // Handle phone numbers starting with just 4
  if (cleaned.startsWith('4')) {
    return '+61' + cleaned;
  }

  // Default case: if the input doesn't match any expected format, return null
  return null;
}

export const useDataUserStore = defineStore('dataUser', {
  persist: true,

  state: (): UserData => ({
    id: undefined,
    password: undefined,
    postcode: undefined,
    latitude: undefined,
    longitude: undefined,
    ageYears: undefined,
    heightCm: undefined,
    weightKg: undefined,
    sex: undefined,
    isSmsNotificationsEnabled: false,
    phoneNumbers: [''],
  }),

  getters: {
    containsUndefined(state) {
      // Inverse (!) has to be used to return boolean
      return (
        !state.id ||
        !state.password ||
        !state.postcode ||
        !state.latitude ||
        !state.longitude ||
        !state.ageYears ||
        !state.heightCm ||
        !state.weightKg ||
        !state.sex
      );
    },
    getParsedPhoneNumbers(state) {
      return state.phoneNumbers.map((number) =>
        parseAustralianPhoneNumber(number)
      );
    },
  },

  actions: {
    async checkPostcode(postcode: number): Promise<boolean | string> {
      // Queensland postcodes range from 4000-5000
      if (postcode < 4000 || postcode >= 5000) {
        return 'Please enter a QLD postcode (4000-4999)';
      }
      // ❗ The below function causes side effects and sets the latitude/longitude
      const foundLatLon = await this.findAndSetPostcodeLatLon(postcode);
      if (!foundLatLon) {
        return 'Postcode lat/lon not found';
      }
      // Everything looks ok
      return true;
    },

    /**
     * Lookup and set the latitude and longitude for a certain postcode
     * ❗ Side effect: will also change the lat/lon in the dataUserStore
     * @returns true if lat/lon are found, otherwise false
     */
    async findAndSetPostcodeLatLon(postcode: number): Promise<boolean> {
      // Dynamically import so it is only loaded into memory when needed
      const { default: postcodeArrayString } = await import(
        'assets/australian_postcodes.js'
      );
      // Lookup postcode latitude and longitude
      const postcodeArray = JSON.parse(postcodeArrayString);
      const postcodeString = postcode.toString();
      // Loop through all postcodes and find correct one
      for (const area of postcodeArray) {
        // Postcode found
        if (area.postcode === postcodeString) {
          // Set postcode, latitude and longitude
          this.latitude = area.lat;
          this.longitude = area.long;
          return true;
        }
      }
      // No postcode found
      return false;
    },

    checkId(id: number) {
      if (id > 0 && id < 1000) {
        this.id = id;
        return true;
      }
      return 'Invalid id value (should be 1-999)';
    },

    checkPassword(password: string) {
      if (password.length > 0) {
        this.password = password;
        return true;
      }
      return 'Please enter a password';
    },

    checkAge(age: number) {
      if (age > 0 && age < 200) {
        this.ageYears = age;
        return true;
      }
      return 'Invalid age value (should be 1-199 years)';
    },

    checkHeight(height: number) {
      if (height > 0 && height < 300) {
        this.heightCm = height;
        return true;
      }
      return 'Invalid height value (1-299cm)';
    },

    checkWeight(weight: number) {
      if (weight > 0 && weight < 400) {
        this.weightKg = weight;
        return true;
      }
      return 'Invalid weight value (1-399kg)';
    },

    checkPhoneNumber(phoneNumber: string) {
      // Parse the phone number into a standardized format
      const parsedNumber = parseAustralianPhoneNumber(phoneNumber);
      // Define regex to check if parsed number is valid
      const validPhoneNumberRegex = /^\+614\d{8}$/; // Should be +614 followed by 8 digits

      if (!parsedNumber || !validPhoneNumberRegex.test(parsedNumber)) {
        // Invalid number
        return 'Invalid phone number';
      }

      return true;
    },
  },
});
