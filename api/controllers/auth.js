import { db } from "../DB.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const q = "SELECT * FROM users WHERE email = ? OR username = ?";
        db.query(q, [req.body.email, req.body.username], async (err, data) => {
            if (err) {
                console.log("Database error:", err); // Add logging
                return res.status(500).json({ error: err.message }); // Return proper error
            }

            if (data.length)
                return res.status(409).json("User already exists!");

            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(req.body.password, salt);

            const q2 =
                "INSERT INTO users(`username`, `email`, `password`) VALUES(?, ?, ?)";
            const values = [req.body.username, req.body.email, hash];

            db.query(q2, values, (err, data) => {
                if (err) {
                    console.log("Insert error:", err); // Add logging
                    return res.status(500).json({ error: err.message });
                }
                return res.status(200).json("User created successfully!");
            });
        });
    } catch (err) {
        console.log("Catch error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const login = (req, res) => {
    // CHEK USER
    const q = "SELECT * FROM users WHERE username = ?";

    db.query(q, [req.body.username], async (err, data) => {
        if (err) return res.json(err);
        if (data.length === 0) return res.status(404).json("User not found!");

        // CHECK PASSWORD
        const isPasswordCorrect = await bcrypt.compare(
            req.body.password,
            data[0].password
        );

        if (!isPasswordCorrect)
            return res.status(400).json("wrong username or password.");

        const token = jwt.sign({ id: data[0].id }, "jwt-key");

        const { password, ...others } = data[0];
        res.cookie("access_token", token, {
            httpOnly: true,
        })
            .status(200)
            .json(others);
    });
};

export const logout = (req, res) => {
    res.clearCookie("access_token", {
        httpOnly: true,
    })
        .status(200)
        .json("User has been logged out.");
};
