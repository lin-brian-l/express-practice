const express = require('express');
const router = express.Router();
const emailValidator = require('email-validator');
const mongo = require('../config/mongo');
const bcrypt = require('bcrypt');

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('auth/login', { title: 'Login' });
});

router.get('/register', function(req, res, next) {
    const user = {
        username: "",
        email: "",
        password: "",
        passwordConfirm: ""
    };
    const htmlInputs = {
        title: 'Register',
        user,
        errors: null
    }
    res.render('auth/register', htmlInputs);
});

router.post('/register', async function(req, res, next) {
    const user = req.body;
    let errors = [];
    if (!emailValidator.validate(user.email)) {
        errors.push('Please enter a valid email.');
    }
    if (user.password !== user.passwordConfirm) {
        errors.push('Your passwords do not match.');
    }

    if (errors.length) {
        const htmlInputs = {
            title: 'Registration Failed',
            user,
            errors
        }
        res.render('auth/register', htmlInputs);
    } else {
        try {
            const saltRounds = parseInt(process.env.BCRYPT_SALTROUNDS);
            const passwordHash = await bcrypt.hash(user.password, saltRounds);
            user.passwordHash = passwordHash;
            delete user.password;
            delete user.passwordConfirm;
            const db = await mongo.connectToDB();
            await db.collection('users').insertOne(user);
            return res.json({success: true});

        } catch (error) {
            res.render('error', { message: error.message, error });
        }
        res.json({success: true});
    }

})

module.exports = router;
