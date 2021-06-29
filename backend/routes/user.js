const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
	try {
		const hashPassword = await bcrypt.hash(req.body.password, 12);

		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashPassword,
		});

		const user = await newUser.save();
		res.status(200).json(user);
	} catch (err) {
		res.status(500).json(err);
	}
});

router.post("/login", async (req, res) => {
	try {
		const { username, password } = req.body;
		const user = await User.findOne({ username });
		if (!user)
			res.status(404).json({
				success: false,
				error: "User not found",
			});
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			res.status(404).json({
				success: false,
				error: "Invalid Password",
			});
		}
		res.status(200).json({ _id: user._id, username });
	} catch (err) {
		console.log(err);
		res.status(500).json(err);
	}
});

module.exports = router;
