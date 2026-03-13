const ErrorMessages = require("../config/ErrorMessages.json");
const APIError = require("./APIError");
const {Role} = require("../models/RolesSchema");
const {verify} = require("jsonwebtoken");
const jwt = require("jsonwebtoken");

exports.authorize = (requiredPermissions = []) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).send(
                    new APIError(
                        401,
                        "Unauthorized",
                        "UNAUTHORIZED_ACCESS",
                        ErrorMessages.UserAuthErrors.UNAUTHORIZED_ACCESS
                    )
                );
            }

            let roles = [];

            if (req.user.roles?.length) {
                if (typeof req.user.roles[0] === "object" && req.user.roles[0].name) {
                    // Already populated with role documents
                    roles = req.user.roles;
                } else {
                    // Just ObjectIds → fetch from DB
                    roles = await Role.find({ _id: { $in: req.user.roles } });
                }
            }

            const userPermissions = roles.flatMap(r => r.permissions || []);
            const hasPermission = requiredPermissions.every(perm =>
                userPermissions.includes(perm)
            );

            if (!hasPermission) {
                return res.status(403).send(
                    new APIError(
                        403,
                        "Forbidden",
                        "FORBIDDEN_ACCESS",
                        ErrorMessages.UserAuthErrors.FORBIDDEN_ACCESS
                    )
                );
            }

            next();
        } catch (e) {
            console.error("Authorization Error:", e);
            return res
                .status(500)
                .send(new APIError(500, "Internal Server Error", "INTERNAL_ERROR"));
        }
    };
};

exports.authorizeRoles = (requiredRoles = []) => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).send(
                    new APIError(
                        401,
                        "Unauthorized",
                        "UNAUTHORIZED_ACCESS",
                        ErrorMessages.UserAuthErrors.UNAUTHORIZED_ACCESS
                    )
                );
            }

            let roles = [];

            if (req.user.roles?.length) {
                if (typeof req.user.roles[0] === "object" && req.user.roles[0].name) {
                    // Already populated
                    roles = req.user.roles;
                } else {
                    // Need to fetch from DB
                    roles = await Role.find({ _id: { $in: req.user.roles } });
                }
            }

            const userRoleNames = roles.map(r => r.name);

            const hasRole = requiredRoles.some(role => userRoleNames.includes(role));

            if (!hasRole) {
                return res.status(403).send(
                    new APIError(
                        403,
                        "Forbidden",
                        "FORBIDDEN_ACCESS",
                        ErrorMessages.UserAuthErrors.FORBIDDEN_ACCESS
                    )
                );
            }

            next();
        } catch (e) {
            console.error("Role Verification Error:", e);
            return res
                .status(500)
                .send(new APIError(500, "Internal Server Error", "INTERNAL_ERROR"));
        }
    };
};

exports.verifyTokenAllowAll = (req, res, next) => {
    const token = req.cookies[process.env.AUTH_TOKEN_KEY_TITLE];

    try {
        if(token){
            const decoded = verify(token, process.env.JWT_SECRET_KEY);
            req.user = decoded;
        }
    } catch (err) {
        // return res
        //     .status(403)
        //     .json(new APIError(403, "Forbidden", "Invalid or expired token"));
    }
    finally {
        next();
    }
};


exports.verifyToken = (req, res, next) => {
    const token = req.cookies[process.env.AUTH_TOKEN_KEY_TITLE];
    if (!token) {
        // console.log("No token found");
        return res
            .status(401)
            .json(new APIError(401, "Unauthorized", "User not logged in"));
    }

    try {
        const decoded = verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res
            .status(403)
            .json(new APIError(403, "Forbidden", "Invalid or expired token"));
    }
};

exports.issueAuthToken = (res, payload) => {
    // console.log("payload",payload)
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.AUTH_TOKEN_EXPIRY_TIME,
    });

    res.cookie(process.env.AUTH_TOKEN_KEY_TITLE, token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
        path: "/",
    });

    return token;
};
