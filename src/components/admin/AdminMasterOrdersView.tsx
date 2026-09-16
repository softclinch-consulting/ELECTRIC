import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SalesOrder, SalesOrderStatus } from '../../types';
import {
  ClipboardList,
  Search,
  Filter,
  PlusCircle,
  Eye,
  ExternalLink,
  Printer,
  Download,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Truck,
  Building2,
  PackageCheck,
  ShieldAlert,
  ShieldCheck,
  ChevronRight,
  User,
  Phone,
  MapPin,
  FileText,
  Boxes,
  Lock,
  Unlock,
  X,
  Plus,
  Trash2,
  Check,
  Send,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

interface AdminMasterOrdersViewProps {
  onNavigateToControlTower?: (orderId: string) => void;
}

export const AdminMasterOrdersView: React.FC<AdminMasterOrdersViewProps> = ({
  onNavigateToControlTower,
}) => {
  const {
    salesOrders,
    activeSalesOrderId,
    setActiveSalesOrderId,
    updateMasterOrderStatus,
    updateMasterOrderLogistics,
    createMasterOrder,
    toggleMasterOrderHold,
    customers,
    products,
    sendInaiwazhiMessage,
    addToast,
  } = useApp();

  // Search and Filtering states
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedOrderId, setSelectedOrderId] = useState<string>(
    activeSalesOrderId || salesOrders[0]?.id || 'SO-1001'
  );

  // Logistics editing states
  const [isEditingLogistics, setIsEditingLogistics] = useState<boolean>(false);
  const [editDeliverySite, setEditDeliverySite] = useState<string>('');
  const [editContactPerson, setEditContactPerson] = useState<string>('');
  const [editContactPhone, setEditContactPhone] = useState<string>('');
  const [editPriority, setEditPriority] = useState<'Standard' | 'Express' | 'Urgent'>('Standard');
  const [editSpecialInstructions, setEditSpecialInstructions] = useState<string>('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showChallanModal, setShowChallanModal] = useState<boolean>(false);
  const [showHoldModal, setShowHoldModal] = useState<boolean>(false);
  const [holdReasonInput, setHoldReasonInput] = useState<string>('');
  const [orderToHold, setOrderToHold] = useState<SalesOrder | null>(null);

  // New Order Form state
  const [newCustomerId, setNewCustomerId] = useState<string>(customers[0]?.id || 'CUST-001');
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [newDeliverySite, setNewDeliverySite] = useState<string>('');
  const [newContactPerson, setNewContactPerson] = useState<string>('');
  const [newContactPhone, setNewContactPhone] = useState<string>('');
  const [newPriority, setNewPriority] = useState<'Standard' | 'Express' | 'Urgent'>('Standard');
  const [newInstructions, setNewInstructions] = useState<string>('');
  const [newOrderItems, setNewOrderItems] = useState<
    Array<{
      productId: string;
      qty: number;
      unitPrice: number;
    }>
  >([
    {
      productId: products[0]?.id || 'PROD-001',
      qty: 50,
      unitPrice: products[0]?.baseListPrice ? Math.round(products[0].baseListPrice * 0.85) : 1500,
    },
  ]);

  // Active selected order object
  const selectedOrder =
    salesOrders.find((o) => o.id === selectedOrderId) || salesOrders[0];

  // Start editing logistics
  const handleStartEditLogistics = () => {
    if (!selectedOrder) return;
    setEditDeliverySite(selectedOrder.deliverySite);
    setEditContactPerson(selectedOrder.siteContactPerson || '');
    setEditContactPhone(selectedOrder.siteContactPhone || '');
    setEditPriority(selectedOrder.priority || 'Standard');
    setEditSpecialInstructions(selectedOrder.specialInstructions || '');
    setIsEditingLogistics(true);
  };

  const handleSaveLogistics = () => {
    if (!selectedOrder) return;
    updateMasterOrderLogistics(selectedOrder.id, {
      deliverySite: editDeliverySite,
      siteContactPerson: editContactPerson,
      siteContactPhone: editContactPhone,
      priority: editPriority,
      specialInstructions: editSpecialInstructions,
    });
    setIsEditingLogistics(false);
  };

  // Open hold modal
  const handleOpenHoldModal = (order: SalesOrder) => {
    setOrderToHold(order);
    setHoldReasonInput(order.holdReason || (order.isHold ? '' : 'Commercial credit review required'));
    setShowHoldModal(true);
  };

  const handleConfirmHold = () => {
    if (!orderToHold) return;
    toggleMasterOrderHold(orderToHold.id, holdReasonInput);
    setShowHoldModal(false);
    setOrderToHold(null);
  };

  // WhatsApp update for delivery
  const handleSendWhatsAppUpdate = () => {
    if (!selectedOrder) return;
    const msg = `*ELECTROSPHERE DISPATCH ADVISORY*\nSales Order: ${selectedOrder.id}\nCustomer: ${selectedOrder.customerName}\nProject: ${selectedOrder.projectName}\nStatus: ${selectedOrder.status}\nSite: ${selectedOrder.deliverySite}\nSite Contact: ${selectedOrder.siteContactPerson || 'N/A'} (${selectedOrder.siteContactPhone || 'N/A'})\nTotal Value: ₹${selectedOrder.grandTotal.toLocaleString('en-IN')}\nExpected Delivery: ${selectedOrder.expectedDeliveryDate}`;
    sendInaiwazhiMessage(msg);
    addToast('Inaiwazhi WhatsApp Sent', `Live dispatch notification dispatched for ${selectedOrder.id}.`, 'success');
  };

  // Filtered orders list
  const filteredOrders = salesOrders.filter((order) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      order.id.toLowerCase().includes(q) ||
      order.customerName.toLowerCase().includes(q) ||
      order.projectName.toLowerCase().includes(q) ||
      order.deliverySite.toLowerCase().includes(q) ||
      order.salesExecutiveName.toLowerCase().includes(q);

    let matchesStatus = true;
    if (statusFilter === 'credit_check') {
      matchesStatus = order.status === 'Credit Check';
    } else if (statusFilter === 'warehouse_picking') {
      matchesStatus =
        order.status === 'Warehouse Allocation' ||
        order.status === 'Picking' ||
        order.status === 'Packing';
    } else if (statusFilter === 'dispatched') {
      matchesStatus =
        order.status === 'Dispatched' || order.status === 'In Transit';
    } else if (statusFilter === 'delivered_invoiced') {
      matchesStatus =
        order.status === 'Delivered' ||
        order.status === 'Partially Delivered' ||
        order.status === 'Invoiced';
    } else if (statusFilter === 'hold') {
      matchesStatus = !!order.isHold;
    }

    const matchesPriority =
      priorityFilter === 'all' || order.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  // KPI Metrics
  const totalOrdersCount = salesOrders.length;
  const totalValue = salesOrders.reduce((sum, o) => sum + o.grandTotal, 0);
  const inFulfillmentCount = salesOrders.filter((o) =>
    ['Credit Check', 'Warehouse Allocation', 'Picking', 'Packing'].includes(o.status)
  ).length;
  const inTransitCount = salesOrders.filter((o) =>
    ['Dispatched', 'In Transit'].includes(o.status)
  ).length;
  const deliveredCount = salesOrders.filter((o) =>
    ['Delivered', 'Partially Delivered', 'Invoiced'].includes(o.status)
  ).length;
  const onHoldCount = salesOrders.filter((o) => !!o.isHold).length;

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'Order ID',
      'Customer',
      'GSTIN',
      'Project',
      'Status',
      'Priority',
      'Order Date',
      'Expected Date',
      'Subtotal (INR)',
      'Tax (INR)',
      'Grand Total (INR)',
      'Items Count',
      'Delivery Site',
    ];
    const rows = salesOrders.map((o) => [
      o.id,
      `"${o.customerName.replace(/"/g, '""')}"`,
      o.customerGst,
      `"${o.projectName.replace(/"/g, '""')}"`,
      o.status,
      o.priority || 'Standard',
      o.orderDate,
      o.expectedDeliveryDate,
      o.subtotal,
      o.taxTotal,
      o.grandTotal,
      o.items.length,
      `"${o.deliverySite.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Master_Orders_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast('CSV Export Ready', `Exported ${salesOrders.length} Master Orders.`, 'success');
  };

  // Add Item to New Order Form
  const handleAddNewOrderItem = () => {
    const prod = products[0];
    setNewOrderItems([
      ...newOrderItems,
      {
        productId: prod?.id || 'PROD-001',
        qty: 10,
        unitPrice: prod?.baseListPrice ? Math.round(prod.baseListPrice * 0.85) : 1500,
      },
    ]);
  };

  const handleRemoveNewOrderItem = (index: number) => {
    setNewOrderItems(newOrderItems.filter((_, i) => i !== index));
  };

  // Calculate totals for new order modal
  const calcNewOrderSubtotal = newOrderItems.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  );
  const calcNewOrderTax = Math.round(calcNewOrderSubtotal * 0.18);
  const calcNewOrderGrandTotal = calcNewOrderSubtotal + calcNewOrderTax;

  // Submit Create Master Order
  const handleCreateOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const customer = customers.find((c) => c.id === newCustomerId) || customers[0];
    const defaultSite = customer.sites?.[0];

    const builtItems = newOrderItems.map((item, idx) => {
      const prod = products.find((p) => p.id === item.productId);
      const lineTotal = Math.round(item.qty * item.unitPrice * 1.18);
      return {
        id: `SO-NEW-${idx + 1}`,
        productId: item.productId,
        productName: prod?.name || 'Industrial Electrical Item',
        brand: prod?.brand || 'Schneider Electric',
        specification: prod?.specification || 'Standard Industrial Grade',
        orderedQty: item.qty,
        deliveredQty: 0,
        remainingQty: item.qty,
        uom: prod?.uom || 'Nos',
        unitPrice: item.unitPrice,
        gstPercent: 18,
        totalAmount: lineTotal,
        allocatedWarehouse: 'WH-MAA-01 (Chennai Central)',
        stockSource: 'Reserved from Inventory' as const,
      };
    });

    createMasterOrder({
      quotationId: `QT-MANUAL-${Math.floor(Math.random() * 9000 + 1000)}`,
      requirementId: `REQ-MANUAL-${Math.floor(Math.random() * 9000 + 1000)}`,
      customerId: customer.id,
      customerName: customer.name,
      customerGst: customer.gst,
      projectName: newProjectName || `${defaultSite?.city || 'Industrial'} Expansion Project`,
      deliverySite: newDeliverySite || (defaultSite ? `${defaultSite.address}, ${defaultSite.city}` : 'Chennai Industrial Estate'),
      salesExecutiveName: customer.assignedSalesName || 'Arun Kumar',
      orderDate: new Date().toISOString().slice(0, 10),
      expectedDeliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      status: 'Credit Check',
      creditCheckPassed: true,
      stockCheckPassed: true,
      hasShortage: false,
      shortageQuantityTotal: 0,
      subtotal: calcNewOrderSubtotal,
      taxTotal: calcNewOrderTax,
      grandTotal: calcNewOrderGrandTotal,
      priority: newPriority,
      siteContactPerson: newContactPerson || defaultSite?.contactPerson || 'Site Incharge',
      siteContactPhone: newContactPhone || defaultSite?.phone || '+91 98401 23456',
      specialInstructions: newInstructions || 'Standard consignment delivery.',
      items: builtItems,
      linkedPickId: `PICK-${Math.floor(Math.random() * 9000 + 1000)}`,
    });

    setShowCreateModal(false);
    // Reset form
    setNewProjectName('');
    setNewDeliverySite('');
    setNewContactPerson('');
    setNewContactPhone('');
    setNewInstructions('');
  };

  const getStatusBadge = (status: SalesOrderStatus, isHold?: boolean) => {
    if (isHold) {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-200">
          <ShieldAlert size={12} />
          <span>ON HOLD</span>
        </span>
      );
    }
    switch (status) {
      case 'Credit Check':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            <Clock size={12} />
            <span>Credit Check</span>
          </span>
        );
      case 'Warehouse Allocation':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Boxes size={12} />
            <span>WH Allocation</span>
          </span>
        );
      case 'Picking':
      case 'Packing':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <PackageCheck size={12} />
            <span>{status}</span>
          </span>
        );
      case 'Dispatched':
      case 'In Transit':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Truck size={12} />
            <span>{status}</span>
          </span>
        );
      case 'Delivered':
      case 'Partially Delivered':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} />
            <span>{status}</span>
          </span>
        );
      case 'Invoiced':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
            <FileText size={12} />
            <span>Invoiced</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const getPriorityBadge = (priority?: string) => {
    switch (priority) {
      case 'Urgent':
        return (
          <span className="text-[10px] font-extrabold uppercase tracking-wide px-1.5 py-0.5 rounded bg-red-600 text-white shadow-2xs">
            Urgent
          </span>
        );
      case 'Express':
        return (
          <span className="text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 shadow-2xs">
            Express
          </span>
        );
      default:
        return (
          <span className="text-[10px] font-medium uppercase tracking-wide px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
            Standard
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. OPERATIONS HEADER & COMMAND BAR */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
              <ClipboardList size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                  Master Orders Registry & Operations Ledger
                </h1>
                <span className="text-xs bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                  Central Authority
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-3xl leading-relaxed">
                Central operational authority for all enterprise customer Sales Orders (SOs),
                commercial dispatch authorizations, inventory reservations, logistics routing,
                and digital proof-of-delivery across Tamil Nadu distribution corridors.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="admin-btn-export-orders-csv"
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition border border-slate-300 shadow-2xs"
            >
              <Download size={14} />
              <span>Export CSV</span>
            </button>

            <button
              id="admin-btn-create-master-order"
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition shadow-xs"
            >
              <PlusCircle size={15} />
              <span>+ Create Master Order</span>
            </button>
          </div>
        </div>

        {/* 2. KPI METRICS CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-5 pt-4 border-t border-slate-100">
          <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200/70">
            <div className="text-[11px] font-semibold text-slate-500">Total Active SOs</div>
            <div className="text-xl font-extrabold text-slate-900 mt-0.5">
              {totalOrdersCount}
            </div>
            <div className="text-[10px] text-blue-700 font-semibold mt-0.5">
              ₹{(totalValue / 100000).toFixed(2)} Lakhs Total
            </div>
          </div>

          <div className="bg-amber-50/60 p-3 rounded-xl border border-amber-200/70">
            <div className="text-[11px] font-semibold text-amber-800">In Fulfillment</div>
            <div className="text-xl font-extrabold text-amber-900 mt-0.5">
              {inFulfillmentCount}
            </div>
            <div className="text-[10px] text-amber-700 font-medium mt-0.5">
              Allocation & Picking
            </div>
          </div>

          <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-200/70">
            <div className="text-[11px] font-semibold text-indigo-800">In Transit & Dispatched</div>
            <div className="text-xl font-extrabold text-indigo-900 mt-0.5">
              {inTransitCount}
            </div>
            <div className="text-[10px] text-indigo-700 font-medium mt-0.5">
              On Road Fleet
            </div>
          </div>

          <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/70">
            <div className="text-[11px] font-semibold text-emerald-800">Delivered / Invoiced</div>
            <div className="text-xl font-extrabold text-emerald-900 mt-0.5">
              {deliveredCount}
            </div>
            <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
              POD Verified
            </div>
          </div>

          <div
            className={`p-3 rounded-xl border transition cursor-pointer ${
              onHoldCount > 0
                ? 'bg-red-50 border-red-200 text-red-900'
                : 'bg-slate-50/80 border-slate-200/70 text-slate-800'
            }`}
            onClick={() => setStatusFilter(statusFilter === 'hold' ? 'all' : 'hold')}
          >
            <div className="text-[11px] font-semibold flex items-center justify-between">
              <span>Commercial Holds</span>
              {onHoldCount > 0 && <ShieldAlert size={14} className="text-red-600" />}
            </div>
            <div className="text-xl font-extrabold mt-0.5">
              {onHoldCount}
            </div>
            <div className="text-[10px] font-medium mt-0.5">
              {onHoldCount > 0 ? 'Click to inspect holds' : 'Zero credit holds'}
            </div>
          </div>
        </div>
      </div>

      {/* 3. TOOLBAR & FILTER TABS */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <input
              id="admin-master-order-search"
              type="text"
              placeholder="Search by SO-ID, Customer, Project, Site, KAM..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-500 focus:bg-white transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Priority filter */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs text-slate-500 font-medium">Priority:</span>
            <select
              id="admin-filter-order-priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-hidden focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="Urgent">Urgent Only</option>
              <option value="Express">Express Only</option>
              <option value="Standard">Standard Only</option>
            </select>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-100 text-xs">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            All Orders ({salesOrders.length})
          </button>
          <button
            onClick={() => setStatusFilter('credit_check')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              statusFilter === 'credit_check'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Credit Check
          </button>
          <button
            onClick={() => setStatusFilter('warehouse_picking')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              statusFilter === 'warehouse_picking'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Allocation & Picking
          </button>
          <button
            onClick={() => setStatusFilter('dispatched')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              statusFilter === 'dispatched'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Dispatched / On Road
          </button>
          <button
            onClick={() => setStatusFilter('delivered_invoiced')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition ${
              statusFilter === 'delivered_invoiced'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            Delivered & Invoiced
          </button>
          <button
            onClick={() => setStatusFilter('hold')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center gap-1 ${
              statusFilter === 'hold'
                ? 'bg-red-600 text-white shadow-2xs'
                : 'bg-slate-100 hover:bg-slate-200 text-red-700'
            }`}
          >
            <ShieldAlert size={13} />
            <span>Holds ({onHoldCount})</span>
          </button>
        </div>
      </div>

      {/* 4. MASTER ORDERS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead className="bg-slate-50/90 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Master Order ID</th>
                <th className="py-3 px-4">Customer & Project</th>
                <th className="py-3 px-4">Sales KAM</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4 text-right">Order Value (INR)</th>
                <th className="py-3 px-4 text-center">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Operations Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No master orders match the active filters or search term.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const isSelected = order.id === selectedOrder?.id;
                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className={`hover:bg-blue-50/40 cursor-pointer transition ${
                        isSelected ? 'bg-blue-50/70 border-l-4 border-l-blue-600 font-medium' : ''
                      }`}
                    >
                      {/* Master Order ID & Priority */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-extrabold text-slate-900 text-xs">
                            {order.id}
                          </span>
                          {getPriorityBadge(order.priority)}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {order.items.length} consignment items
                        </div>
                      </td>

                      {/* Customer & Project */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-bold text-slate-900 truncate">
                          {order.customerName}
                        </div>
                        <div className="text-[11px] text-slate-600 truncate mt-0.5">
                          {order.projectName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          GST: {order.customerGst}
                        </div>
                      </td>

                      {/* Sales KAM */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">
                          {order.salesExecutiveName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Quotation: {order.quotationId}
                        </div>
                      </td>

                      {/* Dates */}
                      <td className="py-3 px-4">
                        <div className="text-slate-800">
                          Booked: {order.orderDate}
                        </div>
                        <div className="text-[11px] text-blue-600 font-medium">
                          Exp: {order.expectedDeliveryDate}
                        </div>
                      </td>

                      {/* Financials */}
                      <td className="py-3 px-4 text-right">
                        <div className="font-mono font-bold text-slate-900 text-xs">
                          ₹{order.grandTotal.toLocaleString('en-IN')}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          +18% GST incl.
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4 text-center">
                        <div>{getStatusBadge(order.status, order.isHold)}</div>
                        {order.hasShortage && (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 mt-1 inline-block font-semibold">
                            {order.shortageQuantityTotal} shortage
                          </span>
                        )}
                      </td>

                      {/* Quick Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            title="Inspect Order Dossier"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedOrderId(order.id);
                            }}
                            className={`p-1.5 rounded-lg border transition ${
                              isSelected
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:border-blue-300'
                            }`}
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            title="Open 12-Stage Control Tower Pipeline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveSalesOrderId(order.id);
                              if (onNavigateToControlTower) {
                                onNavigateToControlTower(order.id);
                              }
                            }}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1.5 rounded-lg shadow-2xs transition"
                          >
                            <span>Control Tower</span>
                            <ChevronRight size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. SELECTED MASTER ORDER DOSSIER & DEEP MANAGEMENT */}
      {selectedOrder && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          {/* Dossier Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-sm font-mono font-extrabold bg-blue-600 text-white px-2.5 py-0.5 rounded-md shadow-2xs">
                  {selectedOrder.id}
                </span>
                <h2 className="text-lg font-bold text-slate-900">
                  {selectedOrder.projectName}
                </h2>
                {getPriorityBadge(selectedOrder.priority)}
                {getStatusBadge(selectedOrder.status, selectedOrder.isHold)}
              </div>
              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5">
                <span>
                  Customer: <strong className="text-slate-800">{selectedOrder.customerName}</strong>
                </span>
                <span>•</span>
                <span>
                  GST: <span className="font-mono">{selectedOrder.customerGst}</span>
                </span>
                <span>•</span>
                <span>
                  KAM: <strong className="text-slate-800">{selectedOrder.salesExecutiveName}</strong>
                </span>
                <span>•</span>
                <span>
                  Quotation: <span className="font-mono text-blue-600">{selectedOrder.quotationId}</span>
                </span>
              </div>
            </div>

            {/* Dossier Operations Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="admin-btn-open-control-tower-deep"
                onClick={() => {
                  setActiveSalesOrderId(selectedOrder.id);
                  if (onNavigateToControlTower) {
                    onNavigateToControlTower(selectedOrder.id);
                  }
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition shadow-xs"
              >
                <PackageCheck size={15} />
                <span>Open Control Tower</span>
                <ChevronRight size={13} />
              </button>

              <button
                id="admin-btn-print-challan"
                onClick={() => setShowChallanModal(true)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition border border-slate-300"
              >
                <Printer size={14} />
                <span>Consignment Note</span>
              </button>

              <button
                id="admin-btn-whatsapp-dispatch"
                onClick={handleSendWhatsAppUpdate}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg transition"
              >
                <Send size={14} />
                <span>Notify Customer</span>
              </button>

              <button
                id="admin-btn-toggle-hold"
                onClick={() => handleOpenHoldModal(selectedOrder)}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition border ${
                  selectedOrder.isHold
                    ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300'
                    : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
                }`}
              >
                {selectedOrder.isHold ? (
                  <>
                    <Unlock size={14} />
                    <span>Release Hold</span>
                  </>
                ) : (
                  <>
                    <Lock size={14} />
                    <span>Hold Order</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Stage Progression Bar */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-2 pb-3 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">Fulfillment Pipeline Stage:</span>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {selectedOrder.status}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Quick Override:</span>
                <select
                  value={selectedOrder.status}
                  onChange={(e) =>
                    updateMasterOrderStatus(
                      selectedOrder.id,
                      e.target.value as SalesOrderStatus
                    )
                  }
                  className="text-xs bg-white border border-slate-300 rounded-lg px-2 py-1 font-semibold text-slate-800 focus:outline-hidden focus:ring-1 focus:ring-blue-500"
                >
                  <option value="Credit Check">Credit Check</option>
                  <option value="Warehouse Allocation">Warehouse Allocation</option>
                  <option value="Picking">Picking</option>
                  <option value="Packing">Packing</option>
                  <option value="Dispatched">Dispatched</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Partially Delivered">Partially Delivered</option>
                  <option value="Invoiced">Invoiced</option>
                </select>
              </div>
            </div>

            {/* Stepper Dots */}
            <div className="grid grid-cols-6 gap-2 mt-3 text-center">
              {[
                { stage: 'Credit Check', label: '1. Credit & Stock' },
                { stage: 'Warehouse Allocation', label: '2. WH Reserve' },
                { stage: 'Picking', label: '3. Pick Bay' },
                { stage: 'Packing', label: '4. Pack & Seal' },
                { stage: 'Dispatched', label: '5. Dispatch' },
                { stage: 'Delivered', label: '6. POD Verified' },
              ].map((step, idx) => {
                const stagesOrder = [
                  'Credit Check',
                  'Warehouse Allocation',
                  'Picking',
                  'Packing',
                  'Dispatched',
                  'In Transit',
                  'Delivered',
                  'Partially Delivered',
                  'Invoiced',
                ];
                const currentIdx = stagesOrder.indexOf(selectedOrder.status);
                const stepIdx = stagesOrder.indexOf(step.stage as SalesOrderStatus);
                const isPassed = currentIdx >= stepIdx;
                const isCurrent =
                  selectedOrder.status === step.stage ||
                  (step.stage === 'Dispatched' && selectedOrder.status === 'In Transit') ||
                  (step.stage === 'Delivered' && ['Delivered', 'Partially Delivered', 'Invoiced'].includes(selectedOrder.status));

                return (
                  <div key={idx} className="space-y-1">
                    <div
                      className={`h-2 rounded-full transition ${
                        isCurrent
                          ? 'bg-blue-600 ring-2 ring-blue-300'
                          : isPassed
                          ? 'bg-emerald-500'
                          : 'bg-slate-200'
                      }`}
                    />
                    <div
                      className={`text-[10px] font-medium truncate ${
                        isCurrent
                          ? 'text-blue-700 font-bold'
                          : isPassed
                          ? 'text-emerald-700'
                          : 'text-slate-400'
                      }`}
                    >
                      {step.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Grid Layout: Left Consignment Items, Right Logistics & Documents */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Consignment Line Items */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Boxes className="text-blue-600" size={18} />
                  <h3 className="text-sm font-bold text-slate-900">
                    Consignment Items ({selectedOrder.items.length} SKUs)
                  </h3>
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Subtotal: ₹{selectedOrder.subtotal.toLocaleString('en-IN')} + GST: ₹
                  {selectedOrder.taxTotal.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3">Item & Brand</th>
                      <th className="py-2.5 px-3 text-center">Ordered</th>
                      <th className="py-2.5 px-3 text-right">Quoted Rate</th>
                      <th className="py-2.5 px-3 text-right">Line Total</th>
                      <th className="py-2.5 px-3">WH Allocation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50/70">
                        <td className="py-2.5 px-3">
                          <div className="font-semibold text-slate-900">{item.productName}</div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                            <span className="bg-slate-100 font-bold px-1.5 py-0.2 rounded text-slate-700">
                              {item.brand}
                            </span>
                            <span className="font-mono">{item.productId}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-800">
                          {item.orderedQty} {item.uom}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                          ₹{item.unitPrice.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                          ₹{item.totalAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-2.5 px-3 text-[10px]">
                          <div className="font-medium text-blue-700">
                            {item.allocatedWarehouse || 'WH-MAA-01'}
                          </div>
                          <div className="text-slate-400">
                            {item.stockSource || 'Reserved from Inventory'}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-slate-50 font-bold text-slate-900 text-xs border-t border-slate-200">
                    <tr>
                      <td colSpan={3} className="py-3 px-3 text-right">
                        Consignment Grand Total (Net Payable):
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-sm text-blue-700">
                        ₹{selectedOrder.grandTotal.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-[10px] font-normal text-slate-500">
                        Inclusive of 18% GST
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Right 1 Col: Logistics & Delivery Coordination */}
            <div className="space-y-4">
              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 text-xs space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Truck size={16} className="text-blue-600" />
                    <span>Logistics Coordination</span>
                  </div>
                  {!isEditingLogistics ? (
                    <button
                      onClick={handleStartEditLogistics}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-[11px]"
                    >
                      Edit Site / Priority
                    </button>
                  ) : (
                    <button
                      onClick={handleSaveLogistics}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded font-bold text-[11px]"
                    >
                      Save
                    </button>
                  )}
                </div>

                {!isEditingLogistics ? (
                  <div className="space-y-2 text-slate-700">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Delivery Site / Address:</span>
                      <div className="font-medium text-slate-900 flex items-start gap-1.5 mt-0.5">
                        <MapPin size={14} className="text-red-500 shrink-0 mt-0.5" />
                        <span>{selectedOrder.deliverySite}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="text-[11px] text-slate-400 block">Site Contact:</span>
                        <div className="font-medium text-slate-800 mt-0.5">
                          {selectedOrder.siteContactPerson || 'Ramesh K. (Purchase Head)'}
                        </div>
                      </div>
                      <div>
                        <span className="text-[11px] text-slate-400 block">Contact Phone:</span>
                        <div className="font-medium text-slate-800 mt-0.5">
                          {selectedOrder.siteContactPhone || '+91 98401 23456'}
                        </div>
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="text-[11px] text-slate-400 block">Special Site Instructions:</span>
                      <div className="italic text-slate-600 bg-white p-2 rounded border border-slate-200 mt-0.5 text-[11px]">
                        {selectedOrder.specialInstructions || 'Standard consignment delivery.'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase">
                        Delivery Site Address
                      </label>
                      <input
                        type="text"
                        value={editDeliverySite}
                        onChange={(e) => setEditDeliverySite(e.target.value)}
                        className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 mt-0.5"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase">
                          Contact Person
                        </label>
                        <input
                          type="text"
                          value={editContactPerson}
                          onChange={(e) => setEditContactPerson(e.target.value)}
                          className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 mt-0.5"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-600 uppercase">
                          Contact Phone
                        </label>
                        <input
                          type="text"
                          value={editContactPhone}
                          onChange={(e) => setEditContactPhone(e.target.value)}
                          className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 mt-0.5"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase">
                        Priority Level
                      </label>
                      <select
                        value={editPriority}
                        onChange={(e) =>
                          setEditPriority(e.target.value as 'Standard' | 'Express' | 'Urgent')
                        }
                        className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 mt-0.5"
                      >
                        <option value="Standard">Standard (3-5 Days)</option>
                        <option value="Express">Express (48 Hours)</option>
                        <option value="Urgent">Urgent (24 Hours Direct Hotshot)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-slate-600 uppercase">
                        Special Instructions
                      </label>
                      <textarea
                        rows={2}
                        value={editSpecialInstructions}
                        onChange={(e) => setEditSpecialInstructions(e.target.value)}
                        className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 mt-0.5"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        onClick={() => setIsEditingLogistics(false)}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveLogistics}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-xs font-semibold"
                      >
                        Save Logistics
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Connected Document Trail */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs space-y-2.5">
                <div className="font-bold text-slate-900 pb-1.5 border-b border-slate-100 flex items-center justify-between">
                  <span>Linked Operational Documents</span>
                  <span className="text-[10px] text-slate-400 font-normal">Audit Verified</span>
                </div>

                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Quotation ID:</span>
                    <span className="font-mono font-bold text-slate-800">{selectedOrder.quotationId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Requirement ID:</span>
                    <span className="font-mono font-bold text-slate-800">{selectedOrder.requirementId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Pick List ID:</span>
                    <span className="font-mono font-bold text-blue-700">
                      {selectedOrder.linkedPickId || 'PICK-1001'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Delivery Challan:</span>
                    <span className="font-mono font-bold text-emerald-700">
                      {selectedOrder.linkedDeliveryId || 'DEL-1001'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Tax Invoice:</span>
                    <span className="font-mono font-bold text-indigo-700">
                      {selectedOrder.linkedInvoiceId || 'INV-1001'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. MODAL: CREATE MASTER ORDER */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-8">
            <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold">Create New Master Sales Order</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Direct administrative creation of customer sales order with immediate inventory allocation.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateOrderSubmit} className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Select Enterprise Customer *
                  </label>
                  <select
                    value={newCustomerId}
                    onChange={(e) => {
                      setNewCustomerId(e.target.value);
                      const c = customers.find((x) => x.id === e.target.value);
                      const s = c?.sites?.[0];
                      if (s) {
                        setNewDeliverySite(`${s.address}, ${s.city}`);
                        setNewContactPerson(s.contactPerson);
                        setNewContactPhone(s.phone);
                      }
                    }}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.sites?.[0]?.city || 'TN'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Project / Plant Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Coimbatore Line-4 Switchgear Modernization"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">
                    Consignment Delivery Site Address *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Plot & Industrial Estate address"
                    value={newDeliverySite}
                    onChange={(e) => setNewDeliverySite(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Logistics Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) =>
                      setNewPriority(e.target.value as 'Standard' | 'Express' | 'Urgent')
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Standard">Standard (3-5 Days)</option>
                    <option value="Express">Express (48 Hours)</option>
                    <option value="Urgent">Urgent (Hotshot Direct)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Site Contact Engineer / Receiver
                  </label>
                  <input
                    type="text"
                    placeholder="Engineer Name"
                    value={newContactPerson}
                    onChange={(e) => setNewContactPerson(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98400 00000"
                    value={newContactPhone}
                    onChange={(e) => setNewContactPhone(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-medium text-slate-800 focus:bg-white focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Order Items Builder */}
              <div className="pt-2">
                <div className="flex items-center justify-between pb-1 mb-2 border-b border-slate-200">
                  <span className="font-bold text-slate-900">Consignment Items to Reserve</span>
                  <button
                    type="button"
                    onClick={handleAddNewOrderItem}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-xs flex items-center gap-1"
                  >
                    <Plus size={14} />
                    <span>Add SKU</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {newOrderItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <select
                        value={item.productId}
                        onChange={(e) => {
                          const prod = products.find((p) => p.id === e.target.value);
                          const updated = [...newOrderItems];
                          updated[index].productId = e.target.value;
                          if (prod?.baseListPrice) {
                            updated[index].unitPrice = Math.round(prod.baseListPrice * 0.85);
                          }
                          setNewOrderItems(updated);
                        }}
                        className="flex-1 p-1 text-xs bg-white border border-slate-300 rounded font-medium"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.brand} - {p.name} ({p.id})
                          </option>
                        ))}
                      </select>

                      <div className="w-20">
                        <input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={item.qty}
                          onChange={(e) => {
                            const updated = [...newOrderItems];
                            updated[index].qty = Math.max(1, parseInt(e.target.value) || 1);
                            setNewOrderItems(updated);
                          }}
                          className="w-full p-1 text-xs bg-white border border-slate-300 rounded text-center font-bold"
                        />
                      </div>

                      <div className="w-28">
                        <input
                          type="number"
                          min="1"
                          placeholder="Rate ₹"
                          value={item.unitPrice}
                          onChange={(e) => {
                            const updated = [...newOrderItems];
                            updated[index].unitPrice = Math.max(0, parseInt(e.target.value) || 0);
                            setNewOrderItems(updated);
                          }}
                          className="w-full p-1 text-xs bg-white border border-slate-300 rounded text-right font-mono"
                        />
                      </div>

                      <div className="w-24 text-right font-mono font-bold text-slate-800 text-[11px]">
                        ₹{(item.qty * item.unitPrice).toLocaleString('en-IN')}
                      </div>

                      {newOrderItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveNewOrderItem(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Calculation Summary */}
                <div className="mt-3 p-3 bg-blue-50/70 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500">Items: </span>
                    <strong className="text-slate-800">{newOrderItems.length} SKUs</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500">Grand Total (incl 18% GST): </span>
                    <strong className="font-mono text-blue-700 text-sm font-bold">
                      ₹{calcNewOrderGrandTotal.toLocaleString('en-IN')}
                    </strong>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition shadow-xs"
                >
                  Generate Master Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. MODAL: PRINT / VIEW CONSIGNMENT NOTE (DELIVERY CHALLAN) */}
      {showChallanModal && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-8">
            <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer size={18} />
                <span className="font-bold text-sm">Delivery Challan & Consignment Note</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold transition"
                >
                  Print Challan
                </button>
                <button
                  onClick={() => setShowChallanModal(false)}
                  className="text-slate-400 hover:text-white transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6 text-xs text-slate-800 bg-white" id="printable-challan">
              {/* Header Letterhead */}
              <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4">
                <div>
                  <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
                    ELECTROSPHERE DISTRIBUTION HUB
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Industrial Electrical Switchgear, Cables & Automation Systems
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    GSTIN: 33AAACE9912K1Z4 • CIN: U31900TN2024PTC189210
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-base font-mono font-extrabold text-blue-700">
                    CHALLAN DEL-{selectedOrder.id.replace('SO-', '')}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Order Ref: <strong className="text-slate-800">{selectedOrder.id}</strong>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Date: {new Date().toLocaleDateString('en-GB')}
                  </div>
                </div>
              </div>

              {/* Consignee & Site Details */}
              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Consignee (Customer)
                  </span>
                  <div className="font-bold text-slate-900 text-sm mt-0.5">
                    {selectedOrder.customerName}
                  </div>
                  <div className="text-slate-600 mt-0.5 font-mono">
                    GSTIN: {selectedOrder.customerGst}
                  </div>
                  <div className="text-slate-600 mt-1">
                    Project: <strong className="text-slate-800">{selectedOrder.projectName}</strong>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Delivery Site & Receiver
                  </span>
                  <div className="font-medium text-slate-800 mt-0.5">
                    {selectedOrder.deliverySite}
                  </div>
                  <div className="text-slate-600 mt-1">
                    Contact: {selectedOrder.siteContactPerson || 'Site Engineer'} (
                    {selectedOrder.siteContactPhone || '+91 98401 23456'})
                  </div>
                  <div className="text-slate-500 text-[10px] mt-1">
                    Allocated Hub: WH-MAA-01 (Chennai Central Regional Logistics Bay)
                  </div>
                </div>
              </div>

              {/* Challan Items Table */}
              <table className="w-full text-left text-xs border-collapse border border-slate-200">
                <thead className="bg-slate-100 font-bold text-slate-700 border-b border-slate-200">
                  <tr>
                    <th className="py-2 px-3 border-r border-slate-200">S.No</th>
                    <th className="py-2 px-3 border-r border-slate-200">Product Description & Brand</th>
                    <th className="py-2 px-3 border-r border-slate-200 text-center">HSN Code</th>
                    <th className="py-2 px-3 border-r border-slate-200 text-center">Quantity</th>
                    <th className="py-2 px-3 text-right">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2 px-3 border-r border-slate-200 text-center font-mono">
                        {idx + 1}
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200">
                        <div className="font-bold text-slate-900">{item.productName}</div>
                        <div className="text-[10px] text-slate-500">
                          Brand: {item.brand} • SKU: {item.productId}
                        </div>
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-center font-mono text-[11px]">
                        8536 / 8544
                      </td>
                      <td className="py-2 px-3 border-r border-slate-200 text-center font-bold text-slate-900">
                        {item.orderedQty} {item.uom}
                      </td>
                      <td className="py-2 px-3 text-right text-[10px] text-slate-500">
                        Intact Factory Seal
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Signatures */}
              <div className="grid grid-cols-3 gap-6 pt-10 text-center text-xs">
                <div className="border-t border-slate-300 pt-2">
                  <div className="font-bold text-slate-800">Prepared By</div>
                  <div className="text-[10px] text-slate-500">WH Dispatch Supervisor</div>
                </div>
                <div className="border-t border-slate-300 pt-2">
                  <div className="font-bold text-slate-800">Transporter / Driver</div>
                  <div className="text-[10px] text-slate-500">Vehicle Sign & Date</div>
                </div>
                <div className="border-t border-slate-300 pt-2">
                  <div className="font-bold text-slate-800">Customer Authorized Receiver</div>
                  <div className="text-[10px] text-slate-500">Seal & Signature with Time</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. MODAL: COMMERCIAL HOLD CONFIRMATION */}
      {showHoldModal && orderToHold && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-5 border border-slate-200 space-y-4">
            <div className="flex items-center gap-2.5 text-amber-700">
              <ShieldAlert size={22} />
              <h3 className="font-bold text-slate-900 text-base">
                {orderToHold.isHold ? 'Release Commercial Hold' : 'Place Commercial Hold'}
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {orderToHold.isHold
                ? `Are you sure you want to release the hold on Master Order ${orderToHold.id}? Fulfillment and warehouse picking will resume immediately.`
                : `Placing Master Order ${orderToHold.id} on commercial hold will pause warehouse dispatch and picking until resolved.`}
            </p>

            {!orderToHold.isHold && (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Reason for Hold
                </label>
                <input
                  type="text"
                  value={holdReasonInput}
                  onChange={(e) => setHoldReasonInput(e.target.value)}
                  placeholder="e.g. Credit limit check pending, Site access delayed"
                  className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowHoldModal(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmHold}
                className={`px-4 py-1.5 text-white rounded-lg text-xs font-bold ${
                  orderToHold.isHold
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {orderToHold.isHold ? 'Confirm Release' : 'Confirm Hold'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
