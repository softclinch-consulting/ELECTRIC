import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminMasterOrdersView } from './AdminMasterOrdersView';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  UserPlus,
  FileText,
  ShoppingCart,
  Truck,
  Building2,
  Boxes,
  Receipt,
  CreditCard,
  Settings,
  BarChart3,
  Search,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Filter,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  PackageCheck,
  FileCheck,
  ShieldAlert,
  RotateCcw,
  ClipboardList,
} from 'lucide-react';

export const AdminDesktopView: React.FC = () => {
  const {
    customers,
    activeCustomer,
    salesTeam,
    requirement,
    quotation,
    salesOrder,
    salesOrders,
    activeSalesOrderId,
    setActiveSalesOrderId,
    procurement,
    purchaseOrder,
    grn,
    picking,
    packing,
    delivery,
    invoice,
    payment,
    products,
    inventory,
    assignSales,
    reassignSales,
    removeSales,
    approveQuotationAdmin,
    runOrderCreditAndStockCheck,
    issuePurchaseOrderAndGRN,
    allocateWarehouseStock,
    completeWarehousePicking,
    completeWarehousePacking,
    dispatchOrderDelivery,
    generateCustomerInvoice,
    recordCustomerPayment,
    addToast,
    setRole,
  } = useApp();

  // Admin Navigation tabs (Section 22)
  const [adminNav, setAdminNav] = useState<
    | 'dashboard'
    | 'control_tower'
    | 'master_orders'
    | 'customers'
    | 'sales_assignment'
    | 'quotations'
    | 'procurement'
    | 'warehouses'
    | 'fulfillment'
    | 'invoices'
    | 'products_inventory'
  >('dashboard');

  // Customer Management states (Section 24, 25, 26, 27)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('CUST-001');
  const [assigningSalesId, setAssigningSalesId] = useState<string>('SALES-001');
  const [customerSearchQuery, setCustomerSearchQuery] = useState<string>('');
  const [customerFilterStatus, setCustomerFilterStatus] = useState<'all' | 'assigned' | 'unassigned' | 'tier1'>('all');

  const filteredCustomers = customers.filter((c) => {
    const q = customerSearchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.gst.toLowerCase().includes(q) ||
      c.industry.toLowerCase().includes(q) ||
      (c.assignedSalesName && c.assignedSalesName.toLowerCase().includes(q)) ||
      c.sites.some((s) => s.city.toLowerCase().includes(q) || s.address.toLowerCase().includes(q));

    const matchesFilter =
      customerFilterStatus === 'all' ||
      (customerFilterStatus === 'assigned' && Boolean(c.assignedSalesId)) ||
      (customerFilterStatus === 'unassigned' && !c.assignedSalesId) ||
      (customerFilterStatus === 'tier1' && c.tier === 'Tier-1 Industrial');

    return matchesQuery && matchesFilter;
  });

  // Control Tower active stage (Section 37)
  const [activeTowerStage, setActiveTowerStage] = useState<
    | 'overview'
    | 'credit_stock'
    | 'procurement'
    | 'warehouse'
    | 'picking'
    | 'packing'
    | 'dispatch'
    | 'invoice'
  >('overview');

  const viewingCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 overflow-hidden">
      {/* 1. LEFT NAVIGATION SIDEBAR (Section 21 & 22) */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 shrink-0">
        {/* Admin Brand */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm">
              AD
            </div>
            <div>
              <div className="font-bold text-white text-xs tracking-tight">OPERATIONS TOWER</div>
              <div className="text-[10px] text-slate-400">Admin Control Center</div>
            </div>
          </div>
          <span className="text-[9px] bg-red-900/60 text-red-300 border border-red-700/50 px-1.5 py-0.5 rounded font-bold uppercase">
            Root
          </span>
        </div>

        {/* Navigation Items (Section 22) */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
          <button
            id="admin-nav-dashboard"
            onClick={() => setAdminNav('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition ${
              adminNav === 'dashboard'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </button>

          <button
            id="admin-nav-control-tower"
            onClick={() => setAdminNav('control_tower')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition ${
              adminNav === 'control_tower'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <PackageCheck size={16} />
              <span>Order Control Tower</span>
            </div>
            <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-1.5 rounded">
              {salesOrder.id}
            </span>
          </button>

          <button
            id="admin-nav-master-orders"
            onClick={() => setAdminNav('master_orders')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition ${
              adminNav === 'master_orders'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ClipboardList size={16} />
              <span>Master Orders</span>
            </div>
            <span className="text-[10px] bg-blue-500/30 text-blue-200 border border-blue-400/40 px-1.5 py-0.5 rounded font-mono font-bold">
              {salesOrders.length} SOs
            </span>
          </button>

          <div className="pt-2 text-[10px] uppercase font-bold text-slate-500 px-3 tracking-wider">
            Customer & Ownership
          </div>

          <button
            id="admin-nav-customers"
            onClick={() => setAdminNav('customers')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition ${
              adminNav === 'customers'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Users size={16} />
            <span>Customer Control 360</span>
          </button>

          <button
            id="admin-nav-sales-assignment"
            onClick={() => setAdminNav('sales_assignment')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition ${
              adminNav === 'sales_assignment'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <UserPlus size={16} />
              <span>Sales Assignment</span>
            </div>
            {customers.some((c) => !c.assignedSalesId) && (
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            )}
          </button>

          <div className="pt-2 text-[10px] uppercase font-bold text-slate-500 px-3 tracking-wider">
            Commercial & Approval
          </div>

          <button
            id="admin-nav-quotations"
            onClick={() => setAdminNav('quotations')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition ${
              adminNav === 'quotations'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText size={16} />
              <span>Quotations Approval</span>
            </div>
            <span className="text-[10px] bg-slate-800 px-1.5 rounded font-mono text-amber-300">
              {quotation.id}
            </span>
          </button>

          <button
            id="admin-nav-invoices"
            onClick={() => setAdminNav('invoices')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition ${
              adminNav === 'invoices'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Receipt size={16} />
              <span>Invoices & Payments</span>
            </div>
            <span className="text-[10px] bg-slate-800 px-1.5 rounded font-mono">INV-001</span>
          </button>

          <div className="pt-2 text-[10px] uppercase font-bold text-slate-500 px-3 tracking-wider">
            Supply Chain & Ops
          </div>

          <button
            id="admin-nav-procurement"
            onClick={() => setAdminNav('procurement')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg font-medium transition ${
              adminNav === 'procurement'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingCart size={16} />
              <span>Procurement (PR-001)</span>
            </div>
            <span className="text-[10px] bg-amber-900/80 text-amber-200 px-1.5 rounded">Shortage</span>
          </button>

          <button
            id="admin-nav-warehouses"
            onClick={() => setAdminNav('warehouses')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition ${
              adminNav === 'warehouses'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Building2 size={16} />
            <span>Warehouses (MAA, MDU, CJB)</span>
          </button>

          <button
            id="admin-nav-products-inventory"
            onClick={() => setAdminNav('products_inventory')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg font-medium transition ${
              adminNav === 'products_inventory'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'hover:bg-slate-800 text-slate-300'
            }`}
          >
            <Boxes size={16} />
            <span>Product Master vs Stock</span>
          </button>
        </nav>

        {/* Admin Footer with Visually Enforced Ownership Notice */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 text-[11px] space-y-1">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <ShieldAlert size={13} />
            <span>Role Constraint Enforced</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-tight">
            Only Admin can assign, reassign or remove customer sales ownership. Sales role is strictly read-only.
          </p>
        </div>
      </aside>

      {/* 2. MAIN ADMIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar with search & operational stats */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3 flex-1 max-w-lg">
            <div className="relative w-full">
              <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Global search: Customer name, GSTIN, REQ-001, QT-001, SO-001, PR-001..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs font-bold text-slate-900">K. Sundararajan</div>
              <div className="text-[10px] text-slate-500">VP Operations & Supply Chain</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
              KS
            </div>
          </div>
        </header>

        {/* Scrollable Content View Area */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* VIEW 1: OPERATIONAL DASHBOARD (Section 23) */}
          {adminNav === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Operations Control Dashboard</h2>
                  <p className="text-xs text-slate-500">
                    Live cross-functional operational metrics across Tamil Nadu operations.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAdminNav('control_tower')}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition flex items-center gap-1.5"
                  >
                    <PackageCheck size={14} />
                    <span>Open SO-001 Control Tower</span>
                  </button>
                </div>
              </div>

              {/* 12 Operational Clickable Metric Cards - Section 23 Mandate */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                <div
                  onClick={() => setAdminNav('customers')}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition"
                >
                  <div className="text-[11px] font-semibold text-slate-500">New Enquiries</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">1</div>
                  <div className="text-[10px] text-blue-600 mt-1 font-mono">ENQ-001 (ABC Ind)</div>
                </div>

                <div
                  onClick={() => setAdminNav('sales_assignment')}
                  className="bg-white p-3.5 rounded-xl border border-amber-200 bg-amber-50/30 shadow-2xs hover:border-amber-400 cursor-pointer transition"
                >
                  <div className="text-[11px] font-semibold text-amber-800">Unassigned Clients</div>
                  <div className="text-xl font-bold text-amber-900 mt-1">1</div>
                  <div className="text-[10px] text-amber-700 mt-1">Thanjavur Solar Agro</div>
                </div>

                <div
                  onClick={() => setAdminNav('sales_assignment')}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition"
                >
                  <div className="text-[11px] font-semibold text-slate-500">Sales Assignments</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">3 Active</div>
                  <div className="text-[10px] text-emerald-600 mt-1">Arun, Priya, Karthik</div>
                </div>

                <div
                  onClick={() => setAdminNav('quotations')}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition"
                >
                  <div className="text-[11px] font-semibold text-slate-500">Pending Quotations</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">
                    {quotation.approvalStatus === 'Approved' ? '0' : '1'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {quotation.approvalStatus === 'Approved' ? 'All authorized' : 'QT-001 awaiting approval'}
                  </div>
                </div>

                <div
                  onClick={() => setAdminNav('control_tower')}
                  className="bg-white p-3.5 rounded-xl border border-emerald-200 bg-emerald-50/20 shadow-2xs hover:border-emerald-400 cursor-pointer transition"
                >
                  <div className="text-[11px] font-semibold text-emerald-800">Accepted Quotes</div>
                  <div className="text-xl font-bold text-emerald-900 mt-1">
                    {quotation.customerStatus === 'Accepted' ? '1' : '0'}
                  </div>
                  <div className="text-[10px] text-emerald-700 mt-1">
                    {quotation.customerStatus === 'Accepted' ? 'SO-001 Created' : 'Under customer review'}
                  </div>
                </div>

                <div
                  onClick={() => setAdminNav('master_orders')}
                  className="bg-white p-3.5 rounded-xl border border-blue-200 bg-blue-50/20 shadow-2xs hover:border-blue-400 cursor-pointer transition"
                >
                  <div className="text-[11px] font-semibold text-blue-800">Master Orders Ledger</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">{salesOrders.length} Active</div>
                  <div className="text-[10px] text-blue-600 mt-1 font-mono">{salesOrder.id} ({salesOrder.status})</div>
                </div>

                <div
                  onClick={() => setAdminNav('control_tower')}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition"
                >
                  <div className="text-[11px] font-semibold text-slate-500">Credit Holds</div>
                  <div className="text-xl font-bold text-emerald-600 mt-1">0</div>
                  <div className="text-[10px] text-slate-400 mt-1">ABC Credit Verified</div>
                </div>

                <div
                  onClick={() => setAdminNav('procurement')}
                  className="bg-white p-3.5 rounded-xl border border-amber-200 bg-amber-50/20 shadow-2xs hover:border-amber-400 cursor-pointer transition"
                >
                  <div className="text-[11px] font-semibold text-amber-800">Stock Shortages</div>
                  <div className="text-xl font-bold text-amber-900 mt-1">
                    {salesOrder.hasShortage ? '4 units' : '0'}
                  </div>
                  <div className="text-[10px] text-amber-700 mt-1">
                    {salesOrder.hasShortage ? 'Havells Floodlights' : 'Resolved via GRN'}
                  </div>
                </div>

                <div
                  onClick={() => setAdminNav('procurement')}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition"
                >
                  <div className="text-[11px] font-semibold text-slate-500">Procurement Pending</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">
                    {procurement.status === 'GRN Completed' ? '0' : '1'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">PR-001 ({procurement.status})</div>
                </div>

                <div
                  onClick={() => setAdminNav('warehouses')}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition"
                >
                  <div className="text-[11px] font-semibold text-slate-500">Warehouse Allocation</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">Chennai WH</div>
                  <div className="text-[10px] text-emerald-600 mt-1">Ambattur Bay 4</div>
                </div>

                <div
                  onClick={() => setAdminNav('control_tower')}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition"
                >
                  <div className="text-[11px] font-semibold text-slate-500">Deliveries Today</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">1 Dispatched</div>
                  <div className="text-[10px] text-blue-600 mt-1">DEL-001 (Murugan K)</div>
                </div>

                <div
                  onClick={() => setAdminNav('invoices')}
                  className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-400 cursor-pointer transition"
                >
                  <div className="text-[11px] font-semibold text-slate-500">Payment Pending</div>
                  <div className="text-xl font-bold text-slate-900 mt-1">
                    {invoice.status === 'Paid' ? '₹0' : '₹3,97,778'}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {invoice.status === 'Paid' ? 'Reconciled PAY-001' : 'INV-001 (45 days credit)'}
                  </div>
                </div>
              </div>

              {/* Connected Active Transaction Summary Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Master Connected Transaction
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      ABC Electrical Industries Ltd — Substation Modernization
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAdminNav('control_tower')}
                      className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1"
                    >
                      <span>Control Tower Pipeline</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500">Enquiry & Requirement:</span>
                    <div className="font-bold text-slate-900 mt-0.5 font-mono">
                      {requirement.enquiryId} / {requirement.id}
                    </div>
                    <div className="text-[11px] text-slate-500">4 Brands • 4 Items</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Quotation Record:</span>
                    <div className="font-bold text-amber-700 mt-0.5 font-mono">
                      {quotation.id} (Rev {quotation.revision})
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Total: ₹{quotation.grandTotal.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-500">Sales Order Status:</span>
                    <div className="font-bold text-blue-700 mt-0.5 font-mono">
                      {salesOrder.id} ({salesOrder.status})
                    </div>
                    <div className="text-[11px] text-slate-500">Site: Ambattur Plant Unit-2</div>
                  </div>
                  <div>
                    <span className="text-slate-500">Assigned Sales KAM:</span>
                    <div className="font-bold text-emerald-700 mt-0.5">
                      {activeCustomer.assignedSalesName}
                    </div>
                    <div className="text-[11px] text-slate-500">Phone: {activeCustomer.assignedSalesPhone}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: ORDER CONTROL TOWER FOR SO-001 (Section 37, 38) */}
          {adminNav === 'control_tower' && (
            <div className="space-y-6">
              <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                        {salesOrder.id}
                      </span>
                      <h2 className="text-base font-bold text-white">ORDER CONTROL TOWER</h2>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">
                      Customer: <span className="text-white font-bold">{salesOrder.customerName}</span> • Project:{' '}
                      {salesOrder.projectName} • Value: ₹{salesOrder.grandTotal.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAdminNav('master_orders')}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700 flex items-center gap-1.5 transition font-medium"
                    >
                      <ClipboardList size={13} />
                      <span>All Master Orders ({salesOrders.length})</span>
                    </button>
                    <span className="text-xs bg-slate-800 text-emerald-400 px-3 py-1 rounded-full font-bold border border-slate-700">
                      Current Status: {salesOrder.status}
                    </span>
                  </div>
                </div>

                {/* Connected 12-Stage Pipeline (Section 37) */}
                <div className="mt-5 pt-4 border-t border-slate-800 overflow-x-auto pb-2">
                  <div className="flex items-center gap-2 min-w-[900px] text-xs">
                    <div className="flex items-center gap-1 text-emerald-400 font-semibold shrink-0">
                      <CheckCircle2 size={14} /> Requirement ✓
                    </div>
                    <span className="text-slate-600">→</span>
                    <div className="flex items-center gap-1 text-emerald-400 font-semibold shrink-0">
                      <CheckCircle2 size={14} /> Quotation ✓
                    </div>
                    <span className="text-slate-600">→</span>
                    <div className="flex items-center gap-1 text-emerald-400 font-semibold shrink-0">
                      <CheckCircle2 size={14} /> Customer Accepted ✓
                    </div>
                    <span className="text-slate-600">→</span>
                    <div className="flex items-center gap-1 text-emerald-400 font-semibold shrink-0">
                      <CheckCircle2 size={14} /> Sales Order ✓
                    </div>
                    <span className="text-slate-600">→</span>

                    {/* Credit Check Button */}
                    <button
                      onClick={() => {
                        runOrderCreditAndStockCheck();
                        setActiveTowerStage('credit_stock');
                      }}
                      className={`px-2.5 py-1 rounded font-semibold text-xs transition shrink-0 ${
                        salesOrder.creditCheckPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-500'
                      }`}
                    >
                      Credit Check {salesOrder.creditCheckPassed ? '✓' : '→'}
                    </button>
                    <span className="text-slate-600">→</span>

                    {/* Stock Check Button */}
                    <button
                      onClick={() => {
                        runOrderCreditAndStockCheck();
                        setActiveTowerStage('credit_stock');
                      }}
                      className={`px-2.5 py-1 rounded font-semibold text-xs transition shrink-0 ${
                        salesOrder.stockCheckPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-500'
                      }`}
                    >
                      Stock Check {salesOrder.stockCheckPassed ? '✓' : '→'}
                    </button>
                    <span className="text-slate-600">→</span>

                    {/* Procurement */}
                    <button
                      onClick={() => {
                        issuePurchaseOrderAndGRN();
                        setActiveTowerStage('procurement');
                      }}
                      className={`px-2.5 py-1 rounded font-semibold text-xs transition shrink-0 ${
                        procurement.status === 'GRN Completed'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-600 text-white hover:bg-amber-500'
                      }`}
                    >
                      Procurement (PR-001) {procurement.status === 'GRN Completed' ? '✓' : '→'}
                    </button>
                    <span className="text-slate-600">→</span>

                    {/* Picking & Packing */}
                    <button
                      onClick={() => {
                        completeWarehousePicking();
                        completeWarehousePacking();
                        setActiveTowerStage('picking');
                      }}
                      className={`px-2.5 py-1 rounded font-semibold text-xs transition shrink-0 ${
                        packing.status === 'Sealed & Barcoded'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-blue-600 text-white'
                      }`}
                    >
                      Pick & Pack {packing.status === 'Sealed & Barcoded' ? '✓' : '→'}
                    </button>
                    <span className="text-slate-600">→</span>

                    {/* Dispatch & Delivery */}
                    <button
                      onClick={() => {
                        dispatchOrderDelivery('Murugan K.', 'TN-02-AK-9821');
                        setActiveTowerStage('dispatch');
                      }}
                      className={`px-2.5 py-1 rounded font-semibold text-xs transition shrink-0 ${
                        delivery.status === 'Delivered'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-purple-600 text-white'
                      }`}
                    >
                      Delivery (DEL-001) {delivery.status === 'Delivered' ? '✓' : '→'}
                    </button>
                    <span className="text-slate-600">→</span>

                    {/* Invoice */}
                    <button
                      onClick={() => {
                        generateCustomerInvoice();
                        setActiveTowerStage('invoice');
                      }}
                      className={`px-2.5 py-1 rounded font-semibold text-xs transition shrink-0 ${
                        invoice.status === 'Paid'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600 text-white'
                      }`}
                    >
                      Invoice & Pay {invoice.status === 'Paid' ? '✓' : '→'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Order Fulfillment Details Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: Order Line Items with Stock Routing */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xs font-bold text-slate-900">
                        Line Items & Fulfillment Allocation
                      </h3>
                      <span className="text-[10px] text-slate-500">
                        Section 38: Available items to WH, shortages to Procurement
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {salesOrder.items.map((item) => (
                        <div
                          key={item.id}
                          className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex flex-col md:flex-row md:items-center justify-between gap-2"
                        >
                          <div>
                            <span className="text-[9px] font-bold uppercase bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded">
                              {item.brand}
                            </span>
                            <div className="font-bold text-slate-900 mt-0.5">{item.productName}</div>
                            <div className="text-[10px] text-slate-500">{item.specification}</div>
                          </div>

                          <div className="flex items-center gap-3 text-right">
                            <div>
                              <div className="font-bold text-slate-900">
                                {item.orderedQty} {item.uom}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                ₹{item.totalAmount.toLocaleString()}
                              </div>
                            </div>

                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                item.stockSource === 'Reserved from Inventory'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {item.stockSource}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Operational Action Controls */}
                    <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs text-slate-500">
                        Delivery Site: <strong className="text-slate-800">{salesOrder.deliverySite}</strong>
                      </div>

                      <div className="flex gap-2">
                        <button
                          id="admin-btn-verify-credit-stock"
                          onClick={runOrderCreditAndStockCheck}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition"
                        >
                          Run Credit & Stock Verification
                        </button>
                        <button
                          id="admin-btn-allocate-stock"
                          onClick={() => allocateWarehouseStock('WH-MAA-01')}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition"
                        >
                          Reserve in Chennai WH
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right 1 Col: Operational Modules Quick Cards */}
                <div className="space-y-4">
                  {/* Warehouse Status Card */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">Warehouse Allocation</span>
                      <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-1.5 py-0.5 rounded">
                        WH-MAA-01
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Chennai Central Warehouse (Plot 12, Ambattur Industrial Estate)
                    </p>
                    <div className="pt-2 border-t border-slate-100 space-y-1">
                      <div className="flex justify-between">
                        <span>Picking (PICK-001):</span>
                        <span className="font-semibold text-emerald-700">{picking.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Packing (PACK-001):</span>
                        <span className="font-semibold text-emerald-700">{packing.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Package Count:</span>
                        <span className="font-bold text-slate-900">{packing.packagesCount} Crated Units</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery & Driver Card */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">Logistics & Driver DEL-001</span>
                      <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-1.5 py-0.5 rounded">
                        {delivery.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-[11px] text-slate-600">
                      <div>Driver: {delivery.driverName} ({delivery.driverPhone})</div>
                      <div>Vehicle: {delivery.vehicleNumber}</div>
                      <div>Recipient: {delivery.contactPerson}</div>
                    </div>
                    <div className="pt-2 border-t border-slate-100 flex gap-2">
                      <button
                        onClick={() => setRole('driver')}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold py-1.5 rounded-lg text-center"
                      >
                        Switch to Driver Mobile View →
                      </button>
                    </div>
                  </div>

                  {/* Financial Reconciliation Card */}
                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">Invoice & Settlement</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          invoice.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Invoice:</span>
                      <span className="font-mono font-bold text-slate-800">{invoice.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total:</span>
                      <span className="font-bold text-blue-700">₹{invoice.totalAmount.toLocaleString()}</span>
                    </div>
                    {invoice.status !== 'Paid' && (
                      <button
                        onClick={() =>
                          recordCustomerPayment('NEFT / RTGS', 'NEFT-HDFC-TN26-9812401')
                        }
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold py-1.5 rounded-lg"
                      >
                        Record NEFT Payment (PAY-001)
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: MASTER ORDERS REGISTRY & OPERATIONS */}
          {adminNav === 'master_orders' && (
            <AdminMasterOrdersView
              onNavigateToControlTower={(orderId) => {
                setActiveSalesOrderId(orderId);
                setAdminNav('control_tower');
              }}
            />
          )}

          {/* VIEW 3: CUSTOMERS 360 & SALES ASSIGNMENT (Section 24, 25, 26, 27) */}
          {(adminNav === 'customers' || adminNav === 'sales_assignment') && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Customer 360 & Sales Ownership Control
                  </h2>
                  <p className="text-xs text-slate-500">
                    Admin is the ONLY role authorized to assign, reassign, or remove sales ownership.
                  </p>
                </div>
                <span className="text-xs bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded-full border border-amber-300">
                  🛡️ Admin Only Control
                </span>
              </div>

              {/* Customer Search Bar & Status Filter Control */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative flex-1 w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      id="admin-customer-search-input"
                      type="text"
                      value={customerSearchQuery}
                      onChange={(e) => setCustomerSearchQuery(e.target.value)}
                      placeholder="Search customers by company, GSTIN, code, city, industry, or sales owner..."
                      className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    />
                    {customerSearchQuery && (
                      <button
                        onClick={() => setCustomerSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                        title="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 text-xs">
                    <button
                      onClick={() => setCustomerFilterStatus('all')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition text-xs ${
                        customerFilterStatus === 'all'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      All ({customers.length})
                    </button>
                    <button
                      onClick={() => setCustomerFilterStatus('assigned')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition text-xs ${
                        customerFilterStatus === 'assigned'
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Assigned ({customers.filter((c) => c.assignedSalesId).length})
                    </button>
                    <button
                      onClick={() => setCustomerFilterStatus('unassigned')}
                      className={`px-3 py-1.5 rounded-lg font-medium transition text-xs ${
                        customerFilterStatus === 'unassigned'
                          ? 'bg-amber-600 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Unassigned ({customers.filter((c) => !c.assignedSalesId).length})
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <span>
                    Showing <strong className="text-slate-800">{filteredCustomers.length}</strong> of{' '}
                    {customers.length} client accounts
                  </span>
                  {customerSearchQuery && (
                    <span className="text-blue-600 font-medium">
                      Filtering by: &ldquo;{customerSearchQuery}&rdquo;
                    </span>
                  )}
                </div>
              </div>

              {/* Customer Selection Tabs */}
              {filteredCustomers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  {filteredCustomers.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedCustomerId(c.id);
                        setAssigningSalesId(c.assignedSalesId || salesTeam[0].id);
                      }}
                      className={`p-3 rounded-xl border text-left transition shadow-2xs ${
                        selectedCustomerId === c.id
                          ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-mono text-slate-500">{c.code}</span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                            c.assignedSalesId
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {c.assignedSalesId ? 'Assigned' : 'Unassigned'}
                        </span>
                      </div>
                      <div className="text-xs font-bold text-slate-900 mt-1 truncate">{c.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                        Owner: {c.assignedSalesName || 'Action Needed'}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white rounded-xl border border-slate-200">
                  <p className="text-sm font-semibold text-slate-700">No customers found matching &ldquo;{customerSearchQuery}&rdquo;</p>
                  <p className="text-xs text-slate-400 mt-1">Try searching by company name, code (e.g. CUST-001), or clear filters.</p>
                  <button
                    onClick={() => {
                      setCustomerSearchQuery('');
                      setCustomerFilterStatus('all');
                    }}
                    className="mt-3 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg"
                  >
                    Clear Filter
                  </button>
                </div>
              )}

              {/* Selected Customer Details & Ownership Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{viewingCustomer.name}</h3>
                    <p className="text-xs text-slate-500">
                      {viewingCustomer.industry} • GSTIN: {viewingCustomer.gst} • Tier: {viewingCustomer.tier}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Credit Limit</div>
                    <div className="text-sm font-bold text-emerald-700">
                      ₹{viewingCustomer.creditLimit.toLocaleString()} (Used: ₹
                      {viewingCustomer.creditUsed.toLocaleString()})
                    </div>
                  </div>
                </div>

                {/* Section 27: Admin Sales Assignment Controls */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <UserPlus size={15} className="text-blue-600" />
                      <span>Sales Executive Assignment Control (Admin Exclusive)</span>
                    </div>
                    <span className="text-[10px] text-slate-400">Section 27 Workflow</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                    <div>
                      <label className="text-[10px] font-bold text-slate-700 uppercase">
                        Current Sales Owner
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={viewingCustomer.assignedSalesName || 'Unassigned'}
                        className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-700 uppercase">
                        Select Sales Representative
                      </label>
                      <select
                        value={assigningSalesId}
                        onChange={(e) => setAssigningSalesId(e.target.value)}
                        className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-blue-500"
                      >
                        {salesTeam.map((rep) => (
                          <option key={rep.id} value={rep.id}>
                            {rep.name} ({rep.workloadCustomers} Accounts, {rep.openQuotations} Quotes)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-2">
                      <button
                        id="admin-btn-assign-sales"
                        onClick={() => assignSales(viewingCustomer.id, assigningSalesId)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded-lg transition"
                      >
                        Assign / Reassign
                      </button>
                      <button
                        id="admin-btn-remove-sales"
                        onClick={() => removeSales(viewingCustomer.id)}
                        className="px-3 bg-white hover:bg-rose-50 border border-rose-300 text-rose-600 text-xs font-bold py-2 rounded-lg transition"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sales Team Workload Table (Section 27) */}
                <div>
                  <div className="text-xs font-bold text-slate-800 mb-2">
                    Sales Team Workload & Territory Balance
                  </div>
                  <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="p-2.5">Sales Executive</th>
                          <th className="p-2.5">Territory & Sector</th>
                          <th className="p-2.5 text-center">Accounts</th>
                          <th className="p-2.5 text-center">Open Enquiries</th>
                          <th className="p-2.5 text-center">Open Quotations</th>
                          <th className="p-2.5 text-center">Active Orders</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {salesTeam.map((rep) => (
                          <tr key={rep.id} className="hover:bg-slate-50">
                            <td className="p-2.5 font-bold text-slate-900">{rep.name}</td>
                            <td className="p-2.5 text-slate-500">{rep.designation}</td>
                            <td className="p-2.5 text-center font-semibold text-slate-800">
                              {rep.workloadCustomers}
                            </td>
                            <td className="p-2.5 text-center text-blue-700 font-semibold">
                              {rep.openEnquiries}
                            </td>
                            <td className="p-2.5 text-center text-amber-700 font-semibold">
                              {rep.openQuotations}
                            </td>
                            <td className="p-2.5 text-center text-emerald-700 font-semibold">
                              {rep.activeOrders}
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

          {/* VIEW 4: QUOTATION APPROVAL QUEUE (Section 34) */}
          {adminNav === 'quotations' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Internal Quotation Authorization Queue
                  </h2>
                  <p className="text-xs text-slate-500">
                    Admin review of manufacturer List Price (MRP), customer project discount %, net commercial pricing, and proposal authorization.
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full ${
                    quotation.approvalStatus === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  Status: {quotation.approvalStatus}
                </span>
              </div>

              {/* Quotation Detail Card */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-start border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-600">{quotation.id}</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      Client: {quotation.customerName}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Prepared by: {quotation.salesExecutiveName} • Validity: {quotation.validUntil}
                    </p>
                  </div>
                  <div className="text-right space-y-0.5">
                    <div className="text-xs text-slate-400">Total Customer Quoted Price</div>
                    <div className="text-base font-bold text-slate-900">
                      ₹{quotation.grandTotal.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold">
                      Applied Discount: {quotation.averageDiscountPercent || 15}% Off List (₹{(quotation.totalDiscountAmount || Math.round(((quotation.totalListPrice || Math.round(quotation.subtotal / 0.85)) - quotation.subtotal))).toLocaleString()} Savings)
                    </div>
                  </div>
                </div>

                {/* Items with Discount Breakdown */}
                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Product Item</th>
                        <th className="p-2.5">Brand</th>
                        <th className="p-2.5 text-right">List Price (MRP)</th>
                        <th className="p-2.5 text-right">Discount %</th>
                        <th className="p-2.5 text-right">Quoted Unit</th>
                        <th className="p-2.5 text-right">Qty</th>
                        <th className="p-2.5 text-right">Line Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {quotation.items.map((i, idx) => {
                        const effectiveListPrice = i.listPrice || Math.round(i.quotedUnitPrice / (1 - (i.discountPercent || 15) / 100));
                        return (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2.5 font-semibold text-slate-900">{i.productName}</td>
                            <td className="p-2.5 text-slate-600">{i.brand}</td>
                            <td className="p-2.5 text-right font-mono text-slate-500">
                              ₹{effectiveListPrice.toLocaleString()}
                            </td>
                            <td className="p-2.5 text-right font-bold text-emerald-700">
                              {i.discountPercent ?? 15}%
                            </td>
                            <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                              ₹{i.quotedUnitPrice.toLocaleString()}
                            </td>
                            <td className="p-2.5 text-right">
                              {i.quantity} {i.uom}
                            </td>
                            <td className="p-2.5 text-right font-bold text-slate-900">
                              ₹{i.lineTotal.toLocaleString()}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Internal Notes */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs">
                  <div className="font-bold text-amber-900">Internal Sales Notes & Commercial Remarks:</div>
                  <p className="text-slate-700 mt-0.5">{quotation.internalNotes}</p>
                </div>

                {/* Section 34 Approval Action */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => addToast('Changes Requested', 'Quotation returned to Arun for commercial review.', 'warning')}
                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-xl"
                  >
                    Request Revision
                  </button>
                  <button
                    id="admin-btn-approve-quotation"
                    onClick={approveQuotationAdmin}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition"
                  >
                    Authorize & Approve Quotation QT-001 ({quotation.averageDiscountPercent || 15}% Discount)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: PROCUREMENT & SHORTAGE RESOLUTION (Section 39) */}
          {adminNav === 'procurement' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Procurement Module (PR-001 & PO-001)
                  </h2>
                  <p className="text-xs text-slate-500">
                    Section 39: Handles shortage quantities only. Available stock is never routed into unnecessary procurement.
                  </p>
                </div>
                <span className="text-xs bg-purple-100 text-purple-800 font-bold px-3 py-1 rounded-full">
                  Status: {procurement.status}
                </span>
              </div>

              {/* Purchase Requirement Shortages Table */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-xs font-mono font-bold text-purple-600">{procurement.id}</span>
                    <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                      Shortage Requisition for Sales Order {procurement.salesOrderId}
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-500">Est. PO Value</div>
                    <div className="text-sm font-bold text-slate-900">₹26,432 (incl. 18% GST)</div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">Shortage Product</th>
                        <th className="p-2.5">Brand</th>
                        <th className="p-2.5 text-center">Shortage Quantity</th>
                        <th className="p-2.5">Preferred Vendor</th>
                        <th className="p-2.5 text-right">Est. Unit Cost</th>
                        <th className="p-2.5 text-right">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {procurement.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">{item.productName}</td>
                          <td className="p-2.5 text-slate-600">{item.brand}</td>
                          <td className="p-2.5 text-center font-bold text-rose-600">
                            {item.shortageQty} {item.uom}
                          </td>
                          <td className="p-2.5 text-slate-700">{item.preferredVendor}</td>
                          <td className="p-2.5 text-right font-mono">₹5,600</td>
                          <td className="p-2.5 text-right font-bold text-slate-900">
                            ₹{item.estCost.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Purchase Order & GRN Inwarding */}
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-slate-900">
                        Purchase Order: {purchaseOrder.id}
                      </span>{' '}
                      • Vendor: {purchaseOrder.vendorName}
                    </div>
                    <span className="font-semibold text-emerald-700">GRN: {grn.id} ({grn.qcStatus})</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                    <span className="text-slate-500">
                      Inwarding Warehouse: <strong>{grn.warehouse}</strong>
                    </span>
                    <button
                      id="admin-btn-issue-po-grn"
                      onClick={issuePurchaseOrderAndGRN}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2 rounded-lg shadow-xs transition"
                    >
                      Receive GRN-001 & Update Chennai WH Stock
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 6: WAREHOUSE ALLOCATION (Section 40, 41) */}
          {adminNav === 'warehouses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Tamil Nadu Regional Warehouses
                  </h2>
                  <p className="text-xs text-slate-500">
                    Multi-location fulfillment across Chennai Central, Madurai Regional, and Coimbatore Industrial.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-blue-300 shadow-2xs space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-blue-900">Chennai Central Hub</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.5 rounded">
                      WH-MAA-01
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Plot 12, Ambattur Industrial Estate, Chennai
                  </p>
                  <div className="text-xs space-y-1 pt-2 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span>ABB S203 MCB:</span>
                      <span className="font-bold text-emerald-700">120 Nos Available</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Polycab 4C Cable:</span>
                      <span className="font-bold text-emerald-700">850 Mtrs</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Havells Floodlight:</span>
                      <span className="font-bold text-slate-800">12 Units (8 WH + 4 GRN)</span>
                    </div>
                  </div>
                  <button
                    onClick={() => allocateWarehouseStock('WH-MAA-01')}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1.5 rounded-lg transition"
                  >
                    Allocate & Reserve for SO-001
                  </button>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-slate-900">Madurai Regional WH</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded">
                      WH-MDU-01
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Plot 88, SIDCO Industrial Estate, Kappalur</p>
                  <div className="text-xs space-y-1 pt-2 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span>ABB S203 MCB:</span>
                      <span className="font-semibold text-slate-700">45 Nos</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Polycab 4C Cable:</span>
                      <span className="font-semibold text-slate-700">300 Mtrs</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-slate-900">Coimbatore Industrial WH</span>
                    <span className="text-[10px] bg-slate-100 text-slate-700 font-bold px-1.5 py-0.5 rounded">
                      WH-CJB-01
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">Peelamedu Project Yard, Coimbatore</p>
                  <div className="text-xs space-y-1 pt-2 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span>ABB S203 MCB:</span>
                      <span className="font-semibold text-slate-700">80 Nos</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Polycab 4C Cable:</span>
                      <span className="font-semibold text-slate-700">600 Mtrs</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 7: PRODUCT MASTER VS INVENTORY (Section 52 Mandate) */}
          {adminNav === 'products_inventory' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Product Master vs Regional Inventory
                  </h2>
                  <p className="text-xs text-slate-500">
                    Section 52 Mandate: Technical Product Master and Physical Warehouse Inventories are kept strictly separated.
                  </p>
                </div>
              </div>

              {/* Product Master Table */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
                  <span>Product Master Directory (Technical Specifications, HSN, Base Price)</span>
                  <span className="text-[10px] text-slate-400">{products.length} Active SKUs</span>
                </div>

                <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5">SKU / Code</th>
                        <th className="p-2.5">Product Name</th>
                        <th className="p-2.5">Brand</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5">HSN Code</th>
                        <th className="p-2.5 text-right">Base List Price</th>
                        <th className="p-2.5 text-center">MOQ</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono text-slate-500">{p.sku}</td>
                          <td className="p-2.5 font-bold text-slate-900">{p.name}</td>
                          <td className="p-2.5 font-semibold text-slate-700">{p.brand}</td>
                          <td className="p-2.5 text-slate-500">{p.category}</td>
                          <td className="p-2.5 font-mono text-slate-500">{p.hsnCode}</td>
                          <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                            ₹{p.baseListPrice.toLocaleString()}
                          </td>
                          <td className="p-2.5 text-center">
                            {p.moq} {p.uom}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 8: INVOICES & PAYMENTS (Section 46, 47) */}
          {adminNav === 'invoices' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Tax Invoices & Payment Ledger</h2>
                  <p className="text-xs text-slate-500">
                    Linked to Sales Order {invoice.salesOrderId} and Delivery {invoice.deliveryId}.
                  </p>
                </div>
              </div>

              {/* Invoice Detail */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 max-w-3xl">
                <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-500">{invoice.id}</span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">TAX INVOICE</h3>
                    <p className="text-xs text-slate-500">
                      Billed to: <strong>{invoice.customerName}</strong> (GSTIN: {invoice.customerGst})
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{invoice.billingAddress}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">Total Due</div>
                    <div className="text-lg font-bold text-blue-700">
                      ₹{invoice.totalAmount.toLocaleString()}
                    </div>
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
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span>Taxable Subtotal:</span>
                    <span>₹{invoice.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CGST (9%):</span>
                    <span>₹{invoice.cgst.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST (9%):</span>
                    <span>₹{invoice.sgst.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-200">
                    <span>Invoice Total:</span>
                    <span>₹{invoice.totalAmount.toLocaleString()}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-between items-center">
                  <span className="text-xs text-slate-500">Terms: {invoice.dueDate}</span>
                  {invoice.status !== 'Paid' ? (
                    <button
                      id="admin-btn-record-payment"
                      onClick={() =>
                        recordCustomerPayment('NEFT / RTGS', 'NEFT-HDFC-TN26-9812401')
                      }
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                    >
                      Record & Reconcile Payment PAY-001
                    </button>
                  ) : (
                    <div className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                      <CheckCircle2 size={16} /> Paid in Full (PAY-001 Reconciled)
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
