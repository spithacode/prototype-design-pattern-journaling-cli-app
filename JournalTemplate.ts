import chalk from "chalk";

export interface TemplateSection {
  title: string;
  prompt: string;
}

export class JournalTemplate {
  constructor(
    public name: string,
    public sections: TemplateSection[],
  ) {}

  clone(): JournalTemplate {
    return new JournalTemplate(
      this.name,
      this.sections.map((s) => ({ ...s })),
    );
  }

  display(): void {
    console.log(chalk.cyan(`\nTemplate: ${this.name}`));
    this.sections.forEach((section, index) => {
      console.log(chalk.yellow(`${index + 1}. ${section.title}`));
      console.log(chalk.gray(`   Prompt: ${section.prompt}`));
    });
  }

  addSection(section: TemplateSection): void {
    this.sections.push(section);
  }

  removeSection(index: number): void {
    if (index >= 0 && index < this.sections.length) {
      this.sections.splice(index, 1);
    } else {
      throw new Error("Invalid section index");
    }
  }

  editSection(index: number, newSection: TemplateSection): void {
    if (index >= 0 && index < this.sections.length) {
      this.sections[index] = newSection;
    } else {
      throw new Error("Invalid section index");
    }
  }

  getSectionCount(): number {
    return this.sections.length;
  }

  getSection(index: number): TemplateSection | undefined {
    return this.sections[index];
  }

  setName(newName: string): void {
    this.name = newName;
  }
}
