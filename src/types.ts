export type AppRole = 'customer' | 'admin' | 'sales' | 'driver';

export type CustomerStatus = 'active' | 'prospect' | 'on_hold';

export interface CustomerSite {
  id: string;
  name: string;
  address: string;
  city: string;
  gstNumber: string;
  contactPerson: string;
  phone: string;
}

export interface CustomerProject {
  id: string;
  name: string;
  contractRef: string;
  siteId: string;
  budget: number;
  startDate: string;
}

export interface CustomerProfile {
  id: string;
  name: string;
  code: string;
  industry: string;
  tier: 'Tier-1 Industrial' | 'Contractor' | 'OEM' | 'Commercial';
  gst: string;
  pan: string;
  creditLimit: number;
  creditUsed: number;
  creditDays: number;
  creditStatus: 'Approved' | 'Review Required' | 'Exceeded';
  assignedSalesId: string;
  assignedSalesName: string;
  assignedSalesPhone: string;
  assignedSalesEmail: string;
  sites: CustomerSite[];
  projects: CustomerProject[];
  createdAt: string;
}

export interface ProductMasterItem {
  id: string;
  name: string;
  brand: 'Schneider Electric' | 'ABB' | 'Polycab' | 'Havells' | 'L&T' | 'Legrand' | 'Siemens' | string;
  category: 'Switchgear' | 'Cables & Wires' | 'Distribution' | 'Industrial Automation' | 'Lighting' | string;
  sku: string;
  specification: string;
  uom: 'Nos' | 'Mtrs' | 'Coils' | 'Sets' | 'Pcs' | string;
  moq: number;
  standardLeadTimeDays: number;
  hsnCode: string;
  gstRate: number; // e.g. 18
  gstRatePercent?: number; // alias e.g. 18
  imageUrl?: string;
  datasheetUrl?: string;
  baseListPrice: number;
  standardDiscountPercent?: number; // Standard manufacturer/distributor discount e.g. 15%
}

export interface WarehouseStock {
  warehouseId: 'WH-MAA-01' | 'WH-MDU-01' | 'WH-CJB-01';
  warehouseName: 'Chennai Central' | 'Madurai Regional' | 'Coimbatore Industrial';
  available: number;
  reserved: number;
  incoming: number;
  damaged: number;
  reorderLevel: number;
}

export interface InventoryItem {
  productId: string;
  sku: string;
  stocks: WarehouseStock[];
}

export interface RequirementItem {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  specification: string;
  uom: string;
  quantity: number;
  targetPrice?: number;
  notes?: string;
  alternativeOffered?: {
    offeredProductId: string;
    offeredProductName: string;
    offeredBrand: string;
    offeredSpec: string;
    offeredPrice: number;
    reason: string;
  };
}

export type RequirementStatus =
  | 'draft'
  | 'submitted'
  | 'admin_review'
  | 'sales_assigned'
  | 'quoting'
  | 'quoted'
  | 'changes_requested'
  | 'accepted'
  | 'converted_so'
  | 'rejected';

export interface Requirement {
  id: string; // e.g. REQ-001
  enquiryId: string; // e.g. ENQ-001
  customerId: string;
  customerName: string;
  projectName: string;
  contractRef: string;
  deliverySite: string;
  requiredDate: string;
  specialNotes: string;
  boqFileName?: string;
  items: RequirementItem[];
  status: RequirementStatus;
  createdAt: string;
  assignedSalesId: string;
  assignedSalesName: string;
  submittedVia: 'Customer Mobile' | 'Direct BOQ Upload' | 'Inaiwazhi Enquiry';
}

export interface InternalQuotationItem {
  requirementItemId: string;
  productId: string;
  productName: string;
  brand: string;
  specification: string;
  quantity: number;
  uom: string;
  costPrice: number;
  listPrice: number;
  discountPercent: number; // e.g. 15% discount off List Price
  marginPercent?: number; // legacy/internal reference
  quotedUnitPrice: number; // listPrice * (1 - discountPercent / 100)
  gstPercent: number;
  totalTax: number;
  lineTotal: number;
  stockStatus: 'In Stock' | 'Partial' | 'Shortage - Need Procurement';
  warehouseLocation: string;
  leadTimeDays: number;
  alternativeTo?: string; // original requested item
  internalNote?: string;
}

export interface Quotation {
  id: string; // QT-001 or QT-001-R1
  revision: number;
  parentQuotationId?: string;
  requirementId: string;
  enquiryId: string;
  customerId: string;
  customerName: string;
  salesExecutiveId: string;
  salesExecutiveName: string;
  date: string;
  validUntil: string;
  paymentTerms: string;
  deliveryTerms: string;
  freightTerms: string;
  totalListPrice?: number; // Total MRP/List Price before discount
  totalDiscountAmount?: number; // Total savings offered to customer
  averageDiscountPercent?: number; // Blended discount percentage
  subtotal: number;
  totalTax: number;
  grandTotal: number;
  totalCostPrice?: number; // Internal only
  blendedMarginPercent?: number; // Internal only
  internalNotes?: string; // Internal only
  approvalStatus: 'Draft' | 'Pending Approval' | 'Approved' | 'Changes Requested by Admin' | 'Rejected';
  approvedBy?: string;
  approvalDate?: string;
  customerStatus: 'Draft' | 'Sent to Customer' | 'Under Review' | 'Changes Requested' | 'Accepted' | 'Declined';
  customerChangeComment?: string;
  items: InternalQuotationItem[];
  pdfGenerated: boolean;
}

export type SalesOrderStatus =
  | 'Draft'
  | 'Credit Check'
  | 'Stock Check'
  | 'Procurement Pending'
  | 'Warehouse Allocation'
  | 'Picking'
  | 'Packing'
  | 'Dispatched'
  | 'In Transit'
  | 'Partially Delivered'
  | 'Delivered'
  | 'Invoiced'
  | 'Payment Received'
  | 'Completed';

export interface SalesOrderItem {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  specification: string;
  orderedQty: number;
  deliveredQty: number;
  remainingQty: number;
  uom: string;
  unitPrice: number;
  gstPercent: number;
  totalAmount: number;
  allocatedWarehouse: string;
  stockSource: 'Reserved from Inventory' | 'Procured from Vendor';
}

export interface SalesOrder {
  id: string; // SO-001
  quotationId: string;
  requirementId: string;
  customerId: string;
  customerName: string;
  customerGst: string;
  projectName: string;
  deliverySite: string;
  salesExecutiveName: string;
  orderDate: string;
  expectedDeliveryDate: string;
  status: SalesOrderStatus;
  creditCheckPassed: boolean;
  stockCheckPassed: boolean;
  hasShortage: boolean;
  shortageQuantityTotal: number;
  items: SalesOrderItem[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  linkedPrId?: string;
  linkedPoId?: string;
  linkedPickId?: string;
  linkedPackId?: string;
  linkedDeliveryId?: string;
  linkedInvoiceId?: string;
  linkedPaymentId?: string;
  priority?: 'Standard' | 'Express' | 'Urgent';
  siteContactPerson?: string;
  siteContactPhone?: string;
  specialInstructions?: string;
  isHold?: boolean;
  holdReason?: string;
}

export interface PurchaseRequirement {
  id: string; // PR-001
  salesOrderId: string;
  requirementId: string;
  customerId: string;
  items: {
    productId: string;
    productName: string;
    brand: string;
    shortageQty: number;
    uom: string;
    preferredVendor: string;
    estCost: number;
  }[];
  status: 'Shortage Identified' | 'RFQ Sent' | 'Vendor Selected' | 'PO Created' | 'GRN Completed';
  createdAt: string;
  linkedPoId?: string;
}

export interface PurchaseOrder {
  id: string; // PO-001
  prId: string;
  salesOrderId: string;
  vendorName: string;
  vendorGst: string;
  orderDate: string;
  expectedDate: string;
  items: {
    productName: string;
    brand: string;
    qty: number;
    rate: number;
    total: number;
  }[];
  totalAmount: number;
  status: 'Approved' | 'Issued' | 'GRN Received' | 'Stock Updated';
  grnId?: string;
}

export interface GRNRecord {
  id: string; // GRN-001
  poId: string;
  receivedDate: string;
  warehouse: string;
  inspectedBy: string;
  qcStatus: 'Passed 100%' | 'Quarantine' | 'Rejected';
  itemsReceived: number;
  inventoryUpdated: boolean;
}

export interface PickingRecord {
  id: string; // PICK-001
  salesOrderId: string;
  warehouse: string;
  pickerName: string;
  status: 'Assigned' | 'In Progress' | 'Picked & Verified';
  pickList: {
    productName: string;
    brand: string;
    rack: string;
    bin: string;
    qty: number;
    picked: boolean;
  }[];
}

export interface PackingRecord {
  id: string; // PACK-001
  salesOrderId: string;
  packagesCount: number;
  totalWeightKg: number;
  dimensionsCm: string;
  packType: 'Industrial Corrugated Crates & Strapped Pallets';
  status: 'Staged' | 'Packing' | 'Sealed & Barcoded';
}

export interface DeliveryRecord {
  id: string; // DEL-001
  salesOrderId: string;
  customerName: string;
  deliverySite: string;
  contactPerson: string;
  contactPhone: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  status: 'Assigned' | 'Dispatched' | 'In Transit' | 'Arrived at Site' | 'Delivered';
  packagesCount: number;
  dispatchTime: string;
  deliveredTime?: string;
  destinationSite?: string;
  podSignedBy?: string;
  podImageUrl?: string;
  podSignature?: {
    receivedBy: string;
    timestamp: string;
    signatureRef: string;
    remarks?: string;
  };
  isPartialDelivery: boolean;
  deliveredQtySum: number;
  remainingQtySum: number;
  nextExpectedDate?: string;
}

export interface DriverProfile {
  id: string;
  name: string;
  phone: string;
  vehicleNumber: string;
  vehicleType: string;
  licenseNo: string;
  hub: string;
  currentDeliveryId: string;
}

export interface InvoiceRecord {
  id: string; // INV-001
  salesOrderId: string;
  deliveryId: string;
  customerId: string;
  customerName: string;
  customerGst: string;
  billingAddress: string;
  date: string;
  dueDate: string;
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  status: 'Generated' | 'Sent' | 'Partially Paid' | 'Paid' | 'Overdue';
  paymentRef?: string;
}

export interface PaymentRecord {
  id: string; // PAY-001
  invoiceId: string;
  salesOrderId: string;
  customerId: string;
  amount: number;
  paymentMethod: 'NEFT / RTGS' | 'UPI Corporate' | 'Letter of Credit' | 'Cheque';
  transactionRef: string;
  date: string;
  status: 'Confirmed' | 'Pending Bank Clearance';
}

export interface InaiwazhiMessage {
  id: string;
  senderRole: 'customer' | 'sales' | 'admin' | 'system' | 'driver';
  senderName: string;
  timestamp: string;
  text: string;
  attachmentName?: string;
  attachmentType?: 'boq' | 'quotation' | 'so' | 'pod' | 'invoice';
  relatedRecordId?: string;
}

export interface InaiwazhiConversation {
  customerId: string;
  customerName: string;
  linkedRecordId: string;
  recordType: 'REQ' | 'QT' | 'SO' | 'DEL' | 'INV';
  currentStatus: string;
  assignedSales: string;
  lastAction: string;
  nextAction: string;
  messages: InaiwazhiMessage[];
}
