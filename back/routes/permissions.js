const router = require("express").Router();

const permissionsController = require("../controllers/permissionsController");

router
    .route("/permissions")
    .post((req, res) => permissionsController.create(req, res));

router.route("/permissions").get((req, res) => permissionsController.getAll(req, res));

router.route("/permissions/:id").get((req, res) => permissionsController.get(req, res));

router.route("/permissions/:id").delete((req, res) => permissionsController.delete(req, res));

router.route("/permissions/:id").put((req, res) => permissionsController.update(req, res));

module.exports = router;