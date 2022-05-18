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



// endpoint for posting a property advert
router.post('/property', verifyJWTbody, (req, res) => {
    try {
        // variables received from the front-end. owner is gotten from the middleware verifyJWTbody
        const owner = req.userId;
        const status = req.body.status;
        const price = req.body.price;
        const state = req.body.state;
        const city = req.body.city;
        const address = req.body.address;
        const type = req.body.type;
        const imageurl = req.body.imageurl;
                
        db.query(`INSERT INTO property (owner, status, price, state, city, address, type, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
        [owner, status, price, state, city, address, type, imageurl], (err, response) => {
            if(err){
                res.json({
                    status: "error",
                    data: err,
                    message: "an error occured while trying to insert property data into the database",
                })
            }else {

                const date = new Date;
                const date_time = `${date.getFullYear()}-${date.getMonth() < 10 + 1 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}T${date.getHours() < 10 ? "0" + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()}:${date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()}.000Z`;

                res.json({
                    status: "success",
                    data: {
                        id: response.insertId,
                        status: status,
                        type: type,
                        state: state,
                        city: city,
                        address: address,
                        price: price,
                        created_on: date_time,
                        image_url: imageurl
                    }, 
                    message: "property added successfully",
                });
            }
        });
    } catch (err) {
        res.json({
            status: "error",
            data: err,
            message: "an error occured while trying to post property",
        });
    }   
});



app.use('/api/v1', router);

app.listen(PORT, () => {
    console.log(`Node Server is online at port ${PORT}!!!`);
});