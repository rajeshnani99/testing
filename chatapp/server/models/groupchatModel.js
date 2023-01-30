/** @format */

const mongoose = require("mongoose");

const groupChatSchema = new mongoose.Schema({
	name: {
		type: String,
	},
	members: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Users",
		},
	],
	messages: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Users",
			},
			message: {
				type: String,
				ref: "Messages",
			},
			timestamp: {
				type: Date,
				default: Date.now,
			},
		},
	],
});

module.exports = mongoose.model("groupChat", groupChatSchema);
