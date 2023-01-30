/** @format */

const {
	addMessage,
	getAllMessage,
} = require("../controllers/messagesController");
const {
	getGroupChatName,
	createGroupChat,
	addToGroup,
	fetchChats,
	addMessageGroup,
	allchats,
} = require("../controllers/groupchatController");

const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getAllMessage);
// router.post("/getgroupchatname", () => {
// 	getGroupChatName;
// });
//router.get("/getgroupchatname/", getGroupChatName);

//**group chat */
router.post("/creategroup/", createGroupChat);
router.put("/addtogroup", addToGroup);
router.get("/allchats", fetchChats);
router.post("/sendmessageGroup", addMessageGroup);
router.post("/getallgroupmessages", fetchChats);
router.post("/groupchatmessage", allchats);
module.exports = router;
