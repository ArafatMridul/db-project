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

// Helper function to get user info
const getUserInfo = (userId, callback) => {
    const q = "SELECT username, email FROM users WHERE id = ?";
    db.query(q, [userId], callback);
};

// CREATE ORDER FROM CART
export const createOrder = async (req, res) => {
    try {
        const userId = getUserFromToken(req);
        if (!userId) {
            return res.status(401).json("Not authenticated!");
        }

        const { address, phone_number } = req.body;

        if (!address || !phone_number) {
            return res
                .status(400)
                .json("Address and phone number are required!");
        }

        // Start transaction
        db.beginTransaction((err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Get user info
            getUserInfo(userId, (err, userData) => {
                if (err) {
                    return db.rollback(() => {
                        res.status(500).json({ error: err.message });
                    });
                }

                if (userData.length === 0) {
                    return db.rollback(() => {
                        res.status(404).json("User not found!");
                    });
                }

                const { username, email } = userData[0];

                // Get user's cart items with pizza details
                const getCartQuery = `
                    SELECT 
                        ci.pizza_id, 
                        ci.quantity, 
                        pm.unit_price, 
                        pm.name as pizza_name,
                        pm.soldOut_status
                    FROM cart c
                    JOIN cart_items ci ON c.cart_id = ci.cart_id
                    JOIN pizza_menu pm ON ci.pizza_id = pm.pizza_id
                    WHERE c.user_id = ?
                `;

                db.query(getCartQuery, [userId], (err, cartItems) => {
                    if (err) {
                        return db.rollback(() => {
                            res.status(500).json({ error: err.message });
                        });
                    }

                    if (cartItems.length === 0) {
                        return db.rollback(() => {
                            res.status(400).json("Cart is empty!");
                        });
                    }

                    // Filter out sold out items
                    const availableItems = cartItems.filter(
                        (item) => !item.soldOut_status
                    );

                    if (availableItems.length === 0) {
                        return db.rollback(() => {
                            res.status(400).json(
                                "All items in cart are sold out!"
                            );
                        });
                    }

                    // Calculate total amount
                    const totalAmount = availableItems.reduce((sum, item) => {
                        return (
                            sum + parseFloat(item.unit_price) * item.quantity
                        );
                    }, 0);

                    // Create order
                    const createOrderQuery =
                        "INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)";

                    db.query(
                        createOrderQuery,
                        [userId, totalAmount, "pending"],
                        (err, orderResult) => {
                            if (err) {
                                return db.rollback(() => {
                                    res.status(500).json({
                                        error: err.message,
                                    });
                                });
                            }

                            const orderId = orderResult.insertId;

                            // Insert order items
                            let itemsProcessed = 0;
                            const totalItems = availableItems.length;

                            availableItems.forEach((item) => {
                                const insertOrderItemQuery =
                                    "INSERT INTO order_items (order_id, pizza_id, quantity) VALUES (?, ?, ?)";

                                db.query(
                                    insertOrderItemQuery,
                                    [orderId, item.pizza_id, item.quantity],
                                    (err) => {
                                        if (err) {
                                            return db.rollback(() => {
                                                res.status(500).json({
                                                    error: err.message,
                                                });
                                            });
                                        }

                                        itemsProcessed++;

                                        if (itemsProcessed === totalItems) {
                                            // Insert order info
                                            const insertOrderInfoQuery =
                                                "INSERT INTO order_info (order_id, name, email, address, phone_number) VALUES (?, ?, ?, ?, ?)";

                                            db.query(
                                                insertOrderInfoQuery,
                                                [
                                                    orderId,
                                                    username,
                                                    email,
                                                    address,
                                                    phone_number,
                                                ],
                                                (err) => {
                                                    if (err) {
                                                        return db.rollback(
                                                            () => {
                                                                res.status(
                                                                    500
                                                                ).json({
                                                                    error: err.message,
                                                                });
                                                            }
                                                        );
                                                    }

                                                    // Clear cart
                                                    const clearCartQuery = `
                                            DELETE ci FROM cart_items ci
                                            JOIN cart c ON ci.cart_id = c.cart_id
                                            WHERE c.user_id = ?
                                        `;

                                                    db.query(
                                                        clearCartQuery,
                                                        [userId],
                                                        (err) => {
                                                            if (err) {
                                                                return db.rollback(
                                                                    () => {
                                                                        res.status(
                                                                            500
                                                                        ).json({
                                                                            error: err.message,
                                                                        });
                                                                    }
                                                                );
                                                            }

                                                            // Commit transaction
                                                            db.commit((err) => {
                                                                if (err) {
                                                                    return db.rollback(
                                                                        () => {
                                                                            res.status(
                                                                                500
                                                                            ).json(
                                                                                {
                                                                                    error: err.message,
                                                                                }
                                                                            );
                                                                        }
                                                                    );
                                                                }

                                                                res.status(
                                                                    201
                                                                ).json({
                                                                    message:
                                                                        "Order created successfully!",
                                                                    orderId:
                                                                        orderId,
                                                                    totalAmount:
                                                                        totalAmount.toFixed(
                                                                            2
                                                                        ),
                                                                    status: "pending",
                                                                    orderInfo: {
                                                                        name: username,
                                                                        email: email,
                                                                        address:
                                                                            address,
                                                                        phone_number:
                                                                            phone_number,
                                                                    },
                                                                    items: availableItems,
                                                                });
                                                            });
                                                        }
                                                    );
                                                }
                                            );
                                        }
                                    }
                                );
                            });
                        }
                    );
                });
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET USER ORDERS
export const getUserOrders = async (req, res) => {
    try {
        const userId = getUserFromToken(req);
        if (!userId) {
            return res.status(401).json("Not authenticated!");
        }

        const q = `
            SELECT 
                o.order_id,
                o.order_date,
                o.total_amount,
                o.status,
                oi.name,
                oi.email,
                oi.address,
                oi.phone_number
            FROM orders o
            LEFT JOIN order_info oi ON o.order_id = oi.order_id
            WHERE o.user_id = ?
            ORDER BY o.order_date DESC
        `;

        db.query(q, [userId], (err, orders) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (orders.length === 0) {
                return res.status(200).json({
                    message: "No orders found",
                    orders: [],
                });
            }

            // Get order items for each order
            let ordersProcessed = 0;
            const totalOrders = orders.length;

            orders.forEach((order, index) => {
                const getOrderItemsQuery = `
                    SELECT 
                        oti.quantity,
                        pm.name as pizza_name,
                        pm.unit_price,
                        pm.img_url
                    FROM order_items oti
                    JOIN pizza_menu pm ON oti.pizza_id = pm.pizza_id
                    WHERE oti.order_id = ?
                `;

                db.query(getOrderItemsQuery, [order.order_id], (err, items) => {
                    if (err) {
                        return res.status(500).json({ error: err.message });
                    }

                    orders[index].items = items;
                    ordersProcessed++;

                    if (ordersProcessed === totalOrders) {
                        res.status(200).json({
                            message: "Orders retrieved successfully",
                            orders: orders,
                        });
                    }
                });
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET SPECIFIC ORDER BY ID
export const getOrderById = async (req, res) => {
    try {
        const userId = getUserFromToken(req);
        if (!userId) {
            return res.status(401).json("Not authenticated!");
        }

        const { orderId } = req.params;

        const q = `
            SELECT 
                o.order_id,
                o.order_date,
                o.total_amount,
                o.status,
                oi.name,
                oi.email,
                oi.address,
                oi.phone_number
            FROM orders o
            LEFT JOIN order_info oi ON o.order_id = oi.order_id
            WHERE o.order_id = ? AND o.user_id = ?
        `;

        db.query(q, [orderId, userId], (err, orderData) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (orderData.length === 0) {
                return res.status(404).json("Order not found!");
            }

            const order = orderData[0];

            // Get order items
            const getItemsQuery = `
                SELECT 
                    oti.quantity,
                    pm.name as pizza_name,
                    pm.unit_price,
                    pm.img_url
                FROM order_items oti
                JOIN pizza_menu pm ON oti.pizza_id = pm.pizza_id
                WHERE oti.order_id = ?
            `;

            db.query(getItemsQuery, [orderId], (err, items) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                order.items = items;

                res.status(200).json({
                    message: "Order retrieved successfully",
                    order: order,
                });
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// UPDATE ORDER STATUS
export const updateOrderStatus = async (req, res) => {
    try {
        const userId = getUserFromToken(req);
        if (!userId) {
            return res.status(401).json("Not authenticated!");
        }

        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = [
            "pending",
            "confirmed",
            "preparing",
            "out_for_delivery",
            "delivered",
            "cancelled",
        ];

        if (!validStatuses.includes(status)) {
            return res.status(400).json("Invalid status!");
        }

        // Check if order belongs to user
        const checkOrderQuery =
            "SELECT order_id FROM orders WHERE order_id = ? AND user_id = ?";

        db.query(checkOrderQuery, [orderId, userId], (err, orderData) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (orderData.length === 0) {
                return res.status(404).json("Order not found!");
            }

            const updateQuery =
                "UPDATE orders SET status = ? WHERE order_id = ?";

            db.query(updateQuery, [status, orderId], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.status(200).json("Order status updated successfully!");
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// CANCEL ORDER (only if status is pending)
export const cancelOrder = async (req, res) => {
    try {
        const userId = getUserFromToken(req);
        if (!userId) {
            return res.status(401).json("Not authenticated!");
        }

        const { orderId } = req.params;

        // Check if order belongs to user and is cancellable
        const checkOrderQuery =
            "SELECT status FROM orders WHERE order_id = ? AND user_id = ?";

        db.query(checkOrderQuery, [orderId, userId], (err, orderData) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (orderData.length === 0) {
                return res.status(404).json("Order not found!");
            }

            if (orderData[0].status !== "pending") {
                return res.status(400).json("Order cannot be cancelled!");
            }

            const updateQuery =
                "UPDATE orders SET status = 'cancelled' WHERE order_id = ?";

            db.query(updateQuery, [orderId], (err, result) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.status(200).json("Order cancelled successfully!");
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
