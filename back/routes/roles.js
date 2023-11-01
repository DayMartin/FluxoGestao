const router = require("express").Router();

const rolesController = require("../controllers/rolesController");

router.route("/roles").post((req, res) => rolesController.create(req, res));

router.route("/roles").get((req, res) => rolesController.getAll(req, res));

router.route("/roles/:id").get((req, res) => rolesController.get(req, res));

router.route("/roles/:id").delete((req, res) => rolesController.delete(req, res));

router.route("/roles/:id").put((req, res) => rolesController.update(req, res));

module.exports = router;