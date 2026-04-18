import { Header } from "@/components/Header";
import { IrisHud } from "@/components/IrisHud";

const About = () => (
  <div className="min-h-screen bg-background">
    <Header />
    <main className="container py-20">
      <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">About</div>
      <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight max-w-3xl">
        A bookshop that reads you back.
      </h1>
      <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
        PageTurn is a curated fiction catalogue with a soft layer of intelligence
        underneath. Iteron AI watches engagement, identifies what isn't working,
        and quietly retunes the shelves — no human in the loop.
      </p>
    </main>
    <IrisHud site="pageturn" />
  </div>
);

export default About;
