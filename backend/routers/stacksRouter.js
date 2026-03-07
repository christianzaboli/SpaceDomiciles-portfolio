import {Router} from "express";
import {index, showSingle, showPlanetsStacks, store, update, patch, destroy, purchaseStack} from "../controllers/stacksController.js";


const router = Router();


router.get("/", index);
router.get("/single/:slug", showSingle);
router.get("/planet/:slug", showPlanetsStacks);
router.post("/", store);
router.put("/:id", update);
router.patch("/:id", patch);
router.delete("/:id", destroy);
router.post("/:id/purchase", purchaseStack);


export default router;
