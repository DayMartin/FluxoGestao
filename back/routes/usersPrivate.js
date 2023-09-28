const router = require("express").Router();
const usersPrivateController = require("../controllers/usersPrivateController");

router.route("/usersprivate/:id").get(usersPrivateController.get);

module.exports = router;
