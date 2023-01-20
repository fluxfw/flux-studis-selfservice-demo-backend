import { PAGE_PERSONAL_DATA, PAGE_PORTRAIT } from "../../../../../flux-studis-selfservice-frontend/src/Adapter/Page/PAGE.mjs";

/** @typedef {import("../../../Adapter/Application/Application.mjs").Application} Application */
/** @typedef {import("../../../../../flux-studis-selfservice-frontend/src/Adapter/Portrait/ChosenPortrait.mjs").ChosenPortrait} ChosenPortrait */
/** @typedef {import("../Port/DataService.mjs").DataService} DataService */
/** @typedef {import("../../../../../flux-studis-selfservice-frontend/src/Adapter/Label/Label.mjs").Label} Label */
/** @typedef {import("../../../../../flux-studis-selfservice-frontend/src/Adapter/Post/Post.mjs").Post} Post */

export class ChosenPortraitCommand {
    /**
     * @type {DataService}
     */
    #data_service;

    /**
     * @param {DataService} data_service
     * @returns {ChosenPortraitCommand}
     */
    static new(data_service) {
        return new this(
            data_service
        );
    }

    /**
     * @param {DataService} data_service
     * @private
     */
    constructor(data_service) {
        this.#data_service = data_service;
    }

    /**
     * @param {Application} application
     * @param {Post & {data: ChosenPortrait}} post
     * @returns {Promise<boolean | Label[]>}
     */
    async chosenPortrait(application, post) {
        if (application.page !== PAGE_PORTRAIT || post.page !== application.page) {
            return false;
        }

        if (typeof post.data !== "object") {
            return false;
        }

        const portrait = await this.#data_service.getPortrait();

        if (post.data.photo !== null && !(Array.isArray(post.data.photo) && post.data.photo.length > 0 && post.data.photo.every(char => typeof char === "number" && Number.isInteger(char) && char >= 0) && post.data.photo.length < portrait["photo-max-data-size"])) {
            return false;
        }
        if (portrait["required-photo"] && post.data.photo === null) {
            return false;
        }

        await this.#data_service.addPost(
            application,
            post
        );

        application.page = PAGE_PERSONAL_DATA;

        return true;
    }
}
