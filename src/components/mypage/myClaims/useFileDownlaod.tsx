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
