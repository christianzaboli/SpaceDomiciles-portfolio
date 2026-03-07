// routers/createOrderRouter.js
// ==========================================================
// Router dedicato alla singola super-chiamata create_order.
// NON è una CRUD. È una action unica che gestisce:
// - invoice
// - invoices_stack
// - certificati
// - invio email
// ==========================================================

import {Router} from "express";
import {createOrder} from "../controllers/createOrderController.js";

const router = Router();

// POST /api/create_order
router.post("/", createOrder);

export default router;