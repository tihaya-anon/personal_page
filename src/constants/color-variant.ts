export type ColorVariant =
  | "primary"
  | "accent"
  | "secondary"
  | "danger"
  | "warning"
  | "success"
  | "info"
  | "text"
  | "muted"
  | "border"
  | "default";
export default function getColorClass(variant: ColorVariant): string {
  switch (variant) {
    case "primary":
      return "stroke-primary";
    case "accent":
      return "stroke-accent";
    case "secondary":
      return "stroke-secondary";
    case "danger":
      return "stroke-destructive";
    case "warning":
      return "stroke-chart-2";
    case "success":
      return "stroke-chart-3";
    case "info":
      return "stroke-chart-4";
    case "text":
      return "stroke-foreground";
    case "muted":
      return "stroke-muted-foreground";
    case "border":
      return "stroke-border";
    default:
      return "";
  }
}
