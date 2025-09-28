import { Card } from "react-bootstrap";
import { Link } from "react-router";

export type MonetaryAmount = {
  amount: number;
  currency: string;
};

export type CoverageDetails = {
  coverageType: string;
  description: string;
  coverageLimit: MonetaryAmount;
  deductible: MonetaryAmount;
};

export type Category = {
  id: number;
  name: string;
  description: string;
};

export type PolicyPeriod = {
  effectiveDate: string;
  expirationDate: string;
};

export type ProductTranslation = {
  displayName: string;
  description: string;
};

export type ProductType =
  | "AUTO"
  // | "HEALTH"
  | "LIFE"
  | "PROPERTY";
// | "TRAVEL"
// | "LIABILITY"
// | "PET";

export type InsuraceProduct = {
  id: number;
  productCode: string;
  displayName: string;
  description: string;
  productType: ProductType;
  basePremium?: MonetaryAmount;
  coverageDetails: CoverageDetails[];
  eligibilityRules: { [key: string]: string };
  targetAudience: string[];
  regions: string[];
  category: Category;
  validityPeriod: PolicyPeriod;
  allowedClaimTypes: string[];
  translation: { [locale: string]: ProductTranslation };
};

interface Props {
  policies?: InsuraceProduct[];
}

const InsuranceCardComponent = ({ policies = [] }: Props) => {
  console.log("Policies in insuraceprodctcard" + policies);

  return (
    <div className="d-flex flex-wrap gap-3 justify-content-center">
      {policies &&
        policies.map((card) => {
          return (
            <Link
              key={card.id}
              to={`/products/${card.id}`}
              style={{ cursor: "pointer", textDecoration: "none" }}
              className="card-link"
            >
              <Card
                bg="primary"
                text={"secondary".toLowerCase() === "light" ? "dark" : "white"}
                style={{ maxWidth: "20rem" }}
                className="mb-2 h-100 d-flex flex-column  "
              >
                <Card.Header className="text-lg">
                  {card.displayName}
                </Card.Header>
                <Card.Body>
                  <Card.Text>{card.description}</Card.Text>
                </Card.Body>
                <div className="flex  align-bottom justify-around gap-1.5 h-10  ">
                  {card.targetAudience &&
                    card.targetAudience.map((audience, index) => {
                      return (
                        <div key={index} className=" text-white ">
                          <Card.Text>{audience} </Card.Text>
                        </div>
                      );
                    })}
                </div>
              </Card>
            </Link>
          );
        })}
    </div>
  );
};

export default InsuranceCardComponent;
