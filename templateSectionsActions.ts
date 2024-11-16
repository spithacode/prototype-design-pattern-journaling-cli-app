import inquirer from "inquirer";
import { JournalTemplate } from "./JournalTemplate";
import { promptForSectionDetails } from "./utils";
import chalk from "chalk";

export async function editTemplateSections(
  template: JournalTemplate,
): Promise<void> {
  let editSections = true;
  while (editSections) {
    const { action } = await inquirer.prompt<{ action: string }>([
      {
        type: "list",
        name: "action",
        message: "What would you like to do with the sections?",
        choices: ["Add Section", "Remove Section", "Edit Section", "Finish"],
      },
    ]);

    switch (action) {
      case "Add Section":
        const newSection = await promptForSectionDetails();
        template.addSection(newSection);
        break;
      case "Remove Section":
        await removeSectionFromTemplate(template);
        break;
      case "Edit Section":
        await editSectionInTemplate(template);
        break;
      case "Finish":
        editSections = false;
        break;
    }
  }
}

async function removeSectionFromTemplate(
  template: JournalTemplate,
): Promise<void> {
  const { sectionToRemove } = await inquirer.prompt<{
    sectionToRemove: number;
  }>([
    {
      type: "number",
      name: "sectionToRemove",
      message: "Enter the number of the section to remove:",
    },
  ]);
  try {
    template.removeSection(sectionToRemove - 1);
  } catch (error) {
    console.log(chalk.red("Error: Invalid section number."));
  }
}

async function editSectionInTemplate(template: JournalTemplate): Promise<void> {
  const { sectionToEdit } = await inquirer.prompt<{
    sectionToEdit: number;
  }>([
    {
      type: "number",
      name: "sectionToEdit",
      message: "Enter the number of the section to edit:",
    },
  ]);

  const currentSection = template.getSection(sectionToEdit - 1);
  if (currentSection) {
    const { newTitle, newPrompt } = await inquirer.prompt<{
      newTitle: string;
      newPrompt: string;
    }>([
      {
        type: "input",
        name: "newTitle",
        message: "Enter new title for the section:",
        default: currentSection.title,
      },
      {
        type: "input",
        name: "newPrompt",
        message: "Enter new prompt for the section:",
        default: currentSection.prompt,
      },
    ]);
    try {
      template.editSection(sectionToEdit - 1, {
        title: newTitle,
        prompt: newPrompt,
      });
    } catch (error) {
      console.log(chalk.red("Error: Invalid section number."));
    }
  } else {
    console.log(chalk.red("Error: Invalid section number."));
  }
}
