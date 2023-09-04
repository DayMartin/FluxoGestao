const router = require("express").Router();

const usersController = require("../controllers/usersController");

router
    .route("/users")
    .post((req, res) => usersController.create(req, res));

router.route("/users").get((req, res) => usersController.getAll(req, res));    

router.route("/users/:id").get((req, res) => usersController.get(req, res));

router.route("/users/:id").delete((req, res) => usersController.delete(req, res));

router.route("/users/:id").put((req, res) => usersController.update(req, res));

module.exports = router;