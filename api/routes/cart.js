import express from "express";
import {
    addToCart,
    getCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartCount,
} from "../controllers/cart.js";

const router = express.Router();


router.post("/add", addToCart);
router.get("/", getCart);
router.get("/count", getCartCount);
router.put("/item/:cart_item_id", updateCartItem);
router.delete("/item/:cart_item_id", removeFromCart);
router.delete("/clear", clearCart);

export default router;
