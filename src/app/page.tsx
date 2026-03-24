// Default page: redirects to /dashboard as Homepage fallback (removed from sidebar)
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/dashboard");
}
