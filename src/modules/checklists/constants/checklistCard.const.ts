export const templateBadge = "Template";
export const progressLabel = "Progress";
export const noItemsText = "No items yet";
export const progressText = (done: number, total: number) =>
  `${done} of ${total} completed`;
export const overdueText = (date: string) => `Overdue · ${date}`;
export const dueText = (date: string) => `Due ${date}`;
