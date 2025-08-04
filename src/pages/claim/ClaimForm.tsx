import { useState } from "react";
import { useForm, FormProvider, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// import { claimFormSchema, type ClaimFormData } from "./Types";
import { claimFormSchema } from "./validation";

import {
  CLAIM_DOCUMENT_TYPES,
  INCIDENT_TYPES,
  type ClaimFormData,
} from "./Types";

import AddressSection from "./AddressSectioin";
import ThirdPartySection from "./ThirdPartySection";

const ClaimForm = () => {
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const methods = useForm<ClaimFormData>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: {
      policyNumber: "",
      claimType: CLAIM_DOCUMENT_TYPES.AUTOMOBILE_COLLISION,
      incidentDetails: {
        incidentDateTime: new Date().toISOString().slice(0, 16),
        type: INCIDENT_TYPES.ACCIDENT,
        thirdPartyInvolved: false,
        location: {
          street: "",
          city: "",
          state: "",
          postalCode: "",
          country: "",
        },
        description: "",
      },
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit: SubmitHandler<ClaimFormData> = async (data) => {
    try {
      // API call would go here
      console.log("Submitting claim:", data);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  if (submitSuccess) {
    return (
      <div className="p-6 bg-green-50 rounded-lg">
        <h2 className="text-2xl font-bold text-green-800">Claim Submitted!</h2>
        <p className="mt-2 text-green-600">
          Your claim has been received (Reference #:
          {Math.floor(Math.random() * 1000000)})
        </p>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 mb-5 p-5 bg-white rounded-lg shadow-md container"
      >
        <p className="text-2xl text-blue-500 font-bold mb-4 ">
          Report New Claim
        </p>

        {/* Policy Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Policy Number *
            </label>
            <input
              {...methods.register("policyNumber")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="POL-123456"
            />
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              {Object.values(CLAIM_DOCUMENT_TYPES).map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, " ")}
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Incident Type *
              </label>
              <select
                {...methods.register("incidentDetails.type")}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                {Object.values(INCIDENT_TYPES).map((type) => (
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
              Police Report Number
            </label>
            <input
              {...methods.register("incidentDetails.policeReportNumber")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Optional"
            />
          </div>
        </div>

        {/* Third Party Section */}
        <ThirdPartySection />

        <div className="flex justify-end ">
          <button
            style={{ backgroundColor: "blue" }}
            type="submit"
            disabled={isSubmitting}
            className=" text-white mt-4 py-2 px-4 rounded rounded-md"
          >
            {isSubmitting ? "Submitting..." : "Submit Claim"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

export default ClaimForm;
