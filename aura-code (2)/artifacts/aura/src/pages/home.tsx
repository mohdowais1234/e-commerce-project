import { Link } from "wouter";
import { useListProducts } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import heroImg from "@assets/generated_images/hero-editorial.jpg";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const { data: products, isLoading } = useListProducts({ featured: true });

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src={heroImg}
            alt="Aura Minimalist Collection"
            className="w-full h-full object-cover object-center animate-in fade-in duration-[2000ms]"
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-primary-foreground mb-6 tracking-tight leading-none animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-150 fill-mode-both">
            Objects for<br />Everyday Living.
          </h1>
          <p className="text-primary-foreground/90 font-sans text-lg md:text-xl max-w-lg mb-10 font-light tracking-wide animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-300 fill-mode-both">
            Curated essentials designed with intention. Bring quiet luxury into your home.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-8 py-4 text-sm uppercase tracking-widest font-medium hover:bg-primary-foreground/90 transition-colors duration-300 animate-in slide-in-from-bottom-8 fade-in duration-1000 delay-500 fill-mode-both"
          >
            Shop the Collection <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 md:py-32 px-4 md:px-6 container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-4">Featured Additions</h2>
            <p className="text-foreground/60 max-w-md">
              Our newest arrivals, crafted from natural materials and built to stand the test of time.
            </p>
          </div>
          <Link
            href="/shop"
            className="group flex items-center gap-2 text-sm uppercase tracking-widest font-medium pb-1 border-b border-foreground hover:text-foreground/70 hover:border-foreground/70 transition-colors"
          >
            View All <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/5] bg-muted w-full" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {products?.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Editorial Block */}
      <section className="py-24 md:py-32 bg-muted px-4 md:px-6">
        <div className="container mx-auto max-w-5xl text-center space-y-8">
          <h2 className="font-serif text-3xl md:text-5xl leading-tight">
            "We believe that the objects we interact with every day should bring a sense of calm and clarity."
          </h2>
          <p className="uppercase tracking-widest text-xs font-medium text-foreground/50">
            The Aura Philosophy
          </p>
        </div>
      </section>
    </div>
  );
}
