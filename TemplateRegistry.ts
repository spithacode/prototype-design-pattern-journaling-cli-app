import { JournalTemplate } from "./JournalTemplate";

export class TemplateRegistry {
  private templates: Map<string, JournalTemplate> = new Map();

  addTemplate(name: string, template: JournalTemplate): void {
    this.templates.set(name, template);
  }

  getTemplate(name: string): JournalTemplate | undefined {
    const template = this.templates.get(name);
    return template ? template.clone() : undefined;
  }

  getTemplateNames(): string[] {
    return Array.from(this.templates.keys());
  }
  getTemplates(): JournalTemplate[] {
    return Array.from(this.templates.values());
  }
}
