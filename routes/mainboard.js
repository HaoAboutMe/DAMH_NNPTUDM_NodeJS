const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/mainboardController");
const {
  authenticateToken,
  requireRole,
} = require("../middlewares/auth.middleware");

router.get("/", ctrl.getAll);
router.get("/:id", ctrl.getById);
router.post("/", authenticateToken, requireRole("ADMIN"), ctrl.create);
router.put("/:id", authenticateToken, requireRole("ADMIN"), ctrl.update);
router.delete("/:id", authenticateToken, requireRole("ADMIN"), ctrl.remove);

module.exports = router;
