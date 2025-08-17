"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
exports.asyncValidate = asyncValidate;
// type Source = "body" | "query" | "params" = "body"
function validate(schema, source = "body") {
    return (req, res, next) => {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
            let errorField = result.error.issues[0];
            next({
                status: 400,
                path: errorField.path[0],
                msg: errorField.message,
            });
        }
        next();
    };
}
function asyncValidate(schema, source = "body") {
    return async (req, res, next) => {
        const sc = await schema(req.user);
        try {
            const result = await sc.safeParseAsync(req[source]);
            if (!result.success) {
                let errorField = result.error.issues[0];
                next({
                    status: 400,
                    path: errorField.path[0],
                    msg: errorField.message,
                });
            }
            next();
        }
        catch (err) {
            console.log(err);
        }
        // test();
    };
}
