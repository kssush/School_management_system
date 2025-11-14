require("dotenv").config();
const cookieParser = require('cookie-parser')
const express = require("express");
const cors = require('cors')
const models = require('./models/models')
const router = require('./routers/index')
const sequelize = require("./db");
const path = require('path');
const errorMiddleware = require("./middleware/ErrorHandlingMiddleware");

const PORT = process.env.PORT || 5000;

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000', 
    credentials: true
};

app.use(cors(corsOptions)); 
app.use(express.json());
app.use('/static', express.static(path.resolve(__dirname, 'static'))) 
app.use(cookieParser())
app.use('/api', router)
app.use(errorMiddleware)

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, console.log(`Server started on port ${PORT}`));
    } catch (error) {
        console.log('Error when starting the server: ', error);
    }
};

start()