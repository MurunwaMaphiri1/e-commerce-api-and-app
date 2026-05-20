import { Router } from "express";
import { getAllProducts, addProduct, listProductById, deleteByProductId, updateProductById } from "../controllers/product.controller.js";

const router = Router();

router.get("/:id", listProductById);
router.post("/", addProduct);
router.get("/", getAllProducts);
router.patch("/:id", updateProductById);
router.delete("/:id", deleteByProductId);

export default router;