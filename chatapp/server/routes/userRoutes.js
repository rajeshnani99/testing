/** @format */

const { allchats } = require("../controllers/groupchatController");
const { register } = require("../controllers/usersController");
const { login } = require("../controllers/usersController");
const { setAvatar } = require("../controllers/usersController");
const { getAllUsers, searchUser } = require("../controllers/usersController");
const { logOut } = require("../controllers/usersController");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/setAvatar/:id", setAvatar);
router.get("/allUsers/:id", getAllUsers);
router.get("/logout/:id", logOut);
//use seach
router.get("/searchuser", searchUser);
//to get the all group chats
router.get("/allgroupchatnames", allchats);

module.exports = router;
