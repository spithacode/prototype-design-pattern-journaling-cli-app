import inquirer from "inquirer";
import { TemplateSection } from "./JournalTemplate";

export async function promptForSectionDetails(): Promise<TemplateSection> {
  const { title, prompt } = await inquirer.prompt<{
    title: string;
    prompt: string;
  }>([
    {
      type: "input",
      name: "title",
      message: "Enter section title:",
    },
    {
      type: "input",
      name: "prompt",
      message: "Enter section prompt:",
    },
  ]);
  return { title, prompt };
}

export async function promptForMoreSections(): Promise<boolean> {
  const { more } = await inquirer.prompt<{ more: boolean }>([
    {
      type: "confirm",
      name: "more",
      message: "Add another section?",
      default: false,
    },
  ]);
  return more;
}

export async function createSections(): Promise<TemplateSection[]> {
  const sections: TemplateSection[] = [];
  let addMore = true;

  while (addMore) {
    const section = await promptForSectionDetails();
    sections.push(section);
    addMore = await promptForMoreSections();
  }

  return sections;
}
