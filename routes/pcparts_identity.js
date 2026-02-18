/**
 * PC Parts — Lookup Tables Router
 * Gộp 8 lookup table routes vào 1 file
 *
 * Endpoints pattern:
 *   GET    /pc-parts/identity/:resource       — Public (xem)
 *   GET    /pc-parts/identity/:resource/:id   — Public (xem chi tiết)
 *   POST   /pc-parts/identity/:resource       — ADMIN only
 *   PUT    /pc-parts/identity/:resource/:id   — ADMIN only
 *   DELETE /pc-parts/identity/:resource/:id   — ADMIN only
 */

const express = require("express");
const router = express.Router();

const {
  authenticateToken,
  requireRole,
} = require("../middlewares/auth.middleware");
const { createLookupController } = require("../controllers/lookupController");
const {
  CoolerType,
  FormFactor,
  InterfaceType,
  PcieConnector,
  PcieVersion,
  RamType,
  Socket,
  SsdType,
} = require("../schemas");

// ── Map resource name → Sequelize Model ────────────────────────────────────
const RESOURCE_MAP = {
  "cooler-types": CoolerType,
  "form-factors": FormFactor,
  "interface-types": InterfaceType,
  "pcie-connectors": PcieConnector,
  "pcie-versions": PcieVersion,
  "ram-types": RamType,
  sockets: Socket,
  "ssd-types": SsdType,
};

// ── Middleware: resolve :resource → Model ───────────────────────────────────
const resolveModel = (req, res, next) => {
  const Model = RESOURCE_MAP[req.params.resource];
  if (!Model) {
    return res.status(404).json({
      code: 1400,
      message: `Resource '${req.params.resource}' không tồn tại. Các resource hợp lệ: ${Object.keys(RESOURCE_MAP).join(", ")}`,
    });
  }
  req.Model = Model;
  next();
};

// ── Routes ──────────────────────────────────────────────────────────────────

// GET /pc-parts/identity/:resource — Lấy tất cả (Public)
router.get("/:resource", resolveModel, (req, res) => {
  const ctrl = createLookupController(req.Model);
  return ctrl.getAll(req, res);
});

// GET /pc-parts/identity/:resource/:id — Lấy theo ID (Public)
router.get("/:resource/:id", resolveModel, (req, res) => {
  const ctrl = createLookupController(req.Model);
  return ctrl.getById(req, res);
});

// POST /pc-parts/identity/:resource — Tạo mới (ADMIN only)
router.post(
  "/:resource",
  authenticateToken,
  requireRole("ADMIN"),
  resolveModel,
  (req, res) => {
    const ctrl = createLookupController(req.Model);
    return ctrl.create(req, res);
  },
);

// PUT /pc-parts/identity/:resource/:id — Cập nhật (ADMIN only)
router.put(
  "/:resource/:id",
  authenticateToken,
  requireRole("ADMIN"),
  resolveModel,
  (req, res) => {
    const ctrl = createLookupController(req.Model);
    return ctrl.update(req, res);
  },
);

// DELETE /pc-parts/identity/:resource/:id — Xóa (ADMIN only)
router.delete(
  "/:resource/:id",
  authenticateToken,
  requireRole("ADMIN"),
  resolveModel,
  (req, res) => {
    const ctrl = createLookupController(req.Model);
    return ctrl.remove(req, res);
  },
);

module.exports = router;
