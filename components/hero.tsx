import NextLogo from "./icons/next-logo";
import SupabaseLogo from "./icons/supabase-logo";

export default function Header() {
  return (
    <div className="flex flex-col min-h-[360px] gap-16 justify-between items-center">
      <h1 className="font-semibold text-center text-4xl">
        Invoice Generator App
      </h1>

      <div className="flex gap-8 justify-center items-center">
        <a
          href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
          target="_blank"
          rel="noreferrer"
        >
          <SupabaseLogo />
        </a>

        <span className="border-l rotate-45 h-6" />

        <a href="https://nextjs.org/" target="_blank" rel="noreferrer">
          <NextLogo />
        </a>
      </div>

      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent my-8" />
    </div>
  );
}
