import { ASSERT_TYPE_JSON } from "../../../node_modules/flux-fetch-api/src/Adapter/AssertType/ASSERT_TYPE.mjs";
import express from "express";
import { ExpressServerApi } from "../../../node_modules/flux-express-server-api/src/Adapter/Api/ExpressServerApi.mjs";
import { fileURLToPath } from "node:url";
import { ShutdownHandler } from "../../../node_modules/flux-shutdown-handler-api/src/Adapter/ShutdownHandler/ShutdownHandler.mjs";
import { ShutdownHandlerApi } from "../../../node_modules/flux-shutdown-handler-api/src/Adapter/Api/ShutdownHandlerApi.mjs";
import { dirname, join } from "node:path";
import { ELEMENT_CHOICE_SUBJECT, ELEMENT_CREATE, ELEMENT_INTENDED_DEGREE_PROGRAM, ELEMENT_RESUME, ELEMENT_START } from "../../../node_modules/flux-studies-selfservice-frontend/src/Adapter/Element/ELEMENT.mjs";

/** @typedef {import("../../../node_modules/flux-studies-selfservice-frontend/src/Adapter/ChoiceSubject/ChoiceSubject.mjs").ChoiceSubject} ChoiceSubject */
/** @typedef {import("../../../node_modules/flux-studies-selfservice-frontend/src/Adapter/DegreeProgram/DegreeProgram.mjs").DegreeProgram} DegreeProgram */
/** @typedef {import("../../../node_modules/flux-studies-selfservice-frontend/src/Adapter/Get/GetResult.mjs").GetResult} GetResult */
/** @typedef {import("../../../node_modules/flux-studies-selfservice-frontend/src/Adapter/IntendedDegreeProgram/IntendedDegreeProgram.mjs").IntendedDegreeProgram} IntendedDegreeProgram */
/** @typedef {import("../../../node_modules/flux-studies-selfservice-frontend/src/Adapter/Page/PAGE.mjs").PAGE} PAGE */
/** @typedef {import("../../../node_modules/flux-studies-selfservice-frontend/src/Adapter/Post/Post.mjs").Post} Post */
/** @typedef {import("../../../node_modules/flux-studies-selfservice-frontend/src/Adapter/Post/PostResult.mjs").PostResult} PostResult */
/** @typedef {import("../../../node_modules/flux-studies-selfservice-frontend/src/Adapter/Semester/Semester.mjs").Semester} Semester */
/** @typedef {import("../../../node_modules/flux-studies-selfservice-frontend/src/Adapter/Start/Start.mjs").Start} Start */
/** @typedef {import("../../../node_modules/flux-studies-selfservice-frontend/src/Adapter/Subject/Subject.mjs").Subject} Subject */

const __dirname = dirname(fileURLToPath(import.meta.url));

export class StudiesSelfserviceDemoBackendApi {
    /**
     * @type {ExpressServerApi | null}
     */
    #express_server_api = null;
    /**
     * @type {PAGE[]}
     */
    #pages;
    /**
     * @type {ShutdownHandler | null}
     */
    #shutdown_handler = null;
    /**
     * @type {ShutdownHandlerApi | null}
     */
    #shutdown_handler_api = null;

    /**
     * @returns {StudiesSelfserviceDemoBackendApi}
     */
    static new() {
        return new this();
    }

    /**
     * @private
     */
    constructor() {
        this.#pages = [
            ELEMENT_START
        ];
    }

    /**
     * @returns {Promise<void>}
     */
    async init() {
        this.#shutdown_handler_api ??= await this.#getShutdownHandlerApi();
        this.#shutdown_handler ??= this.#shutdown_handler_api.getShutdownHandler();

        this.#express_server_api ??= await this.#getExpressServerApi();
    }

    /**
     * @returns {Promise<void>}
     */
    async runServer() {
        await this.#express_server_api.runExpressServer(
            async () => this.#getRouter()
        );
    }

    /**
     * @returns {Promise<void>}
     */
    async #back() {
        let previous_page;

        if (this.#canBack()) {
            previous_page = this.#pages.pop();
        } else {
            previous_page = this.#page;
        }

        console.debug("back", {
            previous_page,
            next_page: this.#page
        });
    }

    /**
     * @returns {boolean}
     */
    #canBack() {
        return this.#pages.length > 1;
    }

    /**
     * @returns {Promise<GetResult>}
     */
    async #get() {
        let data;

        switch (this.#page) {
            case ELEMENT_CHOICE_SUBJECT:
                data = await this.#importChoiceSubject();
                break;

            case ELEMENT_CREATE:
            case ELEMENT_RESUME:
            case ELEMENT_START:
                data = await this.#importStart();
                break;

            case ELEMENT_INTENDED_DEGREE_PROGRAM:
                data = await await this.#importIntendedDegreeProgram();
                break;

            default:
                data = null;
                break;
        }

        /**
         * @type {GetResult}
         */
        const get_result = {
            page: this.#page,
            data,
            can_back: this.#canBack()
        };

        console.debug("get", {
            get_result
        });

        return get_result;
    }

    /**
     * @returns {Promise<ExpressServerApi>}
     */
    async #getExpressServerApi() {
        const express_server = ExpressServerApi.new(
            this.#shutdown_handler
        );

        await express_server.init();

        return express_server;
    }

    /**
     * @returns {Promise<express.Router>}
     */
    async #getRouter() {
        const router = express.Router();

        router.post("/api/back", async (req, res) => {
            try {
                await this.#back();

                res.json(null);
            } catch (error) {
                console.error("back", error);

                res.status(500).end();
            }
        });

        router.get("/api/get", async (req, res) => {
            try {
                res.json(await this.#get());
            } catch (error) {
                console.error("get", error);

                res.status(500).end();
            }
        });

        router.post("/api/post", async (req, res) => {
            try {
                res.json(await this.#post(
                    req.body
                ));
            } catch (error) {
                console.error("post", error);

                res.status(500).end();
            }
        });

        router.use("/", express.static(join(__dirname, "..", "..", "..", "node_modules", "flux-studies-selfservice-frontend", "src")));

        return router;
    }

    /**
     * @returns {Promise<ShutdownHandlerApi>}
     */
    async #getShutdownHandlerApi() {
        const shutdown_handler_api = ShutdownHandlerApi.new();

        await shutdown_handler_api.init();

        return shutdown_handler_api;
    }

    /**
     * @returns {Promise<ChoiceSubject>}
     */
    async #importChoiceSubject() {
        return {
            ...(await import("../Data/ChoiceSubject/choice-subject.json", { assert: { type: ASSERT_TYPE_JSON } })).default,
            "degree-programs": await this.#importDegreePrograms()
        };
    }

    /**
     * @returns {Promise<DegreeProgram[]>}
     */
    async #importDegreePrograms() {
        return (await import("../Data/DegreeProgram/degree-programs.json", { assert: { type: ASSERT_TYPE_JSON } })).default;
    }

    /**
     * @returns {Promise<IntendedDegreeProgram>}
     */
    async #importIntendedDegreeProgram() {
        return {
            ...(await import("../Data/IntendedDegreeProgram/intended-degree-program.json", { assert: { type: ASSERT_TYPE_JSON } })).default,
            subjects: await this.#importSubjects()
        };
    }

    /**
     * @returns {Promise<Semester[]>}
     */
    async #importSemesters() {
        return (await import("../Data/Semester/semesters.json", { assert: { type: ASSERT_TYPE_JSON } })).default;
    }

    /**
     * @returns {Promise<Start>}
     */
    async #importStart() {
        return {
            ...(await import("../Data/Start/start.json", { assert: { type: ASSERT_TYPE_JSON } })).default,
            semesters: await this.#importSemesters()
        };
    }

    /**
     * @returns {Promise<Subject[]>}
     */
    async #importSubjects() {
        return (await import("../Data/Subject/subjects.json", { assert: { type: ASSERT_TYPE_JSON } })).default;
    }

    /**
     * @returns {PAGE | null}
     */
    get #page() {
        return this.#pages[this.#pages.length - 1] ?? null;
    }

    /**
     * @param {Post} post
     * @returns {Promise<PostResult>}
     */
    async #post(post) {
        let next_page;

        switch (post.page) {
            case ELEMENT_CHOICE_SUBJECT:
                next_page = ELEMENT_INTENDED_DEGREE_PROGRAM;
                break;

            case ELEMENT_CREATE:
            case ELEMENT_RESUME:
                next_page = ELEMENT_CHOICE_SUBJECT;
                break;

            default:
                next_page = null;
                break;
        }

        if (next_page !== null) {
            this.#pages.push(next_page);
        }

        /**
         * @type {PostResult}
         */
        const post_result = {
            ok: true
        };

        console.debug("post", {
            post,
            next_page,
            post_result
        });

        return post_result;
    }
}
