import { HttpResponse } from "../../../../../flux-http-api/src/Adapter/Response/HttpResponse.mjs";
import { STATUS_400 } from "../../../../../flux-http-api/src/Adapter/Status/STATUS.mjs";
import { METHOD_OPTIONS, METHOD_POST } from "../../../../../flux-http-api/src/Adapter/Method/METHOD.mjs";

/** @typedef {import("../../Data/Port/DataService.mjs").DataService} DataService */
/** @typedef {import("../../../../../flux-http-api/src/Adapter/Api/HttpApi.mjs").HttpApi} HttpApi */
/** @typedef {import("../../../../../flux-http-api/src/Adapter/Request/HttpRequest.mjs").HttpRequest} HttpRequest */
/** @typedef {import("../../Request/Port/RequestService.mjs").RequestService} RequestService */

export class HandlePostRequestCommand {
    /**
     * @type {DataService}
     */
    #data_service;
    /**
     * @type {HttpApi}
     */
    #http_api;
    /**
     * @type {RequestService}
     */
    #request_service;

    /**
     * @param {DataService} data_service
     * @param {HttpApi} http_api
     * @param {RequestService} request_service
     * @returns {HandlePostRequestCommand}
     */
    static new(data_service, http_api, request_service) {
        return new this(
            data_service,
            http_api,
            request_service
        );
    }

    /**
     * @param {DataService} data_service
     * @param {HttpApi} http_api
     * @param {RequestService} request_service
     * @private
     */
    constructor(data_service, http_api, request_service) {
        this.#data_service = data_service;
        this.#http_api = http_api;
        this.#request_service = request_service;
    }

    /**
     * @param {HttpRequest} request
     * @returns {HttpResponse | null}
     */
    async handlePostRequest(request) {
        if (request.url.pathname !== "/api/post") {
            return null;
        }

        const response = await this.#http_api.validateMethods(
            request,
            [
                METHOD_OPTIONS,
                METHOD_POST
            ]
        );

        if (response !== null) {
            return response;
        }

        let post;
        try {
            post = await request.json();
        } catch (error) {
            console.error(error);

            return HttpResponse.text(
                "Invalid body",
                STATUS_400
            );
        }

        return this.#request_service.mapApiResponse(
            await this.#data_service.post(
                post,
                await this.#request_service.getSessionNumberFromRequest(
                    request
                )
            )
        );
    }
}