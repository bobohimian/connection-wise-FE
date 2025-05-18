import * as canvasService from "./canvas.service.js";

import * as shareService from "./share.service.js";

import * as userService from "./user.service.js";

import * as aiService from "./ai.service.js"

const apiService = {
    ...canvasService,
    ...shareService,
    ...userService,
    ...aiService,
};
export default apiService;