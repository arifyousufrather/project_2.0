import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/format';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartDrawer({ open, onClose, onCheckout }: CartDrawerProps) {
  const { items, subtotal, deliveryFee, total, increment, decrement, remove, count } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-stone-900/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-[70] w-full max-w-md bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-bold text-stone-900">
              Your Cart {count > 0 && <span className="text-stone-400 font-medium">({count})</span>}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-9 h-9 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Items */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-stone-100 mb-4">
              <ShoppingBag className="w-9 h-9 text-stone-300" />
            </div>
            <p className="text-lg font-semibold text-stone-700">Your cart is empty</p>
            <p className="text-sm text-stone-400 mt-1">Add some delicious items from the menu.</p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-3 rounded-xl bg-stone-900 text-white font-semibold text-sm hover:bg-stone-800 transition-colors"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl border border-stone-100 hover:border-stone-200 transition-colors"
                >
                  <img
                    src={item.image_url ?? ''}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-semibold text-stone-900 text-sm leading-snug truncate">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => remove(item.id)}
                        className="flex-shrink-0 text-stone-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-stone-500 mt-0.5">{formatINR(item.price)}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1 bg-stone-100 rounded-lg p-0.5">
                        <button
                          onClick={() => decrement(item.id)}
                          className="flex items-center justify-center w-7 h-7 rounded-md bg-white text-stone-700 hover:bg-stone-200 transition-colors shadow-sm"
                        >
                          <Minus className="w-3.5 h-3.5" strokeWidth={3} />
                        </button>
                        <span className="w-6 text-center font-bold text-stone-900 text-sm">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increment(item.id)}
                          className="flex items-center justify-center w-7 h-7 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow-sm"
                        >
                          <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                        </button>
                      </div>
                      <span className="font-bold text-stone-900 text-sm">
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="border-t border-stone-100 px-5 py-4 space-y-2.5 bg-stone-50/50">
              <div className="flex items-center justify-between text-sm text-stone-600">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-800">{formatINR(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-sm text-stone-600">
                <span>Delivery Fee</span>
                <span className="font-semibold text-stone-800">{formatINR(deliveryFee)}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-stone-200">
                <span className="font-bold text-stone-900">Total</span>
                <span className="text-xl font-extrabold text-orange-600">{formatINR(total)}</span>
              </div>
              <button
                onClick={onCheckout}
                className="mt-2 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-stone-900 font-bold shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] transition-all"
              >
                Proceed to Checkout
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
