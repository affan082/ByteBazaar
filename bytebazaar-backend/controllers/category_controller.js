const Category = require("../models/CategorySchema");
const APIError = require("../utils/APIError");
const APIResponse = require("../utils/APIResponse");
const ErrorMessages = require("../config/ErrorMessages.json");

exports.addCategory = async (req, res) => {
    try {
        if (!req.body || !req.body.name) {
            return res
                .status(400)
                .send(new APIError(400, "Category name is required", "CATEGORY_NAME_REQUIRED"));
        }

        const data = { ...req.body };
        if (data.parent === "") {
            data.parent = null;
        }

        const category = await Category.create(data);

        return res
            .status(201)
            .send(new APIResponse(201, "Category created successfully", {
                id: category._id,
                name: category.name
            }));
    } catch (err) {
        console.error("Error adding category:", err);
        return res
            .status(500)
            .send(new APIError(
                500,
                "There was an error adding the category.",
                ErrorMessages.CategoryErrors?.ADD_ERROR || "CATEGORY_ADD_ERROR",
                err.message || err.toString()
            ));
    }
};

exports.getCategory = async (req, res) => {
    try {
        const { _id, name, slug, parent, limit, skip } = req.query;

        const query = {};
        if (_id) query._id = _id;
        if (name) query.name = name;
        if (slug) query.slug = slug;
        if (parent) query.parent = parent;

        const parsedLimit = Number(limit) > 0 ? Number(limit) : 0;
        const parsedSkip = Number(skip) > 0 ? Number(skip) : 0;
        const categories = await Category.find(query)
            .populate("parent")
            .limit(parsedLimit)
            .skip(parsedSkip);

        // console.log(query, categories);
        if(!categories.length) {
            return res
                .status(404)
                .send(new APIError(404, "Category not found", ErrorMessages.RequestFailureErrors.NOT_FOUND));
        }
        else {
            return res
                .status(200)
                .send(new APIResponse(200, "Categories fetched successfully", categories));
        }
    } catch (err) {
        console.error("Error fetching categories:", err);
        return res
            .status(500)
            .send(new APIError(
                500,
                "There was an error fetching categories.",
                ErrorMessages.CategoryErrors?.FETCH_ERROR || "CATEGORY_FETCH_ERROR",
                err.message || err.toString()
            ));
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const { _id, ...updateData } = req.body;

        if (!_id) {
            return res
                .status(400)
                .send(new APIError(400, "Category _id is required", "CATEGORY_ID_REQUIRED"));
        }

        const category = await Category.findByIdAndUpdate(_id, updateData, { new: true });

        if (!category) {
            return res
                .status(404)
                .send(new APIError(404, "Category not found", "CATEGORY_NOT_FOUND"));
        }

        return res
            .status(200)
            .send(new APIResponse(200, "Category updated successfully", {
                id: category._id,
                name: category.name
            }));
    } catch (err) {
        console.error("Error updating category:", err);
        return res
            .status(500)
            .send(new APIError(
                500,
                "There was an error updating the category.",
                ErrorMessages.CategoryErrors?.UPDATE_ERROR || "CATEGORY_UPDATE_ERROR",
                err.message || err.toString()
            ));
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const { _id } = req.query;

        if (!_id) {
            return res
                .status(400)
                .send(new APIError(400, "Category _id is required", "CATEGORY_ID_REQUIRED"));
        }

        const deleted = await Category.findByIdAndDelete(_id);

        if (!deleted) {
            return res
                .status(404)
                .send(new APIError(404, "Category not found", "CATEGORY_NOT_FOUND"));
        }

        return res
            .status(200)
            .send(new APIResponse(200, "Category deleted successfully"));
    } catch (err) {
        console.error("Error deleting category:", err);
        return res
            .status(500)
            .send(new APIError(
                500,
                "There was an error deleting the category.",
                ErrorMessages.CategoryErrors?.DELETE_ERROR || "CATEGORY_DELETE_ERROR",
                err.message || err.toString()
            ));
    }
};
