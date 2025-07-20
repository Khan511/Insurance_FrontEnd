interface PremiumCalculatorProps {
  productType: string;
  calculationConfig: any;
  basePremium?: number;
  onCalculate: (premium: number) => void;
}

const PremiumCaculator = ({
  productType,
  calculationConfig,
  basePremium,
  onCalculate,
}: PremiumCalculatorProps) => {
  const renderInputs = () => {
    switch (productType) {
      case "LIFE":
        return (
          <>
            <div>
              <label className="form-label">Insured age</label>

              <input
                type="number"
                name="insuredAge"
                className="form-control"
                min="18"
                max="65"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Health Risk Level(1-10)</label>
              <input
                type="number"
                name="riskLevel"
                className="form-control"
                min="1"
                max="10"
              />
            </div>
          </>
        );
      case "PROPERTY":
        return (
          <>
            <div className="mb-3">
              <label className="form-label">Location Risk Zone (1-10)</label>
              <input
                type="number"
                name="riskZone"
                className="form-control"
                // onChange={handleInputChange}
                min="1"
                max="10"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Home Value (DKK)</label>
              <input
                type="number"
                name="homeValue"
                className="form-control"
                // onChange={handleInputChange}
                min="100000"
                step="10000"
              />
            </div>
          </>
        );
      case "AUTO":
        return (
          <>
            <div className="mb-3">
              <label className="form-label">Driver Age</label>
              <input
                type="number"
                name="driverAge"
                className="form-control"
                // onChange={handleInputChange}
                min="18"
                max="70"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Vehicle Value (DKK)</label>
              <input
                type="number"
                name="vehicleValue"
                className="form-control"
                // onChange={handleInputChange}
                min="10000"
                step="1000"
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };
  return (
    <div className="mt-4 p-4 border  rounded bg-white">
      <h5>Calculate Your Premium</h5>
      <form>
        {renderInputs()}
        <button type="button" className="btn btn-secondary mt-2">
          Calculate
        </button>
      </form>
    </div>
  );
};

export default PremiumCaculator;
