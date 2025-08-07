import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import {
  // CLAIM_DOCUMENT_TYPES,
  DOCUMENT_TYPE_MAP,
  // RequiredDocument,
  type ClaimDocumentType,
  type RequiredDocumentType,
} from "./Types";

interface FileUploaderProps {
  // claimType: typeof CLAIM_DOCUMENT_TYPES;
  claimType: ClaimDocumentType;
  onUploadComplete: (metadata: any) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  claimType,
  onUploadComplete,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { setError, clearErrors } = useFormContext();
  const requiredDocs: RequiredDocumentType[] = DOCUMENT_TYPE_MAP[claimType];

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: RequiredDocumentType
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    try {
      // Simulate file upload progress
      const interval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      // In real app:
      // 1. Compute SHA-256 checksum
      // 2. Upload to cloud storage (AWS S3, Google Cloud, etc.)
      // 3. Get back storage metadata
      await new Promise((resolve) => setTimeout(resolve, 2000));
      clearInterval(interval);
      setProgress(100);

      // Simulated metadata from backend
      const metadata = {
        storageId: uuidv4(),
        storageBucket: "claims-documents",
        originalFileName: file.name,
        contentType: file.type,
        sha256Checksum: "simulated-sha256-checksum",
        documentType: docType,
      };

      onUploadComplete(metadata);
      clearErrors("documents");
    } catch (error) {
      setError("documents", {
        type: "manual",
        message: "File upload failed. Please try again.",
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setProgress(0), 500);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Required Documents</h3>
      <p className="text-sm text-gray-500">
        {requiredDocs.map((d) => d.replace(/_/g, " ")).join(", ")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requiredDocs.map((docType) => (
          <div key={docType} className="border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {docType.replace(/_/g, " ")} *
            </label>

            <div className="flex items-center space-x-2">
              <input
                type="file"
                disabled={isUploading}
                onChange={(e) => handleFileChange(e, docType)}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />

              {isUploading && (
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileUploader;
