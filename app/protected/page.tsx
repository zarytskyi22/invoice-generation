import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const LINKS = [
  { href: "/protected/profile", label: "Profile page" },
  { href: "/protected/help", label: "Help page" },
  { href: "/protected/invoices", label: "Invoices" },
  { href: "/protected/invoices/new", label: "Generate invoice" },
];

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col">
      <div className="bg-accent text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
        <InfoIcon size="16" strokeWidth={2} />
        Protected page
      </div>

      <h2 className="mt-10">Navigation:</h2>

      <ul className="mt-5">
        {LINKS.map(({ label, href }) => (
          <li key={label}>
            -{" "}
            <Link className="text-blue-500 hover:text-gray-500" href={href}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
