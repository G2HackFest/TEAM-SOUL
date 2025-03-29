import React from 'react';
import { CreditCard, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentConfirmationProps {
  amount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function PaymentConfirmation({ amount, onConfirm, onCancel }: PaymentConfirmationProps) {
  const handleConfirm = () => {
    toast.success('Payment confirmed successfully!');
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <CreditCard className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold">Confirm Payment</h2>
          <p className="text-gray-600 mt-2">
            Please confirm your appointment payment
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Consultation Fee:</span>
            <span className="text-lg font-semibold">₹{amount}</span>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            * This is a demo payment. No actual charges will be made.
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 flex items-center justify-center"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Confirm Payment
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}