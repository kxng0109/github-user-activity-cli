import { Command } from "commander";
import fetchUser from "../services/fetchUser.js";
import checkUsername from "../utils/checkUsername.js";

const activityCommand = new Command("github-activity")
	.argument("<username>", "Github username", checkUsername)
	.action((username) => {
		fetchUser(username);
	});

export default activityCommand;
