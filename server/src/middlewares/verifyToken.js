const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.JWT_SECRET;

if (!SECRET_KEY) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
}

// Middleware to verify the token
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization; 

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1]; 

    try {
        const decoded = jwt.verify(token, SECRET_KEY); // Verify the token
        req.user = decoded; // Attach the decoded user info to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        return res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    }
};

module.exports = verifyToken;