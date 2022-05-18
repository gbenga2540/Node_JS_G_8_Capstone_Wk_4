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



// endpoint for searching for a property by type
router.get('/property/search', verifyJWT, (req, res) => {
    // variables received from the front-end.
    const type = req.query.type;
    try {
        db.query(`SELECT * FROM property WHERE type=?`, type, (err, result) => {
            if (err) {
                res.json({
                    status: "error",
                    data: err,
                    message: `an error occured while trying to fetch property(ies) with type: ${type} from the database`,
                });
            }else {
                if (result.length > 0) {
                    res.json({
                        status: "success",
                        data: [
                            ...result
                        ], 
                        message: "property request successfully"
                    });                  
                }else {
                    res.json({
                        status: "error",
                        message: `property(ies) with type: ${type} does not exist in the database`,
                    });
                }
            }
        });
    } catch (err) {
        res.json({
            status: "error",
            data: err,
            message: `an error occured while trying to fetch property(ies) with type: ${type}`,
        });
    }   
});



app.use('/api/v1', router);

app.listen(PORT, () => {
    console.log(`Node Server is online at port ${PORT}!!!`);
});