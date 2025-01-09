import chalk from "chalk";
import getRepoName from "../utils/getRepoName.js";

const EVENTS= Object.freeze({
	PUSH: "PushEvent",
	PUBLIC: "PublicEvent",
	WATCH: "WatchEvent",
	CREATE: "CreateEvent",
	ISSUE_COMMENT: "IssueCommentEvent",
	ISSUE: "IssuesEvent",
	PULL: "PullRequestEvent",
	FORK: "ForkEvent"
})


const handleData = (jsonData) => {
	let prevActivity = {};
	let messageArray = [];

	const getMessage = (data) => {
		let repoName = data.repo.name;
		
		switch (data.type) {
			case EVENTS.PUSH:
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
			case EVENTS.PUBLIC:
				repoName = getRepoName(repoName);
				return `- Made thier repository, "${repoName}", public`;
			case EVENTS.WATCH:
				return `- Started watching the repository ${repoName}`;
			case EVENTS.CREATE:
				if (!data.payload.ref) {
					repoName = getRepoName(repoName);
					return `- Created the repository "${repoName}"`;
				}
				break;
			case EVENTS.ISSUE_COMMENT:
				return `- Commented on an issue in ${repoName}`;
			case EVENTS.ISSUE:
				if (data.payload.action === "created") {
					return `- Created an issue in ${repoName}`;
				} else {
					return `- Issue in ${repoName} was ${data.payload.action}`;
				}
			case EVENTS.PULL:
				return `- Opened a pull request in ${repoName}`;
			case EVENTS.FORK:
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

	messageArray
		.filter((data, index) => data !== messageArray[index + 1])
		.forEach((data) => console.log(chalk.green(data)));
};

export default handleData;
