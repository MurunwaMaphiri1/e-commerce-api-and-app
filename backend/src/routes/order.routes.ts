import { Router } from "express";
import { getOrderById, addOrder, deleteOrder, updateOrder } from "../controllers/order.controller.js";

const router = Router();

router.get("/:id", getOrderById);
router.post("/", addOrder);
router.patch("/:id", updateOrder);
router.delete("/:id", deleteOrder);

export default router;