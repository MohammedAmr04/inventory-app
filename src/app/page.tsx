import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/constants";

export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}/dashboard`);
}
