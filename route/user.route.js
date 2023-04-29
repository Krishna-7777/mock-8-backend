const express = require("express")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
require("dotenv").config()
const { UserModel } = require("../models/user.model");
const { authenticate } = require("../middleware/authentication.middleware");

const userRoutes = express.Router();

userRoutes.post('/register', async (ask, give) => {
    let payload = ask.body;
    let pass = payload.password;
    try {
        let userSearch = await UserModel.find({ email: ask.body.email });
        if (userSearch.length) {
            give.status(201).send({ msg: "Already Registered, Please Login!" })
        } else {
            let hash = await bcrypt.hash(pass, 2);
            payload.password = hash
            let user = new UserModel(payload);
            await user.save()
            give.status(201).send({ msg: "Registration Succesfull!" })
        }
    } catch (error) {
        give.status(403).send({ msg: "Error in Registration" })
    }
})

userRoutes.post('/login', async (ask, give) => {
    let { email, password } = ask.body;
    try {
        let userSearch = await UserModel.find({ email });
        if (userSearch.length) {
            userSearch = userSearch[0]
            let hash = userSearch.password
            let res = await bcrypt.compare(password, hash);
            if (res) {
                let token = await jwt.sign({ id: userSearch._id }, process.env.secret)
                give.status(201).send({ msg: "Login Succesfull!", token })
            } else {
                give.status(201).send({ msg: "Wrong Credentials!" })
            }
        } else {
            give.status(201).send({ msg: "Please Register First!" })
        }
    } catch (error) {
        give.status(403).send({ msg: "Error in Login!" })
    }
})

userRoutes.patch('/user/:id/reset', async (ask, give) => {
    try {
        let { current_password, new_password } = ask.body
        let id = ask.params.id;
        let user = await UserModel.findById(id);
        let res = await bcrypt.compare(current_password, user.password);
        if (res) {
            let hash = await bcrypt.hash(new_password, 2);
            await UserModel.findByIdAndUpdate(id, { password: hash })
            give.status(204).send({ msg: "Password Updated" })
        } else {
            give.status(401).send({ msg: "Wrong Current Password!" })
        }
    } catch (error) {
        give.status(403).send({ msg: "Error in updating the Password!" })
    }
})

module.exports = {
    userRoutes
}