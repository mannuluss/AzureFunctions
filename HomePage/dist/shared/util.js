"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Eror404 = void 0;
function Eror404(context) {
    context.res = {
        status: 404,
        headers: {
            "Content-Type": "application/json",
        },
        body: {
            error: "Not Found",
        },
    };
}
exports.Eror404 = Eror404;
//# sourceMappingURL=util.js.map