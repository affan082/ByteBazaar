const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        permissions: [{ type: String, required: true }],
    },
    { timestamps: true }
);

const Role = mongoose.model('Role', roleSchema);


const ROLES_KEYS={
    BUYER:"buyer",
    SELLER:"seller",
    ADMIN:"administrator",
}
module.exports = {Role, ROLES_KEYS};
