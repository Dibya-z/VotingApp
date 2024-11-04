const express = require('express')
const app = express();
const db = require('./db');
require('dotenv').config();

const bodyParser = require('body-parser');
app.use(bodyParser.json()); // req.body
const PORT = process.env.PORT || 3000;

// Import the router files
const userRoutes = require('./routes/userRoutes');
const candidateRoutes = require('./routes/candidateRoutes');
const { default: mongoose } = require('mongoose');

// Use the routers
app.get("/", (req, res) => res.send("Welcome"))
app.use('/user', userRoutes);
app.use('/candidate', candidateRoutes);


mongoose
    .connect(process.env.MONGODB_URL_LOCAL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log("App has started")
        app.listen(PORT, () => {
            console.log('listening on port 3000');
        })
    })