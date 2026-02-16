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
import {
  Shield,
  AlertCircle,
  CheckCircle,
  Upload,
  FileText,
  Calendar,
  MessageSquare,
  DollarSign,
  User,
  Camera,
  Clock,
  ArrowRight,
  Sparkles,
  X,
  Loader2,
  FileCheck,
  Receipt,
} from "lucide-react";
import "./ClaimForm.css";

interface Policy {
  policyNumber: string;
  status: string;
  displayName?: string;
}

const ClaimForm = () => {
  const { data: claimTypes } = useGetClaimTypesQuery();
  const [selectedClaimType, setSelectedClaimType] = useState("");
  const [policyNumbers, setPolicyNumbers] = useState<string[]>([]);
  const [policyDetails, setPolicyDetails] = useState<Policy[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { data: currentUser } = useGetCurrenttUserQuery();
  const [submitClaim] = useSubmitClaimMutation();
  const [uploadedDocuments, setUploadedDocuments] = useState<
    DocumentAttachment[]
  >([]);
  const [deleteFile] = useDeleteFileMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const { data: incidentTypes = [] } = useGetIncidentTypesQuery(
    selectedClaimType,
    {
      skip: !selectedClaimType,
    },
  );

  const { data: requiredDocuments = [] } = useGetRequiredDocumentsQuery(
    selectedClaimType,
    {
      skip: !selectedClaimType,
    },
  );

  const { data: allPoliciesOfUser } = useGetAllPoliciesOfUserQuery(
    currentUser?.data?.user?.userId || "",
    {
      skip: !currentUser?.data?.user?.userId,
    },
  );

  useEffect(() => {
    if (allPoliciesOfUser) {
      // Filter policies based on status
      const activePolicies = allPoliciesOfUser.filter(
        (policy: Policy) =>
          policy.status !== "EXPIRED" &&
          policy.status !== "CANCELLED" &&
          policy.status !== "INACTIVE",
      );

      setPolicyDetails(activePolicies);

      // Extract policy numbers from filtered policies
      const filteredPolicyNumbers = activePolicies.map(
        (policy: Policy) => policy.policyNumber,
      );

      // If no active policies, show a message or handle accordingly
      if (filteredPolicyNumbers.length === 0) {
        setPolicyNumbers(["No active policies available"]);
      } else {
        setPolicyNumbers(["Choose Your Policy", ...filteredPolicyNumbers]);
      }
    }
  }, [allPoliciesOfUser]);

  const methods = useForm<ClaimFormData>({
    resolver: zodResolver(claimFormSchema),
    defaultValues: {
      policyNumber: policyNumbers.length > 0 ? policyNumbers[0] : "",
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
  const thirdPartyInvolved = methods.watch(
    "incidentDetails.thirdPartyInvolved",
  );

  useEffect(() => {
    if (claimType) setSelectedClaimType(claimType);
  }, [claimType]);

  const {
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = methods;

  // Reset form when policy numbers change (optional)
  useEffect(() => {
    if (policyNumbers.length > 0) {
      reset({
        ...methods.getValues(),
        policyNumber: policyNumbers[0],
      });
    }
  }, [policyNumbers, reset]);

  const onSubmit: SubmitHandler<ClaimFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      // const response = await submitClaim(data).unwrap();
      await submitClaim(data).unwrap();
      setSubmitSuccess(true);
      setCurrentStep(5);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
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
    document: DocumentAttachment,
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
          "You don't have permission to delete this file. Please check your AWS permissions.",
        );
      } else {
        alert("Failed to delete file. Please try again.");
      }
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (submitSuccess) {
    return (
      <div className="claim-success-container">
        <div className="claim-success-card">
          <div className="success-animation">
            <CheckCircle className="success-icon" />
            <div className="success-ring"></div>
          </div>
          <h2 className="success-title">Claim Submitted Successfully!</h2>
          <p className="success-message">
            Your claim has been submitted and is being processed. You'll receive
            a confirmation email with your claim number shortly.
          </p>
          <div className="success-details">
            <div className="success-detail">
              <Clock className="w-5 h-5" />
              <span>Average processing time: 24-48 hours</span>
            </div>
            <div className="success-detail">
              <MessageSquare className="w-5 h-5" />
              <span>We'll contact you if we need additional information</span>
            </div>
          </div>
          <button
            onClick={() => (window.location.href = "/my-page/claims")}
            className="success-button"
          >
            <span>View My Claims</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // If no active policies, show a message
  if (
    policyNumbers.length === 1 &&
    policyNumbers[0] === "No active policies available"
  ) {
    return (
      <div className="claim-form-container">
        <div className="claim-form-header">
          <div className="header-badge">
            <Shield className="w-5 h-5" />
            <span>Report New Claim</span>
          </div>
          <h1 className="header-title">File Insurance Claim</h1>
        </div>

        <div className="no-policies-card">
          <div className="no-policies-icon">
            <AlertCircle className="w-12 h-12" />
          </div>
          <h3 className="no-policies-title">No Active Policies Found</h3>
          <p className="no-policies-description">
            You don't have any active policies. Claims can only be submitted for
            policies that are:
          </p>
          <div className="policy-status-list">
            <div className="policy-status-item valid">
              <CheckCircle className="w-5 h-5" />
              <span>Active</span>
            </div>
            <div className="policy-status-item valid">
              <CheckCircle className="w-5 h-5" />
              <span>Pending</span>
            </div>
            <div className="policy-status-item invalid">
              <X className="w-5 h-5" />
              <span>Expired</span>
            </div>
            <div className="policy-status-item invalid">
              <X className="w-5 h-5" />
              <span>Cancelled</span>
            </div>
            <div className="policy-status-item invalid">
              <X className="w-5 h-5" />
              <span>Inactive</span>
            </div>
          </div>
          <p className="no-policies-note">
            Please contact support if you believe this is an error or to
            activate a new policy.
          </p>
          <button className="contact-support-btn">
            <MessageSquare className="w-5 h-5" />
            <span>Contact Support</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="claim-form-container">
      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        <div className="progress-steps">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`progress-step ${currentStep >= step ? "active" : ""}`}
            >
              <div className="step-number">{step}</div>
              <div className="step-label">
                {step === 1 && "Policy"}
                {step === 2 && "Incident"}
                {step === 3 && "Details"}
                {step === 4 && "Documents"}
                {step === 5 && "Review"}
              </div>
            </div>
          ))}
        </div>
      </div>

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="claim-form">
          {/* Form Header */}
          <div className="claim-form-header">
            <div className="header-badge">
              <Sparkles className="w-5 h-5" />
              <span>Report New Claim</span>
            </div>
            <h1 className="header-title">File Insurance Claim</h1>
            <p className="header-description">
              Complete this form to report your claim. Our team will review it
              and get back to you promptly.
            </p>
          </div>

          {/* Step 1: Policy Information */}
          {currentStep === 1 && (
            <div className="form-step">
              <div className="step-header">
                <div className="step-icon">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="step-title">Policy Information</h2>
                  <p className="step-subtitle">
                    Select the policy you're claiming against
                  </p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <Shield className="label-icon" />
                    Policy Number *
                  </label>
                  <div className="select-wrapper">
                    <select
                      {...methods.register("policyNumber")}
                      className="form-select"
                      disabled={policyNumbers.length <= 1}
                    >
                      {policyNumbers.map((policyNumber, index) => (
                        <option
                          key={index}
                          value={
                            index === 0 && policyNumber === "Choose Your Policy"
                              ? ""
                              : policyNumber
                          }
                          disabled={index === 0}
                        >
                          {policyNumber}
                        </option>
                      ))}
                    </select>
                    <div className="select-arrow">
                      {/* <ArrowRight className="w-4 h-4 rotate-90" /> */}
                    </div>
                  </div>
                  {errors.policyNumber && (
                    <p className="form-error">
                      <AlertCircle className="w-4 h-4" />
                      {errors.policyNumber.message}
                    </p>
                  )}
                  <p className="form-hint">
                    Only active policies are shown (not EXPIRED, CANCELLED, or
                    INACTIVE)
                  </p>

                  {/* Policy Details Preview */}
                  {policyDetails.length > 0 &&
                    methods.watch("policyNumber") &&
                    methods.watch("policyNumber") !== "Choose Your Policy" && (
                      <div className="policy-preview">
                        <div className="policy-preview-header">
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <span>Active Policy Selected</span>
                        </div>
                        {policyDetails
                          .filter(
                            (p) =>
                              p.policyNumber === methods.watch("policyNumber"),
                          )
                          .map((policy) => (
                            <div
                              key={policy.policyNumber}
                              className="policy-details"
                            >
                              <div className="policy-detail">
                                <span className="detail-label">
                                  Policy Number:
                                </span>
                                <span className="detail-value">
                                  {policy.policyNumber}
                                </span>
                              </div>
                              {policy.displayName && (
                                <div className="policy-detail">
                                  <span className="detail-label">
                                    Policy Type:
                                  </span>
                                  <span className="detail-value">
                                    {policy.displayName}
                                  </span>
                                </div>
                              )}
                              <div className="policy-detail">
                                <span className="detail-label">Status:</span>
                                <span className="detail-value status-active">
                                  {policy.status}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <AlertCircle className="label-icon" />
                    Claim Type *
                  </label>
                  <div className="select-wrapper">
                    <select
                      {...methods.register("claimType")}
                      className="form-select"
                    >
                      <option value="">Select claim type</option>
                      {claimTypes?.map((type, index) => (
                        <option key={index} value={type.type}>
                          {type.type}
                        </option>
                      ))}
                    </select>
                    <div className="select-arrow">
                      {/* <ArrowRight className="w-4 h-4 rotate-90" /> */}
                    </div>
                  </div>
                  {errors.claimType && (
                    <p className="form-error">
                      <AlertCircle className="w-4 h-4" />
                      {errors.claimType.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="step-navigation">
                <button
                  type="button"
                  onClick={nextStep}
                  className="next-button"
                  disabled={
                    !methods.watch("policyNumber") ||
                    !methods.watch("claimType")
                  }
                >
                  <span>Continue to Incident Details</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Incident Details */}
          {currentStep === 2 && (
            <div className="form-step">
              <div className="step-header">
                <div className="step-icon">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="step-title">Incident Details</h2>
                  <p className="step-subtitle">Tell us what happened</p>
                </div>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <Calendar className="label-icon" />
                    Incident Date & Time *
                  </label>
                  <div className="input-with-icon">
                    <Calendar className="input-icon " />
                    <input
                      type="datetime-local"
                      {...methods.register("incidentDetails.incidentDateTime")}
                      className="form-input px-5"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FileText className="label-icon" />
                    Incident Type *
                  </label>
                  <div className="select-wrapper">
                    <select
                      {...methods.register("incidentDetails.type")}
                      className="form-select"
                    >
                      <option value="">Select incident type</option>
                      {incidentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                    <div className="select-arrow">
                      <ArrowRight className="w-4 h-4 rotate-90" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Component */}
              <AddressSection />

              <div className="form-group">
                <label className="form-label">
                  <MessageSquare className="label-icon" />
                  Description *
                </label>
                <div className="textarea-wrapper">
                  <textarea
                    {...methods.register("incidentDetails.description")}
                    rows={4}
                    className="form-textarea"
                    placeholder="Please describe what happened in detail..."
                  />
                  <div className="textarea-footer">
                    <span className="char-count">
                      Be as detailed as possible for faster processing
                    </span>
                  </div>
                </div>
                {errors.incidentDetails?.description && (
                  <p className="form-error">
                    <AlertCircle className="w-4 h-4" />
                    {errors.incidentDetails.description.message}
                  </p>
                )}
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <DollarSign className="label-icon" />
                    Estimated Claim Amount
                  </label>
                  <div className="input-with-icon ">
                    {/* <DollarSign className="input-icon" /> */}
                    <p className="input-icon">DKK</p>
                    <input
                      {...methods.register("incidentDetails.claimAmount")}
                      className="form-input px-5"
                      placeholder="0.00"
                      type="number"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <p className="form-hint">
                    Optional - Estimated amount of your claim
                  </p>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <FileText className="label-icon" />
                    Police Report Number
                  </label>
                  <input
                    {...methods.register("incidentDetails.policeReportNumber")}
                    className="form-input"
                    placeholder="If applicable"
                  />
                </div>
              </div>

              <div className="step-navigation">
                <button
                  type="button"
                  onClick={prevStep}
                  className="back-button"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="next-button"
                  disabled={!methods.watch("incidentDetails.description")}
                >
                  <span>Continue to Third Party</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Third Party Section */}
          {currentStep === 3 && (
            <div className="form-step">
              <div className="step-header">
                <div className="step-icon">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="step-title">Third Party Information</h2>
                  <p className="step-subtitle">
                    {thirdPartyInvolved
                      ? "Provide details about the third party involved"
                      : "Was anyone else involved in the incident?"}
                  </p>
                </div>
              </div>

              <ThirdPartySection />

              <div className="step-navigation">
                <button
                  type="button"
                  onClick={prevStep}
                  className="back-button"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="next-button"
                >
                  <span>Continue to Documents</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Documents */}
          {currentStep === 4 && (
            <div className="form-step">
              <div className="step-header">
                <div className="step-icon">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="step-title">Supporting Documents</h2>
                  <p className="step-subtitle">
                    Upload required documents to support your claim
                    {requiredDocuments.length > 0 &&
                      ` (${requiredDocuments.length} required)`}
                  </p>
                </div>
              </div>

              <FileUploader
                requiredDocuments={requiredDocuments}
                onUploadComplete={handleUploadComplete}
              />

              {uploadedDocuments.length > 0 && (
                <div className="uploaded-documents">
                  <h3 className="documents-title">
                    <FileCheck className="w-5 h-5" />
                    Uploaded Documents ({uploadedDocuments.length})
                  </h3>
                  <div className="documents-grid">
                    {uploadedDocuments.map((doc, index) => (
                      <div key={index} className="document-card">
                        <div className="document-icon">
                          {doc.documentType.includes("image") ? (
                            <Camera className="w-5 h-5" />
                          ) : (
                            <FileText className="w-5 h-5" />
                          )}
                        </div>
                        <div className="document-info">
                          <span className="document-name">
                            {doc.originalFileName}
                          </span>
                          <span className="document-type">
                            {doc.documentType.replace(/_/g, " ")}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeDocument(index, doc)}
                          className="remove-document-btn"
                          title="Remove document"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {errors.documents && (
                <div className="documents-error">
                  <AlertCircle className="w-5 h-5" />
                  <p>{errors.documents.message}</p>
                </div>
              )}

              <div className="step-navigation">
                <button
                  type="button"
                  onClick={prevStep}
                  className="back-button"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                  <span>Back</span>
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="next-button"
                >
                  <span>Review & Submit</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Review & Submit */}
          {currentStep === 5 && (
            <div className="form-step">
              <div className="step-header">
                <div className="step-icon">
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="step-title">Review & Submit</h2>
                  <p className="step-subtitle">
                    Please review all information before submitting
                  </p>
                </div>
              </div>

              <div className="review-section">
                <div className="review-card">
                  <h3 className="review-card-title">Policy Information</h3>
                  <div className="review-details">
                    <div className="review-detail">
                      <span className="detail-label">Policy Number:</span>
                      <span className="detail-value">
                        {watch("policyNumber")}
                      </span>
                    </div>
                    <div className="review-detail">
                      <span className="detail-label">Claim Type:</span>
                      <span className="detail-value">{watch("claimType")}</span>
                    </div>
                  </div>
                </div>

                <div className="review-card">
                  <h3 className="review-card-title">Incident Details</h3>
                  <div className="review-details">
                    <div className="review-detail">
                      <span className="detail-label">Date & Time:</span>
                      <span className="detail-value">
                        {new Date(
                          watch("incidentDetails.incidentDateTime"),
                        ).toLocaleString()}
                      </span>
                    </div>
                    <div className="review-detail">
                      <span className="detail-label">Incident Type:</span>
                      <span className="detail-value">
                        {watch("incidentDetails.type")}
                      </span>
                    </div>
                    <div className="review-detail">
                      <span className="detail-label">Description:</span>
                      <span className="detail-value truncated">
                        {watch("incidentDetails.description")}
                      </span>
                    </div>
                    {watch("incidentDetails.claimAmount") && (
                      <div className="review-detail">
                        <span className="detail-label">Claim Amount:</span>
                        <span className="detail-value">
                          $
                          {Number(
                            watch("incidentDetails.claimAmount"),
                          ).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {uploadedDocuments.length > 0 && (
                  <div className="review-card">
                    <h3 className="review-card-title">Documents</h3>
                    <div className="review-documents">
                      {uploadedDocuments.map((doc, index) => (
                        <div key={index} className="review-document">
                          <FileText className="w-4 h-4" />
                          <span>{doc.originalFileName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="confirmation-checkbox">
                <input type="checkbox" id="confirm-info" required />
                <label htmlFor="confirm-info">
                  I confirm that all information provided is accurate to the
                  best of my knowledge
                </label>
              </div>

              <div className="step-navigation">
                <button
                  type="button"
                  onClick={prevStep}
                  className="back-button"
                >
                  <ArrowRight className="w-5 h-5 rotate-180" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-button"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Claim</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  );
};

export default ClaimForm;
