const router = require("express").Router();

const usersController = require("../controllers/permissionsController");

router
    .route("/permissions")
    .post((req, res) => usersController.create(req, res));

router.route("/permissions").get((req, res) => usersController.getAll(req, res));

router.route("/auth/register/email").get((req, res) => usersController.getByEmail(req, res));


router.route("/auth/register/:id").get((req, res) => usersController.get(req, res));

router.route("/auth/register/:id").delete((req, res) => usersController.delete(req, res));

router.route("/auth/register/:id").put((req, res) => usersController.update(req, res));

module.exports = router;