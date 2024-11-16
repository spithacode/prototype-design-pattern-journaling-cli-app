import { JournalTemplate } from "./JournalTemplate";
import { TemplateRegistry } from "./TemplateRegistry";

export const registry = new TemplateRegistry();

// Initialize registry with some default templates
registry.addTemplate(
  "Daily Reflection",
  new JournalTemplate("Daily Reflection", [
    {
      title: "Gratitude",
      prompt: "List three things you're grateful for today.",
    },
    { title: "Accomplishments", prompt: "What did you accomplish today?" },
    {
      title: "Challenges",
      prompt: "What challenges did you face and how did you overcome them?",
    },
    {
      title: "Tomorrow's Goals",
      prompt: "What are your top 3 priorities for tomorrow?",
    },
  ]),
);

registry.addTemplate(
  "Weekly Review",
  new JournalTemplate("Weekly Review", [
    { title: "Highlights", prompt: "What were the highlights of your week?" },
    {
      title: "Lessons Learned",
      prompt: "What important lessons did you learn this week?",
    },
    {
      title: "Progress on Goals",
      prompt: "How did you progress towards your goals this week?",
    },
    {
      title: "Next Week's Focus",
      prompt: "What's your main focus for next week?",
    },
  ]),
);
