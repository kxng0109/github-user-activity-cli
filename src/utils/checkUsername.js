import errorHandler from "./errorHandler.js";

const checkUsername = (value, previous) => {
	const userNameRegex = /^[a-zA-Z0-9](?:-?[a-zA-Z0-9]){0,38}$/;
	value = value.trim();
	const test = userNameRegex.test(value);
	if (!test) {
		errorHandler("Invalid username");
	}
	return value;
};

export default checkUsername;