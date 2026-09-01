import { Payment } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { LottieLoader } from "@/components/ui/LottieLoader";

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
}

export function PaymentDetailsModal({ isOpen, onClose, payment }: PaymentDetailsModalProps) {
  const [downloading, setDownloading] = useState(false);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  useEffect(() => {
    let currentUrl: string | null = null;
    
    if (payment && isOpen) {
      let isMounted = true;
      const loadPreview = async () => {
        setIsPreviewLoading(true);
        try {
          const res = await fetch('/api/payment/pdf', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payment),
          });
          if (res.ok) {
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            currentUrl = url;
            if (isMounted) setPdfPreviewUrl(url);
          }
        } catch (error) {
          console.error(error);
        } finally {
          if (isMounted) setIsPreviewLoading(false);
        }
      };
      loadPreview();
      
      return () => {
        isMounted = false;
        if (currentUrl) window.URL.revokeObjectURL(currentUrl);
      };
    } else {
      setPdfPreviewUrl(null);
    }
  }, [payment, isOpen]);

  const downloadPDF = async () => {
    if (!payment) return;
    try {
      setDownloading(true);
      const res = await fetch('/api/payment/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payment),
      });

      if (!res.ok) throw new Error('Failed to generate PDF');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Receipt-${payment.id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  if (!payment) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Transaction Details" size="4xl">
      <div className="flex flex-col h-[70vh] -mx-6 -mb-6 -mt-4 bg-slate-100/50 rounded-b-3xl overflow-hidden relative">
        <div className="flex-1 w-full h-full relative">
          {isPreviewLoading ? (
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-white/50 backdrop-blur-sm z-10">
              <LottieLoader size="lg" className="mb-2" />
              <p className="text-sm font-medium text-brand-muted">Generating PDF preview...</p>
            </div>
          ) : pdfPreviewUrl ? (
            <iframe src={pdfPreviewUrl} className="w-full h-full border-0" title="Payment Receipt PDF" />
          ) : (
            <div className="absolute inset-0 flex justify-center items-center bg-white">
              <p className="text-sm font-medium text-red-500">Failed to load PDF preview.</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-brand-border bg-white flex justify-end gap-3 shrink-0">
          <button 
            onClick={onClose}
            className="px-6 py-2 rounded-xl border border-brand-border text-sm font-semibold text-brand-dark hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
          <button 
            onClick={downloadPDF}
            disabled={downloading || isPreviewLoading}
            className="px-6 py-2 rounded-xl bg-brand-primary text-white text-sm font-bold hover:bg-brand-primaryDark transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
          >
            {downloading ? <LottieLoader size="xs" /> : <Download className="h-4 w-4" />} 
            {downloading ? 'Generating...' : 'Download Receipt'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
