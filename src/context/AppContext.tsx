import React, { createContext, useContext, useState, ReactNode } from 'react';
import {
  AppRole,
  CustomerProfile,
  ProductMasterItem,
  InventoryItem,
  Requirement,
  Quotation,
  InternalQuotationItem,
  SalesOrder,
  SalesOrderStatus,
  PurchaseRequirement,
  PurchaseOrder,
  GRNRecord,
  PickingRecord,
  PackingRecord,
  DeliveryRecord,
  InvoiceRecord,
  PaymentRecord,
  InaiwazhiConversation,
  InaiwazhiMessage,
  DriverProfile,
} from '../types';
import {
  INITIAL_CUSTOMERS,
  SALES_TEAM,
  PRODUCT_MASTER,
  INITIAL_INVENTORY,
  INITIAL_REQUIREMENT,
  INITIAL_QUOTATION,
  INITIAL_SALES_ORDER,
  INITIAL_SALES_ORDERS,
  INITIAL_PROCUREMENT,
  INITIAL_PURCHASE_ORDER,
  INITIAL_GRN,
  INITIAL_PICKING,
  INITIAL_PACKING,
  INITIAL_DELIVERY,
  INITIAL_INVOICE,
  INITIAL_PAYMENT,
  INITIAL_CONVERSATION,
} from '../data/mockData';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface FlowStep {
  id: number;
  title: string;
  role: AppRole;
  description: string;
  expectedAction: string;
}

export const MASTER_FLOW_STEPS: FlowStep[] = [
  {
    id: 1,
    title: 'Customer Mobile: Browse & Create Multi-Brand Requirement (REQ-1001)',
    role: 'customer',
    description: 'Customer ABC Electrical adds 20 products across Schneider, ABB, Polycab, Siemens, Havells, L&T, Legrand and uploads BOQ to REQ-1001.',
    expectedAction: 'Review requirement & Submit to Inaiwazhi (creates ENQ-1001)',
  },
  {
    id: 2,
    title: 'Admin Desktop: Customer Identification & Route to Sales Owner',
    role: 'admin',
    description: 'Admin identifies ABC Electrical as existing customer CUS-1001, routes ENQ-1001 to Current Sales Owner Arun Kumar.',
    expectedAction: 'Route to Current Sales Owner (Arun Kumar)',
  },
  {
    id: 3,
    title: 'Sales Desktop: 20-Product Review, Alternatives & Stock Check',
    role: 'sales',
    description: 'Arun reviews 20 products, proposes ABB MCB alternative for Schneider MCB, and evaluates stock (18 available, 2 shortage).',
    expectedAction: 'Check Stock & Create Quotation QT-1001',
  },
  {
    id: 4,
    title: 'Sales Desktop: Internal Quotation & Margin Review',
    role: 'sales',
    description: 'Review internal cost & 15% margin (INTERNAL ONLY - hidden from customer). Submit QT-1001 for Admin approval.',
    expectedAction: 'Submit QT-1001 for Admin Approval',
  },
  {
    id: 5,
    title: 'Admin Desktop: Approve Internal Quotation QT-1001',
    role: 'admin',
    description: 'Admin reviews multi-brand commercial terms and approves quotation QT-1001.',
    expectedAction: 'Approve Quotation QT-1001',
  },
  {
    id: 6,
    title: 'Sales Desktop: Send Customer Proposal via Inaiwazhi',
    role: 'sales',
    description: 'Generate customer-safe proposal (costs & margins stripped) and send via Inaiwazhi.',
    expectedAction: 'Send Proposal via Inaiwazhi',
  },
  {
    id: 7,
    title: 'Customer Mobile: Receive & Accept Quotation QT-1001',
    role: 'customer',
    description: 'Customer reviews proposal, alternative proposal notes, and accepts QT-1001 (or requests changes QT-1001-R1).',
    expectedAction: 'Click Accept Quotation',
  },
  {
    id: 8,
    title: 'Sales Order Control Tower (SO-1001) Creation',
    role: 'admin',
    description: 'Accepted QT-1001 converts into SO-1001 carrying all 20 products, customer, and project details.',
    expectedAction: 'Open Order Control Tower for SO-1001',
  },
  {
    id: 9,
    title: 'Admin Control Tower: Credit Check & Stock Check',
    role: 'admin',
    description: 'Credit limit approved. Stock check identifies 18 available and 200 unit shortage for ABB MCB 63A routed to PR-1001.',
    expectedAction: 'Run Credit & Stock Check -> Allocate / Procurement',
  },
  {
    id: 10,
    title: 'Admin Procurement: PR-1001 → RFQ-1001 → PO-1001 & GRN-1001',
    role: 'admin',
    description: 'Issue PO-1001 for 200 units shortage, receive GRN-1001, and update inventory to 300 (Ready for fulfillment).',
    expectedAction: 'Confirm GRN-1001 Inwarding',
  },
  {
    id: 11,
    title: 'Warehouse: Allocation, Picking (PICK-1001) & Packing (PACK-1001)',
    role: 'admin',
    description: 'Allocate Chennai Central WH, pick 20 line items (PICK-1001), pack and seal into industrial crates (PACK-1001).',
    expectedAction: 'Complete Picking & Packing',
  },
  {
    id: 12,
    title: 'Admin Dispatch & Driver Mobile: DEL-1001 & Digital POD',
    role: 'driver',
    description: 'Admin assigns Driver Ravi (TN-XX-1234). Driver delivers to Chennai Project Site and captures digital POD.',
    expectedAction: 'Verify Products & Submit POD-1001',
  },
  {
    id: 13,
    title: 'Admin Invoice (INV-1001) & Customer Payment (PAY-1001)',
    role: 'admin',
    description: 'Admin generates GST Invoice INV-1001; Customer makes payment via NEFT (PAY-1001).',
    expectedAction: 'Confirm Payment PAY-1001',
  },
  {
    id: 14,
    title: 'Customer Mobile: Order Completed & 1-Click Reorder',
    role: 'customer',
    description: 'Live order timeline completed. Customer reorders products into a new requirement without mutating historical SO-1001.',
    expectedAction: 'Click Reorder to start new cycle',
  },
];

export const INITIAL_DRIVERS: DriverProfile[] = [
  {
    id: 'DRV-001',
    name: 'Driver Ravi',
    phone: '+91 98409 55667',
    vehicleNumber: 'TN-XX-1234',
    vehicleType: 'Tata 407 Heavy (4-Ton)',
    licenseNo: 'TN-02-2015-0048291',
    hub: 'Chennai Central Warehouse Bay 4',
    currentDeliveryId: 'DEL-1001',
  },
  {
    id: 'DRV-002',
    name: 'Selvam M.',
    phone: '+91 94441 89201',
    vehicleNumber: 'TN-09-CB-4412',
    vehicleType: 'Ashok Leyland Dost (1.5-Ton)',
    licenseNo: 'TN-09-2018-0091823',
    hub: 'Guindy Industrial Route',
    currentDeliveryId: 'DEL-002',
  },
  {
    id: 'DRV-003',
    name: 'Kumar P.',
    phone: '+91 98403 11229',
    vehicleNumber: 'TN-22-EX-7820',
    vehicleType: 'Mahindra Bolero Maxi Truck',
    licenseNo: 'TN-22-2016-0039214',
    hub: 'Sriperumbudur Corridor',
    currentDeliveryId: 'DEL-003',
  },
];

interface AppContextType {
  role: AppRole;
  setRole: (role: AppRole) => void;
  customers: CustomerProfile[];
  activeCustomer: CustomerProfile;
  setActiveCustomerId: (id: string) => void;
  salesTeam: typeof SALES_TEAM;
  products: ProductMasterItem[];
  inventory: InventoryItem[];
  requirement: Requirement;
  quotation: Quotation;
  salesOrder: SalesOrder;
  salesOrders: SalesOrder[];
  activeSalesOrderId: string;
  setActiveSalesOrderId: (id: string) => void;
  updateMasterOrderStatus: (orderId: string, status: SalesOrderStatus) => void;
  updateMasterOrderLogistics: (orderId: string, updates: Partial<SalesOrder>) => void;
  createMasterOrder: (newOrder: Omit<SalesOrder, 'id'>) => void;
  toggleMasterOrderHold: (orderId: string, reason?: string) => void;
  procurement: PurchaseRequirement;
  purchaseOrder: PurchaseOrder;
  grn: GRNRecord;
  picking: PickingRecord;
  packing: PackingRecord;
  delivery: DeliveryRecord;
  invoice: InvoiceRecord;
  payment: PaymentRecord;
  conversation: InaiwazhiConversation;
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;

  // Driver & Customer Auth
  driverProfiles: DriverProfile[];
  activeDriver: DriverProfile;
  setActiveDriver: (driver: DriverProfile) => void;
  isCustomerLoggedIn: boolean;
  setIsCustomerLoggedIn: (val: boolean) => void;
  isDriverLoggedIn: boolean;
  setIsDriverLoggedIn: (val: boolean) => void;
  loginCustomer: (phoneOrEmail: string, customerId?: string) => void;
  logoutCustomer: () => void;
  loginDriver: (vehicleNo: string, pin: string, driverId?: string) => void;
  logoutDriver: () => void;
  
  // Guided Walkthrough
  currentFlowStep: number;
  setFlowStep: (step: number) => void;
  goToNextFlowStep: () => void;
  guidedMode: boolean;
  setGuidedMode: (enabled: boolean) => void;

  // Actions
  assignSales: (customerId: string, salesId: string) => void;
  reassignSales: (customerId: string, salesId: string) => void;
  removeSales: (customerId: string) => void;
  submitCustomerRequirement: (req: Partial<Requirement>) => void;
  submitQuotationForApproval: (notes?: string) => void;
  submitQuotationForAdminApproval: (notes?: string) => void;
  approveQuotationAdmin: () => void;
  sendCustomerProposal: () => void;
  sendQuotationToCustomer: () => void;
  updateQuotationItemPrice: (itemId: string, unitPrice: number) => void;
  updateQuotationItemQty: (itemId: string, quantity: number) => void;
  addQuotationItem: (productId: string, quantity: number, customUnitPrice?: number, customDiscountPercent?: number) => void;
  removeQuotationItem: (itemId: string) => void;
  updateQuotationTerms: (terms: Partial<Pick<Quotation, 'paymentTerms' | 'deliveryTerms' | 'validUntil' | 'internalNotes'>>) => void;
  applyMarginToAllQuotationItems: (marginPercent: number) => void;
  updateQuotationItemDiscount: (itemId: string, discountPercent: number) => void;
  applyDiscountToAllQuotationItems: (discountPercent: number) => void;
  addProductMasterItem: (item: Omit<ProductMasterItem, 'id'>) => void;
  updateProductMasterItem: (id: string, updates: Partial<ProductMasterItem>) => void;
  deleteProductMasterItem: (id: string) => void;
  loadQuotationFromRequirement: () => void;
  updateSalesOrderDetails: (details: Partial<SalesOrder>) => void;
  substituteQuotationProduct: (oldProdId: string, newProdId: string) => void;
  acceptQuotationCustomer: () => void;
  requestQuotationChangesCustomer: (comment: string) => void;
  rejectQuotationCustomer: () => void;
  runOrderCreditAndStockCheck: () => void;
  issuePurchaseOrderAndGRN: () => void;
  allocateWarehouseStock: (whId: string) => void;
  completeWarehousePicking: () => void;
  completeWarehousePacking: () => void;
  dispatchOrderDelivery: (driver: string, vehicle: string) => void;
  driverCompleteDelivery: (signedBy: string, isPartial?: boolean, signatureRef?: string, remarks?: string) => void;
  completeDeliveryWithPod: (signedBy: string, signatureRef?: string, remarks?: string) => void;
  generateCustomerInvoice: () => void;
  recordCustomerPayment: (method: string, ref: string) => void;
  quickReorderFromOrder: () => void;
  sendInaiwazhiMessage: (text: string, attachmentName?: string, attachmentType?: any) => void;
  resetPrototypeState: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<AppRole>('customer');
  const [customers, setCustomers] = useState<CustomerProfile[]>(INITIAL_CUSTOMERS);
  const [activeCustomerId, setActiveCustomerId] = useState<string>('CUST-001');
  const [salesTeam] = useState(SALES_TEAM);
  const [driverProfiles] = useState<DriverProfile[]>(INITIAL_DRIVERS);
  const [activeDriver, setActiveDriver] = useState<DriverProfile>(INITIAL_DRIVERS[0]);
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState<boolean>(true);
  const [isDriverLoggedIn, setIsDriverLoggedIn] = useState<boolean>(true);
  const [products, setProducts] = useState<ProductMasterItem[]>(PRODUCT_MASTER);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [requirement, setRequirement] = useState<Requirement>(INITIAL_REQUIREMENT);
  const [quotation, setQuotation] = useState<Quotation>(INITIAL_QUOTATION);
  const [salesOrders, setSalesOrders] = useState<SalesOrder[]>(INITIAL_SALES_ORDERS);
  const [salesOrder, setSalesOrderState] = useState<SalesOrder>(INITIAL_SALES_ORDER);
  const [activeSalesOrderId, setActiveSalesOrderIdState] = useState<string>(INITIAL_SALES_ORDER.id);

  const setSalesOrder: React.Dispatch<React.SetStateAction<SalesOrder>> = (action) => {
    setSalesOrderState((prev) => {
      const next = typeof action === 'function' ? action(prev) : action;
      setSalesOrders((list) => list.map((o) => (o.id === next.id ? next : o)));
      return next;
    });
  };

  const setActiveSalesOrderId = (id: string) => {
    setActiveSalesOrderIdState(id);
    const target = salesOrders.find((o) => o.id === id);
    if (target) {
      setSalesOrderState(target);
    }
  };

  const updateMasterOrderStatus = (orderId: string, status: SalesOrderStatus) => {
    setSalesOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
    if (salesOrder.id === orderId) {
      setSalesOrderState((prev) => ({ ...prev, status }));
    }
    addToast('Master Order Status Updated', `Order ${orderId} status changed to ${status}.`, 'info');
  };

  const updateMasterOrderLogistics = (orderId: string, updates: Partial<SalesOrder>) => {
    setSalesOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, ...updates } : o))
    );
    if (salesOrder.id === orderId) {
      setSalesOrderState((prev) => ({ ...prev, ...updates }));
    }
    addToast('Order Logistics Updated', `Delivery details updated for ${orderId}.`, 'success');
  };

  const toggleMasterOrderHold = (orderId: string, reason?: string) => {
    setSalesOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const isHold = !o.isHold;
          const updated = {
            ...o,
            isHold,
            holdReason: isHold ? (reason || 'Administrative commercial review hold') : undefined,
          };
          if (salesOrder.id === orderId) {
            setSalesOrderState(updated);
          }
          return updated;
        }
        return o;
      })
    );
    addToast('Order Hold Updated', `Commercial hold status updated for ${orderId}.`, 'warning');
  };

  const createMasterOrder = (newOrder: Omit<SalesOrder, 'id'>) => {
    const nextNum = salesOrders.length + 1001;
    const nextId = `SO-${nextNum}`;
    const created: SalesOrder = {
      ...newOrder,
      id: nextId,
    };
    setSalesOrders((prev) => [created, ...prev]);
    setActiveSalesOrderIdState(nextId);
    setSalesOrderState(created);
    addToast('Master Order Created', `New Master Sales Order ${nextId} generated for ${created.customerName}.`, 'success');
  };

  const [procurement, setProcurement] = useState<PurchaseRequirement>(INITIAL_PROCUREMENT);
  const [purchaseOrder, setPurchaseOrder] = useState<PurchaseOrder>(INITIAL_PURCHASE_ORDER);
  const [grn, setGrn] = useState<GRNRecord>(INITIAL_GRN);
  const [picking, setPicking] = useState<PickingRecord>(INITIAL_PICKING);
  const [packing, setPacking] = useState<PackingRecord>(INITIAL_PACKING);
  const [delivery, setDelivery] = useState<DeliveryRecord>(INITIAL_DELIVERY);
  const [invoice, setInvoice] = useState<InvoiceRecord>(INITIAL_INVOICE);
  const [payment, setPayment] = useState<PaymentRecord>(INITIAL_PAYMENT);
  const [conversation, setConversation] = useState<InaiwazhiConversation>(INITIAL_CONVERSATION);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [currentFlowStep, setCurrentFlowStep] = useState<number>(1);
  const [guidedMode, setGuidedMode] = useState<boolean>(false);

  const loginCustomer = (phoneOrEmail: string, customerId?: string) => {
    if (customerId) {
      setActiveCustomerId(customerId);
    }
    setIsCustomerLoggedIn(true);
    const target = customers.find((c) => c.id === (customerId || activeCustomerId));
    addToast('Customer Authenticated', `Signed in as ${target?.name || 'Customer'}.`, 'success');
  };

  const logoutCustomer = () => {
    setIsCustomerLoggedIn(false);
    addToast('Signed Out', 'You have logged out of the Customer Portal.', 'info');
  };

  const loginDriver = (vehicleNo: string, pin: string, driverId?: string) => {
    const foundDriver =
      driverProfiles.find(
        (d) => d.id === driverId || d.vehicleNumber.toLowerCase() === vehicleNo.trim().toLowerCase()
      ) || driverProfiles[0];
    setActiveDriver(foundDriver);
    setIsDriverLoggedIn(true);
    addToast('Driver Authenticated', `Welcome back, ${foundDriver.name} (${foundDriver.vehicleNumber}).`, 'success');
  };

  const logoutDriver = () => {
    setIsDriverLoggedIn(false);
    addToast('Driver Logged Out', 'Driver session ended.', 'info');
  };

  const addToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const activeCustomer = customers.find((c) => c.id === activeCustomerId) || customers[0];

  const setFlowStep = (stepNum: number) => {
    const step = MASTER_FLOW_STEPS.find((s) => s.id === stepNum);
    if (step) {
      setCurrentFlowStep(stepNum);
      setRole(step.role);
      addToast(`Switched to Step ${step.id}`, `${step.title}`, 'info');
    }
  };

  const goToNextFlowStep = () => {
    if (currentFlowStep < MASTER_FLOW_STEPS.length) {
      setFlowStep(currentFlowStep + 1);
    } else {
      addToast('Workflow Complete', 'You have tested all 14 steps of the B2B transaction journey!', 'success');
    }
  };

  // ADMIN ONLY: Assign Sales to customer
  const assignSales = (customerId: string, salesId: string) => {
    const rep = salesTeam.find((s) => s.id === salesId);
    if (!rep) return;
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? {
              ...c,
              assignedSalesId: rep.id,
              assignedSalesName: rep.name,
              assignedSalesEmail: rep.email,
              assignedSalesPhone: rep.phone,
            }
          : c
      )
    );
    addToast('Sales Assigned', `${rep.name} assigned to customer. Notification sent via Inaiwazhi.`, 'success');
    sendInaiwazhiMessage(
      `Admin assigned ${rep.name} as dedicated Key Account Executive for ${activeCustomer.name}.`,
      undefined,
      undefined
    );
  };

  const reassignSales = (customerId: string, salesId: string) => {
    assignSales(customerId, salesId);
  };

  const removeSales = (customerId: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === customerId
          ? {
              ...c,
              assignedSalesId: '',
              assignedSalesName: 'Unassigned',
              assignedSalesEmail: '',
              assignedSalesPhone: '',
            }
          : c
      )
    );
    addToast('Sales Removed', 'Customer ownership removed. Customer is now unassigned.', 'warning');
  };

  // Customer submit requirement
  const submitCustomerRequirement = (reqData: Partial<Requirement>) => {
    setRequirement((prev) => ({
      ...prev,
      ...reqData,
      status: 'submitted',
      createdAt: 'Just now',
    }));
    addToast('Requirement REQ-001 Submitted', 'Our technical sales team will review and offer competitive pricing.', 'success');
    sendInaiwazhiMessage(
      `Customer submitted Requirement REQ-001 with ${reqData.items?.length || 4} items. Project: ${reqData.projectName || 'Ambattur Line 3'}.`,
      reqData.boqFileName || 'BOQ_Upload.xlsx',
      'boq'
    );
  };

  // Sales submit quotation for approval
  const submitQuotationForApproval = (notes?: string) => {
    setQuotation((prev) => ({
      ...prev,
      approvalStatus: 'Pending Approval',
      internalNotes: notes || prev.internalNotes,
    }));
    addToast('Quotation Submitted for Approval', 'Quotation QT-001 is now awaiting Admin authorization.', 'info');
  };

  // Admin approves quotation
  const approveQuotationAdmin = () => {
    setQuotation((prev) => ({
      ...prev,
      approvalStatus: 'Approved',
      approvedBy: 'Admin (Operations Head)',
      approvalDate: 'Just now',
    }));
    addToast('Quotation Approved', 'Admin authorized QT-001. Ready to send customer proposal.', 'success');
  };

  // Sales submit for approval alias
  const submitQuotationForAdminApproval = (notes?: string) => {
    submitQuotationForApproval(notes);
  };

  // Sales sends customer proposal via Inaiwazhi
  const sendCustomerProposal = () => {
    setQuotation((prev) => ({
      ...prev,
      customerStatus: 'Sent to Customer',
    }));
    setRequirement((prev) => ({
      ...prev,
      status: 'quoted',
    }));
    addToast('Proposal Dispatched', 'Customer proposal dispatched via Inaiwazhi to Customer Mobile.', 'success');
    sendInaiwazhiMessage(
      'Official proposal QT-001 generated and shared. Includes special pricing and ABB alternative offer for immediate dispatch.',
      'Customer_Proposal_QT-001.pdf',
      'quotation'
    );
  };

  const sendQuotationToCustomer = () => {
    sendCustomerProposal();
  };

  const calcQuotationTotals = (items: InternalQuotationItem[]) => {
    const totalListPrice = items.reduce((acc, i) => acc + (i.listPrice || i.quotedUnitPrice) * i.quantity, 0);
    const subtotal = items.reduce((acc, i) => acc + i.quotedUnitPrice * i.quantity, 0);
    const totalTax = items.reduce((acc, i) => acc + i.totalTax, 0);
    const grandTotal = subtotal + totalTax;
    const totalDiscountAmount = Math.max(0, totalListPrice - subtotal);
    const averageDiscountPercent = totalListPrice > 0 ? Math.round((totalDiscountAmount / totalListPrice) * 100) : 0;
    return {
      totalListPrice,
      subtotal,
      totalTax,
      grandTotal,
      totalDiscountAmount,
      averageDiscountPercent,
    };
  };

  const updateQuotationItemPrice = (itemId: string, unitPrice: number) => {
    setQuotation((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.productId === itemId || item.requirementItemId === itemId) {
          const listPrice = item.listPrice || unitPrice;
          const discountPercent = listPrice > 0 ? Math.max(0, Math.round(((listPrice - unitPrice) / listPrice) * 100)) : 0;
          const totalTax = Math.round((unitPrice * item.quantity * (item.gstPercent || 18)) / 100);
          const lineTotal = unitPrice * item.quantity + totalTax;
          return {
            ...item,
            quotedUnitPrice: unitPrice,
            discountPercent,
            totalTax,
            lineTotal,
          };
        }
        return item;
      });
      const totals = calcQuotationTotals(updatedItems);
      return {
        ...prev,
        items: updatedItems,
        ...totals,
      };
    });
  };

  const updateQuotationItemDiscount = (itemId: string, discountPercent: number) => {
    const validDiscount = Math.max(0, Math.min(99, discountPercent));
    setQuotation((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.productId === itemId || item.requirementItemId === itemId) {
          const listPrice = item.listPrice || item.quotedUnitPrice;
          const quotedUnitPrice = Math.round(listPrice * (1 - validDiscount / 100));
          const totalTax = Math.round((quotedUnitPrice * item.quantity * (item.gstPercent || 18)) / 100);
          const lineTotal = quotedUnitPrice * item.quantity + totalTax;
          return {
            ...item,
            discountPercent: validDiscount,
            quotedUnitPrice,
            totalTax,
            lineTotal,
          };
        }
        return item;
      });
      const totals = calcQuotationTotals(updatedItems);
      return {
        ...prev,
        items: updatedItems,
        ...totals,
      };
    });
    addToast('Discount Updated', `Applied ${validDiscount}% discount to product item.`, 'info');
  };

  const applyDiscountToAllQuotationItems = (discountPercent: number) => {
    const validDiscount = Math.max(0, Math.min(99, discountPercent));
    setQuotation((prev) => {
      const updatedItems = prev.items.map((item) => {
        const listPrice = item.listPrice || item.quotedUnitPrice;
        const newUnitPrice = Math.round(listPrice * (1 - validDiscount / 100));
        const totalTax = Math.round((newUnitPrice * item.quantity * (item.gstPercent || 18)) / 100);
        const lineTotal = newUnitPrice * item.quantity + totalTax;
        return {
          ...item,
          discountPercent: validDiscount,
          quotedUnitPrice: newUnitPrice,
          totalTax,
          lineTotal,
        };
      });
      const totals = calcQuotationTotals(updatedItems);
      return {
        ...prev,
        items: updatedItems,
        ...totals,
      };
    });
    addToast('Bulk Discount Applied', `Applied ${validDiscount}% project discount across all quotation items.`, 'success');
  };

  const substituteQuotationProduct = (oldProdId: string, newProdId: string) => {
    const replacementProd = products.find((p) => p.id === newProdId);
    if (!replacementProd) return;
    setQuotation((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.productId === oldProdId) {
          const listPrice = replacementProd.baseListPrice;
          const discountPercent = item.discountPercent || 15;
          const quotedUnitPrice = Math.round(listPrice * (1 - discountPercent / 100));
          const totalTax = Math.round((quotedUnitPrice * item.quantity * 0.18));
          return {
            ...item,
            productId: replacementProd.id,
            productName: replacementProd.name,
            brand: replacementProd.brand,
            specification: replacementProd.specification,
            listPrice,
            discountPercent,
            quotedUnitPrice,
            totalTax,
            lineTotal: quotedUnitPrice * item.quantity + totalTax,
            alternativeTo: item.productName,
          };
        }
        return item;
      });
      const totals = calcQuotationTotals(updatedItems);
      return {
        ...prev,
        items: updatedItems,
        ...totals,
      };
    });
    addToast('Product Substituted', `Substituted with ${replacementProd.brand} ${replacementProd.name}.`, 'info');
  };

  const updateQuotationItemQty = (itemId: string, quantity: number) => {
    const validQty = Math.max(1, quantity);
    setQuotation((prev) => {
      const updatedItems = prev.items.map((item) => {
        if (item.productId === itemId || item.requirementItemId === itemId) {
          const totalTax = Math.round((item.quotedUnitPrice * validQty * (item.gstPercent || 18)) / 100);
          const lineTotal = item.quotedUnitPrice * validQty + totalTax;
          return {
            ...item,
            quantity: validQty,
            totalTax,
            lineTotal,
          };
        }
        return item;
      });
      const totals = calcQuotationTotals(updatedItems);
      return {
        ...prev,
        items: updatedItems,
        ...totals,
      };
    });
  };

  const addQuotationItem = (productId: string, quantity: number, customUnitPrice?: number, customDiscountPercent?: number) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    const qty = Math.max(1, quantity || product.moq || 1);
    const listPrice = product.baseListPrice;
    const discountPercent = customDiscountPercent !== undefined ? customDiscountPercent : (product.standardDiscountPercent ?? 15);
    const unitPrice = customUnitPrice !== undefined ? customUnitPrice : Math.round(listPrice * (1 - discountPercent / 100));
    const costPrice = Math.round(listPrice * 0.72);
    const margin = unitPrice > costPrice ? Math.round(((unitPrice - costPrice) / unitPrice) * 100) : 15;
    const totalTax = Math.round((unitPrice * qty * 0.18));
    const lineTotal = unitPrice * qty + totalTax;

    const newItem: InternalQuotationItem = {
      requirementItemId: `REQ-ITEM-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      brand: product.brand,
      specification: product.specification,
      quantity: qty,
      uom: product.uom,
      costPrice,
      listPrice,
      discountPercent,
      marginPercent: margin,
      quotedUnitPrice: unitPrice,
      gstPercent: 18,
      totalTax,
      lineTotal,
      stockStatus: 'In Stock',
      warehouseLocation: 'WH-MAA-01 (Chennai Central)',
      leadTimeDays: 1,
    };

    setQuotation((prev) => {
      const updatedItems = [...prev.items, newItem];
      const totals = calcQuotationTotals(updatedItems);
      return {
        ...prev,
        items: updatedItems,
        ...totals,
      };
    });
    addToast('Item Added to Quotation', `Added ${product.brand} ${product.name} (${qty} ${product.uom}).`, 'success');
  };

  const removeQuotationItem = (itemId: string) => {
    setQuotation((prev) => {
      if (prev.items.length <= 1) {
        addToast('Cannot Remove', 'Quotation must have at least one product item.', 'warning');
        return prev;
      }
      const updatedItems = prev.items.filter(
        (item) => item.productId !== itemId && item.requirementItemId !== itemId
      );
      const totals = calcQuotationTotals(updatedItems);
      return {
        ...prev,
        items: updatedItems,
        ...totals,
      };
    });
    addToast('Item Removed', 'Quotation item has been removed.', 'info');
  };

  const updateQuotationTerms = (terms: Partial<Pick<Quotation, 'paymentTerms' | 'deliveryTerms' | 'validUntil' | 'internalNotes'>>) => {
    setQuotation((prev) => ({
      ...prev,
      ...terms,
    }));
    addToast('Terms Updated', 'Quotation commercial terms updated successfully.', 'success');
  };

  const applyMarginToAllQuotationItems = (marginPercent: number) => {
    // Keep for backward compatibility; routes to discount calculation
    applyDiscountToAllQuotationItems(marginPercent);
  };

  // Master Product Flow methods
  const addProductMasterItem = (item: Omit<ProductMasterItem, 'id'>) => {
    const nextId = `PROD-${String(products.length + 1).padStart(3, '0')}`;
    const newProduct: ProductMasterItem = {
      ...item,
      id: nextId,
    };
    setProducts((prev) => [newProduct, ...prev]);

    // Also add an inventory stock record for WH-MAA-01 so it's immediately available across app
    setInventory((prev) => [
      {
        productId: nextId,
        sku: newProduct.sku,
        stocks: [
          { warehouseId: 'WH-MAA-01', warehouseName: 'Chennai Central', available: 350, reserved: 0, incoming: 100, damaged: 0, reorderLevel: 50 },
          { warehouseId: 'WH-MDU-01', warehouseName: 'Madurai Regional', available: 150, reserved: 0, incoming: 0, damaged: 0, reorderLevel: 30 },
          { warehouseId: 'WH-CJB-01', warehouseName: 'Coimbatore Industrial', available: 0, reserved: 0, incoming: 0, damaged: 0, reorderLevel: 20 },
        ],
      },
      ...prev,
    ]);

    addToast('Master Product Created', `New product SKU ${newProduct.sku} (${newProduct.brand}) added to Master Catalog.`, 'success');
  };

  const updateProductMasterItem = (id: string, updates: Partial<ProductMasterItem>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    addToast('Product Updated', `Updated product master specifications & pricing.`, 'info');
  };

  const deleteProductMasterItem = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast('Product Removed', `Product removed from Master Catalog.`, 'warning');
  };

  const loadQuotationFromRequirement = () => {
    if (!requirement.items || requirement.items.length === 0) {
      addToast('No Requirement Items', 'No items found in customer requirement REQ-001.', 'warning');
      return;
    }
    const newItems: InternalQuotationItem[] = requirement.items.map((reqItem) => {
      const prod = products.find((p) => p.id === reqItem.productId);
      const listPrice = prod?.baseListPrice || 1000;
      const discount = prod?.standardDiscountPercent ?? 15;
      const unitPrice = Math.round(listPrice * (1 - discount / 100));
      const costPrice = Math.round(listPrice * 0.72);
      const qty = reqItem.quantity;
      const totalTax = Math.round(unitPrice * qty * 0.18);
      return {
        requirementItemId: reqItem.id,
        productId: reqItem.productId,
        productName: reqItem.productName,
        brand: reqItem.brand,
        specification: reqItem.specification,
        quantity: qty,
        uom: reqItem.uom,
        costPrice,
        listPrice,
        discountPercent: discount,
        marginPercent: 15,
        quotedUnitPrice: unitPrice,
        gstPercent: 18,
        totalTax,
        lineTotal: unitPrice * qty + totalTax,
        stockStatus: reqItem.brand === 'Schneider Electric' ? 'Shortage - Need Procurement' : 'In Stock',
        warehouseLocation: 'WH-MAA-01 (Chennai Central)',
        leadTimeDays: reqItem.brand === 'Schneider Electric' ? 21 : 1,
      };
    });
    const subtotal = newItems.reduce((acc, i) => acc + i.quotedUnitPrice * i.quantity, 0);
    const totalTax = newItems.reduce((acc, i) => acc + i.totalTax, 0);
    setQuotation((prev) => ({
      ...prev,
      items: newItems,
      subtotal,
      totalTax,
      grandTotal: subtotal + totalTax,
    }));
    addToast('Loaded from Requirement', `Imported ${newItems.length} items from customer requirement REQ-001.`, 'success');
  };

  const updateSalesOrderDetails = (details: Partial<SalesOrder>) => {
    setSalesOrder((prev) => ({
      ...prev,
      ...details,
    }));
    addToast('Sales Order Updated', 'Sales order details updated successfully.', 'success');
  };

  // Customer accepts quotation -> Creates Sales Order SO-001 automatically
  const acceptQuotationCustomer = () => {
    setQuotation((prev) => ({
      ...prev,
      customerStatus: 'Accepted',
    }));
    setRequirement((prev) => ({
      ...prev,
      status: 'accepted',
    }));
    setSalesOrder((prev) => ({
      ...prev,
      status: 'Credit Check',
      orderDate: '2026-09-08',
    }));
    addToast('Quotation Accepted!', 'Sales Order SO-001 generated automatically and forwarded to Admin Control Tower.', 'success');
    sendInaiwazhiMessage(
      'Quotation QT-001 accepted by customer! Sales Order SO-001 initiated for Ambattur Line 3 Substation.',
      'Sales_Order_SO-001.pdf',
      'so'
    );
  };

  // Customer requests changes -> QT-001-R1 created without deleting QT-001
  const requestQuotationChangesCustomer = (comment: string) => {
    setQuotation((prev) => ({
      ...prev,
      id: 'QT-001-R1',
      revision: 2,
      parentQuotationId: 'QT-001',
      customerStatus: 'Changes Requested',
      customerChangeComment: comment,
    }));
    setRequirement((prev) => ({
      ...prev,
      status: 'changes_requested',
    }));
    addToast('Change Request Submitted', 'Sales team will revise the quotation into revision QT-001-R1.', 'warning');
    sendInaiwazhiMessage(
      `Customer requested revisions for QT-001: "${comment}". New draft QT-001-R1 initiated.`,
      undefined,
      undefined
    );
  };

  // Customer rejects quotation
  const rejectQuotationCustomer = () => {
    setQuotation((prev) => ({
      ...prev,
      customerStatus: 'Declined',
    }));
    setRequirement((prev) => ({
      ...prev,
      status: 'rejected',
    }));
    addToast('Quotation Declined', 'Quotation marked as declined.', 'error');
  };

  // Admin Order Control: Credit & Stock check
  const runOrderCreditAndStockCheck = () => {
    setSalesOrder((prev) => ({
      ...prev,
      creditCheckPassed: true,
      stockCheckPassed: true,
      status: 'Warehouse Allocation',
    }));
    addToast('Credit & Stock Check Passed', 'Available items allocated to Chennai Central WH. 4 Floodlight shortage forwarded to PR-001.', 'success');
  };

  // Admin Procurement PO & GRN
  const issuePurchaseOrderAndGRN = () => {
    setProcurement((prev) => ({
      ...prev,
      status: 'GRN Completed',
    }));
    setPurchaseOrder((prev) => ({
      ...prev,
      status: 'GRN Received',
    }));
    setGrn((prev) => ({
      ...prev,
      qcStatus: 'Passed 100%',
      inventoryUpdated: true,
    }));
    // update inventory
    setInventory((prev) =>
      prev.map((item) =>
        item.productId === 'PROD-005'
          ? {
              ...item,
              stocks: item.stocks.map((s) =>
                s.warehouseId === 'WH-MAA-01' ? { ...s, available: s.available + 4 } : s
              ),
            }
          : item
      )
    );
    setSalesOrder((prev) => ({
      ...prev,
      hasShortage: false,
      shortageQuantityTotal: 0,
      status: 'Picking',
    }));
    addToast('GRN-001 Completed', 'Vendor stock inwarded into Chennai Central WH. 100% order ready for picking!', 'success');
  };

  // Admin Warehouse allocation
  const allocateWarehouseStock = (whId: string) => {
    setSalesOrder((prev) => ({
      ...prev,
      status: 'Picking',
    }));
    addToast('Warehouse Allocated', `Stock reserved in warehouse (${whId}). Picking list generated PICK-001.`, 'info');
  };

  // Admin Complete Picking
  const completeWarehousePicking = () => {
    setPicking((prev) => ({
      ...prev,
      status: 'Picked & Verified',
    }));
    setSalesOrder((prev) => ({
      ...prev,
      status: 'Packing',
    }));
    addToast('Picking PICK-001 Verified', 'All items picked and scanned into packing bay.', 'success');
  };

  // Admin Complete Packing
  const completeWarehousePacking = () => {
    setPacking((prev) => ({
      ...prev,
      status: 'Sealed & Barcoded',
    }));
    setSalesOrder((prev) => ({
      ...prev,
      status: 'Dispatched',
    }));
    setDelivery((prev) => ({
      ...prev,
      status: 'Dispatched',
    }));
    addToast('Packing PACK-001 Sealed', '4 crates strapped & barcoded. Ready for driver handover DEL-001.', 'success');
  };

  // Admin Dispatch delivery
  const dispatchOrderDelivery = (driver: string, vehicle: string) => {
    setDelivery((prev) => ({
      ...prev,
      driverName: driver,
      vehicleNumber: vehicle,
      status: 'In Transit',
    }));
    setSalesOrder((prev) => ({
      ...prev,
      status: 'In Transit',
    }));
    addToast('Order Dispatched (DEL-001)', `Driver ${driver} dispatched in vehicle ${vehicle}.`, 'info');
    sendInaiwazhiMessage(
      `Consignment DEL-001 dispatched in vehicle ${vehicle}. Driver: ${driver} (+91 98409 55667). Expected arrival: Today 03:30 PM.`,
      undefined,
      undefined
    );
  };

  // Driver complete delivery & upload POD
  const driverCompleteDelivery = (
    signedBy: string,
    isPartial: boolean = false,
    signatureRef?: string,
    remarks?: string
  ) => {
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setDelivery((prev) => ({
      ...prev,
      status: 'Delivered',
      deliveredTime: timestampStr,
      podSignedBy: signedBy,
      podSignature: {
        receivedBy: signedBy,
        timestamp: timestampStr,
        signatureRef: signatureRef || `SIG-${signedBy.replace(/\s+/g, '_').toUpperCase()}-2026`,
        remarks: remarks || 'All 18 wooden crated packages received intact with CPRI test reports.',
      },
      isPartialDelivery: isPartial,
      deliveredQtySum: isPartial ? 320 : 468,
      remainingQtySum: isPartial ? 148 : 0,
      nextExpectedDate: isPartial ? '2026-09-14' : undefined,
    }));
    setSalesOrder((prev) => ({
      ...prev,
      status: isPartial ? 'Partially Delivered' : 'Delivered',
      items: prev.items.map((i) => ({
        ...i,
        deliveredQty: isPartial ? Math.floor(i.orderedQty * 0.7) : i.orderedQty,
        remainingQty: isPartial ? Math.ceil(i.orderedQty * 0.3) : 0,
      })),
    }));
    setInvoice((prev) => ({
      ...prev,
      status: 'Generated',
    }));
    addToast(
      isPartial ? 'Partially Delivered' : 'POD Captured & Delivered',
      `Signed by ${signedBy}. Digital POD verified. Generating Invoice INV-001.`,
      'success'
    );
    sendInaiwazhiMessage(
      `Delivery completed at Ambattur Site. Received and signed by ${signedBy}. Digital POD attached.`,
      'Digital_POD_Signed.pdf',
      'pod'
    );
  };

  const completeDeliveryWithPod = (
    signedBy: string,
    signatureRef?: string,
    remarks?: string
  ) => {
    driverCompleteDelivery(signedBy, false, signatureRef, remarks);
  };

  // Admin generate invoice
  const generateCustomerInvoice = () => {
    setInvoice((prev) => ({
      ...prev,
      status: 'Sent',
    }));
    setSalesOrder((prev) => ({
      ...prev,
      status: 'Invoiced',
    }));
    addToast('Invoice INV-001 Generated', 'GST Compliant e-Invoice transmitted to customer portal & accounts.', 'success');
    sendInaiwazhiMessage(
      'Tax Invoice INV-001 generated for ₹3,97,778 (Credit terms: 45 days). Payment receipt link enabled.',
      'Tax_Invoice_INV-001.pdf',
      'invoice'
    );
  };

  // Record payment
  const recordCustomerPayment = (method: string, ref: string) => {
    setPayment((prev) => ({
      ...prev,
      paymentMethod: method as any,
      transactionRef: ref,
      status: 'Confirmed',
    }));
    setInvoice((prev) => ({
      ...prev,
      status: 'Paid',
      paymentRef: ref,
    }));
    setSalesOrder((prev) => ({
      ...prev,
      status: 'Completed',
    }));
    addToast('Payment PAY-001 Recorded', `Full payment of ₹3,97,778 confirmed via ${method}. Transaction Ref: ${ref}.`, 'success');
    sendInaiwazhiMessage(
      `Payment received and reconciled! Transaction Ref: ${ref}. Sales Order SO-001 is now COMPLETED. Thank you!`,
      undefined,
      undefined
    );
  };

  // Quick reorder from completed order
  const quickReorderFromOrder = () => {
    setRequirement({
      id: 'REQ-002',
      enquiryId: 'ENQ-002',
      customerId: activeCustomer.id,
      customerName: activeCustomer.name,
      projectName: `${activeCustomer.projects[0]?.name || 'Ambattur Modernization'} (Reorder Batch)`,
      contractRef: activeCustomer.projects[0]?.contractRef || 'CONT-ABC-2026-08',
      deliverySite: activeCustomer.sites[0]?.name || 'Ambattur Plant Unit-2',
      requiredDate: '2026-10-15',
      specialNotes: 'Quick repeat order based on SO-001 specs. Standard delivery requested.',
      submittedVia: 'Customer Mobile',
      status: 'submitted',
      createdAt: 'Just now',
      assignedSalesId: activeCustomer.assignedSalesId,
      assignedSalesName: activeCustomer.assignedSalesName,
      items: salesOrder.items.map((soItem, idx) => ({
        id: `REQ-ITEM-REORDER-0${idx + 1}`,
        productId: soItem.productId,
        productName: soItem.productName,
        brand: soItem.brand,
        specification: soItem.specification,
        uom: soItem.uom,
        quantity: soItem.orderedQty,
      })),
    });
    setRole('customer');
    addToast('Quick Reorder Created (REQ-002)', 'A new requirement REQ-002 has been created from historical order SO-001.', 'success');
    sendInaiwazhiMessage(
      'New requirement REQ-002 initiated via Quick Reorder feature based on SO-001.',
      undefined,
      undefined
    );
  };

  // Send Inaiwazhi message
  const sendInaiwazhiMessage = (text: string, attachmentName?: string, attachmentType?: any) => {
    const senderRole = role;
    let senderName = 'System Notice';
    if (senderRole === 'customer') senderName = 'Mr. S. Ramesh (ABC Industries)';
    if (senderRole === 'sales') senderName = 'Arun Kumar (Senior KAM)';
    if (senderRole === 'admin') senderName = 'Admin Operations Tower';
    if (senderRole === 'driver') senderName = 'Murugan K. (Logistics Driver)';

    const newMsg: InaiwazhiMessage = {
      id: 'MSG-' + Date.now().toString().slice(-4),
      senderRole,
      senderName,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text,
      attachmentName,
      attachmentType,
      relatedRecordId: quotation.id || requirement.id,
    };

    setConversation((prev) => ({
      ...prev,
      messages: [...prev.messages, newMsg],
      lastAction: text.substring(0, 70) + (text.length > 70 ? '...' : ''),
    }));
  };

  const resetPrototypeState = () => {
    setCustomers(INITIAL_CUSTOMERS);
    setInventory(INITIAL_INVENTORY);
    setRequirement(INITIAL_REQUIREMENT);
    setQuotation(INITIAL_QUOTATION);
    setSalesOrder(INITIAL_SALES_ORDER);
    setProcurement(INITIAL_PROCUREMENT);
    setPurchaseOrder(INITIAL_PURCHASE_ORDER);
    setGrn(INITIAL_GRN);
    setPicking(INITIAL_PICKING);
    setPacking(INITIAL_PACKING);
    setDelivery(INITIAL_DELIVERY);
    setInvoice(INITIAL_INVOICE);
    setPayment(INITIAL_PAYMENT);
    setConversation(INITIAL_CONVERSATION);
    setCurrentFlowStep(1);
    setRole('customer');
    addToast('Prototype Reset', 'Restored initial mock records for ABC Electrical Industries.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        customers,
        activeCustomer,
        setActiveCustomerId,
        salesTeam,
        driverProfiles,
        activeDriver,
        setActiveDriver,
        isCustomerLoggedIn,
        setIsCustomerLoggedIn,
        isDriverLoggedIn,
        setIsDriverLoggedIn,
        loginCustomer,
        logoutCustomer,
        loginDriver,
        logoutDriver,
        products,
        inventory,
        requirement,
        quotation,
        salesOrder,
        salesOrders,
        activeSalesOrderId,
        setActiveSalesOrderId,
        updateMasterOrderStatus,
        updateMasterOrderLogistics,
        createMasterOrder,
        toggleMasterOrderHold,
        procurement,
        purchaseOrder,
        grn,
        picking,
        packing,
        delivery,
        invoice,
        payment,
        conversation,
        toasts,
        addToast,
        removeToast,
        currentFlowStep,
        setFlowStep,
        goToNextFlowStep,
        guidedMode,
        setGuidedMode,
        assignSales,
        reassignSales,
        removeSales,
        submitCustomerRequirement,
        submitQuotationForApproval,
        submitQuotationForAdminApproval,
        approveQuotationAdmin,
        sendCustomerProposal,
        sendQuotationToCustomer,
        updateQuotationItemPrice,
        updateQuotationItemQty,
        addQuotationItem,
        removeQuotationItem,
        updateQuotationTerms,
        applyMarginToAllQuotationItems,
        updateQuotationItemDiscount,
        applyDiscountToAllQuotationItems,
        addProductMasterItem,
        updateProductMasterItem,
        deleteProductMasterItem,
        loadQuotationFromRequirement,
        updateSalesOrderDetails,
        substituteQuotationProduct,
        acceptQuotationCustomer,
        requestQuotationChangesCustomer,
        rejectQuotationCustomer,
        runOrderCreditAndStockCheck,
        issuePurchaseOrderAndGRN,
        allocateWarehouseStock,
        completeWarehousePicking,
        completeWarehousePacking,
        dispatchOrderDelivery,
        driverCompleteDelivery,
        completeDeliveryWithPod,
        generateCustomerInvoice,
        recordCustomerPayment,
        quickReorderFromOrder,
        sendInaiwazhiMessage,
        resetPrototypeState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
