import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Home,
  FileText,
  Clock,
  Package,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Upload,
  Plus,
  Search,
  Filter,
  Check,
  Building,
  User,
  Phone,
  Mail,
  Truck,
  CreditCard,
  RotateCcw,
  MessageSquare,
  FileSpreadsheet,
  Layers,
  ChevronRight,
  ShieldCheck,
  Sparkles,
  Info,
  Calendar,
  MapPin,
  ExternalLink,
  Download,
  LogOut,
  KeyRound,
  X,
} from 'lucide-react';
import { ProductMasterItem, RequirementItem } from '../../types';

export const CustomerMobileView: React.FC = () => {
  const {
    activeCustomer,
    customers,
    setActiveCustomerId,
    isCustomerLoggedIn,
    loginCustomer,
    logoutCustomer,
    requirement,
    quotation,
    salesOrder,
    delivery,
    invoice,
    payment,
    products,
    submitCustomerRequirement,
    acceptQuotationCustomer,
    requestQuotationChangesCustomer,
    rejectQuotationCustomer,
    quickReorderFromOrder,
    recordCustomerPayment,
    sendInaiwazhiMessage,
    addToast,
  } = useApp();

  // Bottom Navigation tabs: Home | Orders | Quotations | Inbox | Account
  const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'quotations' | 'inbox' | 'account'>('home');

  // Customer Login Form state
  const [loginSelectedCustId, setLoginSelectedCustId] = useState(activeCustomer?.id || 'CUST-001');
  const [loginContact, setLoginContact] = useState('procurement@abcelectrical.com');
  const [loginOtp, setLoginOtp] = useState('8492');
  const [termsAgreed, setTermsAgreed] = useState(true);

  // Home screen search bar query (for immediate quick search)
  const [homeSearchText, setHomeSearchText] = useState('');

  // Sub-views inside Home/Shop
  const [showCatalogue, setShowCatalogue] = useState<boolean>(false);
  const [showBulkOrderModal, setShowBulkOrderModal] = useState<boolean>(false);
  const [showRequirementReview, setShowRequirementReview] = useState<boolean>(false);
  const [showChangeRequestModal, setShowChangeRequestModal] = useState<boolean>(false);
  const [changeComment, setChangeComment] = useState<string>('');
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<'NEFT / RTGS' | 'UPI Corporate' | 'Letter of Credit'>('NEFT / RTGS');

  // Catalogue search & filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Multi-product requirement basket
  const [basketItems, setBasketItems] = useState<
    { product: ProductMasterItem; quantity: number }[]
  >([
    { product: products[0], quantity: 50 }, // Schneider MCB
    { product: products[2], quantity: 6 },  // ABB MCCB
    { product: products[3], quantity: 400 }, // Polycab Cable
    { product: products[4], quantity: 12 },  // Havells Floodlight
  ]);

  // Bulk order form state
  const [bulkProjectName, setBulkProjectName] = useState('Ambattur Line 3 Substation Modernization');
  const [bulkContractRef, setBulkContractRef] = useState('CONT-ABC-2026-08');
  const [bulkDeliverySite, setBulkDeliverySite] = useState('Ambattur Plant Unit-2 (Plot 45-B, Industrial Estate)');
  const [bulkRequiredDate, setBulkRequiredDate] = useState('2026-09-20');
  const [bulkNotes, setBulkNotes] = useState('Industrial grade items with manufacturer test certificates required.');
  const [uploadedFileName, setUploadedFileName] = useState('ABC_Line3_Substation_BOQ_Rev4.xlsx');

  const addToBasket = (product: ProductMasterItem) => {
    setBasketItems((prev) => {
      const exists = prev.find((item) => item.product.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + product.moq } : item
        );
      }
      return [...prev, { product, quantity: product.moq }];
    });
    addToast('Added to Requirement', `${product.brand} ${product.name.slice(0, 30)}... added`, 'success');
  };

  const updateBasketQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      setBasketItems((prev) => prev.filter((i) => i.product.id !== productId));
    } else {
      setBasketItems((prev) =>
        prev.map((i) => (i.product.id === productId ? { ...i, quantity: qty } : i))
      );
    }
  };

  const handleFinalRequirementSubmit = () => {
    const formattedItems: RequirementItem[] = basketItems.map((item, idx) => ({
      id: `REQ-ITEM-SUBMIT-0${idx + 1}`,
      productId: item.product.id,
      productName: item.product.name,
      brand: item.product.brand,
      specification: item.product.specification,
      uom: item.product.uom,
      quantity: item.quantity,
    }));

    submitCustomerRequirement({
      projectName: bulkProjectName,
      contractRef: bulkContractRef,
      deliverySite: bulkDeliverySite,
      requiredDate: bulkRequiredDate,
      specialNotes: bulkNotes,
      boqFileName: uploadedFileName,
      items: formattedItems,
    });

    setShowRequirementReview(false);
    setShowBulkOrderModal(false);
    setShowCatalogue(false);
    setActiveTab('home');
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBrand = selectedBrand === 'All' || p.brand === selectedBrand;
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesBrand && matchesCategory;
  });

  // ---------------------------------------------------------------------------
  // CUSTOMER LOGIN SCREEN (When not logged in)
  // ---------------------------------------------------------------------------
  if (!isCustomerLoggedIn) {
    return (
      <div className="w-full flex justify-center py-4 px-2 sm:px-4 bg-slate-900 min-h-screen">
        <div
          id="customer-login-container"
          className="w-full max-w-md bg-slate-50 text-slate-900 rounded-3xl shadow-2xl border-8 border-slate-950 flex flex-col h-[844px] max-h-[92vh] overflow-hidden relative"
        >
          {/* Phone Top Notch / Status Bar */}
          <div className="bg-slate-950 text-white px-6 pt-2 pb-2 flex items-center justify-between text-[11px] font-medium shrink-0">
            <span>09:41</span>
            <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <span>100%</span>
            </div>
          </div>

          {/* Header */}
          <div className="bg-blue-900 text-white p-6 shrink-0 relative overflow-hidden border-b border-blue-800">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-800/80 text-blue-200 text-[10px] font-bold uppercase tracking-wider mb-2">
                <Building size={12} />
                <span>Enterprise B2B Procurement</span>
              </div>
              <h1 className="text-xl font-black text-white tracking-tight">Customer Portal Sign-In</h1>
              <p className="text-xs text-blue-200 mt-1">
                Select your organization account to access RFQs, quotations, contracts & live delivery.
              </p>
            </div>
            <div className="absolute -right-8 -bottom-10 w-32 h-32 bg-blue-700/40 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Login Form Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                loginCustomer(loginContact, loginSelectedCustId);
              }}
              className="space-y-4"
            >
              {/* Select Organization */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Select Registered Enterprise
                </label>
                <div className="space-y-2">
                  {customers.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => {
                        setLoginSelectedCustId(c.id);
                        setActiveCustomerId(c.id);
                      }}
                      className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                        loginSelectedCustId === c.id
                          ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                            loginSelectedCustId === c.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {c.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{c.name}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            GSTIN: {c.gst} • Credit: ₹{(c.creditLimit / 100000).toFixed(1)}L
                          </div>
                        </div>
                      </div>
                      {loginSelectedCustId === c.id && (
                        <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0">
                          <Check size={12} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Work Contact / Email Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Work Email or Registered Mobile
                </label>
                <div className="relative">
                  <Mail size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={loginContact}
                    onChange={(e) => setLoginContact(e.target.value)}
                    placeholder="e.g. procurement@abcelectrical.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* 4-Digit Corporate Access OTP */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Corporate Access OTP / PIN
                  </label>
                  <button
                    type="button"
                    onClick={() => setLoginOtp('8492')}
                    className="text-[10px] text-blue-600 font-semibold hover:underline"
                  >
                    Auto-fill (8492)
                  </button>
                </div>
                <div className="relative">
                  <KeyRound size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={4}
                    required
                    value={loginOtp}
                    onChange={(e) => setLoginOtp(e.target.value)}
                    placeholder="••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs tracking-widest font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Authorization terms */}
              <label className="flex items-start gap-2.5 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition">
                <input
                  type="checkbox"
                  checked={termsAgreed}
                  onChange={(e) => setTermsAgreed(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                />
                <div className="text-[11px] text-slate-600 leading-tight">
                  <strong className="text-slate-800 block">Authorized Procurement Personnel</strong>
                  I am authorized to raise purchase requisitions and approve delivery receipts on behalf of this company.
                </div>
              </label>

              {/* Sign In Button */}
              <button
                id="customer-btn-login"
                type="submit"
                disabled={!termsAgreed}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <span>SIGN IN TO PROCUREMENT PORTAL</span>
                <ArrowRight size={14} />
              </button>
            </form>

            <div className="p-3 bg-blue-50/70 border border-blue-200/80 rounded-xl text-[11px] text-blue-800">
              <div className="font-bold flex items-center gap-1 mb-0.5">
                <ShieldCheck size={13} className="text-blue-600" />
                <span>Enterprise Direct Connect</span>
              </div>
              Connected with your dedicated Sales Key Account Manager and Central Operations.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center py-4 px-2 sm:px-4 bg-slate-900 min-h-screen">
      {/* Mobile Device Frame Mockup */}
      <div
        id="customer-mobile-container"
        className="w-full max-w-md bg-slate-50 text-slate-900 rounded-3xl shadow-2xl border-8 border-slate-950 flex flex-col h-[844px] max-h-[92vh] overflow-hidden relative"
      >
        {/* Phone Top Notch / Status Bar */}
        <div className="bg-slate-950 text-white px-6 pt-2 pb-2 flex items-center justify-between text-[11px] font-medium shrink-0">
          <span>09:41</span>
          <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* Mobile App Header */}
        <div className="bg-white border-b border-slate-200 px-4 py-2.5 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-sm">
              ⚡
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {activeCustomer.name}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Tier-1 Industrial Partner
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              id="mobile-inaiwazhi-btn"
              onClick={() => setActiveTab('inbox')}
              className="relative p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-slate-100"
              title="Inaiwazhi Chat"
            >
              <MessageSquare size={18} />
              <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </button>
            <button
              id="customer-btn-logout-header"
              onClick={logoutCustomer}
              className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-100 transition"
              title="Switch Enterprise Account / Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {/* Main Scrollable Body */}
        <div className="flex-1 overflow-y-auto pb-16 bg-slate-50">
          {/* TAB 1: HOME (Section 5) */}
          {activeTab === 'home' && !showCatalogue && !showBulkOrderModal && !showRequirementReview && (
            <div className="p-4 space-y-3.5">
              {/* Quick Search Bar in Customer Control */}
              <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex items-center gap-2">
                <Search size={15} className="text-slate-400 shrink-0 ml-1" />
                <input
                  type="text"
                  value={homeSearchText}
                  onChange={(e) => setHomeSearchText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && homeSearchText.trim()) {
                      setSearchQuery(homeSearchText.trim());
                      setShowCatalogue(true);
                    }
                  }}
                  placeholder="Search products, MCBs, cables, SKUs..."
                  className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
                />
                {homeSearchText && (
                  <button
                    onClick={() => setHomeSearchText('')}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X size={13} />
                  </button>
                )}
                <button
                  id="btn-home-search-submit"
                  onClick={() => {
                    setSearchQuery(homeSearchText);
                    setShowCatalogue(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shrink-0 transition"
                >
                  Search
                </button>
              </div>
              {/* Sales Contact Card - Section 5 requirement */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-3.5 rounded-2xl shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-300">
                    Dedicated Key Account Manager
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Online
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <User size={14} className="text-blue-300" />
                      {activeCustomer.assignedSalesName || 'Arun Kumar'}
                    </h3>
                    <p className="text-[11px] text-blue-200">
                      Senior KAM • Tamil Nadu Industrial Desk
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('inbox')}
                    className="bg-white/10 hover:bg-white/20 text-white text-[11px] px-3 py-1.5 rounded-lg font-medium border border-white/20 transition flex items-center gap-1"
                  >
                    <MessageSquare size={13} />
                    <span>Chat</span>
                  </button>
                </div>
              </div>

              {/* Primary Actions Grid (Section 5) */}
              <div>
                <div className="text-xs font-bold text-slate-800 mb-2">Quick Actions</div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    id="btn-browse-products"
                    onClick={() => setShowCatalogue(true)}
                    className="p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 text-left shadow-xs transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                      <Search size={16} />
                    </div>
                    <div className="text-xs font-bold text-slate-900">Browse Products</div>
                    <div className="text-[10px] text-slate-500">Schneider, ABB, Polycab</div>
                  </button>

                  <button
                    id="btn-bulk-order"
                    onClick={() => setShowBulkOrderModal(true)}
                    className="p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 text-left shadow-xs transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                      <Upload size={16} />
                    </div>
                    <div className="text-xs font-bold text-slate-900">Bulk BOQ Order</div>
                    <div className="text-[10px] text-slate-500">Upload Excel / PDF / CSV</div>
                  </button>

                  <button
                    id="btn-view-quotations"
                    onClick={() => setActiveTab('quotations')}
                    className="p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 text-left shadow-xs transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                      <FileText size={16} />
                    </div>
                    <div className="text-xs font-bold text-slate-900">Quotations ({quotation.id})</div>
                    <div className="text-[10px] text-slate-500">Review & Accept Proposal</div>
                  </button>

                  <button
                    id="btn-quick-reorder"
                    onClick={() => {
                      quickReorderFromOrder();
                    }}
                    className="p-3 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 text-left shadow-xs transition group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-105 transition">
                      <RotateCcw size={16} />
                    </div>
                    <div className="text-xs font-bold text-slate-900">Quick Reorder</div>
                    <div className="text-[10px] text-slate-500">From historical SO-001</div>
                  </button>
                </div>
              </div>

              {/* Status Feed Cards: Requirement, Quotation, Order, Delivery, Invoice */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold text-slate-800">Active Journey Status</div>

                {/* 1. Open Requirement Card */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
                      {requirement.id}
                    </span>
                    <span className="text-[10px] font-semibold text-blue-700 capitalize bg-blue-100 px-2 py-0.5 rounded-full">
                      {requirement.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-semibold text-slate-900">
                    {requirement.projectName}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {requirement.items.length} Products • Multi-Brand (Schneider, ABB, Polycab, Havells)
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-600 border-t border-slate-100 pt-2">
                    <span>Site: {requirement.deliverySite.split('(')[0]}</span>
                    <button
                      onClick={() => setShowRequirementReview(true)}
                      className="text-blue-600 font-semibold hover:underline flex items-center gap-1"
                    >
                      View <ChevronRight size={12} />
                    </button>
                  </div>
                </div>

                {/* 2. Pending Quotation Card (Section 11 & 12) */}
                <div className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded">
                        {quotation.id}
                      </span>
                      {quotation.items.some((i) => i.alternativeTo) && (
                        <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                          <Sparkles size={10} /> Alt Offer
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                      {quotation.customerStatus}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between items-baseline">
                    <span className="text-xs font-bold text-slate-900">
                      Total: ₹{quotation.grandTotal.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500">Incl. 18% GST</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                    Payment: {quotation.paymentTerms} • {quotation.deliveryTerms}
                  </p>
                  <div className="mt-2.5 flex items-center gap-2">
                    <button
                      id="mobile-open-quote-btn"
                      onClick={() => setActiveTab('quotations')}
                      className="flex-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold py-1.5 rounded-lg transition text-center"
                    >
                      Review Quotation & Alternative
                    </button>
                  </div>
                </div>

                {/* 3. Active Sales Order & Simple Timeline (Section 15) */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded">
                      {salesOrder.id}
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      {salesOrder.status}
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-bold text-slate-900">
                    Order Tracking: {salesOrder.projectName}
                  </div>

                  {/* Customer Safe Simple Timeline - Section 15 */}
                  <div className="mt-3 space-y-1.5">
                    <div className="text-[10px] text-slate-500 font-semibold uppercase">
                      Simple Customer Timeline
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-600 overflow-x-auto py-1 gap-1">
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                        <CheckCircle size={11} /> Quote
                      </span>
                      <span>→</span>
                      <span className="text-emerald-600 font-bold flex items-center gap-0.5">
                        <CheckCircle size={11} /> Order
                      </span>
                      <span>→</span>
                      <span
                        className={
                          ['Warehouse Allocation', 'Picking', 'Packing', 'Dispatched', 'In Transit', 'Delivered', 'Completed'].includes(
                            salesOrder.status
                          )
                            ? 'text-emerald-600 font-bold'
                            : 'text-slate-400'
                        }
                      >
                        Preparing
                      </span>
                      <span>→</span>
                      <span
                        className={
                          ['Dispatched', 'In Transit', 'Delivered', 'Completed'].includes(salesOrder.status)
                            ? 'text-emerald-600 font-bold'
                            : 'text-slate-400'
                        }
                      >
                        Dispatched
                      </span>
                      <span>→</span>
                      <span
                        className={
                          ['Delivered', 'Completed'].includes(salesOrder.status)
                            ? 'text-emerald-600 font-bold'
                            : 'text-slate-400'
                        }
                      >
                        Delivered
                      </span>
                    </div>
                  </div>

                  {/* Partial Delivery Card (Section 16) */}
                  {delivery.isPartialDelivery && (
                    <div className="mt-2.5 p-2 bg-amber-50 rounded-lg border border-amber-200 text-xs">
                      <div className="font-bold text-amber-900 flex items-center justify-between">
                        <span>PARTIALLY DELIVERED</span>
                        <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                          Next: {delivery.nextExpectedDate || '2026-09-14'}
                        </span>
                      </div>
                      <div className="mt-1 flex justify-between text-slate-700 text-[11px]">
                        <span>Delivered: {delivery.deliveredQtySum} units</span>
                        <span className="font-semibold text-amber-800">
                          Remaining: {delivery.remainingQtySum} units
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-[11px] text-slate-500">
                      Vehicle: {delivery.vehicleNumber.split(' ')[0]}
                    </span>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="text-blue-600 font-semibold text-xs hover:underline flex items-center gap-1"
                    >
                      Full Details <ChevronRight size={12} />
                    </button>
                  </div>
                </div>

                {/* 4. Invoice & Payment Quick Card (Section 17 & 18) */}
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded">
                      {invoice.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        invoice.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {invoice.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-2 flex justify-between items-baseline">
                    <div className="text-xs font-bold text-slate-900">
                      Amount: ₹{invoice.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-slate-500">Due: {invoice.dueDate.split('(')[0]}</div>
                  </div>
                  {invoice.status !== 'Paid' ? (
                    <button
                      onClick={() => setShowPaymentModal(true)}
                      className="mt-2.5 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-1.5 rounded-lg transition"
                    >
                      Pay Now via Corporate Banking
                    </button>
                  ) : (
                    <div className="mt-2 text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                      <CheckCircle size={13} /> Paid via {payment.paymentMethod} (Ref: {payment.transactionRef})
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* PRODUCT CATALOGUE VIEW (Section 6 & 7) */}
          {showCatalogue && (
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Tamil Nadu Electrical Catalogue</h3>
                  <p className="text-[10px] text-slate-500">Multi-Brand B2B Products</p>
                </div>
                <button
                  onClick={() => setShowCatalogue(false)}
                  className="text-xs text-blue-600 font-semibold px-2 py-1 bg-blue-50 rounded-lg hover:bg-blue-100"
                >
                  Done / Close
                </button>
              </div>

              {/* Search input */}
              <div className="relative">
                <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search MCB, MCCB, Polycab Cable, Floodlights..."
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Brand Pills filter */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
                {['All', 'Schneider Electric', 'ABB', 'Polycab', 'Havells', 'L&T', 'Legrand'].map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrand(b)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition ${
                      selectedBrand === b
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>

              {/* Requirement Basket Floating Bar (Section 7: 20 products under ONE requirement) */}
              <div className="bg-slate-900 text-white p-3 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-amber-400">
                    {basketItems.length} Products in Requirement
                  </span>
                  <p className="text-[10px] text-slate-300">
                    All brands consolidated under single REQ-001
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowCatalogue(false);
                    setShowRequirementReview(true);
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition"
                >
                  Review REQ-001 →
                </button>
              </div>

              {/* Product Cards List */}
              <div className="space-y-3">
                {filteredProducts.map((product) => {
                  const inBasket = basketItems.find((i) => i.product.id === product.id);
                  return (
                    <div
                      key={product.id}
                      className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex justify-between items-start">
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                            {product.brand}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">{product.sku}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 mt-1">{product.name}</h4>
                        <p className="text-[10px] text-slate-500 mt-0.5">{product.specification}</p>
                      </div>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100">
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            ₹{product.baseListPrice.toLocaleString()} / {product.uom}
                          </div>
                          <div className="text-[9px] text-slate-400">MOQ: {product.moq} {product.uom}</div>
                        </div>

                        {inBasket ? (
                          <div className="flex items-center gap-1.5 bg-blue-50 p-1 rounded-lg border border-blue-200">
                            <button
                              onClick={() => updateBasketQty(product.id, inBasket.quantity - product.moq)}
                              className="w-6 h-6 bg-white rounded text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200"
                            >
                              -
                            </button>
                            <span className="text-xs font-bold text-blue-900 px-1">
                              {inBasket.quantity}
                            </span>
                            <button
                              onClick={() => updateBasketQty(product.id, inBasket.quantity + product.moq)}
                              className="w-6 h-6 bg-white rounded text-blue-700 font-bold text-xs flex items-center justify-center border border-blue-200"
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => addToBasket(product)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition"
                          >
                            <Plus size={13} /> Add to REQ
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* BULK ORDER / BOQ UPLOAD VIEW (Section 8) */}
          {showBulkOrderModal && (
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Bulk Industrial BOQ Order</h3>
                  <p className="text-[10px] text-slate-500">Section 8 Master Requirement</p>
                </div>
                <button
                  onClick={() => setShowBulkOrderModal(false)}
                  className="text-xs text-slate-500 font-semibold hover:text-slate-800"
                >
                  Cancel
                </button>
              </div>

              {/* Upload formats card */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-dashed border-amber-300 rounded-2xl p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-800 mx-auto flex items-center justify-center mb-2">
                  <FileSpreadsheet size={20} />
                </div>
                <div className="text-xs font-bold text-slate-900">Upload BOQ / Project Schedule</div>
                <p className="text-[10px] text-slate-600 mt-0.5">
                  Accepts Excel (.xlsx), CSV, PDF or AutoCAD Schedule
                </p>

                <div className="mt-3 inline-flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-amber-200 text-xs font-semibold text-amber-900 shadow-xs">
                  <CheckCircle size={14} className="text-emerald-600" />
                  <span>{uploadedFileName}</span>
                </div>
              </div>

              {/* Form fields */}
              <div className="space-y-2.5 bg-white p-3.5 rounded-xl border border-slate-200">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Project Name</label>
                  <input
                    type="text"
                    value={bulkProjectName}
                    onChange={(e) => setBulkProjectName(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Contract Reference</label>
                  <input
                    type="text"
                    value={bulkContractRef}
                    onChange={(e) => setBulkContractRef(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Delivery Site</label>
                  <input
                    type="text"
                    value={bulkDeliverySite}
                    onChange={(e) => setBulkDeliverySite(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Required On-Site Date</label>
                  <input
                    type="date"
                    value={bulkRequiredDate}
                    onChange={(e) => setBulkRequiredDate(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Special Requirements / Notes</label>
                  <textarea
                    rows={2}
                    value={bulkNotes}
                    onChange={(e) => setBulkNotes(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <button
                id="btn-review-bulk-req"
                onClick={() => {
                  setShowBulkOrderModal(false);
                  setShowRequirementReview(true);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition"
              >
                Review Requirement (4 Brands Included) →
              </button>
            </div>
          )}

          {/* REQUIREMENT REVIEW (Section 9) */}
          {showRequirementReview && (
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Review Requirement REQ-001</h3>
                  <p className="text-[10px] text-slate-500">Multi-Brand Single Enquiry</p>
                </div>
                <button
                  onClick={() => setShowRequirementReview(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Back
                </button>
              </div>

              {/* Summary card */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                <div>
                  <span className="text-slate-400">Project:</span>{' '}
                  <span className="font-semibold text-slate-800">{bulkProjectName}</span>
                </div>
                <div>
                  <span className="text-slate-400">Site:</span>{' '}
                  <span className="text-slate-800">{bulkDeliverySite}</span>
                </div>
                <div>
                  <span className="text-slate-400">Date:</span>{' '}
                  <span className="text-slate-800">{bulkRequiredDate}</span>
                </div>
                <div>
                  <span className="text-slate-400">Attachment:</span>{' '}
                  <span className="text-blue-600 font-mono font-medium">{uploadedFileName}</span>
                </div>
              </div>

              {/* Items in Requirement */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800">
                  Products in this Requirement ({basketItems.length})
                </div>
                {basketItems.map((item, idx) => (
                  <div
                    key={item.product.id}
                    className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs flex justify-between items-center"
                  >
                    <div>
                      <span className="text-[9px] font-bold uppercase bg-slate-100 px-1 py-0.2 rounded text-slate-600">
                        {item.product.brand}
                      </span>
                      <div className="font-semibold text-slate-900 mt-0.5">{item.product.name}</div>
                      <div className="text-[10px] text-slate-500">{item.product.specification}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-blue-700">
                        {item.quantity} {item.product.uom}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Section 9 Primary CTA: SUBMIT REQUIREMENT */}
              <button
                id="btn-submit-requirement-final"
                onClick={handleFinalRequirementSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition"
              >
                SUBMIT REQUIREMENT
              </button>
            </div>
          )}

          {/* TAB 2: QUOTATIONS (Section 11, 12, 13, 14) */}
          {activeTab === 'quotations' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Quotation {quotation.id}</h3>
                  <p className="text-[10px] text-slate-500">Customer Proposal Document</p>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    quotation.customerStatus === 'Accepted'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {quotation.customerStatus}
                </span>
              </div>

              {/* Quotation Header Metadata */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Date Issued:</span>
                  <span className="font-medium text-slate-800">{quotation.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Validity:</span>
                  <span className="font-medium text-slate-800">{quotation.validUntil}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Sales Executive:</span>
                  <span className="font-medium text-blue-700">{quotation.salesExecutiveName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Terms:</span>
                  <span className="font-medium text-slate-800">{quotation.paymentTerms}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery Terms:</span>
                  <span className="font-medium text-slate-800">{quotation.deliveryTerms}</span>
                </div>
              </div>

              {/* ALTERNATIVE PRODUCT UX - Section 12 Mandate */}
              {quotation.items.some((i) => i.alternativeTo) && (
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 p-3.5 rounded-2xl shadow-xs">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                    <Sparkles size={14} className="text-indigo-600" />
                    <span>Technical Equivalent Alternative Offered</span>
                  </div>
                  <p className="text-[10px] text-indigo-700 mt-0.5">
                    Offered by Arun Kumar to prevent a 3-week Schneider factory lead time.
                  </p>

                  <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded-xl border border-indigo-100">
                    <div className="border-r border-slate-200 pr-2">
                      <div className="text-[9px] font-bold text-slate-400 uppercase">You Requested:</div>
                      <div className="font-bold text-slate-700">Schneider Acti9 iC60N 32A</div>
                      <div className="text-[10px] text-rose-600 mt-0.5">⚠️ 3-week factory delay</div>
                      <div className="text-[10px] text-slate-500">List: ₹1,850</div>
                    </div>
                    <div className="pl-2">
                      <div className="text-[9px] font-bold text-emerald-600 uppercase">We Offer:</div>
                      <div className="font-bold text-indigo-900">ABB S203 Compact 32A</div>
                      <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                        ✓ In Stock (Chennai Central WH)
                      </div>
                      <div className="text-[10px] font-bold text-blue-700">
                        Quoted: ₹1,650 (Save ₹100/unit)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Quotation Line Items Table (Customer-Safe: Shows List Price MRP, Applied Project Discount, and Net Quoted Price) */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800">Offered Product Items ({quotation.items.length})</div>
                {quotation.items.map((item, idx) => {
                  const effectiveListPrice = item.listPrice || Math.round(item.quotedUnitPrice / (1 - (item.discountPercent || 15) / 100));
                  const discount = item.discountPercent ?? 15;
                  return (
                    <div
                      key={idx}
                      className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs text-xs space-y-1.5"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-bold uppercase bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded">
                            {item.brand}
                          </span>
                          <div className="font-bold text-slate-900 mt-0.5">{item.productName}</div>
                          <div className="text-[10px] text-slate-500">{item.specification}</div>
                        </div>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          {discount}% Off
                        </span>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-slate-100 text-[11px]">
                        <div>
                          <span className="text-slate-400 line-through text-[10px] mr-1">
                            ₹{effectiveListPrice.toLocaleString()}
                          </span>
                          <span className="font-bold text-slate-900">
                            ₹{item.quotedUnitPrice.toLocaleString()}
                          </span>
                          <span className="text-slate-500 text-[10px] ml-1">
                            × {item.quantity} {item.uom}
                          </span>
                        </div>
                        <div className="font-bold text-emerald-800">₹{item.lineTotal.toLocaleString()}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Financial Totals with Savings Breakdown */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex justify-between text-slate-500">
                  <span>Total List Price (MRP):</span>
                  <span className="font-mono">₹{(quotation.totalListPrice || Math.round(quotation.subtotal / 0.85)).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded">
                  <span>Project Discount ({quotation.averageDiscountPercent || 15}%):</span>
                  <span className="font-mono font-bold">
                    -₹{(quotation.totalDiscountAmount || Math.round(((quotation.totalListPrice || Math.round(quotation.subtotal / 0.85)) - quotation.subtotal))).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-slate-700 font-medium">
                  <span>Net Commercial Subtotal:</span>
                  <span className="font-mono">₹{quotation.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Consolidated GST (18%):</span>
                  <span className="font-mono">₹{quotation.totalTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                  <span>Grand Total Quoted:</span>
                  <span className="text-emerald-700 font-mono">₹{quotation.grandTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Section 11 & 14 Actions: Accept, Request Changes, Reject */}
              {quotation.customerStatus !== 'Accepted' ? (
                <div className="space-y-2">
                  <button
                    id="btn-accept-quotation"
                    onClick={acceptQuotationCustomer}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle size={15} />
                    <span>ACCEPT QUOTATION</span>
                  </button>

                  <div className="flex gap-2">
                    <button
                      id="btn-request-changes"
                      onClick={() => setShowChangeRequestModal(true)}
                      className="flex-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-xs py-2 rounded-xl transition"
                    >
                      Request Changes
                    </button>
                    <button
                      id="btn-reject-quote"
                      onClick={rejectQuotationCustomer}
                      className="px-3 bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 font-semibold text-xs py-2 rounded-xl transition"
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center mb-1.5">
                    <CheckCircle size={18} />
                  </div>
                  <h4 className="text-xs font-bold text-emerald-900">QUOTATION ACCEPTED</h4>
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    Your order is now being processed. Sales Order {salesOrder.id} generated automatically.
                  </p>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="mt-2 text-xs bg-emerald-600 text-white px-3 py-1 rounded-lg font-semibold hover:bg-emerald-700"
                  >
                    Track Order Live →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ORDERS (Section 15, 16, 17, 18, 19, 20) */}
          {activeTab === 'orders' && (
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Order {salesOrder.id}</h3>
                  <p className="text-[10px] text-slate-500">{salesOrder.projectName}</p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  {salesOrder.status}
                </span>
              </div>

              {/* Simple Order Timeline (Section 15) */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="text-xs font-bold text-slate-900">Delivery Status Timeline</div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <CheckCircle size={14} className="text-emerald-600" />
                    <span>Quotation Accepted</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <CheckCircle size={14} className="text-emerald-600" />
                    <span>Order Confirmed & Stock Verified</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                    <CheckCircle size={14} className="text-emerald-600" />
                    <span>Preparing & Packed at Chennai WH</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      ['Dispatched', 'In Transit', 'Delivered', 'Completed'].includes(salesOrder.status)
                        ? 'text-emerald-700 font-semibold'
                        : 'text-slate-400'
                    }`}
                  >
                    {['Dispatched', 'In Transit', 'Delivered', 'Completed'].includes(salesOrder.status) ? (
                      <CheckCircle size={14} className="text-emerald-600" />
                    ) : (
                      <Clock size={14} />
                    )}
                    <span>Dispatched (Vehicle {delivery.vehicleNumber.split(' ')[0]})</span>
                  </div>
                  <div
                    className={`flex items-center gap-2 ${
                      ['Delivered', 'Completed'].includes(salesOrder.status)
                        ? 'text-emerald-700 font-semibold'
                        : 'text-slate-400'
                    }`}
                  >
                    {['Delivered', 'Completed'].includes(salesOrder.status) ? (
                      <CheckCircle size={14} className="text-emerald-600" />
                    ) : (
                      <Clock size={14} />
                    )}
                    <span>Delivered & Digital POD Signed</span>
                  </div>
                </div>
              </div>

              {/* Ordered Products breakdown */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800">Order Items</div>
                {salesOrder.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1"
                  >
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-900">{item.productName}</span>
                      <span className="font-bold text-blue-700">
                        {item.orderedQty} {item.uom}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500">{item.specification}</div>
                    {delivery.isPartialDelivery && (
                      <div className="flex justify-between text-[11px] text-amber-700 pt-1 border-t border-slate-100 font-medium">
                        <span>Delivered: {item.deliveredQty}</span>
                        <span>Pending: {item.remainingQty}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Order Actions: Download Invoice & Quick Reorder (Section 19 & 20) */}
              <div className="space-y-2 pt-2">
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      addToast('Invoice Downloaded', 'Tax_Invoice_INV-001.pdf downloaded to device', 'info');
                    }}
                    className="flex-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs py-2 rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <Download size={14} />
                    <span>Download Invoice</span>
                  </button>

                  <button
                    id="btn-reorder-mobile"
                    onClick={quickReorderFromOrder}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-xl transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <RotateCcw size={14} />
                    <span>Quick Reorder</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INBOX (Section 10 - Inaiwazhi connected layer) */}
          {activeTab === 'inbox' && (
            <div className="p-4 space-y-3">
              <div className="bg-slate-900 text-white p-3.5 rounded-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Inaiwazhi Live Communication
                  </h3>
                  <span className="text-[10px] bg-blue-600 px-2 py-0.5 rounded font-mono font-medium">
                    {quotation.id}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1">
                  Direct connection with Sales Executive{' '}
                  <span className="text-white font-bold">{activeCustomer.assignedSalesName}</span>.
                </p>
              </div>

              <div className="bg-white p-3 rounded-2xl border border-slate-200 text-xs space-y-3 min-h-[360px] flex flex-col justify-between">
                <div className="space-y-2.5">
                  <div className="bg-slate-100 p-2.5 rounded-xl text-slate-700 text-[11px]">
                    <div className="font-bold text-blue-800 mb-0.5">Arun Kumar (Sales KAM):</div>
                    Hello Mr. Ramesh, we have ready inventory in Chennai Central WH for your Ambattur project. Please review quotation QT-001 with the ABB MCB substitution.
                  </div>
                  <div className="bg-blue-600 text-white p-2.5 rounded-xl text-[11px] ml-auto max-w-[85%]">
                    Thank you Arun. Checking the technical specifications and line total now.
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <div className="flex gap-1 overflow-x-auto text-[10px]">
                    <button
                      onClick={() =>
                        sendInaiwazhiMessage('Can you confirm test certificates for Polycab cables?')
                      }
                      className="bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-full whitespace-nowrap"
                    >
                      CPRI Test Certificates?
                    </button>
                    <button
                      onClick={() =>
                        sendInaiwazhiMessage('What is the exact delivery time to Ambattur Site?')
                      }
                      className="bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-full whitespace-nowrap"
                    >
                      Delivery ETA?
                    </button>
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Type message to Arun Kumar..."
                      className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          sendInaiwazhiMessage(e.currentTarget.value.trim());
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <button
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        if (input && input.value.trim()) {
                          sendInaiwazhiMessage(input.value.trim());
                          input.value = '';
                        }
                      }}
                      className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ACCOUNT */}
          {activeTab === 'account' && (
            <div className="p-4 space-y-4">
              <div className="bg-white p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="font-bold text-sm text-slate-900">{activeCustomer.name}</div>
                <div className="text-slate-500">GSTIN: {activeCustomer.gst}</div>
                <div className="text-slate-500">PAN: {activeCustomer.pan}</div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-slate-500">Credit Limit:</span>
                  <span className="font-bold text-slate-900">
                    ₹{activeCustomer.creditLimit.toLocaleString()} (45 Days Credit)
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Credit Used:</span>
                  <span className="font-semibold text-blue-700">
                    ₹{activeCustomer.creditUsed.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Authorized Delivery Sites */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-800">Authorized Sites</div>
                {activeCustomer.sites.map((site) => (
                  <div key={site.id} className="bg-white p-3 rounded-xl border border-slate-200 text-xs">
                    <div className="font-bold text-slate-900">{site.name}</div>
                    <div className="text-slate-500 text-[11px] mt-0.5">{site.address}</div>
                    <div className="text-[10px] text-blue-600 mt-1">
                      Contact: {site.contactPerson} ({site.phone})
                    </div>
                  </div>
                ))}
              </div>

              {/* Switch Account & Logout Action */}
              <div className="pt-2">
                <button
                  id="customer-btn-logout-account-tab"
                  onClick={logoutCustomer}
                  className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-xs py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  <LogOut size={14} />
                  <span>Switch Enterprise Account / Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Change Request Modal (Section 13) */}
        {showChangeRequestModal && (
          <div className="absolute inset-0 z-30 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-4 w-full max-w-sm space-y-3 shadow-xl">
              <h4 className="text-xs font-bold text-slate-900">Request Quotation Revision (QT-001-R1)</h4>
              <p className="text-[10px] text-slate-500">
                Specify revision details. Original QT-001 will be preserved in history.
              </p>
              <textarea
                rows={3}
                value={changeComment}
                onChange={(e) => setChangeComment(e.target.value)}
                placeholder="e.g. Please reduce Polycab cable from 400m to 300m and advance delivery to 15th Sept."
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:ring-1 focus:ring-blue-500"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowChangeRequestModal(false)}
                  className="flex-1 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-change-request"
                  onClick={() => {
                    requestQuotationChangesCustomer(
                      changeComment || 'Requested revision on quantity and delivery date.'
                    );
                    setShowChangeRequestModal(false);
                    setChangeComment('');
                  }}
                  className="flex-1 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
                >
                  Submit Revision
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Modal (Section 18) */}
        {showPaymentModal && (
          <div className="absolute inset-0 z-30 bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-4 w-full max-w-sm space-y-3 shadow-xl">
              <h4 className="text-xs font-bold text-slate-900">Pay Invoice INV-001</h4>
              <div className="text-sm font-bold text-blue-700">
                Total: ₹{invoice.totalAmount.toLocaleString()}
              </div>

              <div className="space-y-1.5 text-xs">
                <label className="text-[10px] font-bold text-slate-600 uppercase">Payment Method</label>
                <div className="space-y-1">
                  {(['NEFT / RTGS', 'UPI Corporate', 'Letter of Credit'] as const).map((m) => (
                    <label
                      key={m}
                      className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer ${
                        paymentMethod === m
                          ? 'border-blue-500 bg-blue-50 text-blue-900 font-semibold'
                          : 'border-slate-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payMethod"
                        checked={paymentMethod === m}
                        onChange={() => setPaymentMethod(m)}
                        className="text-blue-600"
                      />
                      <span>{m}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  id="btn-confirm-payment-mobile"
                  onClick={() => {
                    recordCustomerPayment(
                      paymentMethod,
                      `TXN-TN26-${Math.floor(100000 + Math.random() * 900000)}`
                    );
                    setShowPaymentModal(false);
                  }}
                  className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Navigation Bar (Section 4: Home, Orders, Quotations, Inbox, Account) */}
        <div className="absolute bottom-0 inset-x-0 bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around z-20 shadow-md">
          <button
            id="mobile-nav-home"
            onClick={() => {
              setActiveTab('home');
              setShowCatalogue(false);
              setShowBulkOrderModal(false);
              setShowRequirementReview(false);
            }}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition ${
              activeTab === 'home' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home size={18} />
            <span>Home</span>
          </button>

          <button
            id="mobile-nav-quotations"
            onClick={() => {
              setActiveTab('quotations');
              setShowCatalogue(false);
              setShowBulkOrderModal(false);
              setShowRequirementReview(false);
            }}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition ${
              activeTab === 'quotations' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              <FileText size={18} />
              {quotation.customerStatus !== 'Accepted' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500 ring-1 ring-white" />
              )}
            </div>
            <span>Quotations</span>
          </button>

          <button
            id="mobile-nav-orders"
            onClick={() => {
              setActiveTab('orders');
              setShowCatalogue(false);
              setShowBulkOrderModal(false);
              setShowRequirementReview(false);
            }}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition ${
              activeTab === 'orders' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Package size={18} />
            <span>Orders</span>
          </button>

          <button
            id="mobile-nav-inbox"
            onClick={() => {
              setActiveTab('inbox');
              setShowCatalogue(false);
              setShowBulkOrderModal(false);
              setShowRequirementReview(false);
            }}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition ${
              activeTab === 'inbox' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="relative">
              <MessageSquare size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
            </div>
            <span>Inbox</span>
          </button>

          <button
            id="mobile-nav-account"
            onClick={() => {
              setActiveTab('account');
              setShowCatalogue(false);
              setShowBulkOrderModal(false);
              setShowRequirementReview(false);
            }}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-medium transition ${
              activeTab === 'account' ? 'text-blue-600 font-bold' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Building size={18} />
            <span>Account</span>
          </button>
        </div>
      </div>
    </div>
  );
};
