import { db } from "../DB.js";
import jwt from "jsonwebtoken";

// Helper function to get user ID from JWT token
const getUserFromToken = (req) => {
    const token = req.cookies.access_token;
    if (!token) return null;

    try {
        const userInfo = jwt.verify(token, "jwt-key");
        return userInfo.id;
    } catch (err) {
        return null;
    }
};

// Helper function to get or create cart for user
const getOrCreateCart = (userId, callback) => {
    const getCartQuery = "SELECT cart_id FROM cart WHERE user_id = ?";

    db.query(getCartQuery, [userId], (err, cartData) => {
        if (err) return callback(err, null);

        if (cartData.length === 0) {
            // Create new cart
            const createCartQuery = "INSERT INTO cart (user_id) VALUES (?)";

            db.query(createCartQuery, [userId], (err, result) => {
                if (err) return callback(err, null);
                callback(null, result.insertId);
            });
        } else {
            callback(null, cartData[0].cart_id);
        }
    });
};

// ADD ITEM TO CART
export const addToCart = async (req, res) => {
    try {
        const userId = getUserFromToken(req);
        if (!userId) {
            return res.status(401).json("Not authenticated!");
        }

        const { pizza_id, quantity = 1 } = req.body;

        if (!pizza_id) {
            return res.status(400).json("Pizza ID is required!");
        }

        // Validate pizza exists
        const checkPizzaQuery =
            "SELECT pizza_id FROM pizza_menu WHERE pizza_id = ?";
        db.query(checkPizzaQuery, [pizza_id], (err, pizzaData) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (pizzaData.length === 0) {
                return res.status(404).json("Pizza not found!");
            }

            // Get or create cart
            getOrCreateCart(userId, (err, cartId) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                // Check if item already exists in cart
                const checkItemQuery =
                    "SELECT * FROM cart_items WHERE cart_id = ? AND pizza_id = ?";

                db.query(
                    checkItemQuery,
                    [cartId, pizza_id],
                    (err, existingItem) => {
                        if (err) {
                            return res.status(500).json({ error: err.message });
                        }

                        if (existingItem.length > 0) {
                            // Update quantity if item exists
                            const updateQuery =
                                "UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND pizza_id = ?";

                            db.query(
                                updateQuery,
                                [quantity, cartId, pizza_id],
                                (err) => {
                                    if (err) {
                                        return res
                                            .status(500)
                                            .json({ error: err.message });
                                    }
                                    res.status(200).json(
                                        "Item quantity updated in cart!"
                                    );
                                }
                            );
                        } else {
                            // Add new item to cart
                            const addItemQuery =
                                "INSERT INTO cart_items (cart_id, pizza_id, quantity) VALUES (?, ?, ?)";

                            db.query(
                                addItemQuery,
                                [cartId, pizza_id, quantity],
                                (err) => {
                                    if (err) {
                                        return res
                                            .status(500)
                                            .json({ error: err.message });
                                    }
                                    res.status(200).json("Item added to cart!");
                                }
                            );
                        }
                    }
                );
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET CART ITEMS
export const getCart = async (req, res) => {
    try {
        const userId = getUserFromToken(req);
        if (!userId) {
            return res.status(401).json("Not authenticated!");
        }

        const q = `
            SELECT 
                ci.cart_item_id,
                ci.pizza_id,
                ci.quantity,
                p.name,
                p.unit_price,
                p.img_url,
                (ci.quantity * p.unit_price) as total_price,
                GROUP_CONCAT(i.name SEPARATOR ', ') as ingredients
            FROM cart c
            JOIN cart_items ci ON c.cart_id = ci.cart_id
            JOIN pizza_menu p ON ci.pizza_id = p.pizza_id
            LEFT JOIN pizza_ingredients pi ON p.pizza_id = pi.pizza_id
            LEFT JOIN ingredients i ON pi.ingredient_id = i.ingredient_id
            WHERE c.user_id = ?
            GROUP BY ci.cart_item_id, ci.pizza_id, ci.quantity, p.name, p.unit_price, p.img_url
            ORDER BY ci.added_at DESC
        `;

        db.query(q, [userId], (err, data) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Calculate cart summary
            const totalItems = data.reduce(
                (sum, item) => sum + item.quantity,
                0
            );
            const totalAmount = data.reduce(
                (sum, item) => sum + Number(item.total_price),
                0
            );

            res.status(200).json({
                items: data,
                summary: {
                    totalItems,
                    totalAmount: totalAmount.toFixed(2),
                },
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE CART ITEM QUANTITY
export const updateCartItem = async (req, res) => {
    try {
        const userId = getUserFromToken(req);
        if (!userId) {
            return res.status(401).json("Not authenticated!");
        }

        const { cart_item_id } = req.params;
        const { quantity } = req.body;

        if (!quantity || quantity < 1) {
            return res.status(400).json("Invalid quantity!");
        }

        // Verify the cart item belongs to the user
        const verifyQuery = `
            SELECT ci.cart_item_id 
            FROM cart_items ci
            JOIN cart c ON ci.cart_id = c.cart_id
            WHERE ci.cart_item_id = ? AND c.user_id = ?
        `;

        db.query(verifyQuery, [cart_item_id, userId], (err, data) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (data.length === 0) {
                return res.status(404).json("Cart item not found!");
            }

            const updateQuery =
                "UPDATE cart_items SET quantity = ? WHERE cart_item_id = ?";

            db.query(updateQuery, [quantity, cart_item_id], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(200).json("Cart item updated!");
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// REMOVE ITEM FROM CART
export const removeFromCart = async (req, res) => {
    try {
        const userId = getUserFromToken(req);
        if (!userId) {
            return res.status(401).json("Not authenticated!");
        }

        const { cart_item_id } = req.params;

        // Verify the cart item belongs to the user
        const verifyQuery = `
            SELECT ci.cart_item_id 
            FROM cart_items ci
            JOIN cart c ON ci.cart_id = c.cart_id
            WHERE ci.cart_item_id = ? AND c.user_id = ?
        `;

        db.query(verifyQuery, [cart_item_id, userId], (err, data) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (data.length === 0) {
                return res.status(404).json("Cart item not found!");
            }

            const deleteQuery = "DELETE FROM cart_items WHERE cart_item_id = ?";

            db.query(deleteQuery, [cart_item_id], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.status(200).json("Item removed from cart!");
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CLEAR ENTIRE CART
export const clearCart = async (req, res) => {
    try {
        const userId = getUserFromToken(req);
        if (!userId) {
            return res.status(401).json("Not authenticated!");
        }

        const q = `
            DELETE ci FROM cart_items ci
            JOIN cart c ON ci.cart_id = c.cart_id
            WHERE c.user_id = ?
        `;

        db.query(q, [userId], (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json(
                `Cart cleared! ${result.affectedRows} items removed.`
            );
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET CART ITEM COUNT (for navbar badge)
export const getCartCount = async (req, res) => {
    try {
        const userId = getUserFromToken(req);
        if (!userId) {
            return res.status(200).json({ count: 0 });
        }

        const q = `
            SELECT COALESCE(SUM(ci.quantity), 0) as count
            FROM cart c
            LEFT JOIN cart_items ci ON c.cart_id = ci.cart_id
            WHERE c.user_id = ?
        `;

        db.query(q, [userId], (err, data) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ count: data[0].count });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
