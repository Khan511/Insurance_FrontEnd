// // hooks/useFileDownload.ts
// import { useGetDownloadUrlMutation } from "@/services/s3Api";
// import { useState } from "react";

// export const useFileDownload = () => {
//   const [getDownloadUrl, { isLoading: isGettingUrl }] =
//     useGetDownloadUrlMutation();
//   const [error, setError] = useState<string | null>(null);
//   const [isDownloading, setIsDownloading] = useState(false);

//   const downloadFile = async (fileKey: string, fileName: string) => {
//     try {
//       setError(null);
//       setIsDownloading(true);

//       // Get the pre-signed URL from the backend
//       const response = await getDownloadUrl(fileKey).unwrap();

//       // Fetch the file using the pre-signed URL
//       const fileResponse = await fetch(response.downloadUrl);

//       if (!fileResponse.ok) {
//         throw new Error(`Failed to download file: ${fileResponse.statusText}`);
//       }

//       const blob = await fileResponse.blob();

//       // Create a URL for the blob
//       const url = window.URL.createObjectURL(blob);

//       // Create a temporary anchor element to trigger the download
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", fileName);
//       document.body.appendChild(link);
//       link.click();

//       // Clean up
//       document.body.removeChild(link);
//       window.URL.revokeObjectURL(url);

//       return { success: true };
//     } catch (err) {
//       const errorMessage = "Failed to download file. Please try again.";
//       setError(errorMessage);
//       console.error("Download error:", err);
//       return { success: false, error: errorMessage };
//     } finally {
//       setIsDownloading(false);
//     }
//   };

//   return {
//     downloadFile,
//     isDownloading: isGettingUrl || isDownloading,
//     error,
//     clearError: () => setError(null),
//   };
// };

// hooks/useFileDownload.ts
// hooks/useFileDownload.ts
import { useGetDownloadUrlMutation } from "@/services/s3Api";
import { useState } from "react";

export const useFileDownload = () => {
  const [getDownloadUrl, { isLoading: isGettingUrl }] =
    useGetDownloadUrlMutation();
  const [error, setError] = useState<string | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null); // <---

  const downloadFile = async (fileKey: string, fileName: string) => {
    try {
      setError(null);
      setActiveKey(fileKey); // <---

      const { downloadUrl } = await getDownloadUrl(fileKey).unwrap();
      const resp = await fetch(downloadUrl);
      if (!resp.ok)
        throw new Error(`Failed to download file: ${resp.statusText}`);

      const blob = await resp.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", fileName);
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (err) {
      const msg = "Failed to download file. Please try again.";
      setError(msg);
      console.error("Download error:", err);
      return { success: false, error: msg };
    } finally {
      setActiveKey(null); // <---
    }
  };

  return {
    downloadFile,
    isGettingUrl,
    activeKey, // <---
    error,
    clearError: () => setError(null),
  };
};
