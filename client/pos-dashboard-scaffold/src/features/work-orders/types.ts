export type Priority = "low" | "medium" | "high";

export type Category = "Preventative" | "Meter Reading";

export type WorkOrder = {
  id: string;
  woNumber: string;
  title: string;
  assignee: { name: string; avatarUrl?: string };
  startDate: string; // ISO date
  dueDate: string; // ISO date or label like "Today"
  category: Category;
  priority: Priority;
  location: string;
  asset: string;
};
