"use client";

import { useState, useRef } from "react";
import { Upload, Loader2, CheckCircle2, X } from "lucide-react";
import { uploadDocument } from "@/lib/uploadApi";

interface DocumentUploadItemProps {
  title: string;
  subtitle: string;
  required?: boolean;
  currentUrl?: string;
  onUploadSuccess: (url: string) => void;
}

export function DocumentUploadItem({
  title,
  subtitle,
  required = false,
  currentUrl,
  onUploadSuccess,
}: DocumentUploadItemProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Optional frontend check
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const response = await uploadDocument(file);
      onUploadSuccess(response.data.url);
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 p-3 rounded-lg border border-brand-border bg-white transition-colors hover:border-brand-primary/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand-dark">
            {title} {required && <span className="text-red-500">*</span>}
          </p>
          <p className="text-xs text-brand-placeholder mt-0.5">{subtitle}</p>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        <div className="flex items-center gap-2">
          {currentUrl && !isUploading && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-xs font-medium border border-emerald-100">
              <CheckCircle2 className="h-3.5 w-3.5" /> Uploaded
            </div>
          )}
          
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png,.pdf"
          />

          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-brand-primary bg-brand-primaryLight rounded-md hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            {isUploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {isUploading ? "Uploading..." : currentUrl ? "Replace" : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
