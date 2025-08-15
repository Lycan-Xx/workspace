import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PinVerificationModal = ({ isOpen, onClose, onVerify }) => {
  const [pin, setPin] = useState(Array(6).fill(''));

  const handlePinChange = (index, value) => {
    if (/^\d*$/.test(value) && value.length <= 1) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      
      if (value && index < 5) {
        document.getElementById(`pin-${index + 1}`).focus();
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const enteredPin = pin.join('');
    if (enteredPin === '000000') {
      onVerify();
    } else {
      alert('Incorrect PIN. Please try again.');
      setPin(Array(6).fill(''));
      document.getElementById('pin-0').focus();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.getElementById('pin-0')?.focus();
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            minHeight: '100dvh' // For mobile browsers with dynamic viewport
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6 my-auto"
            style={{
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto'
            }}
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Please Input Your PIN
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center gap-2">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    id={`pin-${index}`}
                    type="password"
                    inputMode="numeric"
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-xl border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    maxLength="1"
                    required
                  />
                ))}
              </div>
              
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Verify PIN
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PinVerificationModal; 