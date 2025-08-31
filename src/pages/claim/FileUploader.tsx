import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

interface DocumentType {
  name: string;
  displayName: string;
}

interface FileUploaderProps {
  requiredDocuments: DocumentType[];
  onUploadComplete: (metadata: any) => void;
}

// Function to calculate SHA256 hash
const calculateSHA256 = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
};

function FileUploader({
  requiredDocuments,
  onUploadComplete,
}: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const { setError, clearErrors } = useFormContext();
  const { data: currentUser } = useGetCurrenttUserQuery();

  const validateFile = (file: File): string | null => {
    // Check file size (e.g., max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return "File size must be less than 10MB";
    }

    // Check file type
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      return "Only PDF, DOC, DOCX, JPG, and PNG files are allowed";
    }

    return null;
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validationError = validateFile(file);
    if (validationError) {
      setError("documents", {
        type: "manual",
        message: validationError,
      });
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setUploadingDoc(docType);

    try {
      // Calculate SHA256 checksum
      const sha256Checksum = await calculateSHA256(file);

      // Generate a Uniq storage ID
      const storageId = uuidv4();

      // Get file extension
      const fileExtension = file.name.split(".").pop()?.toLowerCase() || "";

      // Create user folder name
      const userName = `${currentUser?.data?.user.name.firstName || "User"}_${
        currentUser?.data?.user.name.lastName || "Unknown"
      }`;

      // const fileKey = `${userName}_${currentUser?.data.user.userId}`;
      const fileKey = `${userName}_${currentUser?.data.user.userId}/${storageId}.${fileExtension}`;

      // Step 1: Get pre-signed URL from backend
      const presignedUrlResponse = await fetch(
        "http://localhost:8080/api/s3/presigned-url",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type,
          }),
        }
      );

      // Check if response is OK and has content
      if (!presignedUrlResponse.ok) {
        const errorText = await presignedUrlResponse.text();
        throw new Error(
          `Failed to get Presigned Url. Server returned ${presignedUrlResponse.status}: ${errorText}`
        );
      }

      // Check if response has content
      const responseText = await presignedUrlResponse.text();
      if (!responseText) {
        throw new Error("Empty response from server");
      }

      const responseData = JSON.parse(responseText);
      const { presignedUrl, fileUrl } = responseData;

      // Step 2: Upload file to S3 using pre-signed URL
      const uploadResponse = await fetch(presignedUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload to S3 failed");
      }

      // Create complete metadata for the document
      const metadata = {
        storageId,
        storageBucket: "insurance-documents",
        originalFileName: file.name,
        contentType: file.type,
        sha256Checksum,
        documentType: docType,
        fileKey: fileKey,
        fileUrl: fileUrl,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
      };

      console.log("Calling onUploadComplete with metadata:", metadata);

      onUploadComplete(metadata);
      clearErrors("documents");

      // Reset the input
      e.target.value = "";
    } catch (error) {
      console.error("Upload error:", error);
      setError("documents", {
        type: "manual",
        message: "File upload failed. Please try again.",
      });
    } finally {
      setIsUploading(false);
      setProgress(0);
      setUploadingDoc(null);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div>
        <p className="text-xl font-medium text-gray-900">Required Documents</p>
        <p className="text-sm text-gray-500 mt-1">
          {requiredDocuments.map((d) => d.displayName).join(", ")}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Supported formats: PDF, DOC, DOCX, JPG, PNG (max 10MB)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {requiredDocuments.map((docType, index) => (
          <div key={index} className="border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {docType.displayName}
              <span className="text-red-500"> *</span>
            </label>

            <div className="space-y-2">
              <input
                type="file"
                disabled={isUploading}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, docType.name)}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100
                  disabled:file:bg-gray-100 disabled:file:text-gray-400"
              />

              {isUploading && uploadingDoc === docType.name && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Uploading...</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Debug information - remove in production */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-xs text-gray-600">
        <p>
          <strong>Debug Info:</strong>
        </p>
        <p>Storage: AWS S3</p>
        <p>
          Current User: {currentUser?.data?.user.name.firstName}{" "}
          {currentUser?.data?.user.name.lastName}
        </p>
        <p>Upload Status: {isUploading ? "Uploading..." : "Ready"}</p>
      </div>
    </div>
  );
}

export default FileUploader;
