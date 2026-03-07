import { Router } from "express";
import {
  index,
  showSingle,
  store,
  update,
  patch,
  destroy,
} from "../controllers/galaxiesController.js";

const router = Router();

router.get("/", index);
router.get("/:slug", showSingle);
router.post("/", store);
router.put("/:id", update);
router.patch("/:id", patch);
router.delete("/:id", destroy);

export default router;
