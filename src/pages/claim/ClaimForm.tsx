import { useEffect, useState } from "react";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { claimFormSchema } from "./validation";
import { type ClaimFormData, type DocumentAttachment } from "./Types";
import AddressSection from "./AddressSectioin";
import ThirdPartySection from "./ThirdPartySection";
import FileUploader from "./FileUploader";

import { useGetCurrenttUserQuery } from "@/services/UserApiSlice";
import {
  useGetClaimTypesQuery,
  useGetIncidentTypesQuery,
  useGetRequiredDocumentsQuery,
  useSubmitClaimMutation,
} from "@/services/ClaimMetaDataApi";
import { useDeleteFileMutation } from "@/services/s3Api";
import { useGetAllPoliciesOfUserQuery } from "@/services/InsurancePolicySlice";

const ClaimForm = () => {
  const { data: claimTypes } = useGetClaimTypesQuery();
  const [selectedClaimType, setSelectedClaimType] = useState("");
  const [policyNumber, setPolicyNumber] = useState<string[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { data: currentUser } = useGetCurrenttUserQuery();
  const [submitClaim] = useSubmitClaimMutation();
  const [uploadedDocuments, setUploadedDocuments] = useState<
    DocumentAttachment[]
  >([]);
  const [deleteFile] = useDeleteFileMutation();
  const { data: incidentTypes = [] } = useGetIncidentTypesQuery(
    selectedClaimType,
    {
      skip: !selectedClaimType,
    }
  );

  const { data: requiredDocuments = [] } = useGetRequiredDocumentsQuery(
    selectedClaimType,
    {
      skip: !selectedClaimType,
    }
  );

  const { data: allPoliciesOfUser } = useGetAllPoliciesOfUserQuery(
    currentUser?.data?.user?.userId || "",
    {
      skip: !currentUser?.data?.user?.userId,
    }
  );

  useEffect(() => {
    if (allPoliciesOfUser) {
      const polNumber = allPoliciesOfUser.map((policy) => policy.policyNumber);
      setPolicyNumber(["Choose Your Policy", ...polNumber]);
    }
  }, [allPoliciesOfUser]);

  const methods = useForm<ClaimFormData>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: {
      policyNumber: policyNumber[0],
      claimType: "",

      incidentDetails: {
        incidentDateTime: new Date().toISOString().slice(0, 16),
        claimAmount: null,
        type: incidentTypes[0] || "",
        thirdPartyInvolved: false,
        location: {
          street: "",
          city: "",
          postalCode: "",
          country: "",
        },
        description: "",
      },
      documents: [],
    },
  });

  const claimType = methods.watch("claimType");

  useEffect(() => {
    if (claimType) setSelectedClaimType(claimType);
  }, [claimType]);

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = methods;

  const onSubmit: SubmitHandler<ClaimFormData> = async (data) => {
    try {
      const response = await submitClaim(data).unwrap();
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const handleUploadComplete = (metadata: DocumentAttachment) => {
    setUploadedDocuments((prev) => {
      const newDocuments = [...prev, metadata];

      setValue("documents", newDocuments, { shouldValidate: true });
      return newDocuments;
    });
  };

  const removeDocument = async (
    index: number,
    document: DocumentAttachment
  ) => {
    try {
      await deleteFile(document.fileUrl).unwrap();

      setUploadedDocuments((prev) => {
        const newDocuments = [...prev];
        newDocuments.splice(index, 1);
        setValue("documents", newDocuments, { shouldValidate: true });
        return newDocuments;
      });
    } catch (error: any) {
      console.error("Error deleting file:", error);

      if (error.status === 403) {
        alert(
          "You don't have permission to delete this file. Please check your AWS permissions."
        );
      } else {
        alert("Failed to delete file. Please try again.");
      }
    }
  };

  if (submitSuccess) {
    return (
      <div className="container flex justify-center p-6 bg-green-50 rounded-lg">
        <p className="mt-2 text-green-600">Your claim has been submitted</p>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 mb-5 p-5 bg-white rounded-lg shadow-xl container"
      >
        <p className="text-2xl text-blue-500 font-bold mb-4 ">
          Report New Claim
        </p>

        {/* Policy Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Policy Number *
            </label>
            <select
              {...methods.register("policyNumber")}
              className="mt-1 block w-full rounded-md p-2 border-gray-300 border focus:border-blue-500 focus:ring-blue-500"
            >
              {Object.values(policyNumber).map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            {methods.formState.errors.policyNumber && (
              <p className="mt-1 text-sm text-red-600">
                {methods.formState.errors.policyNumber.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Claim Type *
            </label>
            <select
              {...methods.register("claimType")}
              className="mt-1 block w-full rounded-md p-2 border-gray-300 border focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Choose claim type</option>
              {claimTypes?.map((type, index) => (
                <option key={index} value={type.type}>
                  {type.type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Incident Details */}
        <div className="border-t pt-4">
          <p className="text-xl  font-semibold text-gray-900">
            Incident Details
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Incident Date/Time *
              </label>
              <input
                type="datetime-local"
                {...methods.register("incidentDetails.incidentDateTime")}
                className="mt-1 block w-full rounded-md p-2 border-gray-300 border focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Incident Type *
              </label>
              <select
                {...methods.register("incidentDetails.type")}
                className="mt-1 block w-full rounded-md p-2 border-gray-300 border focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Choose incident type</option>
                {incidentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Address Component */}
          <AddressSection />

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Description *
            </label>
            <textarea
              {...methods.register("incidentDetails.description")}
              rows={4}
              className="mt-1 block w-full rounded-md p-2 border-gray-300 border focus:border-blue-500 focus:ring-blue-500"
              placeholder="Describe what happened..."
            />
            {methods.formState.errors.incidentDetails?.description && (
              <p className="mt-1 text-sm text-red-600">
                {methods.formState.errors.incidentDetails.description.message}
              </p>
            )}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Claim amount
            </label>
            <input
              {...methods.register("incidentDetails.claimAmount")}
              className="mt-1 block w-full rounded-md p-2 border-gray-300 border focus:border-blue-500 focus:ring-blue-500"
              placeholder="Optional"
            />
            <label className="block text-sm font-medium text-gray-700">
              Police Report Number
            </label>
            <input
              {...methods.register("incidentDetails.policeReportNumber")}
              className="mt-1 block w-full rounded-md p-2 border-gray-300 border focus:border-blue-500 focus:ring-blue-500"
              placeholder="Optional"
            />
          </div>
        </div>

        {/* Third Party Section */}
        <ThirdPartySection />
        {/* Documents Section */}

        <div className="border-t pt-4">
          <FileUploader
            requiredDocuments={requiredDocuments}
            onUploadComplete={handleUploadComplete}
          />

          {uploadedDocuments.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Uploaded Documents
              </h3>
              <div className="space-y-2">
                {uploadedDocuments.map((doc, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
                  >
                    <div>
                      <span className="font-medium">
                        {doc.originalFileName}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({doc.documentType.replace(/_/g, " ")})
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(index, doc)}
                    >
                      <span className="text-red-500 hover:text-red-700">
                        Remove
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {methods.formState.errors.documents && (
            <p className="mt-2 text-sm text-red-600">
              {methods.formState.errors.documents.message}
            </p>
          )}
        </div>

        <div className="flex justify-end ">
          <button
            style={{ backgroundColor: "blue" }}
            type="submit"
            disabled={isSubmitting}
            className=" text-white mt-4 py-2 px-4  rounded"
          >
            {isSubmitting ? "Submitting..." : "Submit Claim"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ClaimForm;
