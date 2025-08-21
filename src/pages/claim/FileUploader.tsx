import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { type RequiredDocumentType } from "./Types";
import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";
import { storage } from "@/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

interface DocumentType {
  name: string;
  displayName: string;
}

interface FileUploaderProps {
  requiredDocuments: DocumentType[];
  onUploadComplete: (metadata: any) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  requiredDocuments,
  onUploadComplete,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { setError, clearErrors } = useFormContext();
  const { data: currentUser } = useGetCurrenttUserQuery();

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    docType: RequiredDocumentType
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setProgress(0);

    try {
      const fileExtension = file.name.split(".").pop()?.toLowerCase();
      const storagePath = `claims-documents/${
        currentUser?.data?.user.name.firstName
      } ${currentUser?.data?.user.name.lastName}_${uuidv4()}.${fileExtension}`;

      const storageRef = ref(storage, storagePath);

      // Create upload tasks
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Track Upload Progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(progress);
        },
        (error) => {
          setError("documents", {
            type: "manual",
            message: "File upload failed. Please try again." + error.message,
          });
          setIsUploading(false);
        },

        async () => {
          try {
            // Get download URL
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);

            // Construct metadata
            const metadata = {
              storageId: uuidv4(),
              storagePath,
              downloadUrl,
              originalFileName: file.name,
              contentType: file.type,
              // sha256Checksum: "simulated-sha256-checksum",
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
            setProgress(0);
          }
        }
      );
    } catch (error) {
      setError("documents", {
        type: "manual",
        message: "File upload failed. Please try again.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <p className="text-xl font-medium text-gray-900">Required Documents</p>
      <p className="text-sm text-gray-500 b">
        {requiredDocuments.map((d) => d.displayName).join(", ")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
        {requiredDocuments.map((docType, index) => (
          <div key={index} className="border rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {docType.displayName}
              <span className="text-red-500"> *</span>
            </label>

            <div className="flex items-center space-x-2">
              <input
                type="file"
                disabled={isUploading}
                onChange={(e) => handleFileChange(e, docType.name)}
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
