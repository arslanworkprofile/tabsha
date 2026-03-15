import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiX } from 'react-icons/fi';

export default function ConfirmModal({
  open,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 1100,
              backdropFilter: 'blur(4px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />
          <motion.div
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'var(--white)',
              borderRadius: '12px',
              padding: '32px',
              zIndex: 1200,
              width: '400px',
              maxWidth: 'calc(100vw - 40px)',
              boxShadow: 'var(--shadow-xl)',
            }}
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <button
              onClick={onCancel}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'none', border: 'none',
                color: 'var(--gray-400)', cursor: 'pointer',
              }}
            >
              <FiX size={18} />
            </button>

            <div style={{
              width: '48px', height: '48px',
              background: danger ? '#fde8e6' : 'var(--gold-light)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: '20px',
              color: danger ? 'var(--error)' : 'var(--gold-dark)',
            }}>
              <FiAlertTriangle size={22} />
            </div>

            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '20px', fontWeight: 500,
              marginBottom: '10px',
            }}>
              {title}
            </h3>

            <p style={{
              fontSize: '14px', color: 'var(--gray-500)',
              lineHeight: 1.6, marginBottom: '28px',
            }}>
              {message}
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="btn btn-outline"
                style={{ flex: 1 }}
                onClick={onCancel}
                disabled={loading}
              >
                {cancelLabel}
              </button>
              <button
                className="btn"
                style={{
                  flex: 1,
                  background: danger ? 'var(--error)' : 'var(--gold)',
                  color: danger ? '#fff' : 'var(--black)',
                }}
                onClick={onConfirm}
                disabled={loading}
              >
                {loading
                  ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, borderTopColor: '#fff' }} />
                  : confirmLabel
                }
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
