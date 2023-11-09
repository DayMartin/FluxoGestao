const router = require("express").Router();

const usersrolesController = require("../controllers/rolesController")

router.route("/usersroles").post((req, res) => usersrolesController.create(req, res));

router.route("/usersroles").get((req, res) => usersrolesController.getAll(req, res));

router.route("/usersroles/:id").get((req, res) => usersrolesController.get(req, res));

router.route("/usersroles/:id").delete((req, res) => usersrolesController.delete(req, res));

router.route("/usersroles/:id").put((req, res) => usersrolesController.update(req, res));

module.exports = router;