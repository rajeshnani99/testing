/** @format */

const Messages = require("../models/messageModel");

const groupchat = require("../models/groupchatModel");
const { json } = require("express");

module.exports.getAllMessage = async (req, res, next) => {
	try {
		const { from, to } = req.body;
		console.log(`req: ${JSON.stringify(req.body)}`);
		const messages = await Messages.find({
			users: {
				$all: [from, to],
			},
		}).sort({ updatedAt: 1 });
		console.log("message :" + typeof messages);
		for (let [key, value] of Object.entries(messages)) {
			//console.log(`keys ${key}:${value}`);
			console.log(`${value.message?.text}`);
		}

		// const projectMessages = messages.map((msg) => {
		// 	//error occur here undefined

		// 	console.log("checking msg:" + msg?.message?.text);

		// 	return {
		// 		fromSelf: msg.sender.toString() === from,
		// 		message: msg?.message?.text,
		// 	};
		// });

		// res.json(projectMessages);
	} catch (error) {
		next(error);
	}
};
module.exports.addMessage = async (req, res, next) => {
	try {
		const { name, from, to, message } = req.body;
		//
		console.log(`req ${JSON.stringify(req.body)}`);
		const data = await groupchat.create({
			name: {
				Groupname: name,
			},
			message: {
				text: message,
			},
			users: [from, to],
			sender: from,
		});

		if (data)
			return res.json({
				msg: "Message added successfully!",
			});
		return res.json({
			msg: "Failed to add message to DB",
		});
	} catch (err) {
		next(err);
	}
};

module.exports.createGroupChat = async (req, res) => {
	if (!req.body.members || !req.body.name) {
		return res.status(400).send({ message: "Please Fill all the feilds" });
	}

	var members = JSON.parse(req.body.members);

	if (members.length < 2) {
		return res
			.status(400)
			.send("More than 2 users are required to form a group chat");
	}
	console.log("member :" + members);
	members.push(req.members);

	try {
		const groupChat = await groupchat.create({
			name: req.body.name,
			members: members,
		});

		const fullGroupChat = await groupchat
			.findOne({ _id: groupChat._id })
			.populate("members", "-password");

		res.status(200).json(fullGroupChat);
	} catch (error) {
		res.status(400);
		throw new Error(error.message);
	}
};

//add to group
module.exports.addToGroup = async (req, res) => {
	const { chatId, userId } = req.body;

	// check if the requester is admin

	const added = await groupchat
		.findByIdAndUpdate(
			chatId,
			{
				$push: { members: userId },
			},
			{
				new: true,
			}
		)
		.populate("members", "-password");
	if (!added) {
		res.status(404);
		throw new Error("Chat Not Found");
	} else {
		res.json(added);
	}
};

module.exports.allchats = async (req, res, next) => {
	try {
		const { from, to } = req.body;
		const messages = await groupchat
			.find({
				users: {
					$all: [from, to],
				},
			})
			.sort({ updatedAt: 1 });
		//accessing messages

		const projectMessages = messages.map((msg) => {
			return {
				fromSelf: msg.sender?.toString() === from,
				message: msg.messages?.text,
			};
		});
		//console.log(`project messages : ${JSON.stringify(projectMessages)}`);
		res.json(projectMessages);
	} catch (error) {
		next(error);
	}
};

module.exports.fetchChats = async (req, res, next) => {
	try {
		//const { _id } = req.body._id;
		await groupchat
			.find({ members: { $elemMatch: { $eq: req.name } } })
			.populate("members", "-password")

			// .populate("message")
			.sort({ updatedAt: -1 })
			.then(async (results) => {
				results = await groupchat.populate(results, {
					path: "message.sender",
					select: "name pic email",
				});
				res.status(200).send(results);
			});
	} catch (error) {
		res.status(400);
		throw new Error(error.message);
	}
};

module.exports.addMessageGroup = async (req, res, next) => {
	try {
		const { from, to, message } = req.body;
		const data = await groupchat.create({
			messages: {
				message: message,
			},
			users: [from, to],
			sender: from,
		});
		console.log(data);
		if (data)
			return res.json({
				msg: "Message added successfully!",
			});
		return res.json({
			msg: "Failed to add message to DB",
		});
	} catch (err) {
		next(err);
	}
};
