require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {User} = require("../models/UserSchema");
const {Role} = require("../models/RolesSchema");

async function createAdmin() {
    try {
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            console.warn("ADMIN_EMAIL or ADMIN_PASSWORD not set in .env");
            return;
        }

        let adminUser = await User.findOne({ email });
        if (adminUser) {
            console.log("Admin already exists:", email);
            return;
        }

        let adminRole = await Role.findOne({ name: "administrator" });
        if (!adminRole) {
            adminRole = await Role.create({
                name: "administrator",
                permissions: ["*"],
            });
            console.log("Created administrator role");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        adminUser = await User.create({
            fullname: "System Admin",
            username: "admin",
            email,
            passwordHash: hashedPassword,
            roles: [adminRole._id],
            phone: "0000000000",
        });

        console.log("Admin user created:", adminUser.email);
    } catch (err) {
        console.error("Error creating admin user:", err.message);
    }
}

module.exports = createAdmin;