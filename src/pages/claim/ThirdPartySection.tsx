import { useFormContext } from "react-hook-form";
import type { ClaimFormData } from "./Types";

const ThirdPartySection = () => {
  const {
    register,
    watch,
    formState: { errors },
  } = useFormContext<ClaimFormData>();
  const thirdPartyInvolved = watch("incidentDetails.thirdPartyInvolved");

  return (
    <div className="border-t pt-4 mt-6">
      <h3 className="text-lg font-medium text-gray-900">
        Third Party Involvement
      </h3>

      <div className="mt-4 flex items-center">
        <input
          type="checkbox"
          id="thirdPartyInvolved"
          {...register("incidentDetails.thirdPartyInvolved")}
          className="h-4 w-4  text-blue-600 rounded"
        />
        <label
          htmlFor="thirdPartyInvolved"
          className="ml-2 block text-sm text-gray-900"
        >
          Was a third party involved?
        </label>
      </div>

      {thirdPartyInvolved && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              {...register("incidentDetails.thirdPartyDetails.name")}
              className="mt-1 block w-full p-2 border rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.incidentDetails?.thirdPartyDetails?.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.incidentDetails.thirdPartyDetails.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Contact Info *
            </label>
            <input
              {...register("incidentDetails.thirdPartyDetails.contactInfo")}
              className="mt-1 block w-full rounded-md p-2 border border-gray-300   focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.incidentDetails?.thirdPartyDetails?.contactInfo && (
              <p className="text-red-500 text-sm mt-1">
                {errors.incidentDetails.thirdPartyDetails.contactInfo.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Insurance Info *
            </label>
            <input
              {...register("incidentDetails.thirdPartyDetails.insuranceInfo")}
              className="mt-1 block w-full rounded-md p-2 border border-gray-300   focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.incidentDetails?.thirdPartyDetails?.insuranceInfo && (
              <p className="text-red-500 text-sm mt-1">
                {errors.incidentDetails.thirdPartyDetails.insuranceInfo.message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThirdPartySection;
