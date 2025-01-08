import { Command } from "commander";
import activityCommand from "./src/commands/githubActivity.js";
const program = new Command();

program.addCommand(activityCommand);

program.parse();
