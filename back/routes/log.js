const router = require("express").Router();

const logController = require("../controllers/logController");

router.route("/log").post((req, res) => logController.create(req, res));
router.route("/log").get((req, res) => logController.getAll(req, res));
router.route("/log/:id").get((req, res) => logController.getById(req, res));
router.route("/log/entity/:entityId").get((req, res) => logController.getByEntityId(req, res));
module.exports = router;
