const express = require("express");
const userRoute = require("../routes/users/userRoute");
const postRoute = require("../routes/posts/postRoute.js");
const CryptoJS = require("crypto-js");

const router = express.Router();


// set up routes for the users
router.use("/users", userRoute);

// set up routes for the posts
router.use("/posts", postRoute);


// for testing purpose only (remove it later) (get encrypted id)
router.get('/test', (req, res) => {
  res.send(CryptoJS.AES.encrypt(req.header('id'), process.env.SECRET_KEY).toString());
})

// set up the error handler
app.use('*' ,(req, res, next) => {
    res.status(500).send("Something failed.");
});


function setter(app) {
    // set up the routes for the api
    app.use("/api/v1", router)

}

module.exports = setter;
