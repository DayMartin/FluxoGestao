const router = require("express").Router();

const ordemController = require("../controllers/ordemController");

router.route("/ordem").post((req, res) => ordemController.create(req, res));

router.route("/ordem").get((req, res) => ordemController.getAll(req, res));

router.route("/ordem/:id").get((req, res) => ordemController.get(req, res));

router.route("/ordem/:id").delete((req, res) => ordemController.delete(req, res));

router.route("/ordem/:id").put((req, res) => ordemController.update(req, res));


module.exports = router;