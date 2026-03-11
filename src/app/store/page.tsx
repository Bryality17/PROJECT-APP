"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { PRODUCTS } from "@/lib/mock-data";
import { Product, ProductCategory, CartItem } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import {
  ShoppingCart,
  Search,
  Plus,
  Minus,
  Trash2,
  X,
  Package,
  Wrench,
  Droplets,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Zap,
  ChevronRight,
} from "lucide-react";

// ─── Config ───────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<ProductCategory, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  roofing_materials: { label: "Roofing Materials", icon: Package,  color: "text-orange-700", bg: "bg-orange-50" },
  gutters:           { label: "Gutters & Drainage", icon: Droplets, color: "text-blue-700",   bg: "bg-blue-50"   },
  service_packages:  { label: "Service Packages",   icon: Wrench,   color: "text-violet-700", bg: "bg-violet-50" },
  addons:            { label: "Add-ons",             icon: Sparkles, color: "text-green-700",  bg: "bg-green-50"  },
};

// Org 1 products only (in a real app this would be derived from domain/slug)
const STORE_PRODUCTS = PRODUCTS.filter((p) => p.orgId === "org_1");

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StorePage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProductCategory | "all">("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  const filtered = useMemo(() => {
    return STORE_PRODUCTS.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || (p.tags ?? []).some((t) => t.includes(q));
      const matchCat = category === "all" || p.category === category;
      return matchSearch && matchCat;
    });
  }, [search, category]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { product, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function updateQty(productId: string, delta: number) {
    setCart((prev) => prev.map((i) => i.product.id === productId ? { ...i, quantity: i.quantity + delta } : i).filter((i) => i.quantity > 0));
  }

  function removeItem(productId: string) {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }

  const featured = STORE_PRODUCTS.filter((p) => p.featured && p.inStock);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
              <Zap className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-bold text-gray-900">Apex Roofing</span>
            <span className="text-gray-300 text-sm ml-1">/ Store</span>
          </div>
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="pl-9 pr-4 py-1.5 text-sm bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:bg-white focus:border-gray-300 w-56"
            />
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium rounded-lg transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero */}
        {!search && category === "all" && (
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 mb-8 text-white">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-80 mb-2">Apex Roofing Supply</p>
            <h1 className="text-2xl font-bold mb-2">Materials, services & more</h1>
            <p className="text-sm opacity-80 mb-5 max-w-md">Everything you need for your roofing project, from materials to maintenance plans.</p>
            <div className="flex flex-wrap gap-2">
              {featured.slice(0, 3).map((p) => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all"
                >
                  <Plus className="w-3.5 h-3.5" /> {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category filters */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          <button
            onClick={() => setCategory("all")}
            className={cn("px-3 py-1.5 rounded-full text-sm font-medium transition-all", category === "all" ? "bg-gray-900 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50")}
          >
            All
          </button>
          {(Object.keys(CATEGORY_CONFIG) as ProductCategory[]).map((cat) => {
            const cfg = CATEGORY_CONFIG[cat];
            const Icon = cfg.icon;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  category === cat ? `${cfg.bg} ${cfg.color} border border-current/20` : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                )}
              >
                <Icon className="w-3.5 h-3.5" /> {cfg.label}
              </button>
            );
          })}
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No products found</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product) => {
              const inCart = cart.find((i) => i.product.id === product.id);
              return <StoreProductCard key={product.id} product={product} inCart={inCart?.quantity ?? 0} onAdd={() => addToCart(product)} />;
            })}
          </div>
        )}
      </div>

      {/* Cart drawer backdrop */}
      {cartOpen && (
        <div className="fixed inset-0 z-40 bg-black/20" onClick={() => setCartOpen(false)} />
      )}

      {/* Cart drawer */}
      <div className={cn("fixed inset-y-0 right-0 z-50 w-80 bg-white shadow-2xl flex flex-col transition-transform duration-300", cartOpen ? "translate-x-0" : "translate-x-full")}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-gray-700" />
            <span className="text-sm font-semibold text-gray-900">Your Cart</span>
            {cartCount > 0 && (
              <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full">{cartCount} items</span>
            )}
          </div>
          <button onClick={() => setCartOpen(false)} className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400 p-6 text-center">
              <ShoppingCart className="w-10 h-10 opacity-20" />
              <p className="text-sm">Your cart is empty. Add some products!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {cart.map(({ product, quantity }) => {
                const cat = CATEGORY_CONFIG[product.category];
                const CatIcon = cat.icon;
                return (
                  <li key={product.id} className="px-4 py-3 flex gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5", cat.bg)}>
                      <CatIcon className={cn("w-4 h-4", cat.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 leading-snug">{product.name}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{formatCurrency(product.price)} /{product.unit}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => updateQty(product.id, -1)} className="w-6 h-6 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                          <Minus className="w-3 h-3 text-gray-600" />
                        </button>
                        <span className="text-xs font-semibold w-4 text-center">{quantity}</span>
                        <button onClick={() => updateQty(product.id, 1)} className="w-6 h-6 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center">
                          <Plus className="w-3 h-3 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => removeItem(product.id)} className="text-gray-300 hover:text-red-400 transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-bold text-gray-900">{formatCurrency(product.price * quantity)}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-bold text-gray-900">{formatCurrency(cartTotal)}</span>
            </div>
            <Link
              href={{ pathname: "/store/checkout", query: { cart: JSON.stringify(cart.map((i) => ({ id: i.product.id, qty: i.quantity }))) } }}
              className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg transition-all"
            >
              Checkout <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────

function StoreProductCard({ product, inCart, onAdd }: { product: Product; inCart: number; onAdd: () => void }) {
  const cat = CATEGORY_CONFIG[product.category];
  const CatIcon = cat.icon;

  return (
    <div className={cn("bg-white rounded-xl border shadow-sm flex flex-col overflow-hidden transition-all", product.inStock ? "border-gray-200 hover:shadow-md" : "border-gray-100 opacity-60")}>
      {/* Color band */}
      <div className={cn("h-1.5 w-full", product.category === "roofing_materials" ? "bg-orange-400" : product.category === "gutters" ? "bg-blue-400" : product.category === "service_packages" ? "bg-violet-400" : "bg-green-400")} />

      <div className="p-4 flex flex-col gap-3 flex-1">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", cat.bg)}>
            <CatIcon className={cn("w-5 h-5", cat.color)} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 leading-snug">{product.name}</p>
            <p className={cn("text-[10px] font-medium mt-0.5", cat.color)}>{cat.label}</p>
          </div>
        </div>

        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">{product.description}</p>

        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded">{tag}</span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-auto">
          <div>
            <span className="text-base font-bold text-gray-900">{formatCurrency(product.price)}</span>
            <span className="text-xs text-gray-500 ml-1">/{product.unit}</span>
          </div>
          <div className="flex flex-col items-end gap-1">
            {product.inStock ? (
              <span className="flex items-center gap-0.5 text-[10px] text-green-600"><CheckCircle className="w-3 h-3" /> In stock</span>
            ) : (
              <span className="flex items-center gap-0.5 text-[10px] text-gray-400"><AlertCircle className="w-3 h-3" /> Out of stock</span>
            )}
            <button
              disabled={!product.inStock}
              onClick={onAdd}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all",
                product.inStock
                  ? inCart > 0 ? "bg-green-600 hover:bg-green-700 text-white" : "bg-orange-500 hover:bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              )}
            >
              <Plus className="w-3 h-3" />
              {inCart > 0 ? `In cart (${inCart})` : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
