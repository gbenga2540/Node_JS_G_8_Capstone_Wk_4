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



// endpoint for signing up a user
router.post('/auth/signup', async (req, res) => {
    try {
        // variables received from the front-end.
        const email = req.body.email;
        const firstname = req.body.firstname;
        const lastname = req.body.lastname;
        const password = req.body.password;
        const phone = req.body.phone;
        const address = req.body.address;
        const isadmin = req.body.isadmin;

        // generate encrypted password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
                
        db.query(`SELECT first_name FROM users WHERE (email = ?)`, email, (err, result) => {
            if (err) {
                res.json({
                    status: "error",
                    data: err,
                    message: "an error occured while trying to check for a unique email",
                    auth: false
                });
            }else {
                if (result.length == 0) {
                    db.query(`INSERT INTO users (email, first_name, last_name, password, phone, address, is_admin) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
                    [email, firstname, lastname, hashedPassword, phone, address, isadmin], (err, response) => {
                        if(err){
                            res.json({
                                status: "error",
                                data: err,
                                message: "an error occured while trying to insert data into the database",
                                auth: false
                            })
                        }else {
                            const uid = response.insertId;
                            const token = jwt.sign({uid}, process.env.NODE_AUTH_SECRET, {
                                expiresIn: 1800,
                            });
                            res.json({
                                status: "success",
                                data: {
                                    token: token,
                                    id: response.insertId,
                                    first_name: firstname,
                                    last_name: lastname,
                                    email: email
                                }, 
                                message: "user account registered successfully",
                                auth: true
                            });
                        }
                    }); 
                }else {
                    res.json({
                        status: "error",
                        message: 'user account already exists',
                        auth: false
                    });
                }
            }
        });
    } catch (err) {
        res.json({
            status: "error",
            data: err,
            message: "an error occured while trying to sign up",
            auth: false
        });
    }   
});



app.use('/api/v1', router);

app.listen(PORT, () => {
    console.log(`Node Server is online at port ${PORT}!!!`);
});