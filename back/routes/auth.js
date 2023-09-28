const router = require("express").Router();

const authController = require("../controllers/authController");

router
    .route("/auth/login")
    .post((req, res) => authController.create(req, res));

router.route("/auth/login").get((req, res) => authController.getAll(req, res));    

router.route("/auth/login/:id").get((req, res) => authController.get(req, res));

router.route("/auth/login/:id").delete((req, res) => authController.delete(req, res));

router.route("/auth/login/:id").put((req, res) => authController.update(req, res));

module.exports = router;