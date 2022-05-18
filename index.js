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



// endpoint for changing a user password 
router.patch('/resetpassword', verifyJWTbody, (req, res) => {
    const id = req.userId;
    try {
        const password = req.body.password;
        const newpassword = req.body.newpassword;
        db.query(`SELECT password FROM users WHERE id=?`, id, (err, response) => {
            if (err) {
                res.json({
                    status: "error",
                    data: err,
                    message: "error trying to verify userID"
                });
            }else {
                bcrypt.compare(password, response[0].password, async (err, result) => {
                    if (err) {
                        res.json({
                            status: "error",
                            data: err,
                            message: "an error occured while checking the password"
                        });
                    }else {
                        if (result) {
                            const salt = await bcrypt.genSalt(10);
                            const hashedPassword = await bcrypt.hash(newpassword, salt);
                            try {
                                db.query(`UPDATE users SET password=? WHERE id=?`, [hashedPassword, id], (err, response) => {
                                    if (err) {
                                        res.json({
                                            status: "error",
                                            data: err,
                                            message: "an error occured while trying to update the password"
                                        });
                                    }else {
                                        if (response.affectedRows === 1){
                                            res.json({
                                                status: "success",
                                                message: "password updated successfully"
                                            });
                                        }else {
                                            res.json({
                                                status: "error",
                                                message: "failed to update the password"
                                            });
                                        }
                                    }
                                });
                            }catch (error) {
                                res.json({
                                    status: "error",
                                    data: error,
                                    message: "error trying update password"
                                });
                            }
                        }else {
                            res.json({
                                status: "error",
                                message: "incorrect password"
                            });
                        }
                    }
                });
            }
        });
    }catch (error) {
        res.json({
            status: "error",
            data: error,
            message: "an error occured while trying to reset password"
        });
    }
});



app.use('/api/v1', router);

app.listen(PORT, () => {
    console.log(`Node Server is online at port ${PORT}!!!`);
});