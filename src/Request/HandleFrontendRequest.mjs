import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path/posix";
import { METHOD_GET, METHOD_HEAD } from "../../../flux-http-api/src/Method/METHOD.mjs";

/** @typedef {import("../../../flux-http-api/src/FluxHttpApi.mjs").FluxHttpApi} FluxHttpApi */
/** @typedef {import("../../../flux-http-api/src/Server/HttpServerRequest.mjs").HttpServerRequest} HttpServerRequest */
/** @typedef {import("../../../flux-http-api/src/Server/HttpServerResponse.mjs").HttpServerResponse} HttpServerResponse */

export class HandleFrontendRequest {
    /**
     * @type {FluxHttpApi}
     */
    #flux_http_api;

    /**
     * @param {FluxHttpApi} flux_http_api
     * @returns {HandleFrontendRequest}
     */
    static new(flux_http_api) {
        return new this(
            flux_http_api
        );
    }

    /**
     * @param {FluxHttpApi} flux_http_api
     * @private
     */
    constructor(flux_http_api) {
        this.#flux_http_api = flux_http_api;
    }

    /**
     * @param {HttpServerRequest} request
     * @returns {Promise<HttpServerResponse>}
     */
    async handleFrontendRequest(request) {
        const response = await this.#flux_http_api.validateMethods(
            request,
            [
                METHOD_GET,
                METHOD_HEAD
            ]
        );

        if (response !== null) {
            return response;
        }

        return this.#flux_http_api.getFilteredStaticFileResponse(
            join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "flux-studis-selfservice-frontend", "src"),
            request.url.pathname,
            request
        );
    }
}
