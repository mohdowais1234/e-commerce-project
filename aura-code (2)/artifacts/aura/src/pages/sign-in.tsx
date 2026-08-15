import { useAuth } from "@workspace/replit-auth-web";

export default function SignIn() {
  const { login, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-pulse text-foreground/50 tracking-widest uppercase text-sm">
          Loading...
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center space-y-6">
          <p className="text-xl font-serif">You are already signed in.</p>
          <a href="/shop" className="inline-block bg-primary text-primary-foreground px-8 py-4 text-sm uppercase tracking-widest font-medium hover:bg-primary/90 transition-colors">
            Return to Shop
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md space-y-12 text-center">
        <div className="space-y-4">
          <h1 className="font-serif text-4xl tracking-tight">Sign In</h1>
          <p className="text-foreground/60 leading-relaxed">
            Access your order history and checkout faster. Authentication is securely handled by Replit.
          </p>
        </div>

        <button
          onClick={login}
          className="w-full bg-primary text-primary-foreground py-4 text-sm uppercase tracking-widest font-medium hover:bg-primary/90 transition-colors"
        >
          Sign In with Replit
        </button>

        <div className="pt-12 border-t border-border">
          <p className="text-xs text-foreground/40 uppercase tracking-widest">
            Aura Member Benefits
          </p>
          <ul className="mt-6 space-y-3 text-sm text-foreground/60">
            <li>Curated recommendations</li>
            <li>Early access to new collections</li>
            <li>Streamlined checkout process</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
