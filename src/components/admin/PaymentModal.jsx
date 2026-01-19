import React, { useState } from 'react';
import { X, IndianRupee } from 'lucide-react';
import { useHttp } from '../hooks/useHttp';
import RippleSpinner from '../common/RippleSpinner';
import { toast } from 'react-hot-toast';

function PaymentModal({ isOpen, onClose, userId, year, month, monthName, onPaymentSuccess }) {
  const { post, loading } = useHttp();
  const [formData, setFormData] = useState({
    amount: '',
    receiptNo: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.amount || !formData.receiptNo) {
      toast.error('Please fill in all fields');
      return;
    }

    const paymentData = {
      userId: userId,
      year: year,
      month: month,
      amount: parseFloat(formData.amount),
      date: new Date().toISOString(),
      receiptNo: formData.receiptNo,
    };

    const res = await post('/api/admin/addPayment', paymentData);

    if (res && res.success) {
      toast.success('Payment added successfully!');
      setFormData({ amount: '', receiptNo: '' });
      onPaymentSuccess();
      onClose();
    } else {
      toast.error(res?.message || 'Failed to add payment');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-[3000] flex items-center justify-center p-4">
      <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-gray-500 hover:text-white hover:bg-red-300 rounded-full w-8 h-8 flex items-center justify-center transition btn-primary"
        >
          <X />
        </button>

        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Record Payment
        </h2>

        {/* Payment Info */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-semibold">Month:</span> {monthName} {year}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Date:</span> {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Amount <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IndianRupee className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="Enter amount"
                className="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
                disabled={loading}
                min="1"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Receipt Number Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Receipt Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.receiptNo}
              onChange={(e) => setFormData({ ...formData, receiptNo: e.target.value })}
              placeholder="Enter receipt number (e.g., REC-123456)"
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500"
              disabled={loading}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-semibold flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RippleSpinner size={20} color="#ffffff" />
                  Processing...
                </>
              ) : (
                'Add Payment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentModal;