/** @typedef {import("../../../Adapter/Response/ApiResponse.mjs").ApiResponse} ApiResponse */
/** @typedef {import("../../Data/Port/DataService.mjs").DataService} DataService */
/** @typedef {import("../../../../../flux-http-api/src/Adapter/Api/HttpApi.mjs").HttpApi} HttpApi */
/** @typedef {import("../../../../../flux-http-api/src/Adapter/Request/HttpRequest.mjs").HttpRequest} HttpRequest */
/** @typedef {import("../../../../../flux-http-api/src/Adapter/Response/HttpResponse.mjs").HttpResponse} HttpResponse */

export class RequestService {
    /**
     * @type {DataService}
     */
    #data_service;
    /**
     * @type {HttpApi}
     */
    #http_api;

    /**
     * @param {DataService} data_service
     * @param {HttpApi} http_api
     * @returns {RequestService}
     */
    static new(data_service, http_api) {
        return new this(
            data_service,
            http_api
        );
    }

    /**
     * @param {DataService} data_service
     * @param {HttpApi} http_api
     * @private
     */
    constructor(data_service, http_api) {
        this.#data_service = data_service;
        this.#http_api = http_api;
    }

    /**
     * @param {HttpRequest} request
     * @returns {Promise<string | null>}
     */
    async getSessionNumberFromRequest(request) {
        return (await import("../Command/GetSessionNumberFromRequestCommand.mjs")).GetSessionNumberFromRequestCommand.new()
            .getSessionNumberFromRequest(
                request
            );
    }

    /**
     * @param {HttpRequest} request
     * @returns {HttpResponse | null}
     */
    async handleApiRequest(request) {
        return (await import("../Command/HandleApiRequestCommand.mjs")).HandleApiRequestCommand.new(
            this
        )
            .handleApiRequest(
                request
            );
    }

    /**
     * @param {HttpRequest} request
     * @returns {HttpResponse | null}
     */
    async handleBackRequest(request) {
        return (await import("../Command/HandleBackRequestCommand.mjs")).HandleBackRequestCommand.new(
            this.#data_service,
            this.#http_api,
            this
        )
            .handleBackRequest(
                request
            );
    }

    /**
     * @param {HttpRequest} request
     * @returns {HttpResponse}
     */
    async handleFrontendRequest(request) {
        return (await import("../Command/HandleFrontendRequestCommand.mjs")).HandleFrontendRequestCommand.new(
            this.#http_api
        )
            .handleFrontendRequest(
                request
            );
    }

    /**
     * @param {HttpRequest} request
     * @returns {HttpResponse | null}
     */
    async handleGetRequest(request) {
        return (await import("../Command/HandleGetRequestCommand.mjs")).HandleGetRequestCommand.new(
            this.#data_service,
            this.#http_api,
            this
        )
            .handleGetRequest(
                request
            );
    }

    /**
     * @param {HttpRequest} request
     * @returns {HttpResponse | null}
     */
    async handleLayoutRequest(request) {
        return (await import("../Command/HandleLayoutRequestCommand.mjs")).HandleLayoutRequestCommand.new(
            this.#data_service,
            this.#http_api,
            this
        )
            .handleLayoutRequest(
                request
            );
    }

    /**
     * @param {HttpRequest} request
     * @returns {HttpResponse | null}
     */
    async handleLogoutRequest(request) {
        return (await import("../Command/HandleLogoutRequestCommand.mjs")).HandleLogoutRequestCommand.new(
            this.#data_service,
            this.#http_api,
            this
        )
            .handleLogoutRequest(
                request
            );
    }

    /**
     * @param {HttpRequest} request
     * @returns {HttpResponse | null}
     */
    async handlePostRequest(request) {
        return (await import("../Command/HandlePostRequestCommand.mjs")).HandlePostRequestCommand.new(
            this.#data_service,
            this.#http_api,
            this
        )
            .handlePostRequest(
                request
            );
    }

    /**
     * @param {HttpRequest} request
     * @returns {HttpResponse | null}
     */
    async handleRequest(request) {
        return (await import("../Command/HandleRequestCommand.mjs")).HandleRequestCommand.new(
            this
        )
            .handleRequest(
                request
            );
    }

    /**
     * @param {ApiResponse} api_response
     * @returns {Promise<HttpResponse>}
     */
    async mapApiResponse(api_response) {
        return (await import("../Command/MapApiResponseCommand.mjs")).MapApiResponseCommand.new()
            .mapApiResponse(
                api_response
            );
    }
}