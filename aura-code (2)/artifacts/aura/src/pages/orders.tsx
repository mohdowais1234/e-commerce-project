import { useListOrders, getListOrdersQueryKey } from "@workspace/api-client-react";
import { useAuth } from "@workspace/replit-auth-web";
import { Link } from "wouter";
import { format } from "date-fns";

export default function Orders() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { data: orders, isLoading: ordersLoading } = useListOrders({
    query: { enabled: isAuthenticated, queryKey: getListOrdersQueryKey() }
  });

  if (authLoading || (isAuthenticated && ordersLoading)) {
    return (
      <div className="min-h-[60vh] container mx-auto px-4 py-24">
        <h1 className="font-serif text-4xl mb-12">My Orders</h1>
        <div className="space-y-6 animate-pulse">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-muted w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center space-y-8">
        <h1 className="font-serif text-4xl">Sign In Required</h1>
        <p className="text-foreground/60 max-w-md">Please sign in to view your order history.</p>
        <Link 
          href="/sign-in" 
          className="bg-primary text-primary-foreground px-8 py-4 text-sm uppercase tracking-widest font-medium hover:bg-primary/90 transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto px-4 md:px-6 py-12 md:py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl tracking-tight mb-12">My Orders</h1>

        {!orders || orders.length === 0 ? (
          <div className="text-center py-24 border border-border/50 bg-muted/30">
            <p className="text-foreground/50 mb-6">You haven't placed any orders yet.</p>
            <Link 
              href="/shop" 
              className="inline-block border border-primary text-primary px-8 py-3 text-sm uppercase tracking-widest font-medium hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-12">
            {orders.map((order) => (
              <div key={order.id} className="border border-border">
                <div className="bg-muted px-6 py-4 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-border text-sm">
                  <div>
                    <p className="text-foreground/50 uppercase tracking-widest text-xs mb-1">Order Placed</p>
                    <p>{order.createdAt ? format(new Date(order.createdAt), 'MMMM d, yyyy') : 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-foreground/50 uppercase tracking-widest text-xs mb-1">Total</p>
                    <p>${order.total.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-foreground/50 uppercase tracking-widest text-xs mb-1">Order #</p>
                    <p className="font-mono text-xs">{order.id.toString().padStart(6, '0')}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 bg-background border border-border text-xs uppercase tracking-widest font-medium">
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <ul className="divide-y divide-border/50">
                    {order.items.map((item, idx) => (
                      <li key={idx} className="py-4 flex justify-between items-center group">
                        <Link href={`/product/${item.productId}`} className="flex-1 hover:underline decoration-foreground/30 underline-offset-4">
                          <span className="font-serif text-lg">{item.name}</span>
                        </Link>
                        <div className="text-right text-foreground/60 text-sm">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
