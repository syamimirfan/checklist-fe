export type DashboardView =
  | "all"
  | "dueSoon"
  | "templates"
  | "assigned"
  | "workspace";

export interface DashboardPageProps {
  view: DashboardView;
}
