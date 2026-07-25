import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { DemoCanvas } from "@/components/sections/DemoCanvas";
import { Verticals } from "@/components/sections/Verticals";
import { SolutionPacks } from "@/components/sections/SolutionPacks";
import { Trust } from "@/components/sections/Trust";
import { BookDemo } from "@/components/sections/BookDemo";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <DemoCanvas />
        <Verticals />
        <SolutionPacks />
        <Trust />
        <BookDemo />
      </main>
      <Footer />
    </>
  );
}
