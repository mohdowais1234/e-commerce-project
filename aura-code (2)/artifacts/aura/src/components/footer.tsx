export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16 md:py-24 mt-20 md:mt-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
          <div className="md:col-span-2 space-y-6">
            <h2 className="font-serif text-3xl md:text-4xl tracking-tight">Aura.</h2>
            <p className="max-w-md text-background/70 leading-relaxed font-sans text-sm md:text-base">
              Curated everyday objects for the considered home. We believe in the quiet luxury of form meeting function.
            </p>
          </div>
          
          <div className="space-y-6">
            <h3 className="font-sans text-xs uppercase tracking-widest font-medium text-background/50">Shop</h3>
            <ul className="space-y-4">
              <li><a href="/shop" className="text-background/80 hover:text-background transition-colors text-sm">All Products</a></li>
              <li><a href="/shop?category=home" className="text-background/80 hover:text-background transition-colors text-sm">Home</a></li>
              <li><a href="/shop?category=apparel" className="text-background/80 hover:text-background transition-colors text-sm">Apparel</a></li>
              <li><a href="/shop?category=accessories" className="text-background/80 hover:text-background transition-colors text-sm">Accessories</a></li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h3 className="font-sans text-xs uppercase tracking-widest font-medium text-background/50">Support</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-background/80 hover:text-background transition-colors text-sm">FAQ</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors text-sm">Shipping & Returns</a></li>
              <li><a href="#" className="text-background/80 hover:text-background transition-colors text-sm">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 md:mt-24 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-background/40">
          <p>&copy; {new Date().getFullYear()} Aura. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-background/80 transition-colors">Instagram</a>
            <a href="#" className="hover:text-background/80 transition-colors">Pinterest</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
