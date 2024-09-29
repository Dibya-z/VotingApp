const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(express.json());
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateJwt} = require("./middleware");
const mongoURI = process.env.MONGO_URI;
const port = 3001;



const userDetailsSchema = new mongoose.Schema({
    name: String,
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: String,
    bio: String,
    location: String,
    gender: String
}, { collection: 'UserAuthentication' });
const Users = mongoose.model('UserAuthentication', userDetailsSchema);







mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err)
    );



app.post('/signup', async (req, res) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
        return res.status(400).send({
            message: "All fields are required"
        });
    }

    try {

        const checkUsername = await Users.findOne({ username: username });
        if (checkUsername) {
            return res.status(400).send({ message: "Username already exists" });
        }

        const checkEmail = await Users.findOne({ email: email });
        if (checkEmail) {
            return res.status(400).send({ message: "Email is already registered" });
        }


        const hash = await bcrypt.hash(password, 10);


        const user = new Users({
            name,
            username,
            email,
            password: hash
        });
        await user.save();


        const payload = { name, username, email };
        const tokens = generateJwt(payload);


        res.status(200).send({
            message: "Success",
            token: tokens.token,
            refresh_token: tokens.refresh_token
        });
    } catch (error) {

        res.status(500).send({
            message: "An error occurred",
            error: error.message
        });
    }
});



app.post('/login', async (req, res) => {
    const { username, email, password } = req.body;
    if (!password || (!email && !username)) {
        res.status(400).send({ message: "all fields are required" });
        return;
    }
    try {
        let user;
        if (!username) {
            user = await Users.findOne({ email: email });
            if (!user) {
                res.status(404).send({ message: "User with this email does not exist" });
                return;
            }
        }
        else if (!email || (!(!email) && !(!username))) {
            user = await Users.findOne({ username: username });
            if (!user) {
                res.status(404).send({ message: "User with this username does not exist" });
                return;
            }
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            res.status(400).send({ message: "Wrong password" });
            return;
        }
        const payload = {
            name: user.name,
            username: user.username,
            email: user.email
        };
        const tokens = generateJwt(payload);
        res.status(200).send({
            message: "login successfull",
            token: tokens.token,
            refresh_token: tokens.refresh_token
        });
        return;
    }
    catch (e) {
        res.status(500).send({ message: "something went wrong" });
    }

})





app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});