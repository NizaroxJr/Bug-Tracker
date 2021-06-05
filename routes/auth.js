const express = require('express');
const router = express.Router();
const passport = require("passport");
const authController = require("../controller/authController");



router.get("/login", function(req, res) {
    res.render("login");
});

router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", authController.auth_register);
router.post("/login", authController.auth_login);
router.get("/dashbord", authController.auth_dashbord);

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});

//Google Authentication
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', "email"] }));

router.get('/auth/google/dashbord',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/dashbord');
    });

//////*Facebook Authentication*////

router.get('/auth/facebook',
    passport.authenticate('facebook', { scope: ['email'] }));

router.get('/auth/facebook/dashbord',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect('/dashbord');
    });

module.exports = router;