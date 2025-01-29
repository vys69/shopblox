import Base404 from "@/components/404/Base404";

export default function ProfileNotFound() {
  return (
    <Base404
      title="Profile Not Found"
      message="This user profile doesn't exist or has been removed."
      actionText="Browse Users"
      actionHref="/users"
    />
  );
} 