import chalk from "chalk";

const errorHandler = (message, exit = true) => {
	console.error(chalk.bold.red(message));
	if (exit) {
		process.exit(1);
	}
};

export default errorHandler;