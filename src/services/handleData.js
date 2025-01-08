import chalk from "chalk";

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

	messageArray
		.filter((data, index) => data !== messageArray[index + 1])
		.forEach((data) => console.log(chalk.green(data)));
};

export default handleData;
