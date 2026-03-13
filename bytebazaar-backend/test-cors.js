// ... imports ...
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const cors = require("cors");
const router = require("./routes/router");
const cookieParser = require("cookie-parser");


const app = express();
const PORT = process.env.PORT;
const connectString = process.env.MDB_URL;
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
};

mongoose.connect(connectString);
// ... connection event handlers ...

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(process.env.UPLOAD_PATH));

app.get('/test-cors', (req, res) => {
    res.json({ message: 'CORS Test Successful' });
});

app.use(router);

app.listen(PORT, () => {
    console.log("Server Started on Port " + PORT);
});