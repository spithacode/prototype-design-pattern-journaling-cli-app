import inquirer from "inquirer";
import chalk from "chalk";
import {
  createTemplate,
  createFromExistingTemplate,
  viewTemplates,
  useTemplate,
} from "./templateActions";

async function mainMenu(): Promise<void> {
  const { action } = await inquirer.prompt<{ action: string }>([
    {
      type: "list",
      name: "action",
      message: "What would you like to do?",
      choices: [
        "Create Template",
        "Create a template from an existing template",
        "View Templates",
        "Use Template",
        "Exit",
      ],
    },
  ]);

  switch (action) {
    case "Create Template":
      await createTemplate();
      break;
    case "Create a template from an existing template":
      await createFromExistingTemplate();
      break;
    case "View Templates":
      await viewTemplates();
      break;
    case "Use Template":
      await useTemplate();
      break;
    case "Exit":
      console.log(
        chalk.yellow("Thank you for using the Journal Template Manager!"),
      );
      process.exit(0);
  }

  await mainMenu();
}

console.log(chalk.blue.bold("Welcome to the Journal Template Manager!"));
console.log(
  chalk.gray(
    "This tool demonstrates the Prototype pattern for managing journal templates.\n",
  ),
);

mainMenu();
