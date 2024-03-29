import COUNTRIES from "../Country/countries.json" assert {type: "json"};

/** @typedef {import("../../../../flux-studis-selfservice-frontend/src/Country/Country.mjs").Country} Country */

export class GetCountriesCommand {
    /**
     * @returns {GetCountriesCommand}
     */
    static new() {
        return new this();
    }

    /**
     * @private
     */
    constructor() {

    }

    /**
     * @returns {Promise<Country[]>}
     */
    async getCountries() {
        return structuredClone(COUNTRIES);
    }
}
