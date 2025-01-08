import { request } from "https";
import errorHandler from "../utils/errorHandler.js";
import handleData from "./handleData.js";

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
		if (res.statusCode !== 200) {
			errorHandler(
				`Error occured while trying to fetch users details. Status: ${res.statusCode}`,
			);
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

export default fetchUser;
