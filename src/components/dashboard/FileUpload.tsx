"use client";

import { useState, useEffect, useCallback } from "react";
import { validateFile } from "../../lib/utils/validation";

interface FileUploadProps {
  label: string;
  accept?: string;
  multiple?: boolean;
  value: File[];
  onChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  onError?: (error: string) => void;
}

export default function FileUpload({ 
  label, 
  accept, 
  multiple = false, 
  value, 
  onChange, 
  maxFiles,
  maxSizeMB = 5,
  onError,
}: FileUploadProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<number, string>>({});

  const getAllowedTypes = useCallback((): string[] => {
    if (!accept) return [];
    return accept.split(',').map(type => type.trim());
  }, [accept]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    const existingFiles = value || [];
    
    if (maxFiles && existingFiles.length + files.length > maxFiles) {
      const errorMsg = `Maximum ${maxFiles} file(s) allowed`;
      if (onError) {
        onError(errorMsg);
      } else {
        alert(errorMsg);
      }
      return;
    }

    const allowedTypes = getAllowedTypes();
    const validFiles: File[] = [];
    const newErrors: Record<number, string> = {};

    files.forEach((file, idx) => {
      const validation = validateFile(file, {
        maxSizeMB,
        allowedTypes: allowedTypes.length > 0 ? allowedTypes : undefined,
      });

      if (validation.valid) {
        validFiles.push(file);
      } else {
        const errorIndex = existingFiles.length + idx;
        newErrors[errorIndex] = validation.error || 'Invalid file';
        if (onError && validation.error) {
          onError(validation.error);
        }
      }
    });

    if (validFiles.length === 0 && files.length > 0) {
      return;
    }

    setErrors(newErrors);

    const newFiles = multiple ? [...existingFiles, ...validFiles] : validFiles;
    onChange(newFiles);

    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));
    if (multiple) {
      setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);
    } else {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
      setPreviewUrls(newPreviewUrls);
    }

    e.target.value = '';
  }

  function removeFile(index: number) {
    if (previewUrls[index]) {
      URL.revokeObjectURL(previewUrls[index]);
    }
    
    const newFiles = value.filter((_, i) => i !== index);
    onChange(newFiles);
    
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newPreviewUrls);

    const newErrors = { ...errors };
    delete newErrors[index];
    setErrors(newErrors);
  }

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
        }
      });
    };
  }, [previewUrls]);

  useEffect(() => {
    if (value.length === 0 && previewUrls.length > 0) {
      previewUrls.forEach((url) => {
        try {
          URL.revokeObjectURL(url);
        } catch {
        }
      });
      setPreviewUrls([]);
    }
  }, [value.length, previewUrls]);

  return (
    <div>
      <label className="block text-sm font-medium mb-1 text-black">{label}</label>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="w-full rounded-md border border-black/10 px-3 py-2 text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 cursor-pointer"
      />
      {Object.keys(errors).length > 0 && (
        <div className="mt-2 space-y-1">
          {Object.entries(errors).map(([index, errorMsg]) => (
            <div key={index} className="text-xs text-red-600" role="alert">
              {errorMsg}
            </div>
          ))}
        </div>
      )}
      {value.length > 0 && (
        <div className="mt-3 space-y-2">
          {value.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 border border-black/10 rounded-md">
              <span className="text-sm text-black/70 truncate flex-1">{file.name}</span>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="ml-2 text-red-600 hover:text-red-700 text-sm"
                aria-label={`Remove ${file.name}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
      {multiple && maxFiles && (
        <p className="mt-1 text-xs text-black/50">{value.length} / {maxFiles} files selected</p>
      )}
    </div>
  );
}

