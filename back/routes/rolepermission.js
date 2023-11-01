const router = require("express").Router();

const rolepermissionController = require("../controllers/rolepermissionController");

router
    .route("/rolepermission")
    .post((req, res) => rolepermissionController.create(req, res));

router.route("/rolepermission").get((req, res) => rolepermissionController.getAll(req, res));

router.route("/rolepermission/:id").get((req, res) => rolepermissionController.get(req, res));

router.route("/rolepermission/:id").delete((req, res) => rolepermissionController.delete(req, res));

router.route("/rolepermission/:id").put((req, res) => rolepermissionController.update(req, res));

module.exports = router;