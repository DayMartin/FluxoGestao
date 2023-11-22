const router = require("express").Router();

const salaController = require("../controllers/salaController");

router.route("/sala").post((req, res) => salaController.create(req, res));

router.route("/sala").get((req, res) => salaController.getAll(req, res));

router.route("/sala/:id").get((req, res) => salaController.get(req, res));

router.route("/sala/:id").delete((req, res) => salaController.delete(req, res));

router.route("/sala/:id").put((req, res) => salaController.update(req, res));

module.exports = router;