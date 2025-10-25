import { db } from "../DB.js";

export const getMenu = async (req, res) => {
    try {
        const q = `
            SELECT * FROM pizza_with_ingredients;
        `;

        db.query(q, (err, data) => {
            if (err) {
                console.log("Database error:", err); // Add logging
                return res.status(500).json({ error: err.message }); // Return proper error
            }
            if (data.length === 0) {
                return res
                    .status(200)
                    .json({ message: "No menu items found", data: [] });
            }
            return res.status(200).json(data);
        });
    } catch (err) {
        console.log("Catch error:", err);
        res.status(500).json({ error: err.message });
    }
};
