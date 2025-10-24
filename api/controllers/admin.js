import { db } from "../DB.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const checkAdminCredentials = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json("Username and password are required.");
        }

        // Query to find the admin by username
        const q = "SELECT * FROM admin WHERE username = ?";

        db.query(q, [username], async (err, data) => {
            if (err) {
                console.log("Database error:", err);
                return res.status(500).json({ error: err.message });
            }

            if (data.length === 0) {
                return res.status(404).json("Admin not found!");
            }

            // Compare the entered password with the hashed one in DB
            const isPasswordCorrect = await bcrypt.compare(
                password,
                data[0].password
            );

            if (!isPasswordCorrect) {
                return res.status(400).json({
                    success: false,
                    message: "Wrong username or password.",
                });
            }

            // Generate JWT token for admin
            const token = jwt.sign(
                { id: data[0].id, role: "admin" },
                "jwt-key"
            );

            res.status(200).json({
                success: true,
                token,
                message: "Admin logged in successfully.",
            });
        });
    } catch (err) {
        console.log("Catch error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const getAllUsers = (req, res) => {
    try {
        const q = `
            SELECT 
                id, 
                username, 
                email, 
                created_at
            FROM users
            ORDER BY id ASC
        `;

        db.query(q, (err, data) => {
            if (err) {
                console.log("Database error while fetching users:", err);
                return res.status(500).json({ error: err.message });
            }

            if (!data.length) {
                return res.status(404).json({ message: "No users found." });
            }

            res.status(200).json({
                message: "Users fetched successfully.",
                total: data.length,
                users: data,
            });
        });
    } catch (err) {
        console.log("Catch error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const getAllPizzas = (req, res) => {
    try {
        const q = `
            SELECT 
                pm.pizza_id,
                pm.name AS pizza_name,
                pm.unit_price,
                pm.img_url,
                pm.soldOut_status,
                pm.created_at,
                GROUP_CONCAT(i.name ORDER BY i.name SEPARATOR ', ') AS ingredients
            FROM pizza_menu pm
            LEFT JOIN pizza_ingredients pi ON pm.pizza_id = pi.pizza_id
            LEFT JOIN ingredients i ON pi.ingredient_id = i.ingredient_id
            GROUP BY pm.pizza_id
            ORDER BY pm.pizza_id ASC;
        `;

        db.query(q, (err, data) => {
            if (err) {
                console.log("Database error while fetching pizzas:", err);
                return res.status(500).json({ error: err.message });
            }

            if (!data.length) {
                return res.status(404).json({ message: "No pizzas found." });
            }

            const pizzas = data.map((row) => ({
                pizza_id: row.pizza_id,
                name: row.pizza_name,
                unit_price: row.unit_price,
                img_url: row.img_url,
                soldOut_status: row.soldOut_status,
                ingredients: row.ingredients ? row.ingredients.split(", ") : [],
            }));

            res.status(200).json({
                message: "Pizzas fetched successfully.",
                total: pizzas.length,
                pizzas,
            });
        });
    } catch (err) {
        console.log("Catch error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const addNewPizza = async (req, res) => {
    const { name, unit_price, img_url, soldOut_status, ingredients } = req.body;

    if (
        !name ||
        !unit_price ||
        !img_url ||
        !ingredients ||
        ingredients.length === 0
    ) {
        return res
            .status(400)
            .json({ error: "All required fields must be provided." });
    }

    try {
        // 1️⃣ Insert the pizza into pizza_menu
        const pizzaQuery = `
            INSERT INTO pizza_menu (name, unit_price, img_url, soldOut_status)
            VALUES (?, ?, ?, ?)
        `;

        db.query(
            pizzaQuery,
            [name, unit_price, img_url, soldOut_status || false],
            (err, result) => {
                if (err) {
                    console.log("Error inserting pizza:", err);
                    return res.status(500).json({ error: err.message });
                }

                const pizza_id = result.insertId; // Get the new pizza ID

                // 2️⃣ Handle ingredients
                ingredients.forEach((ingredient) => {
                    // Insert ingredient if it doesn’t exist
                    const ingredientQuery = `
                        INSERT IGNORE INTO ingredients (name) VALUES (?)
                    `;
                    db.query(ingredientQuery, [ingredient], (err) => {
                        if (err)
                            console.log("Error inserting ingredient:", err);
                    });

                    // Link pizza with ingredient
                    const linkQuery = `
                        INSERT INTO pizza_ingredients (pizza_id, ingredient_id)
                        SELECT ?, ingredient_id FROM ingredients WHERE name = ?
                    `;
                    db.query(linkQuery, [pizza_id, ingredient], (err) => {
                        if (err) console.log("Error linking ingredient:", err);
                    });
                });

                res.status(201).json({
                    message: "Pizza added successfully!",
                    pizza_id,
                    name,
                    unit_price,
                    ingredients,
                });
            }
        );
    } catch (err) {
        console.log("Catch error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const editPizza = async (req, res) => {
    try {
        const {
            pizza_id,
            name,
            unit_price,
            img_url,
            soldOut_status,
            ingredients,
        } = req.body;

        if (!pizza_id)
            return res.status(400).json({ error: "pizza_id is required" });

        // Update pizza basic details
        const q1 = `UPDATE pizza_menu SET name = ?, unit_price = ?, img_url = ?, soldOut_status = ? WHERE pizza_id = ?`;

        db.query(
            q1,
            [name, unit_price, img_url, soldOut_status ?? false, pizza_id],
            async (err) => {
                if (err) {
                    console.error("Error updating pizza:", err);
                    return res.status(500).json({ error: err.message });
                }

                // If ingredients provided, refresh the relationship
                if (ingredients && ingredients.length > 0) {
                    // Delete existing relationships
                    const deleteQ =
                        "DELETE FROM pizza_ingredients WHERE pizza_id = ?";
                    db.query(deleteQ, [pizza_id], (delErr) => {
                        if (delErr) {
                            console.error(
                                "Error deleting old ingredients:",
                                delErr
                            );
                            return res
                                .status(500)
                                .json({ error: delErr.message });
                        }

                        // Insert new relationships
                        const insertQ = `INSERT INTO pizza_ingredients (pizza_id, ingredient_id) VALUES (?, (SELECT ingredient_id FROM ingredients WHERE name = ? LIMIT 1))`;

                        ingredients.forEach((ing) => {
                            db.query(insertQ, [pizza_id, ing], (insErr) => {
                                if (insErr)
                                    console.error(
                                        "Ingredient insert error:",
                                        insErr.message
                                    );
                            });
                        });
                    });
                }

                return res
                    .status(200)
                    .json({ message: "Pizza updated successfully!" });
            }
        );
    } catch (err) {
        console.error("Edit Pizza Error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const getAllIngredients = (req, res) => {
    try {
        const q =
            "SELECT ingredient_id, name FROM ingredients ORDER BY name ASC";

        db.query(q, (err, data) => {
            if (err) {
                console.log("Database error while fetching ingredients:", err);
                return res.status(500).json({ error: err.message });
            }

            if (!data.length) {
                return res
                    .status(404)
                    .json({ message: "No ingredients found." });
            }

            // Return a clean list of ingredient names
            const ingredients = data.map((row) => ({
                id: row.ingredient_id,
                name: row.name,
            }));

            res.status(200).json({
                message: "Ingredients fetched successfully",
                total: ingredients.length,
                ingredients,
            });
        });
    } catch (err) {
        console.log("Catch error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const markPizzaAsSoldOut = (req, res) => {
    const { pizza_id, soldOut_status } = req.body;

    if (!pizza_id || soldOut_status === undefined) {
        return res
            .status(400)
            .json({ error: "Pizza ID and soldOut_status are required." });
    }

    try {
        const q = "UPDATE pizza_menu SET soldOut_status = ? WHERE pizza_id = ?";

        db.query(q, [soldOut_status, pizza_id], (err, result) => {
            if (err) {
                console.error(
                    "Database error while updating sold-out status:",
                    err
                );
                return res.status(500).json({ error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Pizza not found." });
            }

            res.status(200).json({
                message: `Pizza marked as ${
                    soldOut_status ? "SOLD OUT" : "AVAILABLE"
                } successfully!`,
            });
        });
    } catch (err) {
        console.error("Catch error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const getUserOrders = (req, res) => {
    const { user_id } = req.params;

    if (!user_id) {
        return res.status(400).json({ error: "User ID is required." });
    }

    try {
        const q = `
            SELECT 
                o.order_id,
                o.order_date,
                o.total_amount,
                o.status,
                GROUP_CONCAT(
                    JSON_OBJECT(
                        'pizza_id', p.pizza_id,
                        'pizza_name', p.name,
                        'quantity', oi.quantity,
                        'unit_price', p.unit_price
                    )
                    SEPARATOR ','
                ) AS pizzas
            FROM orders o
            LEFT JOIN order_items oi ON o.order_id = oi.order_id
            LEFT JOIN pizza_menu p ON oi.pizza_id = p.pizza_id
            WHERE o.user_id = ?
            GROUP BY o.order_id
            ORDER BY o.order_date DESC;
        `;

        db.query(q, [user_id], (err, data) => {
            if (err) {
                console.log("Database error while fetching user orders:", err);
                return res.status(500).json({ error: err.message });
            }

            if (!data.length) {
                return res
                    .status(404)
                    .json({ message: "No orders found for this user." });
            }

            // Format pizzas back to proper JSON arrays
            const orders = data.map((order) => ({
                order_id: order.order_id,
                order_date: order.order_date,
                total_amount: order.total_amount,
                status: order.status,
                pizzas: order.pizzas
                    ? JSON.parse(`[${order.pizzas}]`) // Convert GROUP_CONCAT string back to array
                    : [],
            }));

            res.status(200).json({
                message: "User orders fetched successfully.",
                total_orders: orders.length,
                orders,
            });
        });
    } catch (err) {
        console.log("Catch error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const updateOrderStatus = (req, res) => {
    const { order_id, status } = req.body;

    if (!order_id || !status) {
        return res
            .status(400)
            .json({ error: "Order ID and new status are required." });
    }

    try {
        const q = `
            UPDATE orders
            SET status = ?
            WHERE order_id = ?
        `;

        db.query(q, [status, order_id], (err, result) => {
            if (err) {
                console.log("Database error while updating order status:", err);
                return res.status(500).json({ error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Order not found." });
            }

            res.status(200).json({
                message: `Order status updated to '${status}' successfully.`,
                order_id,
                status,
            });
        });
    } catch (err) {
        console.log("Catch error:", err);
        res.status(500).json({ error: err.message });
    }
};

export const getTotalOrders = (req, res) => {
    try {
        const q = "SELECT COUNT(*) AS totalOrders FROM orders";

        db.query(q, (err, result) => {
            if (err) {
                console.error("Database error while counting orders:", err);
                return res
                    .status(500)
                    .json({ error: "Failed to count orders." });
            }

            // result[0].totalOrders will hold the total count
            res.status(200).json({
                total: result[0].totalOrders,
                message: "Total orders retrieved successfully.",
            });
        });
    } catch (err) {
        console.error("Unexpected server error:", err);
        res.status(500).json({ error: "Server error occurred." });
    }
};