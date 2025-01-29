import Base404 from "@/components/404/Base404";

export default function StoreNotFound() {
  return (
    <Base404
      title="Store Not Found"
      message="This store might have been deleted or never existed."
      actionText="Browse Stores"
      actionHref="/browse"
    />
  );
} 