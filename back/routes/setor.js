const router = require("express").Router();

const setorController = require("../controllers/setorController");

router.route("/setor").post((req, res) => setorController.create(req, res));

router.route("/setor").get((req, res) => setorController.getAll(req, res));

router.route("/setor/:id").get((req, res) => setorController.get(req, res));

router.route("/setor/:id").delete((req, res) => setorController.delete(req, res));

router.route("/setor/:id").put((req, res) => setorController.update(req, res));

module.exports = router;