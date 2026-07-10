import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CreditCard, Landmark, QrCode, Banknote, ShieldCheck } from 'lucide-react';

export function StepPayment() {
  const [method, setMethod] = useState<'card' | 'upi' | 'netbanking' | 'cash'>('upi');
  const [cardDetails, setCardDetails] = useState({ name: '', number: '', expiry: '', cvv: '' });

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-brand-dark">Payment Setup</h3>
        <p className="text-sm text-brand-muted mt-0.5">Configure your initial billing method for the selected subscription.</p>
      </div>

      {/* Subscription Summary */}
      <div className="bg-brand-light border border-brand-border p-4 rounded-xl flex justify-between items-center">
        <div>
          <p className="text-xs text-brand-muted font-semibold uppercase tracking-wider mb-1">Selected Plan</p>
          <p className="text-lg font-bold text-brand-dark">Professional Plan</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-brand-primary">$199<span className="text-sm font-normal text-brand-muted">/mo</span></p>
          <p className="text-xs text-brand-muted">Billed monthly</p>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="space-y-3">
        <label className="text-sm font-semibold text-brand-dark">Select Payment Method</label>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div 
            onClick={() => setMethod('upi')}
            className={`rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors relative ${method === 'upi' ? 'border-2 border-brand-primary bg-indigo-50/50' : 'border border-brand-border bg-white hover:border-brand-borderHover'}`}
          >
            {method === 'upi' && <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-brand-primary ring-2 ring-indigo-100" />}
            <QrCode className={`h-6 w-6 mb-2 ${method === 'upi' ? 'text-brand-primary' : 'text-brand-muted'}`} />
            <span className={`text-sm ${method === 'upi' ? 'font-semibold text-brand-dark' : 'font-medium text-brand-muted'}`}>UPI</span>
          </div>

          <div 
            onClick={() => setMethod('card')}
            className={`rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors relative ${method === 'card' ? 'border-2 border-brand-primary bg-indigo-50/50' : 'border border-brand-border bg-white hover:border-brand-borderHover'}`}
          >
            {method === 'card' && <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-brand-primary ring-2 ring-indigo-100" />}
            <CreditCard className={`h-6 w-6 mb-2 ${method === 'card' ? 'text-brand-primary' : 'text-brand-muted'}`} />
            <span className={`text-sm ${method === 'card' ? 'font-semibold text-brand-dark' : 'font-medium text-brand-muted'}`}>Card</span>
          </div>

          <div 
            onClick={() => setMethod('netbanking')}
            className={`rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors relative ${method === 'netbanking' ? 'border-2 border-brand-primary bg-indigo-50/50' : 'border border-brand-border bg-white hover:border-brand-borderHover'}`}
          >
            {method === 'netbanking' && <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-brand-primary ring-2 ring-indigo-100" />}
            <Landmark className={`h-6 w-6 mb-2 ${method === 'netbanking' ? 'text-brand-primary' : 'text-brand-muted'}`} />
            <span className={`text-sm ${method === 'netbanking' ? 'font-semibold text-brand-dark' : 'font-medium text-brand-muted'}`}>Netbanking</span>
          </div>

          <div 
            onClick={() => setMethod('cash')}
            className={`rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors relative ${method === 'cash' ? 'border-2 border-brand-primary bg-indigo-50/50' : 'border border-brand-border bg-white hover:border-brand-borderHover'}`}
          >
            {method === 'cash' && <div className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-brand-primary ring-2 ring-indigo-100" />}
            <Banknote className={`h-6 w-6 mb-2 ${method === 'cash' ? 'text-brand-primary' : 'text-brand-muted'}`} />
            <span className={`text-sm ${method === 'cash' ? 'font-semibold text-brand-dark' : 'font-medium text-brand-muted'}`}>Cash</span>
          </div>
        </div>
      </div>

      {/* Dynamic Form Area */}
      <div className="space-y-4 pt-4 border-t border-brand-border min-h-[250px]">
        {method === 'card' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <Input 
              label="Cardholder Name" 
              placeholder="John Doe" 
              value={cardDetails.name}
              onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
            />
            <Input 
              label="Card Number" 
              placeholder="0000 0000 0000 0000" 
              value={cardDetails.number}
              onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input 
                label="Expiry Date" 
                placeholder="MM/YY" 
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
              />
              <Input 
                label="CVV" 
                placeholder="123" 
                value={cardDetails.cvv}
                onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                type="password"
              />
            </div>
            <p className="text-xs text-brand-muted flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              Payments are secure and encrypted.
            </p>
          </div>
        )}

        {method === 'upi' && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center animate-in fade-in slide-in-from-bottom-2">
            <QrCode className="h-24 w-24 text-slate-300 mx-auto mb-4 border-4 border-white shadow-sm rounded-xl p-2 bg-white" />
            <h4 className="text-brand-dark font-semibold mb-1">Pay with UPI</h4>
            <p className="text-sm text-brand-muted mb-4 max-w-sm mx-auto">
              Scan the QR code with any UPI app (GPay, PhonePe, Paytm) or enter your UPI ID below.
            </p>
            <div className="max-w-xs mx-auto flex gap-2">
              <Input placeholder="Enter UPI ID (e.g., user@upi)" className="flex-1" />
              <Button className="bg-brand-dark text-white hover:bg-black">Verify</Button>
            </div>
          </div>
        )}

        {method === 'netbanking' && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center animate-in fade-in slide-in-from-bottom-2">
            <Landmark className="h-10 w-10 text-brand-muted mx-auto mb-3" />
            <h4 className="text-brand-dark font-semibold mb-1">Netbanking</h4>
            <p className="text-sm text-brand-muted mb-4 max-w-sm mx-auto">
              Select your bank to proceed to their secure payment portal.
            </p>
            <div className="max-w-xs mx-auto space-y-4">
              <select className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/50">
                <option value="">Select your bank...</option>
                <option value="sbi">State Bank of India</option>
                <option value="hdfc">HDFC Bank</option>
                <option value="icici">ICICI Bank</option>
                <option value="axis">Axis Bank</option>
              </select>
              <Button className="w-full bg-brand-primary text-white hover:bg-brand-primaryDark">
                Proceed to Bank Portal
              </Button>
            </div>
          </div>
        )}

        {method === 'cash' && (
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center animate-in fade-in slide-in-from-bottom-2">
            <Banknote className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
            <h4 className="text-brand-dark font-semibold mb-1">Cash Payment</h4>
            <p className="text-sm text-brand-muted mb-4 max-w-sm mx-auto">
              You have selected to pay via Cash. A collection request will be created and our field executive will contact you for pickup.
            </p>
            <div className="bg-white border border-slate-200 rounded-lg p-4 text-left inline-block w-full max-w-md space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-brand-muted">Amount to Collect:</span>
                <span className="text-sm font-bold text-emerald-600">$199.00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-brand-muted">Pickup Address:</span>
                <span className="text-sm font-medium text-brand-dark">As per business details</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
