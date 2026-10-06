const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware that verifies the JWT token sent in the
 * Authorization header: "Bearer <token>"
 *
 * On success → attaches req.user = { id, email } and calls next()
 * On failure → returns 401 Unauthorized
 */
const protect = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided."
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, JWT_SECRET);

        // Attach user info to the request so controllers can use it
        req.user = {
            id:    decoded.id,
            email: decoded.email
        };

        next();

    } catch (error) {

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired. Please login again."
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid token."
        });
    }
};

module.exports = { protect };
