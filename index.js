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



// endpoint for deleting a property
router.delete('/property/:id', verifyJWT, (req, res) => {
    try {
        // variables received from the front-end. owner is gotten from the middleware verifyJWT
        const id = req.params.id;
        const owner = req.userId;

        db.query(`SELECT * FROM property WHERE id=?`, id, (err, result) => {
            if (err) {
                res.json({
                    status: "error",
                    data: err,
                    message: "an error occured while trying to verify userID from the database",
                });
            }else {
                if (owner === result[0].owner) {
                    try {
                        db.query(`DELETE FROM property WHERE id=?`, id, (err, response) => {
                            if(err){
                                res.json({
                                    status: "error",
                                    data: err,
                                    message: "an error occured while trying to delete property",
                                });
                            }else {
                                res.json({
                                    status: "success",
                                    data: {
                                        id: id,
                                        status: result[0].status,
                                        type: result[0].type,
                                        state: result[0].state,
                                        city: result[0].city,
                                        address: result[0].address,
                                        price: result[0].price,
                                        created_on: result[0].created_on,
                                        image_url: result[0].image_url
                                    }, 
                                    message: "property deleted successfully",
                                    additionalInfo: response.affectedRows + " row updated"
                                });
                            }
                        });
                    }catch (error) {
                        res.json({
                            status: "error",
                            data: err,
                            message: "an error occured while trying to delete property",
                        });
                    }                  
                }else {
                    res.json({
                        status: "error",
                        message: "an error occured while trying to verify user of this property",
                    });
                }
            }
        });
    } catch (err) {
        res.json({
            status: "error",
            data: err,
            message: "an error occured while trying to delete property",
        });
    }   
});



app.use('/api/v1', router);

app.listen(PORT, () => {
    console.log(`Node Server is online at port ${PORT}!!!`);
});