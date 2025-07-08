import { Card } from "react-bootstrap";
import { Link } from "react-router";

export interface InsuracePolicy {
  id: number;
  title: string;
  description: string;
  targetAudience: string[];
  region: string[];
  category: {
    id: number;
    name: string;
  };
}

interface Props {
  policies?: InsuracePolicy[];
}

const InsuranceCardComponent = ({ policies = [] }: Props) => {
  return (
    <div className="d-flex flex-wrap gap-3 justify-content-center">
      {policies &&
        policies.map((card) => {
          return (
            <Link
              key={card.id}
              to={`/policies/${card.id}`}
              style={{ cursor: "pointer", textDecoration: "none" }}
              className="card-link"
            >
              <Card
                bg="primary"
                text={"secondary".toLowerCase() === "light" ? "dark" : "white"}
                style={{ width: "18rem" }}
                className="mb-2 h-100 d-flex flex-column  "
              >
                <Card.Header className="fw-bold">{card.title}</Card.Header>
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
