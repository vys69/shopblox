import Base404 from "@/components/404/Base404";

export default function BrowseNotFound() {
  return (
    <Base404
      title="No Stores Found"
      message="There are no stores available at the moment."
      actionText="Return Home"
      actionHref="/"
      image="/stores/404.png"
    />
  );
} 