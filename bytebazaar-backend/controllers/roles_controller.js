const {Role} = require("../models/RolesSchema");
const APIError = require("../utils/APIError");
const APIResponse = require("../utils/APIResponse");
const ErrorMessages = require("../config/ErrorMessages.json");

exports.createRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;

        if (!name || !permissions || !Array.isArray(permissions)) {
            const err = new APIError(
                400,
                ErrorMessages.ValidationErrors.MISSING_REQUIRED_FIELD,
                "MISSING_REQUIRED_FIELD",
                "Role name and permissions array are required"
            );
            return res.status(err.statusCode).send(err);
        }

        const existing = await Role.findOne({ name });
        if (existing) {
            const err = new APIError(
                409,
                ErrorMessages.ValidationErrors.RESOURCE_CONFLICT,
                "ROLE_ALREADY_EXISTS",
                "A role with this name already exists"
            );
            return res.status(err.statusCode).send(err);
        }

        const role = new Role({ name, permissions });
        await role.save();

        return res
            .status(201)
            .send(new APIResponse(201, "Role created successfully", role));
    } catch (e) {
        console.error(e);
        const err = new APIError(
            500,
            ErrorMessages.ServerErrors.INTERNAL_ERROR,
            "INTERNAL_ERROR",
            e.message
        );
        res.status(err.statusCode).send(err);
    }
};


exports.getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res
            .status(200)
            .send(new APIResponse(200, "Roles retrieved successfully", roles));
    } catch (e) {
        const err = new APIError(500, ErrorMessages.ServerErrors.INTERNAL_ERROR);
        res.status(err.statusCode).send(err);
    }
};


exports.getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (!role) {
            const err = new APIError(
                404,
                ErrorMessages.ValidationErrors.VALIDATION_ERROR,
                "ROLE_NOT_FOUND",
                "Role not found"
            );
            return res.status(err.statusCode).send(err);
        }
        res
            .status(200)
            .send(new APIResponse(200, "Role retrieved successfully", role));
    } catch (e) {
        const err = new APIError(500, ErrorMessages.ServerErrors.INTERNAL_ERROR);
        res.status(err.statusCode).send(err);
    }
};

exports.updateRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;

        const role = await Role.findById(req.params.id);
        if (!role) {
            const err = new APIError(
                404,
                "Role not found",
                "ROLE_NOT_FOUND"
            );
            return res.status(err.statusCode).send(err);
        }

        if (name) role.name = name;
        if (permissions && Array.isArray(permissions)) role.permissions = permissions;

        await role.save();

        res
            .status(200)
            .send(new APIResponse(200, "Role updated successfully", role));
    } catch (e) {
        const err = new APIError(500, ErrorMessages.ServerErrors.INTERNAL_ERROR);
        res.status(err.statusCode).send(err);
    }
};

exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) {
            const err = new APIError(
                404,
                "Role not found",
                "ROLE_NOT_FOUND"
            );
            return res.status(err.statusCode).send(err);
        }

        res
            .status(200)
            .send(new APIResponse(200, "Role deleted successfully", role));
    } catch (e) {
        const err = new APIError(500, ErrorMessages.ServerErrors.INTERNAL_ERROR);
        res.status(err.statusCode).send(err);
    }
};
