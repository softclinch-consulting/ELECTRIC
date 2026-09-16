import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { InternalQuotationItem, ProductMasterItem } from '../../types';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  FileText,
  Package,
  Sparkles,
  Send,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Building,
  Phone,
  Mail,
  Shield,
  Search,
  Percent,
  Check,
  RotateCcw,
  ExternalLink,
  Plus,
  Trash2,
  Edit3,
  Save,
  RefreshCw,
  AlertTriangle,
  Tag,
  Calendar,
  MapPin,
  Sliders,
  X,
  FileSpreadsheet,
  Truck,
} from 'lucide-react';

export const SalesDesktopView: React.FC = () => {
  const {
    activeCustomer,
    requirement,
    quotation,
    salesOrder,
    products,
    updateQuotationItemPrice,
    updateQuotationItemDiscount,
    applyDiscountToAllQuotationItems,
    addProductMasterItem,
    updateProductMasterItem,
    deleteProductMasterItem,
    updateQuotationItemQty,
    addQuotationItem,
    removeQuotationItem,
    updateQuotationTerms,
    applyMarginToAllQuotationItems,
    loadQuotationFromRequirement,
    updateSalesOrderDetails,
    substituteQuotationProduct,
    submitQuotationForAdminApproval,
    sendQuotationToCustomer,
    sendInaiwazhiMessage,
    addToast,
  } = useApp();

  // Sales Navigation tabs (Section 29)
  const [salesTab, setSalesTab] = useState<
    'dashboard' | 'enquiries' | 'quotation_builder' | 'customers' | 'orders' | 'product_master'
  >('dashboard');

  // Commercial Terms & Notes State
  const [internalNotes, setInternalNotes] = useState<string>(
    quotation.internalNotes || 'Offered ABB S203 MCB as direct equivalent to avoid 3-week Schneider delay. 120 ready in Chennai WH.'
  );
  const [paymentTermsInput, setPaymentTermsInput] = useState<string>(
    quotation.paymentTerms || '45 Days Credit'
  );
  const [deliveryTermsInput, setDeliveryTermsInput] = useState<string>(
    quotation.deliveryTerms || 'Door Delivery to Ambattur Site'
  );
  const [validUntilInput, setValidUntilInput] = useState<string>(
    quotation.validUntil || '2026-09-23'
  );

  // Add Product Modal State
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [productSearch, setProductSearch] = useState<string>('');
  const [selectedBrandFilter, setSelectedBrandFilter] = useState<string>('All');
  const [selectedProductToAdd, setSelectedProductToAdd] = useState<ProductMasterItem | null>(null);
  const [addQty, setAddQty] = useState<number>(10);
  const [addCustomPrice, setAddCustomPrice] = useState<number>(0);
  const [addDiscountPercent, setAddDiscountPercent] = useState<number>(15);

  // Master Product Flow state
  const [masterSearch, setMasterSearch] = useState<string>('');
  const [masterBrandFilter, setMasterBrandFilter] = useState<string>('All');
  const [masterCategoryFilter, setMasterCategoryFilter] = useState<string>('All');
  const [showCreateMasterModal, setShowCreateMasterModal] = useState<boolean>(false);
  const [newMasterName, setNewMasterName] = useState<string>('');
  const [newMasterBrand, setNewMasterBrand] = useState<string>('Schneider Electric');
  const [newMasterCategory, setNewMasterCategory] = useState<string>('Switchgear');
  const [newMasterSku, setNewMasterSku] = useState<string>('');
  const [newMasterSpec, setNewMasterSpec] = useState<string>('');
  const [newMasterUom, setNewMasterUom] = useState<string>('Nos');
  const [newMasterListPrice, setNewMasterListPrice] = useState<number>(1500);
  const [newMasterDiscount, setNewMasterDiscount] = useState<number>(15);
  const [newMasterMoq, setNewMasterMoq] = useState<number>(5);
  const [newMasterLeadTime, setNewMasterLeadTime] = useState<number>(2);
  const [newMasterHsn, setNewMasterHsn] = useState<string>('85362030');

  // Product Substitution Modal State
  const [showSubstituteModal, setShowSubstituteModal] = useState<boolean>(false);
  const [substituteItem, setSubstituteItem] = useState<InternalQuotationItem | null>(null);

  // Sales Order Delivery Editing State
  const [isEditingOrder, setIsEditingOrder] = useState<boolean>(false);
  const [orderDeliverySite, setOrderDeliverySite] = useState<string>(salesOrder.deliverySite);
  const [orderContactPerson, setOrderContactPerson] = useState<string>('Ramesh K. (Purchase Head, +91 98401 23456)');
  const [orderPriority, setOrderPriority] = useState<'Standard' | 'Express' | 'Urgent'>('Express');
  const [orderSpecialNotes, setOrderSpecialNotes] = useState<string>(
    'Priority dispatch to Ambattur Line 3 Substation. Offload at Gate 2 with forklift.'
  );

  // Filtered products for Add Product modal
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.brand.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase());
    const matchesBrand = selectedBrandFilter === 'All' || p.brand === selectedBrandFilter;
    return matchesSearch && matchesBrand;
  });

  const handleOpenAddModal = () => {
    setProductSearch('');
    setSelectedBrandFilter('All');
    const firstProd = products[0];
    setSelectedProductToAdd(firstProd);
    setAddQty(firstProd?.moq || 10);
    const disc = firstProd?.standardDiscountPercent || 15;
    setAddDiscountPercent(disc);
    const calculatedPrice = firstProd ? Math.round(firstProd.baseListPrice * (1 - disc / 100)) : 1000;
    setAddCustomPrice(calculatedPrice);
    setShowAddModal(true);
  };

  const handleConfirmAddProduct = () => {
    if (!selectedProductToAdd) return;
    addQuotationItem(selectedProductToAdd.id, addQty, addCustomPrice, addDiscountPercent);
    setShowAddModal(false);
  };

  const handleCreateNewMasterProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMasterName || !newMasterSku) {
      addToast('Missing Required Fields', 'Please provide Product Name and SKU Code.', 'warning');
      return;
    }

    const generatedId = `PROD-${newMasterBrand.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const newProduct: ProductMasterItem = {
      id: generatedId,
      name: newMasterName,
      brand: newMasterBrand,
      category: newMasterCategory,
      sku: newMasterSku.toUpperCase(),
      specification: newMasterSpec || 'Standard Industrial Specification',
      uom: newMasterUom,
      baseListPrice: Number(newMasterListPrice),
      standardDiscountPercent: Number(newMasterDiscount),
      moq: Number(newMasterMoq),
      standardLeadTimeDays: Number(newMasterLeadTime),
      hsnCode: newMasterHsn || '85362030',
      gstRate: 18,
      gstRatePercent: 18,
    };

    addProductMasterItem(newProduct);
    setShowCreateMasterModal(false);
    // Reset form
    setNewMasterName('');
    setNewMasterSku('');
    setNewMasterSpec('');
    setNewMasterListPrice(1500);
    setNewMasterDiscount(15);
  };

  const handleQuickAddMasterToQuotation = (prod: ProductMasterItem, qty = 10) => {
    const disc = prod.standardDiscountPercent || 15;
    const unitPrice = Math.round(prod.baseListPrice * (1 - disc / 100));
    addQuotationItem(prod.id, qty, unitPrice, disc);
    addToast('Product Added to Quotation', `Added ${qty} ${prod.uom} of ${prod.name} to active quotation ${quotation.id}.`, 'success');
  };

  const handleOpenSubstituteModal = (item: InternalQuotationItem) => {
    setSubstituteItem(item);
    setShowSubstituteModal(true);
  };

  const handleConfirmSubstitution = (newProductId: string) => {
    if (!substituteItem) return;
    substituteQuotationProduct(substituteItem.productId, newProductId);
    setShowSubstituteModal(false);
  };

  const handleSaveTerms = () => {
    updateQuotationTerms({
      paymentTerms: paymentTermsInput,
      deliveryTerms: deliveryTermsInput,
      validUntil: validUntilInput,
      internalNotes,
    });
  };

  const handleSaveOrderDetails = () => {
    updateSalesOrderDetails({
      deliverySite: orderDeliverySite,
    });
    setIsEditingOrder(false);
    addToast('Delivery Details Saved', 'Logistics and site delivery instructions updated for warehouse dispatch.', 'success');
  };

  const handleSendOrderUpdateInaiwazhi = () => {
    sendInaiwazhiMessage(
      `Update for Sales Order ${salesOrder.id}: Delivery prioritized as "${orderPriority}". Site: ${orderDeliverySite}. Dispatched units will be received by ${orderContactPerson}.`,
      'Delivery_Update.pdf',
      'so'
    );
    addToast('Update Sent to Customer', 'Sent delivery status notification to customer Inaiwazhi chat.', 'info');
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 overflow-hidden">
      {/* 1. LEFT NAVIGATION SIDEBAR (Section 28 & 29) */}
      <aside className="w-64 bg-slate-950 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
        {/* Sales KAM Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              AK
            </div>
            <div>
              <div className="font-bold text-white text-xs">Arun Kumar</div>
              <div className="text-[10px] text-slate-400">Senior KAM • Industrial Accounts</div>
            </div>
          </div>
          <span className="text-[9px] bg-emerald-900/60 text-emerald-300 border border-emerald-700/50 px-1.5 py-0.5 rounded font-bold">
            Sales
          </span>
        </div>

        {/* Navigation Items (Section 29) */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
          <button
            id="sales-nav-dashboard"
            onClick={() => setSalesTab('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition ${
              salesTab === 'dashboard'
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : 'hover:bg-slate-900 text-slate-300'
            }`}
          >
            <LayoutDashboard size={16} />
            <span>Sales Dashboard</span>
          </button>

          <button
            id="sales-nav-enquiries"
            onClick={() => setSalesTab('enquiries')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition ${
              salesTab === 'enquiries'
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : 'hover:bg-slate-900 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText size={16} />
              <span>Assigned Enquiries</span>
            </div>
            <span className="text-[10px] bg-blue-600 text-white font-mono px-1.5 rounded">
              {requirement.enquiryId}
            </span>
          </button>

          <button
            id="sales-nav-quotation-builder"
            onClick={() => setSalesTab('quotation_builder')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition ${
              salesTab === 'quotation_builder'
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : 'hover:bg-slate-900 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Sparkles size={16} />
              <span>Quotation & Pricing</span>
            </div>
            <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 rounded">
              {quotation.id}
            </span>
          </button>

          <button
            id="sales-nav-product-master"
            onClick={() => setSalesTab('product_master')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition ${
              salesTab === 'product_master'
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : 'hover:bg-slate-900 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Tag size={16} />
              <span>Master Products</span>
            </div>
            <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-1.5 rounded">
              {products.length}
            </span>
          </button>

          <button
            id="sales-nav-customers"
            onClick={() => setSalesTab('customers')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition ${
              salesTab === 'customers'
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : 'hover:bg-slate-900 text-slate-300'
            }`}
          >
            <Users size={16} />
            <span>Assigned Accounts (360)</span>
          </button>

          <button
            id="sales-nav-orders"
            onClick={() => setSalesTab('orders')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition ${
              salesTab === 'orders'
                ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                : 'hover:bg-slate-900 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package size={16} />
              <span>My Orders & Delivery</span>
            </div>
            <span className="text-[10px] bg-slate-800 text-emerald-400 font-mono px-1.5 rounded">
              {salesOrder.id}
            </span>
          </button>
        </nav>

        {/* Boundary Notice for Sales Role */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/50 text-[11px] space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium">
            <Shield size={13} className="text-emerald-400" />
            <span>Role Boundaries Active</span>
          </div>
          <p className="text-[10px] text-slate-500">
            Account reassignment is restricted to Admin. Sales edits quotation pricing, margins, substitutions, terms & delivery instructions.
          </p>
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Sales Territory: Chennai Industrial Corridor (Ambattur & Guindy)
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-900">
                Target: ₹45,00,000 • Achieved: ₹32,80,000 (72.8%)
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold">
                Quarterly Incentive Band A
              </div>
            </div>
          </div>
        </header>

        {/* Global Customer Action Alert Banner (Shows workflow transitions) */}
        {quotation.customerStatus === 'Changes Requested' && (
          <div className="bg-amber-500 text-slate-950 px-6 py-2.5 flex items-center justify-between text-xs font-bold shadow-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-slate-950" />
              <span>
                Customer Requested Revisions on Quotation: &quot;{quotation.customerChangeComment}&quot;
              </span>
            </div>
            <button
              onClick={() => setSalesTab('quotation_builder')}
              className="bg-slate-950 hover:bg-slate-800 text-white text-[11px] font-bold px-3 py-1 rounded-lg transition"
            >
              Open Quotation Builder to Edit →
            </button>
          </div>
        )}

        {quotation.customerStatus === 'Accepted' && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-bold shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>
                Customer Accepted Quotation {quotation.id}! Sales Order {salesOrder.id} generated and sent to Admin Control Tower.
              </span>
            </div>
            <button
              onClick={() => setSalesTab('orders')}
              className="bg-white hover:bg-slate-100 text-emerald-900 text-[11px] font-bold px-3 py-1 rounded-lg transition"
            >
              Track Order & Logistics →
            </button>
          </div>
        )}

        {/* Main Content View */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: SALES DASHBOARD (Section 30) */}
          {salesTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Commercial Pipeline & Accounts</h2>
                <p className="text-xs text-slate-500">
                  Arun Kumar&apos;s active deals, quotation conversions, and customer interactions.
                </p>
              </div>

              {/* KPI Cards (Section 30) */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <div
                  onClick={() => setSalesTab('enquiries')}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs cursor-pointer hover:border-emerald-400 transition"
                >
                  <div className="text-[11px] font-semibold text-slate-500">My Enquiries</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">1 Open</div>
                  <div className="text-[10px] text-blue-600 mt-1 font-mono">REQ-001 (ABC Ind)</div>
                </div>

                <div
                  onClick={() => setSalesTab('customers')}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs cursor-pointer hover:border-emerald-400 transition"
                >
                  <div className="text-[11px] font-semibold text-slate-500">My Accounts</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">2 Clients</div>
                  <div className="text-[10px] text-emerald-600 mt-1">Tier-1 Industrial</div>
                </div>

                <div
                  onClick={() => setSalesTab('quotation_builder')}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs cursor-pointer hover:border-emerald-400 transition"
                >
                  <div className="text-[11px] font-semibold text-slate-500">Draft Quotes</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">
                    {quotation.approvalStatus === 'Approved' ? '0' : '1'}
                  </div>
                  <div className="text-[10px] text-amber-600 mt-1 font-mono">{quotation.id}</div>
                </div>

                <div
                  onClick={() => setSalesTab('quotation_builder')}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs cursor-pointer hover:border-emerald-400 transition"
                >
                  <div className="text-[11px] font-semibold text-slate-500">Customer Status</div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {quotation.customerStatus}
                  </div>
                  <div className="text-[10px] text-blue-600 mt-1">Proposal Live</div>
                </div>

                <div
                  onClick={() => setSalesTab('orders')}
                  className="bg-white p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-2xs cursor-pointer hover:border-emerald-400 transition"
                >
                  <div className="text-[11px] font-semibold text-emerald-800">Won Orders</div>
                  <div className="text-xl font-bold text-emerald-900 mt-1">1</div>
                  <div className="text-[10px] text-emerald-700 mt-1 font-mono">SO-001</div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-semibold text-slate-500">Pipeline Value</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">
                    ₹{quotation.grandTotal.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-1">
                    {quotation.averageDiscountPercent || 15}% Avg Discount
                  </div>
                </div>
              </div>

              {/* Priority Action Hero Card */}
              <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-5 rounded-2xl shadow-md">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                      Priority Opportunity: ABC Electrical Industries
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">
                      Customer Requirement REQ-001 • {requirement.items.length} Products Consolidated
                    </h3>
                    <p className="text-xs text-slate-300 mt-1">
                      Schneider MCB factory delay: Substitute with ABB S203 (120 ready in Chennai WH) or quote direct with competitive margins.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSalesTab('enquiries')}
                      className="bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition flex items-center gap-1.5"
                    >
                      <FileText size={14} />
                      <span>Review REQ</span>
                    </button>
                    <button
                      onClick={() => setSalesTab('quotation_builder')}
                      className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 shrink-0"
                    >
                      <Sparkles size={15} />
                      <span>Open Quotation Builder</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MULTI-PRODUCT ENQUIRY REVIEW (Section 32) */}
          {salesTab === 'enquiries' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Enquiry Review: {requirement.enquiryId} (REQ-001)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Project: <strong className="text-slate-800">{requirement.projectName}</strong> • Delivery Site: {requirement.deliverySite}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={loadQuotationFromRequirement}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-slate-300 transition"
                  >
                    <RefreshCw size={13} />
                    <span>Sync to Quotation</span>
                  </button>
                  <button
                    onClick={() => setSalesTab('quotation_builder')}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-xs transition"
                  >
                    <span>Build & Edit Quotation {quotation.id}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Requirement Summary Card */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-400">Customer:</span>
                  <div className="font-bold text-slate-800">{activeCustomer.name}</div>
                </div>
                <div>
                  <span className="text-slate-400">Required On-Site:</span>
                  <div className="font-bold text-slate-800">{requirement.requiredDate}</div>
                </div>
                <div>
                  <span className="text-slate-400">BOQ Attachment:</span>
                  <div className="font-mono text-blue-600 font-semibold flex items-center gap-1">
                    <FileSpreadsheet size={13} />
                    <span>{requirement.boqFileName || 'Ambattur_Line3_BOQ.xlsx'}</span>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400">Status:</span>
                  <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 uppercase">
                    {requirement.status}
                  </span>
                </div>
              </div>

              {/* Enquiry Items with Stock Availability & Lead Time Analysis */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <div className="font-bold text-slate-900">
                    Requested Items ({requirement.items.length}) & Stock Availability Check
                  </div>
                  <span className="text-slate-500">Consolidated under single requirement REQ-001</span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Requested Product</th>
                        <th className="p-2.5">Brand</th>
                        <th className="p-2.5 text-center">Req Qty</th>
                        <th className="p-2.5">Chennai WH Stock</th>
                        <th className="p-2.5">Factory Lead Time</th>
                        <th className="p-2.5 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {requirement.items.map((item) => {
                        const isSchneiderDelay = item.brand === 'Schneider Electric';
                        return (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="p-2.5">
                              <div className="font-bold text-slate-900">{item.productName}</div>
                              <div className="text-[10px] text-slate-500">{item.specification}</div>
                            </td>
                            <td className="p-2.5 font-semibold text-slate-700">{item.brand}</td>
                            <td className="p-2.5 text-center font-bold">
                              {item.quantity} {item.uom}
                            </td>
                            <td className="p-2.5">
                              {isSchneiderDelay ? (
                                <span className="text-rose-600 font-bold">0 in Stock (WH-MAA-01)</span>
                              ) : (
                                <span className="text-emerald-700 font-semibold">Available</span>
                              )}
                            </td>
                            <td className="p-2.5">
                              {isSchneiderDelay ? (
                                <span className="text-rose-600 font-bold bg-rose-50 px-1.5 py-0.5 rounded">
                                  ⚠️ 3 Weeks Delay
                                </span>
                              ) : (
                                <span className="text-slate-600">Immediate</span>
                              )}
                            </td>
                            <td className="p-2.5 text-center">
                              {isSchneiderDelay ? (
                                <button
                                  onClick={() => {
                                    substituteQuotationProduct(item.productId, 'PROD-ABB-001');
                                    setSalesTab('quotation_builder');
                                  }}
                                  className="text-[11px] bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 shadow-2xs"
                                >
                                  <Sparkles size={12} /> Substitute ABB S203
                                </button>
                              ) : (
                                <button
                                  onClick={() => setSalesTab('quotation_builder')}
                                  className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold"
                                >
                                  Quote in QT-001
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: INTERNAL QUOTATION BUILDER & COMMERCIAL PRICING */}
          {salesTab === 'quotation_builder' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">
                      Quotation Builder: {quotation.id} (Revision {quotation.revision || 1})
                    </h2>
                    <span className="text-xs bg-slate-200 text-slate-800 font-mono px-2 py-0.5 rounded">
                      Linked to {requirement.enquiryId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Internal margin calculator, brand substitution engine & customer commercial proposal.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      quotation.approvalStatus === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Admin: {quotation.approvalStatus}
                  </span>
                  <span
                    className={`text-xs font-bold px-3 py-1 rounded-full ${
                      quotation.customerStatus === 'Accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : quotation.customerStatus === 'Changes Requested'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    Customer: {quotation.customerStatus}
                  </span>
                </div>
              </div>

              {/* Customer Feedback Notice if Revision Requested */}
              {quotation.customerChangeComment && (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs space-y-1">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5">
                    <AlertCircle size={15} className="text-amber-700" />
                    <span>Customer Revision Request Comment:</span>
                  </div>
                  <p className="text-amber-800 font-medium italic bg-white/70 p-2 rounded-lg border border-amber-200">
                    &quot;{quotation.customerChangeComment}&quot;
                  </p>
                  <p className="text-[11px] text-amber-700">
                    💡 You can edit item unit prices, change quantities, apply discount margins, or substitute products below.
                  </p>
                </div>
              )}

              {/* Alternative Substitution Highlight Card */}
              {quotation.items.some((i) => i.alternativeTo) && (
                <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-2xl text-xs space-y-1">
                  <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-indigo-600" />
                    <span>Alternative Product Applied: ABB S203 substituted for Schneider Acti9</span>
                  </div>
                  <p className="text-indigo-700 text-[11px]">
                    Customer benefit: Saves ₹100/unit and ships immediately from Chennai Central WH instead of waiting 3 weeks.
                  </p>
                </div>
              )}

              {/* Toolbar: Discount Presets & Add Product */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Tag size={14} className="text-emerald-600" />
                    <span>Standard Project Discount Presets:</span>
                  </span>
                  {[5, 10, 15, 20, 25].map((d) => (
                    <button
                      key={d}
                      onClick={() => applyDiscountToAllQuotationItems(d)}
                      className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition ${
                        (quotation.averageDiscountPercent || 15) === d
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                          : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200'
                      }`}
                    >
                      {d}% {d === 15 ? '(Target)' : ''}
                    </button>
                  ))}
                  <button
                    onClick={() => applyDiscountToAllQuotationItems(0)}
                    className="px-2 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition"
                    title="Reset to 0% discount (Full MRP List Price)"
                  >
                    0% (List Price)
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={loadQuotationFromRequirement}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1.5 transition"
                    title="Reload original items from customer requirement"
                  >
                    <RefreshCw size={13} />
                    <span>Reload REQ</span>
                  </button>

                  <button
                    onClick={handleOpenAddModal}
                    className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Plus size={14} />
                    <span>Add Product to Quote</span>
                  </button>
                </div>
              </div>

              {/* Interactive Commercial Pricing Table */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">
                    Line Items & Commercial Quotation ({quotation.items.length} Products)
                  </span>
                  <span className="text-slate-500 text-[11px] flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Product discount is applied to Manufacturer List Price (MRP) to compute unit quoted price.</span>
                  </span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Quoted Product & Brand</th>
                        <th className="p-2.5 text-right">List Price (MRP)</th>
                        <th className="p-2.5 text-right">Discount %</th>
                        <th className="p-2.5 text-right">Quoted Unit (₹)</th>
                        <th className="p-2.5 text-center">Qty</th>
                        <th className="p-2.5 text-right">Line Total</th>
                        <th className="p-2.5 text-center">Substitution</th>
                        <th className="p-2.5 text-center">Remove</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {quotation.items.map((item, idx) => {
                        const effectiveListPrice = item.listPrice || Math.round(item.quotedUnitPrice / (1 - (item.discountPercent || 15) / 100));
                        const currentDiscount = item.discountPercent ?? 15;
                        return (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2.5">
                              <div className="font-bold text-slate-900">{item.productName}</div>
                              <div className="text-[10px] text-slate-500">
                                {item.brand} • {item.specification}
                              </div>
                              {item.alternativeTo && (
                                <span className="inline-block mt-0.5 text-[9px] bg-indigo-100 text-indigo-800 font-bold px-1.5 rounded">
                                  Equivalent Alt: {item.alternativeTo}
                                </span>
                              )}
                            </td>
                            <td className="p-2.5 text-right font-mono text-slate-500">
                              ₹{effectiveListPrice.toLocaleString()}
                            </td>
                            <td className="p-2.5 text-right">
                              <div className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-300 rounded px-1.5 py-0.5">
                                <input
                                  type="number"
                                  min={0}
                                  max={99}
                                  value={currentDiscount}
                                  onChange={(e) =>
                                    updateQuotationItemDiscount(
                                      item.productId,
                                      Math.max(0, Math.min(99, Number(e.target.value)))
                                    )
                                  }
                                  className="w-10 text-right font-mono font-bold text-xs text-emerald-800 bg-transparent focus:outline-none"
                                />
                                <span className="text-[10px] text-emerald-700 font-bold">%</span>
                              </div>
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                              <input
                                type="number"
                                value={item.quotedUnitPrice}
                                onChange={(e) =>
                                  updateQuotationItemPrice(item.productId, Number(e.target.value))
                                }
                                className="w-24 px-2 py-1 bg-slate-50 border border-slate-300 rounded text-right font-mono text-xs focus:ring-1 focus:ring-blue-500 focus:bg-white"
                              />
                            </td>
                            <td className="p-2.5 text-center">
                              <div className="inline-flex items-center gap-1 bg-slate-50 border border-slate-300 rounded px-1">
                                <input
                                  type="number"
                                  min={1}
                                  value={item.quantity}
                                  onChange={(e) =>
                                    updateQuotationItemQty(item.productId, Number(e.target.value))
                                  }
                                  className="w-14 text-center font-mono font-bold text-xs py-0.5 bg-transparent focus:outline-none"
                                />
                                <span className="text-[10px] text-slate-500">{item.uom}</span>
                              </div>
                            </td>
                            <td className="p-2.5 text-right font-bold text-slate-900 font-mono">
                              ₹{item.lineTotal.toLocaleString()}
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                onClick={() => handleOpenSubstituteModal(item)}
                                className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded border border-slate-300 flex items-center gap-1 mx-auto"
                                title="Swap with alternative brand or in-stock model"
                              >
                                <Sparkles size={11} className="text-amber-500" />
                                <span>Swap Brand</span>
                              </button>
                            </td>
                            <td className="p-2.5 text-center">
                              <button
                                onClick={() => removeQuotationItem(item.productId)}
                                className="text-slate-400 hover:text-rose-600 p-1 transition"
                                title="Remove item from quotation"
                              >
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Commercial Terms Form & Financial Totals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                    <div className="font-bold text-slate-900 flex items-center justify-between">
                      <span>Commercial & Delivery Terms (Customer Visible)</span>
                      <button
                        onClick={handleSaveTerms}
                        className="bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-semibold px-2.5 py-1 rounded flex items-center gap-1"
                      >
                        <Save size={12} />
                        <span>Save Terms</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase">Payment Terms</label>
                        <input
                          type="text"
                          value={paymentTermsInput}
                          onChange={(e) => setPaymentTermsInput(e.target.value)}
                          className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                          placeholder="e.g. 45 Days Credit"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase">Quotation Validity</label>
                        <input
                          type="date"
                          value={validUntilInput}
                          onChange={(e) => setValidUntilInput(e.target.value)}
                          className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase">Delivery & Logistics Terms</label>
                      <input
                        type="text"
                        value={deliveryTermsInput}
                        onChange={(e) => setDeliveryTermsInput(e.target.value)}
                        className="w-full mt-0.5 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                        placeholder="e.g. Door Delivery to Ambattur Site"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase">
                        Internal Sales Notes & Commercial Remarks
                      </label>
                      <textarea
                        rows={2}
                        value={internalNotes}
                        onChange={(e) => setInternalNotes(e.target.value)}
                        className="w-full mt-0.5 p-2 bg-white border border-slate-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>

                  {/* Financial Breakdown Card with Discount Savings */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="font-bold text-slate-900 mb-2">Quotation Financial Summary</div>
                      <div className="space-y-1.5 text-slate-600">
                        <div className="flex justify-between">
                          <span>Products Count:</span>
                          <span className="font-bold text-slate-800">{quotation.items.length} Line Items</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total List Price (MRP):</span>
                          <span className="font-mono text-slate-600">
                            ₹{(quotation.totalListPrice || Math.round(quotation.subtotal / 0.85)).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200">
                          <span>Special Project Discount:</span>
                          <span className="font-mono font-bold">
                            -₹{(quotation.totalDiscountAmount || Math.round(((quotation.totalListPrice || Math.round(quotation.subtotal / 0.85)) - quotation.subtotal))).toLocaleString()}{' '}
                            <span className="text-[10px]">({quotation.averageDiscountPercent || 15}% Off)</span>
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Net Quoted Subtotal:</span>
                          <span className="font-mono font-bold text-slate-900">
                            ₹{quotation.subtotal.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Consolidated GST (18%):</span>
                          <span className="font-mono font-semibold text-slate-900">
                            ₹{quotation.totalTax.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between font-bold text-base text-slate-900 pt-2 border-t border-slate-200">
                          <span>Grand Total Quoted:</span>
                          <span className="text-emerald-700 font-mono">
                            ₹{quotation.grandTotal.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action CTAs based on approval status */}
                    <div className="pt-4 border-t border-slate-200 flex flex-wrap justify-end gap-2.5">
                      {quotation.approvalStatus !== 'Approved' ? (
                        <button
                          id="sales-btn-submit-approval"
                          onClick={() => submitQuotationForAdminApproval(internalNotes)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 size={15} />
                          <span>Submit for Admin Approval ({quotation.averageDiscountPercent || 15}% Discount Applied)</span>
                        </button>
                      ) : (
                        <button
                          id="sales-btn-send-inaiwazhi"
                          onClick={sendQuotationToCustomer}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                        >
                          <Send size={15} />
                          <span>Send Customer-Safe Proposal via Inaiwazhi</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ASSIGNED CUSTOMER 360 (Section 31) */}
          {salesTab === 'customers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Assigned Account 360: {activeCustomer.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Strictly assigned customer view. Ownership can only be updated by Admin.
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400">Industry:</span>
                    <div className="font-bold text-slate-900">{activeCustomer.industry}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">GSTIN:</span>
                    <div className="font-mono font-bold text-slate-900">{activeCustomer.gst}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Approved Credit:</span>
                    <div className="font-bold text-emerald-700">
                      ₹{activeCustomer.creditLimit.toLocaleString()} (Used: ₹
                      {activeCustomer.creditUsed.toLocaleString()})
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-800 mb-2">Key Customer Contacts</div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                    <div>
                      <div className="font-bold text-slate-900">Ramesh K. (Purchase Head)</div>
                      <div className="text-slate-500 text-[11px]">Direct: +91 98401 23456 • ramesh@abcelectrical.in</div>
                    </div>
                    <button
                      onClick={() =>
                        sendInaiwazhiMessage('Hello Mr. Ramesh, let me know if you need any clarification on the proposal.')
                      }
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                    >
                      Chat via Inaiwazhi
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: MY ORDERS & REAL-TIME OPS STATUS & DELIVERY LOGISTICS */}
          {salesTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Won Orders & Operational Fulfillment
                  </h2>
                  <p className="text-xs text-slate-500">
                    Sales monitors fulfillment, customizes delivery logistics, and informs customer in real-time.
                  </p>
                </div>
                <button
                  onClick={handleSendOrderUpdateInaiwazhi}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-xs transition"
                >
                  <MessageSquare size={14} />
                  <span>Send Inaiwazhi Delivery Update</span>
                </button>
              </div>

              {/* Order Overview Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-600">{salesOrder.id}</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      {salesOrder.projectName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                      Status: {salesOrder.status}
                    </span>
                    <span className="text-xs font-bold bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full">
                      Priority: {orderPriority}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500">Customer:</span>
                    <div className="font-bold text-slate-900">{salesOrder.customerName}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Total Value:</span>
                    <div className="font-bold text-slate-900 font-mono">₹{salesOrder.grandTotal.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Order Date:</span>
                    <div className="font-semibold text-slate-800">{salesOrder.orderDate}</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Payment Terms:</span>
                    <div className="font-semibold text-slate-800">{quotation.paymentTerms || '45 Days Credit'}</div>
                  </div>
                </div>

                {/* Editable Delivery & Logistics Section */}
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <Truck size={15} className="text-emerald-600" />
                      <span>Delivery Logistics & Site Coordination (Sales Editable)</span>
                    </div>
                    {!isEditingOrder ? (
                      <button
                        onClick={() => setIsEditingOrder(true)}
                        className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                      >
                        <Edit3 size={13} />
                        <span>Edit Delivery Instructions</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleSaveOrderDetails}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-1 rounded-lg flex items-center gap-1 shadow-xs"
                      >
                        <Save size={13} />
                        <span>Save Changes</span>
                      </button>
                    )}
                  </div>

                  {isEditingOrder ? (
                    <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 uppercase">Site Delivery Address</label>
                          <input
                            type="text"
                            value={orderDeliverySite}
                            onChange={(e) => setOrderDeliverySite(e.target.value)}
                            className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 uppercase">Site Engineer / Contact Person</label>
                          <input
                            type="text"
                            value={orderContactPerson}
                            onChange={(e) => setOrderContactPerson(e.target.value)}
                            className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 uppercase">Logistics Priority</label>
                          <select
                            value={orderPriority}
                            onChange={(e) => setOrderPriority(e.target.value as any)}
                            className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                          >
                            <option value="Standard">Standard (3-5 Business Days)</option>
                            <option value="Express">Express Priority (24-48 Hours)</option>
                            <option value="Urgent">Emergency Shutdown Rush (Same Day)</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-600 uppercase">Special Handling / Offloading Notes</label>
                          <input
                            type="text"
                            value={orderSpecialNotes}
                            onChange={(e) => setOrderSpecialNotes(e.target.value)}
                            className="w-full mt-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold">Delivery Site:</span>
                        <div className="font-semibold text-slate-800 mt-0.5">{salesOrder.deliverySite}</div>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold">Site Contact:</span>
                        <div className="font-semibold text-slate-800 mt-0.5">{orderContactPerson}</div>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[10px] uppercase font-bold">Handling Notes:</span>
                        <div className="text-slate-700 mt-0.5 italic">{orderSpecialNotes}</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Items in Sales Order */}
                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <div className="text-xs font-bold text-slate-800">
                    Consignment Items ({salesOrder.items.length})
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">Product</th>
                          <th className="p-2.5">Brand</th>
                          <th className="p-2.5 text-center">Ordered Qty</th>
                          <th className="p-2.5 text-right">Unit Price</th>
                          <th className="p-2.5 text-right">Total</th>
                          <th className="p-2.5">Stock Source</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {salesOrder.items.map((item) => (
                          <tr key={item.id} className="hover:bg-slate-50">
                            <td className="p-2.5">
                              <div className="font-bold text-slate-900">{item.productName}</div>
                              <div className="text-[10px] text-slate-500">{item.specification}</div>
                            </td>
                            <td className="p-2.5 font-semibold text-slate-700">{item.brand}</td>
                            <td className="p-2.5 text-center font-bold">
                              {item.orderedQty} {item.uom}
                            </td>
                            <td className="p-2.5 text-right font-mono">
                              ₹{(item.unitPrice || 0).toLocaleString()}
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                              ₹{(item.totalAmount || 0).toLocaleString()}
                            </td>
                            <td className="p-2.5">
                              <span className="inline-block text-[10px] px-2 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                {item.stockSource}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: MASTER PRODUCT FLOW & CATALOG */}
          {salesTab === 'product_master' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">Master Product Catalog & Price Lists</h2>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      {products.length} SKUs Live
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Authorized distributor price lists with standard discount structures and 1-click quotation sync.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowCreateMasterModal(true)}
                    className="px-3.5 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Plus size={15} />
                    <span>+ Register New Master SKU</span>
                  </button>
                </div>
              </div>

              {/* KPI Header Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-semibold text-slate-500">Total Catalog Products</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">{products.length} Items</div>
                  <div className="text-[10px] text-emerald-600 mt-1 font-semibold">Active Master Records</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-semibold text-slate-500">Major Brands</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">7 Franchises</div>
                  <div className="text-[10px] text-slate-500 mt-1">ABB, Schneider, Polycab...</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-semibold text-slate-500">Avg Standard Discount</div>
                  <div className="text-xl font-bold text-emerald-700 mt-1">16.5%</div>
                  <div className="text-[10px] text-slate-500 mt-1">Off List Price (MRP)</div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                  <div className="text-[11px] font-semibold text-slate-500">Dispatch Readiness</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">Chennai WH</div>
                  <div className="text-[10px] text-emerald-600 mt-1 font-semibold">Immediate / 24-48h</div>
                </div>
              </div>

              {/* Master Search & Filter Toolbar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="flex-1 flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200 text-xs">
                    <Search size={15} className="text-slate-400" />
                    <input
                      type="text"
                      value={masterSearch}
                      onChange={(e) => setMasterSearch(e.target.value)}
                      placeholder="Search SKU code, product title, specifications (e.g. 63A, Polycab, MCB)..."
                      className="w-full bg-transparent focus:outline-none text-xs"
                    />
                    {masterSearch && (
                      <button onClick={() => setMasterSearch('')} className="text-slate-400 hover:text-slate-600">
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={masterCategoryFilter}
                      onChange={(e) => setMasterCategoryFilter(e.target.value)}
                      className="text-xs font-semibold bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-700 focus:outline-none"
                    >
                      <option value="All">All Categories</option>
                      <option value="Switchgear">Switchgear</option>
                      <option value="Cables & Wires">Cables & Wires</option>
                      <option value="Distribution Boards">Distribution Boards</option>
                      <option value="Protection Devices">Protection Devices</option>
                      <option value="Industrial Automation">Industrial Automation</option>
                    </select>
                  </div>
                </div>

                {/* Brand Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                  <span className="text-[11px] font-bold text-slate-500 uppercase shrink-0 mr-1">Brand:</span>
                  {['All', 'ABB', 'Schneider Electric', 'Polycab', 'Havells', 'Siemens', 'L&T', 'Legrand'].map((b) => (
                    <button
                      key={b}
                      onClick={() => setMasterBrandFilter(b)}
                      className={`px-3 py-1 rounded-full font-semibold transition text-xs shrink-0 ${
                        masterBrandFilter === b
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Master Products Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-900">
                    Product Master Records (
                    {
                      products.filter((p) => {
                        const mSearch =
                          p.name.toLowerCase().includes(masterSearch.toLowerCase()) ||
                          p.brand.toLowerCase().includes(masterSearch.toLowerCase()) ||
                          p.sku.toLowerCase().includes(masterSearch.toLowerCase()) ||
                          p.specification.toLowerCase().includes(masterSearch.toLowerCase());
                        const mBrand = masterBrandFilter === 'All' || p.brand === masterBrandFilter;
                        const mCat = masterCategoryFilter === 'All' || p.category === masterCategoryFilter;
                        return mSearch && mBrand && mCat;
                      }).length
                    }{' '}
                    Found)
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Click <strong>&quot;+ Add to Quote&quot;</strong> to incorporate items into active quotation {quotation.id}.
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-3">SKU & Brand</th>
                        <th className="p-3">Product Name & Category</th>
                        <th className="p-3">Technical Specification</th>
                        <th className="p-3 text-right">List Price (MRP)</th>
                        <th className="p-3 text-right">Std Discount</th>
                        <th className="p-3 text-right">Net Price (₹)</th>
                        <th className="p-3 text-center">MOQ / Lead Time</th>
                        <th className="p-3 text-center">Quotation Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {products
                        .filter((p) => {
                          const mSearch =
                            p.name.toLowerCase().includes(masterSearch.toLowerCase()) ||
                            p.brand.toLowerCase().includes(masterSearch.toLowerCase()) ||
                            p.sku.toLowerCase().includes(masterSearch.toLowerCase()) ||
                            p.specification.toLowerCase().includes(masterSearch.toLowerCase());
                          const mBrand = masterBrandFilter === 'All' || p.brand === masterBrandFilter;
                          const mCat = masterCategoryFilter === 'All' || p.category === masterCategoryFilter;
                          return mSearch && mBrand && mCat;
                        })
                        .map((prod) => {
                          const stdDisc = prod.standardDiscountPercent || 15;
                          const netPrice = Math.round(prod.baseListPrice * (1 - stdDisc / 100));
                          const isAlreadyInQuote = quotation.items.some((i) => i.productId === prod.id);

                          return (
                            <tr key={prod.id} className="hover:bg-slate-50/80 transition">
                              <td className="p-3">
                                <div className="font-mono font-bold text-slate-900">{prod.sku}</div>
                                <span className="inline-block mt-0.5 text-[9px] font-bold uppercase bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                                  {prod.brand}
                                </span>
                              </td>
                              <td className="p-3">
                                <div className="font-bold text-slate-900">{prod.name}</div>
                                <div className="text-[10px] text-slate-500">{prod.category}</div>
                              </td>
                              <td className="p-3 max-w-xs">
                                <div className="text-[11px] text-slate-700">{prod.specification}</div>
                                <div className="text-[9px] text-slate-400 font-mono mt-0.5">HSN: {prod.hsnCode} • GST: {prod.gstRatePercent}%</div>
                              </td>
                              <td className="p-3 text-right font-mono text-slate-600">
                                ₹{prod.baseListPrice.toLocaleString()}
                                <div className="text-[9px] text-slate-400">per {prod.uom}</div>
                              </td>
                              <td className="p-3 text-right">
                                <span className="inline-block bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded">
                                  {stdDisc}% Off
                                </span>
                              </td>
                              <td className="p-3 text-right font-mono font-bold text-slate-900">
                                ₹{netPrice.toLocaleString()}
                              </td>
                              <td className="p-3 text-center">
                                <div className="font-semibold text-slate-700">
                                  {prod.moq} {prod.uom}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  {prod.standardLeadTimeDays === 0
                                    ? 'Immediate'
                                    : `${prod.standardLeadTimeDays} Days`}
                                </div>
                              </td>
                              <td className="p-3 text-center">
                                {isAlreadyInQuote ? (
                                  <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded inline-flex items-center gap-1">
                                    <Check size={12} /> In Quotation
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleQuickAddMasterToQuotation(prod, prod.moq || 10)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] px-3 py-1.5 rounded-lg shadow-2xs transition inline-flex items-center gap-1"
                                  >
                                    <Plus size={12} />
                                    <span>Add to Quote</span>
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL 1: ADD PRODUCT TO QUOTATION */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Add Product to Quotation</h3>
                <p className="text-[11px] text-slate-500">Pick products across ABB, Schneider, Polycab, Havells, L&T</p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="p-3 border-b border-slate-200 space-y-2 bg-white">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 text-xs">
                <Search size={14} className="text-slate-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products, MCBs, wires, brands..."
                  className="w-full bg-transparent focus:outline-none text-xs"
                />
              </div>

              {/* Brand Pills */}
              <div className="flex gap-1 overflow-x-auto pb-1">
                {['All', 'ABB', 'Schneider Electric', 'Polycab', 'Havells', 'L&T', 'Legrand'].map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBrandFilter(b)}
                    className={`px-2.5 py-1 text-[10px] font-semibold rounded-full transition ${
                      selectedBrandFilter === b
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Product List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 divide-y divide-slate-100">
              {filteredProducts.map((prod) => {
                const isSelected = selectedProductToAdd?.id === prod.id;
                return (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setSelectedProductToAdd(prod);
                      setAddCustomPrice(prod.baseListPrice);
                      setAddQty(prod.moq || 10);
                    }}
                    className={`p-2.5 rounded-xl text-xs cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50 border border-blue-300'
                        : 'hover:bg-slate-50 border border-transparent'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-bold uppercase bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded">
                          {prod.brand}
                        </span>
                        <span className="font-bold text-slate-900">{prod.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{prod.specification}</div>
                      <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                        List Price: ₹{prod.baseListPrice.toLocaleString()} / {prod.uom} • MOQ: {prod.moq}
                      </div>
                    </div>
                    {isSelected && (
                      <span className="text-blue-600 font-bold text-xs">✓ Selected</span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected Product Config (Qty & Quoted Price) */}
            {selectedProductToAdd && (
              <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                  <span>Selected: {selectedProductToAdd.brand} {selectedProductToAdd.name}</span>
                  <span className="text-slate-500 font-mono">List: ₹{selectedProductToAdd.baseListPrice}</span>
                </div>

                <div className="grid grid-cols-3 gap-2.5 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Quantity ({selectedProductToAdd.uom})</label>
                    <input
                      type="number"
                      min={1}
                      value={addQty}
                      onChange={(e) => setAddQty(Math.max(1, Number(e.target.value)))}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Discount (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={99}
                      value={addDiscountPercent}
                      onChange={(e) => {
                        const d = Number(e.target.value);
                        setAddDiscountPercent(d);
                        if (selectedProductToAdd) {
                          setAddCustomPrice(Math.round(selectedProductToAdd.baseListPrice * (1 - d / 100)));
                        }
                      }}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-emerald-700 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 uppercase">Unit Quoted (₹)</label>
                    <input
                      type="number"
                      value={addCustomPrice}
                      onChange={(e) => {
                        const p = Number(e.target.value);
                        setAddCustomPrice(p);
                        if (selectedProductToAdd && selectedProductToAdd.baseListPrice > 0) {
                          setAddDiscountPercent(Math.max(0, Math.round(((selectedProductToAdd.baseListPrice - p) / selectedProductToAdd.baseListPrice) * 100)));
                        }
                      }}
                      className="w-full mt-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-bold text-blue-700 font-mono"
                    />
                  </div>
                </div>

                <button
                  onClick={handleConfirmAddProduct}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition"
                >
                  Add to Quotation (Net ₹{(addQty * addCustomPrice).toLocaleString()} + GST = ₹{Math.round(addQty * addCustomPrice * 1.18).toLocaleString()})
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: SUBSTITUTE BRAND / PRODUCT */}
      {showSubstituteModal && substituteItem && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Substitute Product Alternative</h3>
                <p className="text-[11px] text-slate-500">
                  Select equivalent brand to prevent delays or optimize pricing
                </p>
              </div>
              <button
                onClick={() => setShowSubstituteModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Currently Quoted:</span>
                <div className="font-bold text-slate-900 mt-0.5">{substituteItem.productName}</div>
                <div className="text-[11px] text-slate-600">{substituteItem.brand} • {substituteItem.specification}</div>
              </div>

              <div className="font-bold text-slate-800 pt-1">Choose Equivalent Alternative:</div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {products
                  .filter((p) => p.id !== substituteItem.productId)
                  .map((cand) => (
                    <div
                      key={cand.id}
                      className="p-3 bg-white hover:bg-indigo-50/50 border border-slate-200 hover:border-indigo-300 rounded-xl cursor-pointer transition flex items-center justify-between"
                      onClick={() => handleConfirmSubstitution(cand.id)}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-bold uppercase bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded">
                            {cand.brand}
                          </span>
                          <span className="font-bold text-slate-900">{cand.name}</span>
                        </div>
                        <div className="text-[10px] text-slate-500 mt-0.5">{cand.specification}</div>
                        <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                          List: ₹{cand.baseListPrice.toLocaleString()} • In Stock (Chennai WH)
                        </div>
                      </div>

                      <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shrink-0">
                        Substitute
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: REGISTER NEW MASTER PRODUCT SKU */}
      {showCreateMasterModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Register New Master Product SKU</h3>
                <p className="text-[11px] text-slate-500">
                  Add manufacturer catalog specifications, list price, and official discount structures.
                </p>
              </div>
              <button
                onClick={() => setShowCreateMasterModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateNewMasterProduct} className="p-5 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={newMasterName}
                    onChange={(e) => setNewMasterName(e.target.value)}
                    placeholder="e.g. Acti9 iC60N MCB 4P 32A"
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">SKU / Catalog Number *</label>
                  <input
                    type="text"
                    required
                    value={newMasterSku}
                    onChange={(e) => setNewMasterSku(e.target.value)}
                    placeholder="e.g. A9F74432"
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono uppercase font-bold focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Manufacturer Brand</label>
                  <select
                    value={newMasterBrand}
                    onChange={(e) => setNewMasterBrand(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:bg-white focus:outline-none"
                  >
                    <option value="ABB">ABB</option>
                    <option value="Schneider Electric">Schneider Electric</option>
                    <option value="Polycab">Polycab</option>
                    <option value="Havells">Havells</option>
                    <option value="Siemens">Siemens</option>
                    <option value="L&T">L&T</option>
                    <option value="Legrand">Legrand</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Product Category</label>
                  <select
                    value={newMasterCategory}
                    onChange={(e) => setNewMasterCategory(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:bg-white focus:outline-none"
                  >
                    <option value="Switchgear">Switchgear</option>
                    <option value="Cables & Wires">Cables & Wires</option>
                    <option value="Distribution Boards">Distribution Boards</option>
                    <option value="Protection Devices">Protection Devices</option>
                    <option value="Industrial Automation">Industrial Automation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Technical Specifications</label>
                <textarea
                  rows={2}
                  value={newMasterSpec}
                  onChange={(e) => setNewMasterSpec(e.target.value)}
                  placeholder="e.g. 4 Pole, 32A, C-Curve, 10kA Breaking Capacity, 415V AC"
                  className="w-full mt-1 p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200">
                <div>
                  <label className="text-[10px] font-bold text-emerald-800 uppercase">List Price (MRP ₹)</label>
                  <input
                    type="number"
                    min={1}
                    value={newMasterListPrice}
                    onChange={(e) => setNewMasterListPrice(Number(e.target.value))}
                    className="w-full mt-1 px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-mono font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-emerald-800 uppercase">Std Discount %</label>
                  <input
                    type="number"
                    min={0}
                    max={90}
                    value={newMasterDiscount}
                    onChange={(e) => setNewMasterDiscount(Number(e.target.value))}
                    className="w-full mt-1 px-2.5 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-mono font-bold text-emerald-800"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-emerald-800 uppercase">Calculated Net (₹)</label>
                  <div className="w-full mt-1 px-2.5 py-1.5 bg-emerald-100 border border-emerald-300 rounded-lg text-xs font-mono font-bold text-emerald-950 flex items-center">
                    ₹{Math.round(newMasterListPrice * (1 - newMasterDiscount / 100)).toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">UOM (Unit)</label>
                  <select
                    value={newMasterUom}
                    onChange={(e) => setNewMasterUom(e.target.value)}
                    className="w-full mt-1 px-2 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="Nos">Nos</option>
                    <option value="Meters">Meters</option>
                    <option value="Sets">Sets</option>
                    <option value="Rolls">Rolls</option>
                    <option value="Lots">Lots</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Minimum Qty (MOQ)</label>
                  <input
                    type="number"
                    min={1}
                    value={newMasterMoq}
                    onChange={(e) => setNewMasterMoq(Number(e.target.value))}
                    className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Lead Time (Days)</label>
                  <input
                    type="number"
                    min={0}
                    value={newMasterLeadTime}
                    onChange={(e) => setNewMasterLeadTime(Number(e.target.value))}
                    className="w-full mt-1 px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateMasterModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center gap-1.5"
                >
                  <Save size={14} />
                  <span>Save SKU into Master Catalog</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
