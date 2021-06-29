require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const pinRoute = require("./routes/pins");
const app = express();

app.use(express.json());

mongoose
	.connect(process.env.MONGO_URI, {
		useCreateIndex: true,
		useUnifiedTopology: true,
		useNewUrlParser: true,
	})
	.then(() => {
		console.log("Mongo connected");
	})
	.catch((err) => {
		console.log(err);
	});

app.use("/api/pins", pinRoute);

app.listen(8080, () => {
	console.log("server started");
});
