import Base404 from "@/components/404/Base404";

export default function StoreNotFound() {
  return (
    <Base404
      title="not logged in"
      message="you're not logged in dawg lmao"
      actionText="log in"
      actionHref="/login/roblox"
    />
  );
} 