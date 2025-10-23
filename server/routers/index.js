const fileUpload = require('express-fileupload')
const cookiePerser = require('cookie-parser')
const express = require("express");
const cors = require('cors')
require("dotenv").config();
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const models = require('./models/models')
const router = require('./routes/index')
const sequelize = require("./db");
const path = require('path')


const PORT = process.env.PORT || 5000;

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true, 
};

app.use(cors(corsOptions)); 
app.use(express.json());
app.use('/static', express.static(path.resolve(__dirname, 'static'))) 
app.use(fileUpload({}))
app.use(cookiePerser())
app.use('/api', router)
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
};

start()