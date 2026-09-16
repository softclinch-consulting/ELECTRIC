import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Truck,
  MapPin,
  Phone,
  CheckCircle2,
  Package,
  FileCheck,
  PenTool,
  Navigation,
  ShieldCheck,
  Clock,
  Receipt,
  ArrowRight,
  Download,
  Share2,
  ChevronRight,
  LogOut,
  KeyRound,
  FileText,
  Building2,
  Check,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';

export const DriverMobileView: React.FC = () => {
  const {
    delivery,
    completeDeliveryWithPod,
    salesOrder,
    invoice,
    addToast,
    isDriverLoggedIn,
    driverProfiles,
    activeDriver,
    setActiveDriver,
    loginDriver,
    logoutDriver,
  } = useApp();

  // Screen state: 'trip' | 'invoice'
  const [driverScreen, setDriverScreen] = useState<'trip' | 'invoice'>('trip');

  // POD form state
  const [receiverName, setReceiverName] = useState('Ramesh K.');
  const [remarks, setRemarks] = useState('All 18 wooden crated packages received intact with CPRI test reports.');
  const [isSigned, setIsSigned] = useState(false);

  // Login form state
  const [selectedDriverId, setSelectedDriverId] = useState(activeDriver?.id || driverProfiles[0]?.id || 'DRV-001');
  const [inputVehicleNo, setInputVehicleNo] = useState(activeDriver?.vehicleNumber || 'TN-02-AK-9821');
  const [inputPin, setInputPin] = useState('1234');
  const [inspectionChecked, setInspectionChecked] = useState(true);

  const handleConfirmDelivery = () => {
    completeDeliveryWithPod(
      receiverName,
      `SIG-${receiverName.replace(/\s+/g, '_').toUpperCase()}-2026`,
      remarks
    );
    // After confirming delivery, automatically prompt connecting to next screen
    addToast(
      'Delivery Confirmed',
      'Digital POD captured. Tap "Connect Next" to view the Consignment Invoice Bill.',
      'success'
    );
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginDriver(inputVehicleNo, inputPin, selectedDriverId);
  };

  // ---------------------------------------------------------------------------
  // 1. DRIVER LOGIN SCREEN (When not logged in)
  // ---------------------------------------------------------------------------
  if (!isDriverLoggedIn) {
    return (
      <div className="w-full flex justify-center py-4 px-2 sm:px-4 bg-slate-900 min-h-screen">
        <div
          id="driver-login-container"
          className="w-full max-w-md bg-slate-50 text-slate-900 rounded-3xl shadow-2xl border-8 border-slate-950 flex flex-col h-[844px] max-h-[92vh] overflow-hidden relative"
        >
          {/* Phone Notch */}
          <div className="bg-slate-950 text-white px-6 pt-2 pb-2 flex items-center justify-between text-[11px] font-medium shrink-0">
            <span>11:20</span>
            <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
            <div className="flex items-center gap-1.5">
              <span>5G</span>
              <span>96%</span>
            </div>
          </div>

          {/* Login Header */}
          <div className="bg-purple-950 text-white p-6 shrink-0 relative overflow-hidden border-b border-purple-800">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-800/80 text-purple-200 text-[10px] font-bold uppercase tracking-wider mb-2">
                <Truck size={12} />
                <span>Field Dispatch Terminal</span>
              </div>
              <h1 className="text-xl font-black text-white tracking-tight">Driver Fleet Login</h1>
              <p className="text-xs text-purple-200 mt-1">
                Enter your vehicle and driver credentials to access today&apos;s consignments.
              </p>
            </div>
            <div className="absolute -right-8 -bottom-10 w-32 h-32 bg-purple-800/30 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* Login Form Content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Preset Driver Select */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Select Assigned Driver Profile
                </label>
                <div className="space-y-2">
                  {driverProfiles.map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        setSelectedDriverId(d.id);
                        setInputVehicleNo(d.vehicleNumber);
                      }}
                      className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between ${
                        selectedDriverId === d.id
                          ? 'border-purple-600 bg-purple-50 ring-2 ring-purple-500/20'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs ${
                            selectedDriverId === d.id
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {d.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-900">{d.name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">
                            {d.vehicleNumber} • {d.vehicleType}
                          </div>
                        </div>
                      </div>
                      {selectedDriverId === d.id && (
                        <div className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
                          <Check size={12} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vehicle Number Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  Vehicle Registration Number
                </label>
                <div className="relative">
                  <Truck size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={inputVehicleNo}
                    onChange={(e) => setInputVehicleNo(e.target.value.toUpperCase())}
                    placeholder="e.g. TN-02-AK-9821"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Driver PIN Input */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    4-Digit Driver Access PIN
                  </label>
                  <span className="text-[10px] text-purple-600 font-medium">Default: 1234</span>
                </div>
                <div className="relative">
                  <KeyRound size={14} className="text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={4}
                    required
                    value={inputPin}
                    onChange={(e) => setInputPin(e.target.value)}
                    placeholder="••••"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs tracking-widest font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Pre-Trip Vehicle Checklist */}
              <label className="flex items-start gap-2.5 p-3 bg-white rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition">
                <input
                  type="checkbox"
                  checked={inspectionChecked}
                  onChange={(e) => setInspectionChecked(e.target.checked)}
                  className="mt-0.5 rounded text-purple-600 focus:ring-purple-500"
                />
                <div className="text-[11px] text-slate-600 leading-tight">
                  <strong className="text-slate-800 block">Pre-Trip Safety Inspection Verified</strong>
                  Cargo strapping, tyre pressure, fuel level, and hardcopy E-Way Bills are in order.
                </div>
              </label>

              {/* Sign In Button */}
              <button
                id="driver-btn-login"
                type="submit"
                disabled={!inspectionChecked}
                className="w-full bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
              >
                <span>LOG IN TO DRIVER TERMINAL</span>
                <ArrowRight size={14} />
              </button>
            </form>

            <div className="p-3 bg-purple-50/70 border border-purple-200/80 rounded-xl text-[11px] text-purple-800">
              <div className="font-bold flex items-center gap-1 mb-0.5">
                <ShieldCheck size={13} className="text-purple-600" />
                <span>TN Logistics Geo-Tagged Fleet</span>
              </div>
              Driver location and delivery timestamps are automatically synchronized with Central Control Tower and Inaiwazhi.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. MAIN LOGGED-IN DRIVER INTERFACE
  // ---------------------------------------------------------------------------
  return (
    <div className="w-full flex justify-center py-4 px-2 sm:px-4 bg-slate-900 min-h-screen">
      {/* Mobile Frame */}
      <div
        id="driver-mobile-container"
        className="w-full max-w-md bg-slate-50 text-slate-900 rounded-3xl shadow-2xl border-8 border-slate-950 flex flex-col h-[844px] max-h-[92vh] overflow-hidden relative"
      >
        {/* Phone Notch */}
        <div className="bg-slate-950 text-white px-6 pt-2 pb-2 flex items-center justify-between text-[11px] font-medium shrink-0">
          <span>11:20</span>
          <div className="w-20 h-4 bg-slate-900 rounded-full mx-auto" />
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <span>96%</span>
          </div>
        </div>

        {/* Top Header with Driver Session & Screen Switcher */}
        <div className="bg-purple-900 text-white p-3.5 shrink-0 shadow-xs space-y-2.5">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-[10px] uppercase font-bold tracking-wider text-purple-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Driver On-Duty • {activeDriver.vehicleNumber}
              </div>
              <h2 className="text-sm font-bold text-white mt-0.5">
                {activeDriver.name} ({activeDriver.vehicleType})
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold bg-purple-800 text-purple-200 px-2 py-0.5 rounded border border-purple-700">
                {delivery.id}
              </span>
              <button
                id="driver-btn-logout"
                onClick={logoutDriver}
                title="Switch Driver / Logout"
                className="p-1.5 bg-purple-800/80 hover:bg-purple-700 text-purple-200 hover:text-white rounded-lg transition"
              >
                <LogOut size={13} />
              </button>
            </div>
          </div>

          {/* Two-Screen Switcher Tabs: 1. Trip & POD | 2. Invoice & Billing */}
          <div className="grid grid-cols-2 gap-1.5 bg-purple-950/60 p-1 rounded-xl border border-purple-800/80 text-xs">
            <button
              id="driver-tab-trip"
              onClick={() => setDriverScreen('trip')}
              className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition ${
                driverScreen === 'trip'
                  ? 'bg-purple-700 text-white shadow-2xs'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <Truck size={13} />
              <span>1. Trip & POD</span>
            </button>
            <button
              id="driver-tab-invoice"
              onClick={() => setDriverScreen('invoice')}
              className={`py-1.5 px-2 rounded-lg font-bold flex items-center justify-center gap-1.5 transition relative ${
                driverScreen === 'invoice'
                  ? 'bg-purple-700 text-white shadow-2xs'
                  : 'text-purple-300 hover:text-white'
              }`}
            >
              <Receipt size={13} />
              <span>2. Invoice & Bill</span>
              {delivery.status === 'Delivered' && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 absolute top-1.5 right-1.5 ring-1 ring-purple-900" />
              )}
            </button>
          </div>
        </div>

        {/* =================================================================== */}
        {/* SCREEN 1: TRIP MANIFEST & DIGITAL PROOF OF DELIVERY (POD)            */}
        {/* =================================================================== */}
        {driverScreen === 'trip' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Delivery Completion Notice & "Connect Next" Action Banner */}
            {delivery.status === 'Delivered' && (
              <div className="p-3.5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-300 rounded-2xl shadow-2xs space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-emerald-950">
                      DELIVERY COMPLETED & POD SIGNED
                    </div>
                    <div className="text-[11px] text-emerald-700">
                      Signed by {delivery.podSignature?.receivedBy || receiverName} at {delivery.deliveredTime || '11:25 AM'}
                    </div>
                  </div>
                </div>

                {/* PROMINENT "CONNECT NEXT" BUTTON */}
                <button
                  id="driver-btn-connect-next"
                  onClick={() => {
                    setDriverScreen('invoice');
                    addToast('Connected to Next Screen', 'Viewing Consignment Invoice & Bill INV-001', 'info');
                  }}
                  className="w-full mt-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 group"
                >
                  <span>CONNECT TO NEXT: OPEN INVOICE & BILL (INV-001)</span>
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}

            {/* Active Trip Card */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-900">Active Delivery Destination</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    delivery.status === 'Delivered'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {delivery.status.toUpperCase()}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="font-bold text-slate-900 text-sm">
                  ABC Electrical Industries Ltd
                </div>
                <div className="text-slate-600 flex items-start gap-1">
                  <MapPin size={14} className="text-purple-600 shrink-0 mt-0.5" />
                  <span>{delivery.destinationSite || delivery.deliverySite}</span>
                </div>
                <div className="text-slate-600 flex items-center gap-1 pt-1">
                  <Phone size={13} className="text-slate-400" />
                  <span>
                    Receiver: {delivery.contactPerson} ({delivery.contactPhone})
                  </span>
                </div>
              </div>

              {/* Navigation Button */}
              <button
                onClick={() =>
                  addToast(
                    'Navigation Started',
                    'Live route to Ambattur Industrial Estate Bay 4 loaded on GPS.',
                    'info'
                  )
                }
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <Navigation size={14} />
                <span>Start Turn-by-Turn GPS Navigation</span>
              </button>
            </div>

            {/* Consignment Packages */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900">Cargo & Packaging Manifest</span>
                <span className="font-semibold text-slate-500">PACK-001 (Chennai Central WH)</span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Total Packages:</span>
                  <span className="font-bold text-slate-900">18 Crated Packages</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Gross Weight:</span>
                  <span className="font-bold text-slate-900">420 kg (Verified on Weighbridge)</span>
                </div>
                <div className="flex justify-between p-2 bg-slate-50 rounded-lg">
                  <span className="text-slate-600">Items:</span>
                  <span className="font-bold text-slate-900">MCB, Polycab Cable Drums, Floodlights</span>
                </div>
              </div>
            </div>

            {/* Interactive Digital POD Signature Capture */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <PenTool size={14} className="text-purple-600" />
                  <span>Digital Proof of Delivery (POD)</span>
                </h3>
                {delivery.status === 'Delivered' && (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Verified
                  </span>
                )}
              </div>

              {delivery.status !== 'Delivered' ? (
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 uppercase">
                      Received By (Authorized Site Engineer)
                    </label>
                    <input
                      type="text"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-700 uppercase">
                      Receiver Remarks / Material Inspection
                    </label>
                    <input
                      type="text"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full mt-1 p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  {/* Digital Signature Canvas Simulation */}
                  <div>
                    <label className="text-[10px] font-bold text-slate-700 uppercase">
                      Receiver E-Signature (Tap to Sign)
                    </label>
                    <div
                      onClick={() => setIsSigned(true)}
                      className="mt-1 h-24 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center cursor-pointer hover:bg-slate-100 transition relative"
                    >
                      {isSigned ? (
                        <div className="font-serif italic text-blue-900 text-lg font-bold text-center">
                          {receiverName}
                          <div className="text-[9px] text-slate-400 font-sans not-italic text-center">
                            Digitally Verified • {new Date().toLocaleTimeString()}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-slate-400">
                          <PenTool size={16} className="mx-auto mb-1 text-slate-400" />
                          <span className="text-[11px]">Tap here to sign on screen</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    id="driver-btn-complete-pod"
                    onClick={handleConfirmDelivery}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 size={16} />
                    <span>CONFIRM DELIVERY & CAPTURE DIGITAL POD</span>
                  </button>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-emerald-900">
                        DELIVERY COMPLETED SUCCESSFULLY
                      </div>
                      <div className="text-[11px] text-emerald-700">
                        Signed by {delivery.podSignature?.receivedBy || receiverName}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-600 bg-white/70 p-2 rounded-lg border border-emerald-100">
                    POD signature ref: <code className="font-mono font-bold text-emerald-800">{delivery.podSignature?.signatureRef || 'SIG-RAMESH_K-2026'}</code>. Invoice INV-001 has been generated.
                  </div>
                  <button
                    onClick={() => setDriverScreen('invoice')}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 rounded-lg transition flex items-center justify-center gap-1"
                  >
                    <span>View Consignment Invoice & Bill</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* SCREEN 2: CONSIGNMENT INVOICE BILL FOR DRIVER APP                    */}
        {/* =================================================================== */}
        {driverScreen === 'invoice' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Invoice Top Actions & Badge */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Consignment Bill
                </span>
                <div className="text-base font-black text-slate-900 font-mono">
                  {invoice.id}
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                    invoice.status === 'Paid'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {invoice.status.toUpperCase()}
                </span>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Due: {invoice.dueDate}
                </div>
              </div>
            </div>

            {/* Bill Details Document Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden text-xs">
              {/* Document Header */}
              <div className="bg-slate-900 text-white p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-black tracking-tight">
                      TAX INVOICE & DELIVERY BILL
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      Original for Consignee / Transport Copy
                    </p>
                  </div>
                  <span className="text-[10px] font-mono bg-slate-800 text-slate-200 px-2 py-0.5 rounded">
                    GST Compliant
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] pt-1 border-t border-slate-800 text-slate-300">
                  <div>
                    <span className="text-slate-400">E-Way Bill:</span>{' '}
                    <span className="font-mono font-bold text-amber-300">EWB-7729-1082-9931</span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400">Delivery Ref:</span>{' '}
                    <span className="font-mono font-bold text-white">{delivery.id}</span>
                  </div>
                </div>
              </div>

              {/* Consignor & Consignee Info */}
              <div className="p-3.5 grid grid-cols-2 gap-3 border-b border-slate-200 bg-slate-50/50">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Shipped By (Supplier)</div>
                  <div className="font-bold text-slate-900 mt-0.5">Chennai Central Hub</div>
                  <div className="text-[10px] text-slate-500">Warehouse Bay 4, Ambattur Rd</div>
                  <div className="text-[10px] font-mono text-slate-600 mt-0.5">GSTIN: 33AAACV4891M1Z5</div>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase">Billed & Shipped To</div>
                  <div className="font-bold text-slate-900 mt-0.5 truncate">{invoice.customerName}</div>
                  <div className="text-[10px] text-slate-500 truncate">{invoice.billingAddress}</div>
                  <div className="text-[10px] font-mono text-blue-700 font-bold mt-0.5">
                    GSTIN: {invoice.customerGst}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="p-3.5 space-y-2">
                <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">
                  Consignment Line Items
                </div>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 p-2 grid grid-cols-12 text-[10px] font-bold text-slate-600">
                    <span className="col-span-6">Item Description</span>
                    <span className="col-span-2 text-center">Qty</span>
                    <span className="col-span-2 text-right">Rate</span>
                    <span className="col-span-2 text-right">Total</span>
                  </div>
                  {(salesOrder?.items || []).map((item) => {
                    const price = item.unitPrice ?? 0;
                    const total = item.totalAmount ?? (price * (item.orderedQty || 1));
                    return (
                      <div key={item.id || item.productId} className="p-2 grid grid-cols-12 text-[11px] items-center">
                        <div className="col-span-6 pr-1">
                          <div className="font-bold text-slate-800 truncate">{item.productName}</div>
                          <div className="text-[9px] text-slate-400 font-mono">Brand: {item.brand}</div>
                        </div>
                        <div className="col-span-2 text-center font-bold text-slate-900">
                          {item.orderedQty}
                        </div>
                        <div className="col-span-2 text-right font-mono text-slate-600">
                          ₹{price.toLocaleString()}
                        </div>
                        <div className="col-span-2 text-right font-mono font-bold text-slate-900">
                          ₹{total.toLocaleString()}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Calculations Summary */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Taxable Subtotal:</span>
                    <span className="font-mono">₹{(invoice?.subtotal ?? 337100).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>CGST (9%):</span>
                    <span className="font-mono">₹{(invoice?.cgst ?? 30339).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>SGST (9%):</span>
                    <span className="font-mono">₹{(invoice?.sgst ?? 30339).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-slate-900 pt-1.5 border-t border-slate-200">
                    <span>Invoice Grand Total:</span>
                    <span className="font-mono text-blue-700 text-base">
                      ₹{(invoice?.totalAmount ?? 397778).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* POD Acknowledgment Box */}
                <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl space-y-1">
                  <div className="text-[10px] font-bold text-emerald-900 uppercase">
                    Consignee Acknowledgement & POD Status
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-emerald-800">
                    <span>Receiver: <strong>{delivery?.podSignature?.receivedBy || delivery?.podSignedBy || receiverName}</strong></span>
                    <span className="font-mono text-[10px] bg-emerald-100 px-2 py-0.5 rounded font-bold">
                      VERIFIED ON-SITE
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500">
                    Vehicle: {activeDriver?.vehicleNumber || 'TN-02-AK-9821'} • Driver: {activeDriver?.name || 'Murugan K.'}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3.5 bg-slate-50 border-t border-slate-200 space-y-2">
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      addToast(
                        'Invoice Downloaded',
                        `Saved ${invoice.id}_TAX_INVOICE.pdf to mobile downloads.`,
                        'success'
                      )
                    }
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <Download size={14} />
                    <span>Download Bill (PDF)</span>
                  </button>
                  <button
                    onClick={() =>
                      addToast(
                        'Bill Link Shared',
                        'Invoice bill copy shared to client WhatsApp & SMS.',
                        'info'
                      )
                    }
                    className="flex-1 py-2.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
                  >
                    <Share2 size={14} />
                    <span>Share with Client</span>
                  </button>
                </div>

                <button
                  onClick={() => {
                    setDriverScreen('trip');
                  }}
                  className="w-full py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-xl transition flex items-center justify-center gap-1"
                >
                  <RotateCcw size={13} />
                  <span>Return to Trip Manifest</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
