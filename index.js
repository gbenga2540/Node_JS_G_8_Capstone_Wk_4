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



// Verifies the generated token from the front-end [token stored in header request due to GET Request] to get the user id. example:
// {
//     status: "available",
//     price: 4429.99,
//     headers: {
//       "x-access-token": sessionStorage.getItem("apextoken")
//     }
// }
const verifyJWT = (req, res, next) => {
    const token = req.headers["x-access-token"];

    if (token) {
        jwt.verify(token, process.env.NODE_AUTH_SECRET, (err, decoded) => {
            if (err) {
                res.json({
                    status: "error",
                    message: "failed to authenticate",
                    auth: false
                });
            }else {
                req.userId = decoded.uid;
                next();
            }
        });
    }else {
        res.json({
            status: "error",
            message: "token was not received",
            auth: false
        })
    }
}

// Verifies the generated token from the front-end [token stored in body request due to POST request] to get the user id. example:
// {
//     status: "available",
//     price: 4429.99,
//     headers: {
//       "x-access-token": sessionStorage.getItem("apextoken")
//     }
// }
const verifyJWTbody = (req, res, next) => {
    const token = req.body.headers["x-access-token"];

    if (token) {
        jwt.verify(token, process.env.NODE_AUTH_SECRET, (err, decoded) => {
            if (err) {
                res.json({
                    status: "error",
                    message: "failed to authenticate",
                    auth: false
                });
            }else {
                req.userId = decoded.uid;
                next();
            }
        });
    }else {
        res.json({
            status: "error",
            message: "token was not received",
            auth: false
        })
    }
}



// endpoint for deleting a user account (checks if the user has a property first)
router.delete('/deleteuser', verifyJWT, (req, res) => {
    // id is gotten from the middleware verifyJWT
    const id = req.userId;
    try {
        db.query(`SELECT id FROM property WHERE owner=?`, id, (err, response) => {
            if(err) {
                res.json({
                    status: "error",
                    data: err,
                    message: "an error occured while trying to check if user has any property from the database"
                });
            }else {
                if (response.length === 0){
                    try {
                        // variables received from the front-end.
                        const email = req.headers["email"];
                        const password = req.headers["password"];
                
                        db.query(`SELECT password from users WHERE email =?`, email, (err, result) => {
                            if(err) {
                                res.json({
                                    status: "error",
                                    data: err,
                                    message: "an error occured while checking if the email exists"
                                });
                            }else{
                                if (result.length > 0) {
                                    bcrypt.compare(password, result[0].password, (err, response) => {
                                        if (err) {
                                            res.json({
                                                status: "error",
                                                data: err,
                                                message: "an error occured while checking the password"
                                            });
                                        }else {
                                            if (response) {
                                                db.query(`DELETE FROM users WHERE email=?`, email, (err, result) => {
                                                    if (err) {
                                                        res.json({
                                                            status: "error",
                                                            data: err,
                                                            message: "an error occured while trying to delete user"
                                                        });
                                                    }else {
                                                        res.json({
                                                            status: "success",
                                                            data: result,
                                                            message: "user account deleted successfully"
                                                        });
                                                    }
                                                });
                                            }else {
                                                res.json({
                                                    status: "error",
                                                    message: "password is incorrect"
                                                });
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    } catch (err) {
                        res.json({
                            status: "error",
                            data: err,
                            message: "an error occured while trying to delete user"
                        });
                    }
                }else {
                    res.json({
                        status: "error",
                        message: "cannot delete user with property(ies)"
                    });
                }
            }
        });
    }catch (error) {
        res.json({
            status: "error",
            data: err,
            message: "an error occured while trying to check if user has any property"
        });
    }
});



app.use('/api/v1', router);

app.listen(PORT, () => {
    console.log(`Node Server is online at port ${PORT}!!!`);
});