import { useGetProduct, getGetProductQueryKey } from "@workspace/api-client-react";
import { useParams } from "wouter";
import { useCart } from "@/contexts/cart-context";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Plus, Minus } from "lucide-react";

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const productId = parseInt(params.id || "0", 10);
  
  const { data: product, isLoading, error } = useGetProduct(productId, { 
    query: { enabled: !!productId, queryKey: getGetProductQueryKey(productId) } 
  });
  
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-12 md:py-24 animate-pulse flex flex-col md:flex-row gap-12 lg:gap-24">
        <div className="flex-1 aspect-[4/5] bg-muted" />
        <div className="flex-1 space-y-8 py-12">
          <div className="h-10 bg-muted w-3/4" />
          <div className="h-6 bg-muted w-1/4" />
          <div className="h-32 bg-muted w-full" />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-foreground/60 text-lg">Product not found.</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      imageUrl: product.imageUrl,
    });
    
    toast({
      title: "Added to cart",
      description: `${quantity} × ${product.name} added to your bag.`,
    });
  };

  return (
    <div className="min-h-screen container mx-auto px-4 md:px-6 py-12 md:py-24">
      <div className="flex flex-col md:flex-row gap-12 lg:gap-24 items-start">
        {/* Images */}
        <div className="w-full md:w-1/2 space-y-8">
          <div className="aspect-[4/5] bg-muted w-full overflow-hidden">
            {product.imageUrl ? (
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-foreground/30">No Image</div>
            )}
          </div>
          {product.imageUrl2 && (
            <div className="aspect-[4/5] bg-muted w-full overflow-hidden hidden md:block">
              <img 
                src={product.imageUrl2} 
                alt={`${product.name} alternate view`}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Details */}
        <div className="w-full md:w-1/2 sticky top-32 space-y-10">
          <div>
            <p className="text-xs uppercase tracking-widest font-medium text-foreground/50 mb-4">
              {product.category}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-4">{product.name}</h1>
            <p className="text-2xl font-light">${product.price.toFixed(2)}</p>
          </div>

          <div className="prose prose-neutral text-foreground/80 leading-relaxed font-light">
            <p>{product.description}</p>
          </div>

          <div className="pt-8 border-t border-border space-y-6">
            <div className="flex items-center gap-6">
              <span className="text-sm uppercase tracking-widest text-foreground/60">Quantity</span>
              <div className="flex items-center border border-border">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-4 hover:bg-muted transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-4 hover:bg-muted transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-primary text-primary-foreground py-5 text-sm uppercase tracking-widest font-medium hover:bg-primary/90 transition-colors"
            >
              Add to Cart — ${(product.price * quantity).toFixed(2)}
            </button>
          </div>

          <div className="pt-8 text-sm text-foreground/50 space-y-3 flex flex-col">
            <p>Free standard shipping on orders over $150.</p>
            <p>Returns accepted within 30 days of delivery.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
