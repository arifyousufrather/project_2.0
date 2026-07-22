import { useState } from 'react';
import { X, Loader2, CheckCircle2, Utensils, ShoppingBag, Truck, Home } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabase';
import { formatINR } from '@/lib/format';
import type { OrderType } from '@/types';

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
}

type Phase = 'form' | 'submitting' | 'success' | 'error';

const orderTypes: { value: OrderType; label: string; icon: typeof Utensils }[] = [
  { value: 'Dine-in', label: 'Dine-in', icon: Utensils },
  { value: 'Takeaway', label: 'Takeaway', icon: ShoppingBag },
  { value: 'Delivery', label: 'Delivery', icon: Truck },
];

export default function CheckoutModal({ open, onClose }: CheckoutModalProps) {
  const { items, subtotal, deliveryFee, total, clear } = useCart();
  const [phase, setPhase] = useState<Phase>('form');
  const [errorMsg, setErrorMsg] = useState('');
  const [orderId, setOrderId] = useState('');

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [orderType, setOrderType] = useState<OrderType>('Takeaway');
  const [tableOrAddress, setTableOrAddress] = useState('');
  const [notes, setNotes] = useState('');

  const reset = () => {
    setPhase('form');
    setErrorMsg('');
    setOrderId('');
    setName('');
    setPhone('');
    setOrderType('Takeaway');
    setTableOrAddress('');
    setNotes('');
  };

  const handleClose = () => {
    if (phase === 'submitting') return;
    if (phase === 'success') {
      clear();
      reset();
    }
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg('Please enter your name and phone number.');
      return;
    }
    if (orderType !== 'Takeaway' && !tableOrAddress.trim()) {
      setErrorMsg(orderType === 'Dine-in' ? 'Please enter your table number.' : 'Please enter your delivery address.');
      return;
    }
    setPhase('submitting');
    setErrorMsg('');

    const { data, error } = await supabase
      .from('orders')
      .insert({
        customer_name: name.trim(),
        customer_phone: phone.trim(),
        order_type: orderType,
        table_or_address: tableOrAddress.trim() || null,
        notes: notes.trim() || null,
        total,
        items_json: items,
      })
      .select('id')
      .single();

    if (error || !data) {
      setPhase('error');
      setErrorMsg(error?.message ?? 'Could not place your order. Please try again.');
      return;
    }

    setOrderId(data.id);
    setPhase('success');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-stone-900/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-[fadeInUp_0.3s_ease-out]">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-white/95 backdrop-blur-sm z-10">
          <h2 className="text-lg font-bold text-stone-900">
            {phase === 'success' ? 'Order Confirmed' : 'Checkout'}
          </h2>
          <button
            onClick={handleClose}
            disabled={phase === 'submitting'}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors disabled:opacity-40"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ---- SUCCESS ---- */}
        {phase === 'success' && (
          <div className="px-6 py-10 text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mx-auto mb-5 animate-[scaleIn_0.3s_ease-out]">
              <CheckCircle2 className="w-11 h-11 text-green-600" strokeWidth={2} />
            </div>
            <h3 className="text-xl font-bold text-stone-900">Thank you, {name.split(' ')[0]}!</h3>
            <p className="mt-2 text-stone-600">
              Your order has been received and is being prepared with love.
            </p>
            <div className="mt-5 mx-auto max-w-xs p-4 rounded-xl bg-stone-50 border border-stone-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-500">Order ID</span>
                <span className="font-mono font-semibold text-stone-800">
                  #{orderId.slice(0, 8).toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-stone-500">Status</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 font-semibold text-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Received
                </span>
              </div>
              <div className="flex items-center justify-between text-sm mt-2">
                <span className="text-stone-500">Total Paid</span>
                <span className="font-bold text-stone-900">{formatINR(total)}</span>
              </div>
            </div>
            <p className="mt-5 text-sm text-stone-400">
              Estimated preparation time: ~15–20 minutes. We will call you when it is ready.
            </p>
            <button
              onClick={handleClose}
              className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-stone-900 font-bold shadow-lg shadow-orange-500/30 hover:scale-[1.02] transition-transform"
            >
              Done
            </button>
          </div>
        )}

        {/* ---- ERROR ---- */}
        {phase === 'error' && (
          <div className="px-6 py-10 text-center">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mx-auto mb-4">
              <X className="w-8 h-8 text-red-600" strokeWidth={2} />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Something went wrong</h3>
            <p className="mt-2 text-sm text-stone-600">{errorMsg}</p>
            <button
              onClick={() => setPhase('form')}
              className="mt-6 px-6 py-3 rounded-xl bg-stone-900 text-white font-semibold text-sm hover:bg-stone-800 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ---- FORM ---- */}
        {(phase === 'form' || phase === 'submitting') && (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
            {/* Order summary */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">
                Order Summary
              </p>
              <div className="space-y-1.5">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <span className="text-stone-700">
                      {item.quantity} × {item.name}
                    </span>
                    <span className="font-medium text-stone-800">
                      {formatINR(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-stone-200 space-y-1">
                <div className="flex items-center justify-between text-sm text-stone-500">
                  <span>Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div className="flex items-center justify-between text-sm text-stone-500">
                  <span>Delivery Fee</span>
                  <span>{formatINR(deliveryFee)}</span>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="font-bold text-stone-900">Total</span>
                  <span className="text-lg font-extrabold text-orange-600">{formatINR(total)}</span>
                </div>
              </div>
            </div>

            {/* Order type */}
            <div>
              <label className="block text-sm font-semibold text-stone-700 mb-2">Order Type</label>
              <div className="grid grid-cols-3 gap-2">
                {orderTypes.map((ot) => (
                  <button
                    key={ot.value}
                    type="button"
                    onClick={() => setOrderType(ot.value)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition-all ${
                      orderType === ot.value
                        ? 'border-orange-400 bg-orange-50 text-orange-700'
                        : 'border-stone-200 text-stone-500 hover:border-stone-300'
                    }`}
                  >
                    <ot.icon className="w-5 h-5" />
                    <span className="text-xs font-semibold">{ot.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Name */}
            <div>
              <label htmlFor="co-name" className="block text-sm font-semibold text-stone-700 mb-1.5">
                Full Name
              </label>
              <input
                id="co-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Arif Yousuf"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow"
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="co-phone" className="block text-sm font-semibold text-stone-700 mb-1.5">
                Phone Number
              </label>
              <input
                id="co-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 90000 00000"
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow"
              />
            </div>

            {/* Table / address */}
            {orderType !== 'Takeaway' && (
              <div>
                <label htmlFor="co-loc" className="block text-sm font-semibold text-stone-700 mb-1.5">
                  {orderType === 'Dine-in' ? 'Table Number' : 'Delivery Address'}
                </label>
                <input
                  id="co-loc"
                  type="text"
                  value={tableOrAddress}
                  onChange={(e) => setTableOrAddress(e.target.value)}
                  placeholder={orderType === 'Dine-in' ? 'e.g. Table 12' : 'e.g. Room 204, Hostel Block B'}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow"
                />
              </div>
            )}

            {/* Notes */}
            <div>
              <label htmlFor="co-notes" className="block text-sm font-semibold text-stone-700 mb-1.5">
                Special Instructions <span className="text-stone-400 font-normal">(optional)</span>
              </label>
              <textarea
                id="co-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="e.g. Less spicy, extra chutney..."
                className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-shadow resize-none"
              />
            </div>

            {errorMsg && phase === 'form' && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{errorMsg}</p>
            )}

            <button
              type="submit"
              disabled={phase === 'submitting'}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-stone-900 font-bold shadow-lg shadow-orange-500/30 hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {phase === 'submitting' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Placing Order...
                </>
              ) : (
                <>Place Order · {formatINR(total)}</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
