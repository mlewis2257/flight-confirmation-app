const express = require("express");
const router = express.Router();
const authCtrl = require("../controllers/auth");

router.post("/signup", authCtrl.signup);
router.post("/login", authCtrl.login);
router.post("/signout", authCtrl.signOut);
router.post("/refesh-token", authCtrl.refreshToken);
module.export = router;
