import { useState, useMemo } from "react";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { ProductCard } from "@/components/product-card";
import { cn } from "@/lib/utils";

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const { data: allProducts, isLoading: productsLoading } = useListProducts({});
  const { data: categories, isLoading: categoriesLoading } = useListCategories();

  const displayedProducts = useMemo(() => {
    if (!allProducts) return [];
    if (!activeCategory) return allProducts;
    return allProducts.filter((p) => p.category === activeCategory);
  }, [allProducts, activeCategory]);

  return (
    <div className="min-h-screen container mx-auto px-4 md:px-6 py-12 md:py-24">
      <div className="mb-16">
        <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">The Collection</h1>
        <p className="text-foreground/60 max-w-lg text-lg">
          Explore our full range of thoughtfully considered lifestyle objects.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-12 md:gap-24">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-48 shrink-0 space-y-8">
          <div>
            <h3 className="text-xs uppercase tracking-widest font-medium text-foreground/50 mb-6">
              Categories
            </h3>
            {categoriesLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-muted w-24" />
                <div className="h-4 bg-muted w-32" />
                <div className="h-4 bg-muted w-20" />
              </div>
            ) : (
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => setActiveCategory(null)}
                    className={cn(
                      "text-sm tracking-wide capitalize transition-colors hover:text-foreground",
                      activeCategory === null ? "text-foreground font-medium" : "text-foreground/60"
                    )}
                  >
                    All Products
                  </button>
                </li>
                {categories?.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setActiveCategory(cat.slug)}
                      className={cn(
                        "text-sm tracking-wide capitalize transition-colors hover:text-foreground",
                        activeCategory === cat.slug ? "text-foreground font-medium" : "text-foreground/60"
                      )}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 animate-pulse">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="aspect-[4/5] bg-muted w-full" />
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="py-24 text-center text-foreground/50">
              No products found in this category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
