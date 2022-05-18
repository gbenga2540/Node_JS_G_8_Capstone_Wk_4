const express = require('express');
const router = require('express').Router();
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const db = require('./src/db.config');
const PORT = process.env.NODE_PORT;
const app = express();

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: '20mb', extended: true}));
app.use(cors());



// endpoint for logging in a user
router.post('/auth/signin', (req, res) => {
    try {
        // variables received from the front-end.
        const email = req.body.email;
        const password = req.body.password;

        db.query(`SELECT id, first_name, last_name, email, password FROM users WHERE (email = ?)`, email, (err, result) => {
            if (err) {
                res.json({
                    status: "error",
                    data: err,
                    message: "an error occured while checking for the email in the database"
                });
            }else {
                if (result.length > 0) {
                    bcrypt.compare(password, result[0].password, (error, response) => {
                        if (error) {
                            res.json({
                                status: "error",
                                data: error,
                                message: "an error occured while checking the password",
                                auth: false
                            });
                        }else {
                            if (response) {
                                const uid = result[0].id;
                                const token = jwt.sign({uid}, process.env.NODE_AUTH_SECRET, {
                                    expiresIn: 1800,
                                });
                                res.json({
                                    status: "success",
                                    data: {
                                        token: token,
                                        first_name: result[0].first_name,
                                        last_name: result[0].last_name,
                                        email: result[0].email
                                    },
                                    message: "logged in successfully",
                                    auth: true
                                });
                            }else {
                                res.json({
                                    status: "error",
                                    message: "password is incorrect",
                                    auth: false
                                });
                            }
                        }    
                    });
                }else {
                    res.json({
                        status: "error",
                        message: "username does not exist",
                        auth: false
                    });
                }
            }   
        });
    } catch (err) {
        res.json({
            status: "error",
            data: err,
            message: "an error occured while trying to login",
            auth: false
        });
    }
});



app.use('/api/v1', router);

app.listen(PORT, () => {
    console.log(`Node Server is online at port ${PORT}!!!`);
});