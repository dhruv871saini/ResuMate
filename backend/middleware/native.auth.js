import express from "express"
import jwt from "jsonwebtoken"

const authMiddleware = (req, res, next) => {
    const authheader = req.headers.authorization;
    if (!authheader) {
        return res.status(401).json({ message: "unauthorized token not provided" })
    }
    try {
        jwt.verify(authheader, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "invalid token" })
            }
            req.user = decoded;
            next();
        })
    } catch (error) {
        return res.status(500).json({ message: "internal server error" })
    }
}
export default authMiddleware