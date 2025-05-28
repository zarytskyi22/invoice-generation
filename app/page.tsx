import Hero from "@/components/hero";

export default async function Home() {
  return (
    <>
      <Hero />
      <main className="flex-1 text-center flex flex-col gap-6 px-4">
        Home Page
      </main>
    </>
  );
}
