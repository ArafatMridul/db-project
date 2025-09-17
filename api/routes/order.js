import express from "express";
import {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
} from "../controllers/order.js";

const router = express.Router();

// POST /api/order - Create a new order from cart
router.post("/", createOrder);

// GET /api/order - Get all orders for the authenticated user
router.get("/", getUserOrders);

// GET /api/order/:orderId - Get specific order details
router.get("/:orderId", getOrderById);

// PUT /api/order/:orderId/status - Update order status
router.put("/:orderId/status", updateOrderStatus);

// PUT /api/order/:orderId/cancel - Cancel order (only if pending)
router.put("/:orderId/cancel", cancelOrder);

export default router;
