const router = require("express").Router();

const usersController = require("../controllers/usersController");

router
    .route("/auth/register")
    .post((req, res) => usersController.create(req, res));

router.route("/auth/register").get((req, res) => usersController.getAll(req, res));

router.route("/auth/register/email").get((req, res) => usersController.getByEmail(req, res));


router.route("/auth/register/:id").get((req, res) => usersController.get(req, res));

router.route("/auth/register/:id").delete((req, res) => usersController.delete(req, res));

router.route("/auth/register/:id").put((req, res) => usersController.update(req, res));

module.exports = router;