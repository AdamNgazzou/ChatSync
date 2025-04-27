const express = require("express");
const { register, login } = require("../controllers/authController");
const router = express.Router();

router.get('/', (req, res) => {
    res.send("Hello World!2");
});
router.post("/register", register); // Registration route
router.post("/login", login);       // Login route

module.exports = router;