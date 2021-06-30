const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			unique: true,
			require: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
			min: 3,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
