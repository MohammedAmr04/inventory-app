import { EmptyState } from "@/components/feedback/empty-state";

export default function NotFound() {
  return (
    <EmptyState
      title="Page not found"
      message="The page you are looking for does not exist."
    />
  );
}
