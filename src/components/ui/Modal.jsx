import { useEffect } from 'react';
import { createPortal } from 'react-dom';   // ⭐ Portal import
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, size = 'md', children, footer }) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  // ⭐ Modal ko body par directly render karein — parent ke overflow/transform se azaad
  return createPortal(
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        background: 'rgba(0, 0, 0, 0.55)',
        backdropFilter: 'blur(2px)',           // ⭐ Modern blur effect
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,                          // ⭐ Sabse upar
        padding: 20,
        boxSizing: 'border-box',
        animation: 'wfFadeIn 0.15s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#ffffff',
          borderRadius: 12,
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(0, 0, 0, 0.05)',
          width: '100%',
          maxWidth: size === 'lg' ? 860 : 520,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'wfModalIn 0.2s ease',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#ffffff',
          flexShrink: 0,
        }}>
          <h3 style={{ fontSize: 17, fontWeight: 600, margin: 0, color: '#0F172A' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            style={{
              padding: 6,
              borderRadius: 6,
              color: '#64748B',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#F1F5F9')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{
          padding: 24,
          overflowY: 'auto',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          background: '#ffffff',
        }}>
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div style={{
            padding: '16px 24px',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 8,
            background: '#F8FAFC',
            flexShrink: 0,
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}