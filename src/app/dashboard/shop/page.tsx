"use client";

import { useState } from "react";
import { useOrg } from "@/components/layout/org-context";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getOrgProducts, getOrgOrders } from "@/lib/mock-data";
import { Product, ProductCategory, Order, OrderStatus } from "@/types";
import { formatCurrency, formatDate, cn } from "@/lib/utils";
import {
  Package,
  ShoppingBag,
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ChevronDown,
  Wrench,
  Droplets,
  Sparkles,
  TrendingUp,
  Clock,
  DollarSign,
} from "lucide-react";

// ─── Config ──────────────────────────────────────────────────────────────────

const CATEGORY_CONFIG: Record<ProductCategory, { label: string; icon: React.ElementType; color: string; bg: string }> = {
  roofing_materials: { label: "Roofing Materials", icon: Package,  color: "text-orange-700", bg: "bg-orange-50" },
  gutters:           { label: "Gutters & Drainage", icon: Droplets, color: "text-blue-700",   bg: "bg-blue-50"   },
  service_packages:  { label: "Service Packages",   icon: Wrench,   color: "text-violet-700", bg: "bg-violet-50" },
  addons:            { label: "Add-ons",             icon: Sparkles, color: "text-green-700",  bg: "bg-green-50"  },
};

const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; border: string }> = {
  pending:    { label: "Pending",    color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200"  },
  processing: { label: "Processing", color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200"   },
  shipped:    { label: "Shipped",    color: "text-cyan-700",   bg: "bg-cyan-50",   border: "border-cyan-200"   },
  delivered:  { label: "Delivered",  color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200"  },
  cancelled:  { label: "Cancelled",  color: "text-gray-500",   bg: "bg-gray-50",   border: "border-gray-200"   },
};

const CATEGORIES: ProductCategory[] = ["roofing_materials", "gutters", "service_packages", "addons"];

const EMPTY_PRODUCT: Omit<Product, "id" | "orgId"> = {
  name: "", description: "", category: "roofing_materials", price: 0, unit: "each", inStock: true, featured: false, tags: [],
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminShopPage() {
  const { currentOrg } = useOrg();
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<Product[]>(getOrgProducts(currentOrg.id));
  const [orders, setOrders] = useState<Order[]>(getOrgOrders(currentOrg.id));

  // product panel state
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProductData, setNewProductData] = useState(EMPTY_PRODUCT);

  // order detail state
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  function openAdd() { setNewProductData(EMPTY_PRODUCT); setShowAddForm(true); setEditProduct(null); }
  function openEdit(p: Product) { setEditProduct(p); setShowAddForm(false); }
  function closePanel() { setShowAddForm(false); setEditProduct(null); }

  function saveNew() {
    if (!newProductData.name.trim()) return;
    const p: Product = { ...newProductData, id: `prod_${Date.now()}`, orgId: currentOrg.id };
    setProducts((prev) => [...prev, p]);
    closePanel();
  }

  function saveEdit() {
    if (!editProduct) return;
    setProducts((prev) => prev.map((p) => (p.id === editProduct.id ? editProduct : p)));
    closePanel();
  }

  function deleteProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function toggleStock(id: string) {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, inStock: !p.inStock } : p));
  }

  function updateOrderStatus(orderId: string, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o));
    if (viewOrder?.id === orderId) setViewOrder((o) => o ? { ...o, status } : o);
  }

  const panelOpen = showAddForm || !!editProduct;
  const panelProduct = editProduct ?? newProductData;
  const setPanelProduct = editProduct
    ? (val: Partial<Product>) => setEditProduct((p) => p ? { ...p, ...val } : p)
    : (val: Partial<typeof newProductData>) => setNewProductData((p) => ({ ...p, ...val }));

  // stats
  const inStock = products.filter((p) => p.inStock).length;
  const totalRevenue = orders.reduce((s, o) => s + o.subtotal, 0);
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar
        currentOrg={currentOrg}
        title="Shop Admin"
        subtitle="Manage products and orders"
        action={
          <div className="flex items-center gap-2">
            <a
              href="/store"
              target="_blank"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Store
            </a>
            {tab === "products" && (
              <Button onClick={openAdd}>
                <Plus className="w-3.5 h-3.5" /> Add Product
              </Button>
            )}
          </div>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Main */}
        <div className="flex-1 overflow-y-auto">
          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 px-6 pt-5 pb-4">
            {[
              { label: "Products", value: products.length, icon: Package,      color: "text-orange-600" },
              { label: "In Stock",  value: inStock,         icon: CheckCircle,  color: "text-green-600"  },
              { label: "Orders",    value: orders.length,   icon: ShoppingBag,  color: "text-violet-600" },
              { label: "Revenue",   value: formatCurrency(totalRevenue), icon: DollarSign, color: "text-blue-600" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center flex-shrink-0">
                  <Icon className={cn("w-4.5 h-4.5", color)} />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 leading-none">{value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="px-6 flex items-center gap-1 border-b border-gray-200 mb-0">
            {(["products", "orders"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-4 py-2.5 text-sm font-medium capitalize border-b-2 -mb-px transition-all",
                  tab === t ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                {t === "orders" && pendingOrders > 0 && (
                  <span className="inline-flex items-center justify-center w-4 h-4 mr-1.5 bg-orange-100 text-orange-700 text-[10px] font-bold rounded-full">
                    {pendingOrders}
                  </span>
                )}
                {t}
              </button>
            ))}
          </div>

          {/* Products tab */}
          {tab === "products" && (
            <div className="p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    {["Product", "Category", "Price", "Unit", "Stock", ""].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 pb-2 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => {
                    const cat = CATEGORY_CONFIG[p.category];
                    const CatIcon = cat.icon;
                    return (
                      <tr key={p.id} className="hover:bg-gray-50 group">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0", cat.bg)}>
                              <CatIcon className={cn("w-3.5 h-3.5", cat.color)} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{p.name}</p>
                              {p.featured && <span className="text-[10px] text-orange-500 font-medium">★ Featured</span>}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", cat.bg, cat.color)}>{cat.label}</span>
                        </td>
                        <td className="py-3 pr-4 font-semibold text-gray-900">{formatCurrency(p.price)}</td>
                        <td className="py-3 pr-4 text-gray-500">{p.unit}</td>
                        <td className="py-3 pr-4">
                          <button
                            onClick={() => toggleStock(p.id)}
                            className={cn(
                              "flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border transition-all",
                              p.inStock
                                ? "text-green-700 bg-green-50 border-green-200 hover:bg-green-100"
                                : "text-gray-500 bg-gray-50 border-gray-200 hover:bg-gray-100"
                            )}
                          >
                            {p.inStock ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                            {p.inStock ? "In Stock" : "Out of Stock"}
                          </button>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openEdit(p)}
                              className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-md transition-all"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteProduct(p.id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Orders tab */}
          {tab === "orders" && (
            <div className="p-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    {["Order", "Customer", "Items", "Total", "Status", "Date", ""].map((h) => (
                      <th key={h} className="text-left text-xs font-semibold text-gray-500 pb-2 pr-4">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => {
                    const st = ORDER_STATUS_CONFIG[order.status];
                    return (
                      <tr key={order.id} className="hover:bg-gray-50 group">
                        <td className="py-3 pr-4 font-mono text-xs font-semibold text-gray-700">{order.orderNumber}</td>
                        <td className="py-3 pr-4">
                          <p className="font-medium text-gray-900">{order.customer.name}</p>
                          <p className="text-xs text-gray-500">{order.customer.email}</p>
                        </td>
                        <td className="py-3 pr-4 text-gray-600">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</td>
                        <td className="py-3 pr-4 font-semibold text-gray-900">{formatCurrency(order.subtotal)}</td>
                        <td className="py-3 pr-4">
                          <OrderStatusDropdown
                            status={order.status}
                            onChange={(s) => updateOrderStatus(order.id, s)}
                          />
                        </td>
                        <td className="py-3 pr-4 text-xs text-gray-500 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                        <td className="py-3">
                          <button
                            onClick={() => setViewOrder(order)}
                            className="text-xs text-orange-500 hover:text-orange-700 font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
                          >
                            View →
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Product add/edit panel */}
        <div className={cn("flex-shrink-0 bg-white border-l border-gray-200 flex flex-col transition-all duration-200 overflow-hidden", panelOpen ? "w-80" : "w-0")}>
          {panelOpen && (
            <ProductFormPanel
              isNew={showAddForm}
              product={panelProduct as Product}
              onChange={setPanelProduct}
              onSave={showAddForm ? saveNew : saveEdit}
              onClose={closePanel}
            />
          )}
        </div>

        {/* Order detail panel */}
        <div className={cn("flex-shrink-0 bg-white border-l border-gray-200 flex flex-col transition-all duration-200 overflow-hidden", viewOrder ? "w-80" : "w-0")}>
          {viewOrder && (
            <OrderDetailPanel
              order={viewOrder}
              onClose={() => setViewOrder(null)}
              onStatusChange={(s) => updateOrderStatus(viewOrder.id, s)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function OrderStatusDropdown({ status, onChange }: { status: OrderStatus; onChange: (s: OrderStatus) => void }) {
  const st = ORDER_STATUS_CONFIG[status];
  return (
    <div className="relative group/dd">
      <button className={cn("flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border", st.bg, st.color, st.border)}>
        {st.label} <ChevronDown className="w-3 h-3" />
      </button>
      <div className="absolute left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 hidden group-hover/dd:block min-w-[140px]">
        {(Object.keys(ORDER_STATUS_CONFIG) as OrderStatus[]).map((s) => {
          const cfg = ORDER_STATUS_CONFIG[s];
          return (
            <button
              key={s}
              onClick={() => onChange(s)}
              className={cn(
                "w-full text-left px-3 py-1.5 text-xs font-medium transition-colors first:rounded-t-lg last:rounded-b-lg",
                s === status ? `${cfg.bg} ${cfg.color}` : "text-gray-700 hover:bg-gray-50"
              )}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProductFormPanel({
  isNew, product, onChange, onSave, onClose,
}: {
  isNew: boolean;
  product: Partial<Product>;
  onChange: (val: Partial<Product>) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <p className="text-sm font-semibold text-gray-900">{isNew ? "Add Product" : "Edit Product"}</p>
        <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <Field label="Name">
          <input value={product.name ?? ""} onChange={(e) => onChange({ name: e.target.value })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
        </Field>
        <Field label="Description">
          <textarea value={product.description ?? ""} onChange={(e) => onChange({ description: e.target.value })} rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
        </Field>
        <Field label="Category">
          <select value={product.category} onChange={(e) => onChange({ category: e.target.value as ProductCategory })}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
            {(Object.keys(CATEGORY_CONFIG) as ProductCategory[]).map((c) => (
              <option key={c} value={c}>{CATEGORY_CONFIG[c].label}</option>
            ))}
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Price ($)">
            <input type="number" min={0} value={product.price ?? 0} onChange={(e) => onChange({ price: parseFloat(e.target.value) || 0 })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </Field>
          <Field label="Unit">
            <input value={product.unit ?? ""} onChange={(e) => onChange({ unit: e.target.value })}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </Field>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={product.inStock ?? true} onChange={(e) => onChange({ inStock: e.target.checked })}
              className="rounded border-gray-300 text-orange-500 focus:ring-orange-400" />
            In Stock
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input type="checkbox" checked={product.featured ?? false} onChange={(e) => onChange({ featured: e.target.checked })}
              className="rounded border-gray-300 text-orange-500 focus:ring-orange-400" />
            Featured
          </label>
        </div>
      </div>
      <div className="px-4 pb-4 flex-shrink-0">
        <Button className="w-full" onClick={onSave}>
          {isNew ? "Add Product" : "Save Changes"}
        </Button>
      </div>
    </>
  );
}

function OrderDetailPanel({ order, onClose, onStatusChange }: { order: Order; onClose: () => void; onStatusChange: (s: OrderStatus) => void }) {
  const st = ORDER_STATUS_CONFIG[order.status];
  return (
    <>
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
        <div>
          <p className="text-sm font-semibold text-gray-900">{order.orderNumber}</p>
          <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <button onClick={onClose} className="p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Status */}
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">STATUS</p>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(ORDER_STATUS_CONFIG) as OrderStatus[]).map((s) => {
              const cfg = ORDER_STATUS_CONFIG[s];
              return (
                <button
                  key={s}
                  onClick={() => onStatusChange(s)}
                  className={cn(
                    "px-2.5 py-1 text-xs font-medium rounded-full border transition-all",
                    s === order.status ? `${cfg.bg} ${cfg.color} ${cfg.border}` : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                  )}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>
        {/* Customer */}
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">CUSTOMER</p>
          <div className="bg-gray-50 rounded-lg p-3 space-y-1 text-sm">
            <p className="font-medium text-gray-900">{order.customer.name}</p>
            <p className="text-gray-500 text-xs">{order.customer.email}</p>
            <p className="text-gray-500 text-xs">{order.customer.phone}</p>
            <p className="text-gray-500 text-xs">{order.customer.address}</p>
          </div>
        </div>
        {/* Items */}
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">ITEMS</p>
          <ul className="space-y-2">
            {order.items.map((item) => (
              <li key={item.productId} className="flex items-start justify-between text-sm gap-2">
                <div>
                  <p className="text-gray-900 font-medium leading-snug">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.quantity} × {formatCurrency(item.price)}/{item.unit}</p>
                </div>
                <p className="font-semibold text-gray-900 whitespace-nowrap">{formatCurrency(item.price * item.quantity)}</p>
              </li>
            ))}
          </ul>
          <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between text-sm font-bold">
            <span>Total</span>
            <span>{formatCurrency(order.subtotal)}</span>
          </div>
        </div>
        {order.notes && (
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1">NOTES</p>
            <p className="text-sm text-gray-600 bg-amber-50 border border-amber-200 rounded-lg p-3">{order.notes}</p>
          </div>
        )}
      </div>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}
