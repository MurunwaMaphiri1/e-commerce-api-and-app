import { Router } from "express";
import { getCartByUserId, updateCartItem, deleteCartItem, addToCart } from "../controllers/cart.controller.js";

const router = Router();

router.get("/:id", getCartByUserId);
router.post("/user/:id", addToCart);
router.patch("/:id", updateCartItem);
router.delete("/:id", deleteCartItem);

export default router;