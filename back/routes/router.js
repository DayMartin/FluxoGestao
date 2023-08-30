const router = require("express").Router();

// Services router
const servicesRouter = require("./service");

router.use("/", servicesRouter);

// Parties routes

const partyRouter = require("./parties");

router.use("/", partyRouter);

// comments routes

const commentsRouter = require("./comments");

router.use("/", commentsRouter);

module.exports = router;