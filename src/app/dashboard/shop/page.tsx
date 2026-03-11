"use client";

import { useState, useMemo } from "react";
import { useOrg } from "@/components/layout/org-context";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { getOrgProducts } from "@/lib/mock-data";
import { Product, CartItem, ProductCategory } from "@/types";
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
  ShoppingBag,
  ChevronRight,
} from "lucide-react";

const CATEGORY_CONFIG: Record<
  ProductCategory,
  { label: string; icon: React.ElementType; color: string; bg: string }
> = {
  roofing_materials: { label: "Roofing Materials", icon: Package,   color: "text-orange-700", bg: "bg-orange-50" },
  gutters:           { label: "Gutters & Drainage", icon: Droplets,  color: "text-blue-700",   bg: "bg-blue-50"   },
  service_packages:  { label: "Service Packages",   icon: Wrench,    color: "text-violet-700", bg: "bg-violet-50" },
  addons:            { label: "Add-ons",             icon: Sparkles,  color: "text-green-700",  bg: "bg-green-50"  },
};

const CATEGORY_ORDER: ProductCategory[] = [
  "roofing_materials",
  "gutters",
  "service_packages",
  "addons",
];

export default function ShopPage() {
  const { currentOrg } = useOrg();
  const products = getOrgProducts(currentOrg.id);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ProductCategory | "all">("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase()) ||
        (p.tags ?? []).some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchCat = categoryFilter === "all" || p.category === categoryFilter;
      return matchSearch && matchCat;
    });
  }, [products, search, categoryFilter]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.quantity, 0);

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setCartOpen(true);
  }

  function updateQty(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((i) =>
          i.product.id === productId ? { ...i, quantity: i.quantity + delta } : i
        )
        .filter((i) => i.quantity > 0)
    );
  }

  function removeItem(productId: string) {
    setCart((prev) => prev.filter((i) => i.product.id !== productId));
  }

  function handleCheckout() {
    setOrderPlaced(true);
    setCart([]);
    setTimeout(() => {
      setCartOpen(false);
      setOrderPlaced(false);
    }, 2500);
  }

  const featuredProducts = products.filter((p) => p.featured && p.inStock);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        currentOrg={currentOrg}
        title="Shop"
        subtitle={`${products.length} products · ${products.filter((p) => p.inStock).length} in stock`}
        action={
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-900 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          {/* Featured strip */}
          {featuredProducts.length > 0 && categoryFilter === "all" && !search && (
            <div className="px-6 pt-5 pb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Featured
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {featuredProducts.map((p) => {
                  const cat = CATEGORY_CONFIG[p.category];
                  const CatIcon = cat.icon;
                  return (
                    <button
                      key={p.id}
                      onClick={() => addToCart(p)}
                      className="text-left bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-3 hover:shadow-md hover:border-orange-400 transition-all group"
                    >
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center mb-2", cat.bg)}>
                        <CatIcon className={cn("w-4 h-4", cat.color)} />
                      </div>
                      <p className="text-xs font-semibold text-gray-900 group-hover:text-orange-600 transition-colors leading-snug">
                        {p.name}
                      </p>
                      <p className="text-sm font-bold text-orange-600 mt-1">
                        {formatCurrency(p.price)}
                        <span className="text-xs font-normal text-gray-500"> /{p.unit}</span>
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Toolbar */}
          <div className="px-6 py-3 bg-gray-50 border-y border-gray-200 flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products…"
                className="pl-9 pr-4 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent w-52"
              />
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setCategoryFilter("all")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  categoryFilter === "all"
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                )}
              >
                All
              </button>
              {CATEGORY_ORDER.map((cat) => {
                const cfg = CATEGORY_CONFIG[cat];
                const CatIcon = cfg.icon;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all",
                      categoryFilter === cat
                        ? `${cfg.bg} ${cfg.color} border ${cfg.bg.replace("bg-", "border-").replace("-50", "-200")}`
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"
                    )}
                  >
                    <CatIcon className="w-3 h-3" />
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Product grid */}
          <div className="p-6">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-gray-400 text-sm">No products match your search</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} onAdd={addToCart} cartQty={cart.find((i) => i.product.id === product.id)?.quantity ?? 0} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Cart sidebar */}
        <div
          className={cn(
            "flex flex-col bg-white border-l border-gray-200 transition-all duration-300 overflow-hidden flex-shrink-0",
            cartOpen ? "w-80" : "w-0"
          )}
        >
          {cartOpen && (
            <CartPanel
              cart={cart}
              total={cartTotal}
              orderPlaced={orderPlaced}
              onClose={() => setCartOpen(false)}
              onUpdateQty={updateQty}
              onRemove={removeItem}
              onCheckout={handleCheckout}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function ProductCard({
  product,
  onAdd,
  cartQty,
}: {
  product: Product;
  onAdd: (p: Product) => void;
  cartQty: number;
}) {
  const cat = CATEGORY_CONFIG[product.category];
  const CatIcon = cat.icon;

  return (
    <div
      className={cn(
        "bg-white rounded-xl border shadow-sm p-4 flex flex-col gap-3 transition-all",
        product.inStock
          ? "border-gray-200 hover:shadow-md hover:border-orange-200"
          : "border-gray-100 opacity-60"
      )}
    >
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0", cat.bg)}>
          <CatIcon className={cn("w-5 h-5", cat.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 leading-snug">{product.name}</p>
          <p className={cn("text-[10px] font-medium mt-0.5", cat.color)}>{cat.label}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          {product.inStock ? (
            <span className="flex items-center gap-0.5 text-[10px] font-medium text-green-600">
              <CheckCircle className="w-3 h-3" /> In stock
            </span>
          ) : (
            <span className="flex items-center gap-0.5 text-[10px] font-medium text-gray-400">
              <AlertCircle className="w-3 h-3" /> Out of stock
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{product.description}</p>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {product.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] rounded-full">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
        <div>
          <span className="text-base font-bold text-gray-900">{formatCurrency(product.price)}</span>
          <span className="text-xs text-gray-500 ml-1">/{product.unit}</span>
        </div>
        <button
          disabled={!product.inStock}
          onClick={() => onAdd(product)}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
            product.inStock
              ? cartQty > 0
                ? "bg-green-600 hover:bg-green-700 text-white"
                : "bg-orange-500 hover:bg-orange-600 text-white"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          )}
        >
          {cartQty > 0 ? (
            <>
              <ShoppingBag className="w-3 h-3" />
              In cart ({cartQty})
            </>
          ) : (
            <>
              <Plus className="w-3 h-3" />
              Add to cart
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function CartPanel({
  cart,
  total,
  orderPlaced,
  onClose,
  onUpdateQty,
  onRemove,
  onCheckout,
}: {
  cart: CartItem[];
  total: number;
  orderPlaced: boolean;
  onClose: () => void;
  onUpdateQty: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}) {
  if (orderPlaced) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <div>
          <p className="text-base font-bold text-gray-900">Quote Submitted!</p>
          <p className="text-xs text-gray-500 mt-1">A job will be created from this order.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Cart header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4 text-gray-700" />
          <span className="text-sm font-semibold text-gray-900">Cart</span>
          {cart.length > 0 && (
            <span className="px-1.5 py-0.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full">
              {cart.reduce((s, i) => s + i.quantity, 0)} items
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Cart items */}
      <div className="flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-gray-400 p-6">
            <ShoppingBag className="w-10 h-10 opacity-30" />
            <p className="text-sm text-center">Your cart is empty. Browse products and add items.</p>
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
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {formatCurrency(product.price)} /{product.unit}
                    </p>
                    {/* Qty controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => onUpdateQty(product.id, -1)}
                        className="w-6 h-6 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-3 h-3 text-gray-600" />
                      </button>
                      <span className="text-xs font-semibold text-gray-900 w-4 text-center">{quantity}</span>
                      <button
                        onClick={() => onUpdateQty(product.id, 1)}
                        className="w-6 h-6 rounded-md bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-3 h-3 text-gray-600" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => onRemove(product.id)}
                      className="text-gray-300 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-gray-900">
                      {formatCurrency(product.price * quantity)}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Cart footer */}
      {cart.length > 0 && (
        <div className="border-t border-gray-200 p-4 flex-shrink-0 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Subtotal</span>
            <span className="font-bold text-gray-900">{formatCurrency(total)}</span>
          </div>
          <p className="text-[10px] text-gray-400 leading-relaxed">
            Tax and labor costs will be calculated at quote. Submitting creates a new job in your pipeline.
          </p>
          <Button className="w-full" onClick={onCheckout}>
            <ChevronRight className="w-3.5 h-3.5" />
            Submit as Quote
          </Button>
        </div>
      )}
    </>
  );
}
