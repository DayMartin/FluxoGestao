const router = require("express").Router();

const commentsController = require("../controllers/commentsController");

router
    .route("/comments")
    .post((req, res) => commentsController.create(req, res));

router.route("/comments").get((req, res) => commentsController.getAll(req, res));    

router.route("/comments/:id").get((req, res) => commentsController.get(req, res));

router.route("/comments/:id").delete((req, res) => commentsController.delete(req, res));

router.route("/comments/:id").put((req, res) => commentsController.update(req, res));

module.exports = router;