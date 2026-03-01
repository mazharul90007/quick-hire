import Navbar from "@/components/shared/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="bg-white dark:bg-zinc-950">{children}</main>
      {/* Footer can go here later */}
    </div>
  );
}
