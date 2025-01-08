import chalk from "chalk";
import { Command } from "commander";
import { request } from "https";
const program = new Command();

const errorHandler = (message, exit = true) => {
	console.error(chalk.bold.red(message));
	if (exit) {
		process.exit(1);
	}
};

const checkUsername = (value, previous) => {
	const userNameRegex = /^[a-zA-Z0-9](?:-?[a-zA-Z0-9]){0,38}$/;
	value = value.trim();
	const test = userNameRegex.test(value);
	if (!test) {
		errorHandler("Invalid username");
	}
	return value;
};

const handleData = (jsonData) => {
	let prevActivity = {};
	let messageArray = [];
	const getMessage = (data) => {
		let repoName = data.repo.name;
		switch (data.type) {
			case "PushEvent":
				const { prevType, prevID, commitCount = 0 } = prevActivity;
				if (data.type === prevType && data.repo.id === prevID) {
					prevActivity.commitCount = commitCount + 1;
					messageArray.pop();
					return `- Pushed ${commitCount + 1} commits to ${repoName}`;
				} else {
					prevActivity = {
						prevType: data.type,
						prevID: data.repo.id,
						commitCount: 1,
					};
					return `- Pushed 1 commit to ${repoName}`;
				}
			case "PublicEvent":
				repoName = repoName.split("/")[1];
				return `- Made thier repository, "${repoName}", public`;
			case "WatchEvent":
				return `- Started watching the repository ${repoName}`;
			case "CreateEvent":
				if (!data.payload.ref) {
					repoName = repoName.split("/")[1];
					return `- Created the repository "${repoName}"`;
				}
				break;
			case "IssueCommentEvent":
				return `- Commented on an issue in ${repoName}`;
			case "IssuesEvent":
				if (data.payload.action === "created") {
					return `- Created an issue in ${repoName}`;
				} else {
					return `- Issue in ${repoName} was ${data.payload.action}`;
				}
			case "PullRequestEvent":
				return `- Opened a pull request in ${repoName}`;
			case "ForkEvent":
				return `- Forked the repository ${repoName}`;
			default:
				return undefined;
		}
	};

	jsonData.forEach((data) => {
		const message = getMessage(data);
		if (message) {
			messageArray.push(message);
		}
	});

	const filteredArray = messageArray.filter(
		(data, index) => data !== messageArray[index + 1],
	);
	console.log(chalk.green(filteredArray));
};

const fetchUser = (username) => {
	const options = {
		hostname: "api.github.com",
		path: `/users/${username}/events`,
		port: 443,
		method: "GET",
		headers: {
			"User-Agent": "node-app",
		},
	};

	request(options, (res) => {
		if (res.statusCode == 404) {
			errorHandler(`User with the username ${username} not found`);
		}
		if(res.statusCode !== 200){
			errorHandler(`Error occured while trying to fetch users details. Status: ${res.statusCode}`)
		}

		let data = "";

		res.on("data", (chunk) => {
			data += chunk;
		});

		res.on("end", () => {
			try {
				const jsonData = JSON.parse(data);
				handleData(jsonData);
			} catch (err) {
				errorHandler(
					`Error occured while parsing JSON: ${err.message}`,
					false,
				);
			}
		});
	})
		.on("error", (err) => {
			errorHandler(`Failed to fetch user details: ${err}`, false);
		})
		.end();
};

program
	.command("github-activity")
	.argument("<username>", "Github username", checkUsername)
	.action((username) => {
		fetchUser(username);
	});

program.parse();
