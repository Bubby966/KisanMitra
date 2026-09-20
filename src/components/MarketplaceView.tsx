import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Search,
  Filter,
  MapPin,
  Calendar,
  CheckCircle2,
  Trash2,
  ShoppingCart,
  Tag,
  TrendingUp,
  User,
  ArrowRight,
  PackageCheck,
  Check,
  Phone,
  Store
} from 'lucide-react';
import { MarketplaceProduct, UserRole, Order } from '../types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, MANDI_PRICES } from '../data/mockData';

interface MarketplaceViewProps {
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  cartCount: number;
  setCartCount: (cnt: number) => void;
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  role,
  onRoleChange,
  cartCount,
  setCartCount,
}) => {
  const [products, setProducts] = useState<MarketplaceProduct[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState<'browse' | 'my-listings' | 'orders' | 'add'>(
    role === 'farmer' ? 'my-listings' : 'browse'
  );

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Cart & Checkout
  const [cart, setCart] = useState<{ product: MarketplaceProduct; qty: number }[]>([]);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderSuccessModal, setOrderSuccessModal] = useState(false);
  const [buyerName, setBuyerName] = useState('Anand Sharma');
  const [buyerPhone, setBuyerPhone] = useState('9849012345');
  const [buyerAddress, setBuyerAddress] = useState('H.No 4-22, Banjara Hills, Hyderabad, Telangana');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('UPI');

  // New Product Form state
  const [newCrop, setNewCrop] = useState('Organic Red Tomatoes');
  const [newCat, setNewCat] = useState<'Vegetables' | 'Fruits' | 'Grains' | 'Paddy' | 'Pulses' | 'Spices'>('Vegetables');
  const [newPrice, setNewPrice] = useState<number>(34);
  const [newUnit, setNewUnit] = useState<'kg' | 'quintal' | 'crate' | 'ton'>('kg');
  const [newQty, setNewQty] = useState<number>(150);
  const [newIsOrganic, setNewIsOrganic] = useState(true);
  const [newImgUrl, setNewImgUrl] = useState(
    'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=60'
  );

  const categories = ['All', 'Vegetables', 'Grains', 'Paddy', 'Pulses', 'Spices'];

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const cropStr = p.cropName || p.title || '';
    const locStr = p.location || `${p.village || ''}, ${p.district || ''}`;
    const matchesSearch =
      cropStr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.farmerName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      locStr.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const addToCart = (product: MarketplaceProduct) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { product, qty: 1 }];
    });
    setCartCount(cartCount + 1);
  };

  const removeFromCart = (productId: string) => {
    const item = cart.find((i) => i.product.id === productId);
    if (item) {
      setCartCount(Math.max(0, cartCount - item.qty));
      setCart((prev) => prev.filter((i) => i.product.id !== productId));
    }
  };

  const cartTotal = cart.reduce((acc, curr) => acc + curr.product.pricePerUnit * curr.qty, 0);

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;
    const newOrder: Order = {
      id: 'ORD-' + Math.floor(1000 + Math.random() * 9000),
      productId: cart[0].product.id,
      productName: cart.map((c) => `${c.product.cropName} (${c.qty} ${c.product.unit})`).join(', '),
      quantity: cart.reduce((acc, c) => acc + c.qty, 0),
      unit: cart[0].product.unit,
      totalAmount: cartTotal,
      farmerName: cart[0].product.farmerName,
      farmerPhone: cart[0].product.farmerPhone,
      buyerName,
      buyerPhone,
      deliveryAddress: buyerAddress,
      status: 'Confirmed',
      orderDate: new Date().toISOString().split('T')[0],
      paymentMethod,
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setCartCount(0);
    setShowCheckoutModal(false);
    setOrderSuccessModal(true);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const created: MarketplaceProduct = {
      id: 'prod-' + Date.now(),
      farmerId: 'farmer-101',
      farmerName: 'Rama Rao Patel',
      farmerPhone: '9848022334',
      title: newCrop,
      cropName: newCrop,
      category: newCat,
      variety: 'Desi Hybrid Grade A',
      pricePerUnit: newPrice,
      unit: newUnit,
      availableQty: newQty,
      quantityAvailable: newQty,
      village: 'Duggirala',
      district: 'Guntur',
      state: 'Andhra Pradesh',
      location: 'Duggirala, Guntur (AP)',
      harvestDate: new Date().toISOString().split('T')[0],
      isOrganic: newIsOrganic,
      imageUrl: newImgUrl,
      mandiBenchmarkPrice: Math.round(newPrice * 0.9),
      rating: 5.0,
      description: 'Fresh farm-harvested produce sold directly by farmer.',
    };

    setProducts([created, ...products]);
    setActiveTab('my-listings');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: Order['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-1">
            <Store className="w-4 h-4 text-emerald-600" />
            <span>0% Commission Direct Agri-Market</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-950 font-serif">
            KisanMitra Marketplace (రైతు బజార్ / किसान मंडी)
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Eliminating middlemen: Direct farm-to-table trade with transparent APMC benchmark pricing.
          </p>
        </div>

        {/* Perspective Switcher & Cart */}
        <div className="flex items-center gap-3">
          <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200">
            <button
              onClick={() => {
                onRoleChange('farmer');
                setActiveTab('my-listings');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                role === 'farmer' ? 'bg-emerald-700 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Farmer Mode 👨🌾
            </button>
            <button
              onClick={() => {
                onRoleChange('customer');
                setActiveTab('browse');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                role === 'customer' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Buyer Mode 🛒
            </button>
          </div>

          <button
            onClick={() => setShowCheckoutModal(true)}
            className="relative px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Cart ({cart.reduce((a, b) => a + b.qty, 0)})</span>
          </button>
        </div>
      </div>

      {/* Sub navigation bar */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-3 mb-6 overflow-x-auto">
        <button
          onClick={() => setActiveTab('browse')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'browse' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Browse All Harvest ({products.length})
        </button>

        {role === 'farmer' && (
          <>
            <button
              onClick={() => setActiveTab('my-listings')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'my-listings' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              My Farm Listings
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'add' ? 'bg-emerald-700 text-white' : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List New Crop for Sale</span>
            </button>
          </>
        )}

        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'orders' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Orders & Dispatches ({orders.length})
        </button>
      </div>

      {/* VIEW: BROWSE PRODUCTS */}
      {activeTab === 'browse' && (
        <div>
          {/* Search & Category filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crop, farmer, or village..."
                className="w-full bg-white border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-emerald-700 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  {/* Image & Tags */}
                  <div className="relative aspect-16/10 bg-stone-100 overflow-hidden">
                    <img
                      src={product.imageUrl}
                      alt={product.cropName}
                      className="w-full h-full object-cover hover:scale-105 transition duration-500"
                      crossOrigin="anonymous"
                    />
                    {product.isOrganic && (
                      <span className="absolute top-3 left-3 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                        100% Organic
                      </span>
                    )}
                    <span className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {product.category}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="flex items-baseline justify-between mb-1">
                      <h3 className="font-extrabold text-base text-stone-950">{product.cropName || product.title}</h3>
                      <span className="text-[11px] font-mono text-stone-500">{product.variety || 'A-Grade'}</span>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-stone-500 mb-3">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span className="truncate">{product.location || `${product.village || ''}, ${product.district || ''}`}</span>
                    </div>

                    {/* Price & Mandi Benchmark */}
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 mb-4 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-stone-600">Farmer Price:</span>
                        <span className="text-base font-black text-emerald-800">
                          ₹{product.pricePerUnit} <span className="text-xs font-normal">/{product.unit}</span>
                        </span>
                      </div>

                      {product.mandiBenchmarkPrice && (
                        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200/60">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-amber-600" />
                            Mandi Yard Rate:
                          </span>
                          <span className="font-mono">₹{product.mandiBenchmarkPrice}/{product.unit}</span>
                        </div>
                      )}
                    </div>

                    {/* Farmer details */}
                    <div className="flex items-center justify-between text-xs text-stone-600 pt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-stone-400" />
                        {product.farmerName}
                      </span>
                      <span className="font-bold text-stone-900">{product.quantityAvailable} {product.unit} available</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => addToCart(product)}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Add to Order Cart</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW: MY LISTINGS (Farmer Mode) */}
      {activeTab === 'my-listings' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-stone-950 text-base">Rama Rao Patel's Farm Stall</h3>
              <p className="text-xs text-stone-600 mt-0.5">
                Total 3 active listings • Received 12 direct consumer orders • ₹42,500 total sales
              </p>
            </div>
            <button
              onClick={() => setActiveTab('add')}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>List Another Harvest</span>
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .filter((p) => p.farmerId === 'farmer-101')
              .map((prod) => (
                <div key={prod.id} className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs">
                  <img
                    src={prod.imageUrl}
                    alt={prod.cropName}
                    className="w-full h-36 object-cover rounded-xl mb-3"
                    crossOrigin="anonymous"
                  />
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-sm text-stone-900">{prod.cropName}</h4>
                    <span className="text-xs font-bold text-emerald-700">₹{prod.pricePerUnit}/{prod.unit}</span>
                  </div>
                  <p className="text-xs text-stone-500 mb-3">{prod.quantityAvailable} {prod.unit} in stock</p>

                  <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                    <button
                      onClick={() => setProducts(products.filter((p) => p.id !== prod.id))}
                      className="flex-1 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold cursor-pointer transition flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* VIEW: ADD PRODUCT FORM */}
      {activeTab === 'add' && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-stone-200 shadow-xs">
          <h2 className="text-lg font-bold text-stone-900 mb-1">List New Agricultural Harvest for Direct Sale</h2>
          <p className="text-xs text-stone-500 mb-6">
            Set your own fair price. Reach consumers, restaurants, and wholesale traders directly without middleman cuts.
          </p>

          <form onSubmit={handleCreateProduct} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Crop / Product Title</label>
              <input
                type="text"
                required
                value={newCrop}
                onChange={(e) => setNewCrop(e.target.value)}
                placeholder="e.g. Fresh Red Tomatoes, Sona Masoori Paddy"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
                <select
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Vegetables">Vegetables</option>
                  <option value="Paddy">Paddy / Rice</option>
                  <option value="Grains">Grains / Cereals</option>
                  <option value="Pulses">Pulses / Dal</option>
                  <option value="Fruits">Fruits</option>
                  <option value="Spices">Spices / Commercial</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Unit</label>
                <select
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value as any)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="kg">Per Kilogram (kg)</option>
                  <option value="quintal">Per Quintal (100 kg)</option>
                  <option value="crate">Per Crate (25 kg)</option>
                  <option value="ton">Per Ton</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Selling Price (₹ per {newUnit})</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newPrice}
                  onChange={(e) => setNewPrice(parseFloat(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Available Quantity ({newUnit})</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newQty}
                  onChange={(e) => setNewQty(parseFloat(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Produce Image URL</label>
              <input
                type="url"
                value={newImgUrl}
                onChange={(e) => setNewImgUrl(e.target.value)}
                placeholder="Paste image link or use default"
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3.5 py-2 text-xs text-stone-900 focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="organic-check"
                checked={newIsOrganic}
                onChange={(e) => setNewIsOrganic(e.target.checked)}
                className="w-4 h-4 accent-emerald-700"
              />
              <label htmlFor="organic-check" className="text-xs font-semibold text-stone-800 cursor-pointer">
                Certified Natural / Organic Farming (Zero Chemical Pesticides)
              </label>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                type="submit"
                className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition"
              >
                Publish Crop to Marketplace
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('my-listings')}
                className="px-5 py-3 border border-stone-300 text-stone-700 font-bold text-xs rounded-xl hover:bg-stone-50 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* VIEW: ORDERS & DISPATCHES */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-bold text-stone-900 text-sm">Customer Orders & Dispatch Ledger</h3>
            <span className="text-xs text-stone-500 font-medium">Real-time order tracking</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Produce Details</th>
                  <th className="py-3 px-4">Buyer</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/50">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{ord.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{ord.productName || ord.items?.[0]?.productTitle || 'Agricultural Produce'}</div>
                      <div className="text-[10px] text-stone-500">Qty: {ord.quantity || ord.items?.[0]?.quantity || 1} {ord.unit || ord.items?.[0]?.unit || 'kg'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900">{ord.buyerName || ord.customerName || 'Direct Buyer'}</div>
                      <div className="text-[10px] text-stone-500 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-stone-400" />
                        {ord.buyerPhone || ord.customerPhone || 'Verified Phone'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-black text-emerald-800">₹{ord.totalAmount}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-900'
                            : ord.status === 'Shipped' || ord.status === 'In Transit'
                            ? 'bg-blue-100 text-blue-900'
                            : ord.status === 'Confirmed' || ord.status === 'Packed by Farmer'
                            ? 'bg-purple-100 text-purple-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <select
                        value={ord.status}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value as any)}
                        className="bg-stone-100 border border-stone-200 rounded px-2 py-1 text-[11px] font-semibold cursor-pointer"
                      >
                        <option value="Placed">Placed</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Packed by Farmer">Packed by Farmer</option>
                        <option value="In Transit">In Transit</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-stone-200 shadow-2xl">
            <div className="flex items-center justify-between mb-4 border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-base text-stone-900">Direct Farm Purchase Cart</h3>
              </div>
              <button
                onClick={() => setShowCheckoutModal(false)}
                className="text-stone-400 hover:text-stone-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-8 text-stone-500">
                <ShoppingCart className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                <p className="text-xs">Your order cart is empty.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {cart.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs"
                    >
                      <div>
                        <div className="font-bold text-stone-900">{item.product.cropName}</div>
                        <div className="text-stone-500 text-[10px]">
                          ₹{item.product.pricePerUnit}/{item.product.unit} • Farmer: {item.product.farmerName}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-stone-800">
                          {item.qty} {item.product.unit} (₹{item.product.pricePerUnit * item.qty})
                        </span>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-emerald-50 rounded-xl flex items-center justify-between font-bold text-sm text-emerald-950">
                  <span>Grand Total:</span>
                  <span>₹{cartTotal}</span>
                </div>

                {/* Buyer info fields */}
                <div className="space-y-2 text-xs">
                  <div>
                    <label className="block text-stone-600 font-semibold mb-0.5">Your Name</label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full border rounded-lg p-2 text-xs bg-stone-50"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-semibold mb-0.5">Contact Phone</label>
                    <input
                      type="tel"
                      value={buyerPhone}
                      onChange={(e) => setBuyerPhone(e.target.value)}
                      className="w-full border rounded-lg p-2 text-xs bg-stone-50"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-semibold mb-0.5">Delivery Address</label>
                    <input
                      type="text"
                      value={buyerAddress}
                      onChange={(e) => setBuyerAddress(e.target.value)}
                      className="w-full border rounded-lg p-2 text-xs bg-stone-50"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-600 font-semibold mb-0.5">Payment Method</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('UPI')}
                        className={`flex-1 p-2 rounded-lg border font-bold text-xs cursor-pointer ${
                          paymentMethod === 'UPI' ? 'border-emerald-700 bg-emerald-50 text-emerald-900' : 'bg-stone-50'
                        }`}
                      >
                        UPI / Bank Transfer
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('COD')}
                        className={`flex-1 p-2 rounded-lg border font-bold text-xs cursor-pointer ${
                          paymentMethod === 'COD' ? 'border-emerald-700 bg-emerald-50 text-emerald-900' : 'bg-stone-50'
                        }`}
                      >
                        Cash on Delivery (COD)
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handlePlaceOrder}
                    className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
                  >
                    Confirm & Place Direct Farm Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ORDER SUCCESS MODAL */}
      {orderSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="font-extrabold text-base text-stone-900 mb-1">Order Placed Successfully!</h3>
            <p className="text-xs text-stone-600 mb-6">
              The farmer has received your direct order. Dispatch tracking updates will be communicated directly via SMS and WhatsApp.
            </p>
            <button
              onClick={() => {
                setOrderSuccessModal(false);
                setActiveTab('orders');
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs cursor-pointer"
            >
              View in Orders Ledger
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
