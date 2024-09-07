import express from "express";
import jwt from "jsonwebtoken"
const authRouter = express.Router();


authRouter.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }
    const payload = { username };


    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.json({
        message: 'Login successful',
        token,
    });
})

authRouter.get("/verify", (req, res) => {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: 'Token missing or invalid' });
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token is invalid or expired' });
        console.log(user);

        res.json({
            message: 'You are authorized!',
            user: user.username,
        });
    });

})

export default authRouter