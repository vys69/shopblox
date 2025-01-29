import Base404 from "@/components/404/Base404";

export default function GlobalNotFound() {
  return (
    <Base404
      title="Page Not Found"
      message="The page you're looking for doesn't exist."
      actionText="Return Home"
      actionHref="/"
    />
  );
} 