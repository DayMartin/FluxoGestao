const router = require("express").Router();

// Services router
const servicesRouter = require("./service");

router.use("/", servicesRouter);

// Ordem routes

const ordemRouter = require("./ordem");

router.use("/", ordemRouter);

// comments routes

const commentsRouter = require("./comments");

router.use("/", commentsRouter);

// users routes

const usersRouter = require("./users");

router.use("/", usersRouter);

module.exports = router;


// auth routes

const authRouter = require("./auth");

router.use("/", authRouter);

module.exports = router;

// usersPrivate routes

const usersPrivateRouter = require("./usersPrivate");

router.use("/", usersPrivateRouter);

module.exports = router;


// roles routes

const usersrolesRouter = require("./roles");

router.use("/", usersrolesRouter);

module.exports = router;

// sala routes

const salaRouter = require("./sala");

router.use("/", salaRouter);

module.exports = router;

// setor routes

const setorRouter = require("./setor");

router.use("/", setorRouter);

module.exports = router;

// equipe routes

const equipeRouter = require("./equipe");

router.use("/", equipeRouter);

module.exports = router;


// log routes

const logRouter = require("./log");

router.use("/", logRouter);

module.exports = router;
