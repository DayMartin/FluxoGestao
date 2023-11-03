const router = require("express").Router();

const { authController } = require("../controllers/authController");
const ordemController = require("../controllers/ordemController");
const rolesMiddleware = require("../middlewares/rolesMiddleware");


router.route("/ordem").post(rolesMiddleware(['admin']), (req, res) => ordemController.create(req, res));
router.route("/ordem").get((req, res) => ordemController.getAll(req, res));
router.route("/ordem/:id").get((req, res) => ordemController.get(req, res));
router.route("/ordem/:id").delete((req, res) => ordemController.delete(req, res));
router.route("/ordem/:id").put((req, res) => ordemController.update(req, res));

module.exports = router;
