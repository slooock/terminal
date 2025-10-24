import Terminal from "./components/Terminal";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="w-full max-w-3xl">
        <Terminal />
      </main>
    </div>
  );
}
