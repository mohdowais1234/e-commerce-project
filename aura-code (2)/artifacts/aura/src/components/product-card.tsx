import { Link } from "wouter";
import { type Product } from "@workspace/api-client-react";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="group block cursor-pointer">
      <div className="relative aspect-[4/5] mb-4 overflow-hidden bg-muted">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
            No Image
          </div>
        )}
        {product.imageUrl2 && (
          <img
            src={product.imageUrl2}
            alt={`${product.name} alternate view`}
            className="absolute inset-0 object-cover w-full h-full opacity-0 transition-opacity duration-700 ease-in-out group-hover:opacity-100"
          />
        )}
      </div>
      <div className="space-y-1">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-serif text-lg leading-tight text-foreground truncate">
            {product.name}
          </h3>
          <span className="text-sm font-medium tracking-wide">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <p className="text-sm text-foreground/60 capitalize tracking-wider">
          {product.category}
        </p>
      </div>
    </Link>
  );
}
