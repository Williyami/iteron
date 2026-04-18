import { Header } from "@/components/Header";

const Dashboard = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Header />
    <main className="max-w-[1280px] mx-auto px-6 md:px-10 py-24">
      <div className="text-[11px] uppercase tracking-[0.3em] text-amber mb-6">
        Iteron AI · Control Panel
      </div>
      <h1 className="font-display text-5xl md:text-7xl text-paper leading-[1.02] max-w-3xl">
        The dashboard is being typeset.
      </h1>
      <p className="mt-6 text-muted-foreground max-w-xl">
        Soon: live experiment graphs, segment performance, and config history.
        For now, use the ⚡ Iteron pill on the storefront to run a loop.
      </p>
    </main>
  </div>
);

export default Dashboard;
