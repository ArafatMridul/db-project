import express from "express";
import {
    addNewPizza,
    checkAdminCredentials,
    getAllIngredients,
    getAllPizzas,
    getAllUsers,
    getUserOrders,
    markPizzaAsSoldOut,
    updateOrderStatus,
} from "../controllers/admin.js";
const router = express.Router();

router.post("/login", checkAdminCredentials);
router.get("/users", getAllUsers);
router.get("/all-pizzas", getAllPizzas);
router.post("/add-pizza", addNewPizza);
router.get("/all-ingredients", getAllIngredients);
router.put("/mark-soldout", markPizzaAsSoldOut);
router.get("/orders/:user_id", getUserOrders);
router.put("/order/status", updateOrderStatus);

export default router;
