import express from "express";
import {
    addNewPizza,
    checkAdminCredentials,
    editPizza,
    getAllIngredients,
    getAllPizzas,
    getAllUsers,
    getTotalOrders,
    getUserOrders,
    markPizzaAsSoldOut,
    updateOrderStatus,
} from "../controllers/admin.js";
const router = express.Router();

router.post("/login", checkAdminCredentials);
router.get("/users", getAllUsers);
router.get("/all-pizzas", getAllPizzas);
router.post("/add-pizza", addNewPizza);
router.put("/edit-pizza", editPizza);
router.get("/all-ingredients", getAllIngredients);
router.put("/mark-soldout", markPizzaAsSoldOut);
router.get("/orders/total", getTotalOrders);
router.get("/orders/:user_id", getUserOrders);
router.put("/order/status", updateOrderStatus);

export default router;
