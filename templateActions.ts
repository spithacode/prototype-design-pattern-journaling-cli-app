import inquirer from "inquirer";
import chalk from "chalk";
import { JournalTemplate } from "./JournalTemplate";
import { registry } from "./registry";
import { promptForSectionDetails } from "./utils";
import { editTemplateSections } from "./templateSectionsActions";
import fs from "fs";
import path from "path";

export async function createTemplate(): Promise<void> {
  const { name } = await inquirer.prompt<{ name: string }>([
    {
      type: "input",
      name: "name",
      message: "Enter a name for the new template:",
    },
  ]);

  const newTemplate = new JournalTemplate(name, []);
  let addMore = true;
  while (addMore) {
    const newSection = await promptForSectionDetails();
    newTemplate.addSection(newSection);
    const { more } = await inquirer.prompt<{ more: boolean }>([
      {
        type: "confirm",
        name: "more",
        message: "Add another section?",
        default: false,
      },
    ]);
    addMore = more;
  }

  registry.addTemplate(name, newTemplate);
  console.log(chalk.green(`Template "${name}" created successfully!`));
}

export async function createFromExistingTemplate(): Promise<void> {
  const allTemplates = registry.getTemplateNames();

  const { sourceName, newName } = await inquirer.prompt<{
    sourceName: string;
    newName: string;
  }>([
    {
      type: "list",
      name: "sourceName",
      message: "Select a template to use as a base:",
      choices: allTemplates,
    },
    {
      type: "input",
      name: "newName",
      message: "Enter a name for the new template:",
    },
  ]);

  const sourceTemplate = registry.getTemplate(sourceName);

  if (sourceTemplate) {
    const newTemplate = sourceTemplate.clone();
    newTemplate.setName(newName);

    await editTemplateSections(newTemplate);

    registry.addTemplate(newName, newTemplate);
    console.log(
      chalk.green(
        `New template "${newName}" created based on "${sourceName}" successfully!`,
      ),
    );
  } else {
    console.log(chalk.red(`Error: Template "${sourceName}" not found.`));
  }
}

export async function viewTemplates(): Promise<void> {
  const allTemplates = registry.getTemplates();

  if (allTemplates.length === 0) {
    console.log(chalk.yellow("No templates available."));
    return;
  }

  console.log(chalk.blue.bold("\nAvailable Templates:"));
  allTemplates.forEach((template, index) => {
    console.log(chalk.cyan(`\nTemplate #${index + 1}: ${template.name}`));
    template.display();
  });

  await inquirer.prompt<{ continue: string }>([
    {
      type: "input",
      name: "continue",
      message: "Press Enter to continue...",
    },
  ]);
}

export async function useTemplate(): Promise<void> {
  const allTemplates = registry.getTemplateNames();

  const { templateName } = await inquirer.prompt<{ templateName: string }>([
    {
      type: "list",
      name: "templateName",
      message: "Select a template to use:",
      choices: allTemplates,
    },
  ]);

  const template = registry.getTemplate(templateName);

  if (template) {
    console.log(chalk.green(`\nUsing template: ${template.name}`));
    let journalContent = `# ${template.name} - Journal Entry\n\n`;

    for (let i = 0; i < template.getSectionCount(); i++) {
      const section = template.getSection(i);
      if (section) {
        console.log(chalk.yellow(`\n${section.title}`));
        console.log(chalk.gray(`${section.prompt}`));

        const { entry } = await inquirer.prompt<{ entry: string }>([
          {
            type: "editor",
            name: "entry",
            message:
              "Write your entry (save and close the editor when finished):",
          },
        ]);

        journalContent += `## ${section.title}\n\n`;
        journalContent += `**Prompt:** ${section.prompt}\n\n`;
        journalContent += `${entry}\n\n`;
      }
    }

    // Create directory if it doesn't exist
    const dirPath = path.join(process.cwd(), template.name);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Generate filename with current date
    const date = new Date();
    const dateString = date.toISOString().split("T")[0]; // YYYY-MM-DD format
    const fileName = `${template.name}-${dateString}.md`;
    const filePath = path.join(dirPath, fileName);

    // Write content to file
    fs.writeFileSync(filePath, journalContent);

    console.log(chalk.green("\nJournal entry completed!"));
    console.log(chalk.green(`Saved to: ${filePath}`));
  } else {
    console.log(chalk.red(`Error: Template "${templateName}" not found.`));
  }
}
