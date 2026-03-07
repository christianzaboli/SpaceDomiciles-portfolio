import { Router } from "express";
import {
  index,
  indexFilter,
  show,
  store,
  update,
  patch,
  destroy,
  showGalaxyPlanet,
} from "../controllers/planetsController.js";

const router = Router();

router.get("/", index);
router.get("/filter", indexFilter);
router.get("/:slug", show);
router.get("/from/:galaxySlug", showGalaxyPlanet);
router.post("/", store);
router.put("/:id", update);
router.patch("/:id", patch);
router.delete("/:id", destroy);

export default router;
