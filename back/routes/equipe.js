const router = require("express").Router();

const equipeController = require("../controllers/equipeController");

router.route("/equipe").post((req, res) => equipeController.create(req, res));

router.route("/equipe").get((req, res) => equipeController.getAll(req, res));

router.route("/equipe/:id").get((req, res) => equipeController.get(req, res));

router.route("/equipe/:id").delete((req, res) => equipeController.delete(req, res));

router.route("/equipe/:id").put((req, res) => equipeController.update(req, res));

module.exports = router;