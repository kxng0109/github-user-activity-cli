import chalk from "chalk";
import getRepoName from "../utils/getRepoName.js";

const EVENTS = Object.freeze({
	COMMIT_COMMENT: "CommitCommentEvent",
	CREATE: "CreateEvent",
	DELETE: "DeleteEvent",
	FORK: "ForkEvent",
	GOLLUM: "GollumEvent",
	ISSUE: "IssuesEvent",
	ISSUE_COMMENT: "IssueCommentEvent",
	MEMBER: "MemberEvent",
	PUBLIC: "PublicEvent",
	PULL: "PullRequestEvent",
	PULL_REVIEW: "PullRequestReviewEvent",
	PULL_REVIEW_COMMENT: "PullRequestReviewCommentEvent",
	PUSH: "PushEvent",
	RELEASE: "ReleaseEvent",
	SPONSORSHIP: "SponsorshipEvent",
	WATCH: "WatchEvent",
});

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
			case EVENTS.PULL_REVIEW:
				const actionType = [
					"opened",
					"edited",
					"closed",
					"reopened",
					"created",
				];
				if (actionType.includes(data.payload.action)) {
					return `- Pull request${data.type === EVENTS.PULL_REVIEW ? " review" : ""} in ${repoName} was ${data.payload.action}`;
				} else {
					return `- Action performed on their pull request in ${repoName}`;
				}
			case EVENTS.FORK:
				return `- Forked the repository ${repoName}`;
			case EVENTS.COMMIT_COMMENT:
				return `- Created a commit comment in ${repoName}`;
			case EVENTS.DELETE:
				return `- Deleted their git ${data.payload.ref_type}`;
			case EVENTS.RELEASE:
				return `- ${data.payload.action} a release in ${repoName}`;
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
