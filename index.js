const express = require('express');
const router = require('express').Router();
const cors = require('cors');
const db = require('./src/db.config');
const PORT = 3005;
const app = express();
app.use(express.json());
app.use(cors());

router.post('/register', (req, res) => {
    const email = req.body.email;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const password = req.body.password;
    const phone = req.body.phone;
    const address = req.body.address;
    const isadmin = req.body.isadmin;

    db.query(`SELECT first_name FROM Users WHERE (email = ?)`, [email], (err, result) => {
        if (err) throw err;
        if(!result.length){
            db.query("INSERT INTO Users (email, first_name, last_name, password, phone, address, is_admin) VALUES (?, ?, ?, ?, ?, ?, ?)", 
            [email, firstname, lastname, password, phone, address, isadmin], 
            (err, result) => {
                console.log(err);
                res.send(result);
            }) 
        }else {
            res.send('This account already exists!!!');
        }
    });   
});

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.query(`SELECT first_name FROM Users WHERE (email = ? && password = ?)`, [email, password], (err, result) => {
        if (err) throw err;
        res.send(result);
        console.log(result)
    });
});

router.post('/deleteuser', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    db.query(`DELETE FROM Users WHERE (email = ? && password = ?)`, [email, password], (err, result) => {
        if (err) throw err;
        res.send({
            message: result,
            info: "Account deleted successfully!!!"
        });
        console.log(result)
    });
});

router.get('/users', (req, res) => {
    db.query("SELECT * FROM Users", (err, result) => {
        if (err) throw err;
        res.send(result)
    });
});

app.use('/api/v1', router);

app.listen(PORT, () => {
    console.log('Server is online!!!');
});