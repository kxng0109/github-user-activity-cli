import chalk from "chalk";
import { Command } from "commander";
import { request } from "https";
const program = new Command();

const errorHandler = message =>{
	console.error(chalk.bold.red(message));
	process.exit(1);
}

const checkUsername = (value, previous) =>{
	const userNameRegex = /^[a-zA-Z0-9](?:-?[a-zA-Z0-9]){0,38}$/;
	value = value.trim();
	const test = userNameRegex.test(value);
	if(!test){errorHandler("Invalid username")};
	return value;
}

const accumulate = () =>{
	return 
}

const handleData = jsonData =>{
	jsonData.forEach((data, index) =>{
		if(data.type === "PushEvent"){
			let number = 1;
			// for(let _i = index; jsonData[_i].repo.name == data.repo.name && jsonData[_i].type == data.type; _i++){
			// 	console.log(_i, number)
			// 	number++;
			// }
			console.log(`- Pushed ${number} commits to ${data.repo.name}`)
		} else if(data.type === "PublicEvent"){
			const repoName = data.repo.name.split("/")[1];
			console.log(`- Made thier repository, "${repoName}", public`)
		} else if(data.type === "WatchEvent"){
			console.log(`- Started watching the repository ${data.repo.name}`)
		} else if(data.type === "CreateEvent" && !data.payload.ref){
			const repoName = data.repo.name.split("/")[1];
			console.log(`- Created the repository "${repoName}"`)
		} else if(data.type === "IssueCommentEvent"){
			console.log(`- Commented on an issue in ${data.repo.name}`)
		} else if(data.type === "IssuesEvent" && data.payload.action === "created"){
			console.log(`- Opened an issue in ${data.repo.name}`)
		} else if(data.type === "IssuesEvent" && data.payload.action){
			console.log(`- Issue created in ${data.repo.name} was ${data.payload.action}`)
		} else if(data.type === "PullRequestEvent"){
			console.log(`- Opened a pull request in ${data.repo.name}`)
		}
	})
}

const fetchUser = username =>{
	const options = {
		hostname: "api.github.com",
		path: `/users/${username}/events`,
		port: 443,
		method: "GET",
		headers:{
			"User-Agent": "node-app"
		}
	}

	request(options, res =>{
		if(res.statusCode == 404){
			errorHandler(`User with the username ${username} not found`);
		}

		let data = "";

		res.on("data", chunk => {
			data+=chunk
		});

		res.on("end", () =>{
			try{
				const jsonData = JSON.parse(data);
				handleData(jsonData)
			}catch(err){
				console.error("Error occured while parsing JSON: ", err.message)
			}
		})
	}).on("error", err =>{
		console.error(`Failed to fetch user details: ${err}`)
	}).end();
}


program
	.command("github-activity")
	.argument("<username>", "Github username", checkUsername)
	.action(username =>{
		fetchUser(username)
	})

program.parse();