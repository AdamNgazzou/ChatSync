const jwt = require("jsonwebtoken")

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}

// middleware

const verifyToken = (req, res, next) => {
    const authHeader = req.header.authorirzation;

    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.slpit("")[1];

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized" })
    }
};

module.exports = verifyToken;