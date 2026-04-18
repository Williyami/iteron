import { Header } from "@/components/Header";

const About = () => (
  <div className="min-h-screen bg-background text-foreground">
    <Header />
    <main className="max-w-[1280px] mx-auto px-6 md:px-10 py-24">
      <div className="text-[11px] uppercase tracking-[0.3em] text-amber mb-6">Colophon</div>
      <h1 className="font-display text-5xl md:text-7xl text-paper leading-[1.02] max-w-3xl">
        A bookshop that <span className="italic text-amber-soft">reads you back.</span>
      </h1>
      <p className="mt-8 text-lg text-muted-foreground max-w-2xl leading-relaxed">
        PageTurn is a small editorial experiment: a curated shelf of fiction, a
        soft layer of intelligence, and the belief that recommending a book is
        still a craft worth taking seriously.
      </p>
    </main>
  </div>
);

export default About;
