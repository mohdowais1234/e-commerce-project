import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@workspace/replit-auth-web";
import { 
  useCreateOrder, 
  useCreateRazorpayOrder, 
  useVerifyRazorpayPayment 
} from "@workspace/api-client-react";
import { Plus, Minus, X, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Helper to load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function Cart() {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const createOrder = useCreateOrder();
  const createRazorpayOrder = useCreateRazorpayOrder();
  const verifyPayment = useVerifyRazorpayPayment();

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Sign in required",
        description: "Please sign in to complete your purchase.",
      });
      setLocation("/sign-in");
      return;
    }

    if (items.length === 0) return;

    try {
      setIsCheckingOut(true);

      // 1. Create order in our system
      const order = await createOrder.mutateAsync({
        data: {
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
          })),
          total,
        },
      });

      // 2. Create Razorpay order
      const rpOrder = await createRazorpayOrder.mutateAsync({
        data: {
          amount: order.total,
          orderId: order.id,
        },
      });

      // 3. Load script
      const res = await loadRazorpayScript();
      if (!res) {
        throw new Error("Razorpay SDK failed to load. Are you online?");
      }

      // 4. Open Razorpay modal
      const options = {
        key: rpOrder.keyId,
        amount: rpOrder.amount.toString(),
        currency: rpOrder.currency,
        name: "Aura.",
        description: "Aura E-Commerce Purchase",
        order_id: rpOrder.razorpayOrderId,
        handler: async function (response: any) {
          try {
            // 5. Verify payment
            await verifyPayment.mutateAsync({
              data: {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                orderId: order.id,
              },
            });

            toast({
              title: "Payment Successful",
              description: "Your order has been placed.",
            });
            clearCart();
            setLocation("/orders");
          } catch (err) {
            toast({
              variant: "destructive",
              title: "Payment Verification Failed",
              description: "We could not verify your payment. Please contact support.",
            });
          }
        },
        theme: {
          color: "#1a1a1a",
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on("payment.failed", function (response: any) {
        toast({
          variant: "destructive",
          title: "Payment Failed",
          description: response.error.description,
        });
      });
      rzp1.open();
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Checkout Error",
        description: err.message || "An unexpected error occurred during checkout.",
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <h1 className="font-serif text-4xl mb-6">Your bag is empty</h1>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 border border-foreground px-8 py-4 text-sm uppercase tracking-widest font-medium hover:bg-foreground hover:text-background transition-colors"
        >
          Return to Shop <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto px-4 md:px-6 py-12 md:py-24">
      <h1 className="font-serif text-4xl md:text-5xl tracking-tight mb-12">Your Bag</h1>

      <div className="flex flex-col lg:flex-row gap-16">
        <div className="flex-1 space-y-8">
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border text-xs uppercase tracking-widest text-foreground/50 font-medium">
            <div className="col-span-6">Product</div>
            <div className="col-span-3 text-center">Quantity</div>
            <div className="col-span-3 text-right">Total</div>
          </div>

          <div className="space-y-8 md:space-y-0 md:divide-y md:divide-border/50">
            {items.map((item) => (
              <div key={item.productId} className="md:py-8 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="col-span-1 md:col-span-6 flex gap-6 items-center">
                  <Link href={`/product/${item.productId}`} className="w-24 h-32 shrink-0 bg-muted overflow-hidden block">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </Link>
                  <div>
                    <Link href={`/product/${item.productId}`} className="font-serif text-xl md:text-2xl hover:text-foreground/70 transition-colors block mb-2">
                      {item.name}
                    </Link>
                    <p className="text-foreground/60 text-sm">${item.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="col-span-1 md:col-span-3 flex md:justify-center items-center gap-4">
                  <div className="flex items-center border border-border w-fit">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-3 hover:bg-muted transition-colors text-foreground/60 hover:text-foreground"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-3 hover:bg-muted transition-colors text-foreground/60 hover:text-foreground"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.productId)}
                    className="md:hidden text-xs uppercase tracking-widest text-foreground/50 hover:text-foreground underline underline-offset-4"
                  >
                    Remove
                  </button>
                </div>

                <div className="col-span-1 md:col-span-3 flex justify-between md:block text-right">
                  <span className="md:hidden text-foreground/50 text-sm">Total:</span>
                  <div className="flex items-center justify-end gap-4">
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                    <button 
                      onClick={() => removeFromCart(item.productId)}
                      className="hidden md:block p-2 text-foreground/30 hover:text-destructive transition-colors"
                      aria-label="Remove item"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-96 shrink-0">
          <div className="bg-muted/50 p-8 space-y-6 border border-border/50 sticky top-32">
            <h2 className="font-serif text-2xl tracking-tight">Order Summary</h2>
            
            <div className="space-y-4 text-sm border-b border-border/50 pb-6">
              <div className="flex justify-between">
                <span className="text-foreground/70">Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground/70">Shipping</span>
                <span>Calculated at checkout</span>
              </div>
            </div>
            
            <div className="flex justify-between items-end pt-2">
              <span className="uppercase tracking-widest text-xs font-medium">Estimated Total</span>
              <span className="font-serif text-3xl">${total.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full bg-primary text-primary-foreground py-5 text-sm uppercase tracking-widest font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 mt-6"
            >
              {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
            </button>
            
            {!isAuthenticated && (
              <p className="text-center text-xs text-foreground/50 mt-4">
                You will be asked to sign in securely via Replit before payment.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
