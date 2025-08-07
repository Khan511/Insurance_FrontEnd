import { useFormContext } from "react-hook-form";
import type { ClaimFormData } from "./Types";

const AddressSection = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ClaimFormData>();

  return (
    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Street *
        </label>
        <input
          {...register("incidentDetails.location.street")}
          className="mt-1 block w-full p-2 border rounded-md border-gray-300   focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.incidentDetails?.location?.street && (
          <p className="text-red-500 text-sm mt-1">
            {errors.incidentDetails.location.street.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          City *
        </label>
        <input
          {...register("incidentDetails.location.city")}
          className="mt-1 block w-full p-2 rounded-md border border-gray-300   focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.incidentDetails?.location?.city && (
          <p className="text-red-500 text-sm mt-1">
            {errors.incidentDetails.location.city.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Postal Code *
        </label>
        <input
          {...register("incidentDetails.location.postalCode")}
          className="mt-1 block w-full rounded-md p-2 border-gray-300 border focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.incidentDetails?.location?.postalCode && (
          <p className="text-red-500 text-sm mt-1">
            {errors.incidentDetails.location.postalCode.message}
          </p>
        )}
      </div>

      <div className=" ">
        <label className="block text-sm font-medium text-gray-700">
          Country *
        </label>
        <input
          {...register("incidentDetails.location.country")}
          className="mt-1 block w-full rounded-md p-2 border-gray-300 border focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.incidentDetails?.location?.country && (
          <p className="text-red-500 text-sm mt-1">
            {errors.incidentDetails.location.country.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AddressSection;
