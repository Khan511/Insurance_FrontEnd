// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Carousel,
//   CarouselContent,
//   CarouselItem,
//   CarouselNext,
//   CarouselPrevious,
// } from "@/components/ui/carousel";
// import { CardTitle } from "react-bootstrap";
// import { Link } from "react-router";

// export interface InsuracePolicy {
//   id: number;
//   title: string;
//   description: string;
//   targetAudience: string[];
//   region: string[];
//   category: {
//     id: number;
//     name: string;
//   };
// }

// interface Props {
//   policy?: InsuracePolicy;
// }
// export function InsuraceCardCarousel({ policy }: Props) {
//   return (
//     <Carousel
//       opts={{
//         align: "start",
//       }}
//       className="w-full max-w-sm"
//     >
//       <CarouselContent>
//         <Link to="/">
//           <CarouselItem
//             key={policy?.id}
//             className="pl-3 md:basis-1/2 lg:basis-1/3"
//           >
//             <div className="p-1">
//               <Card>
//                 <CardTitle>{policy?.title} </CardTitle>
//                 <CardContent className="flex aspect-square items-center justify-center p-6">
//                   <span className="">{policy?.description}</span>
//                 </CardContent>
//               </Card>
//             </div>
//           </CarouselItem>
//         </Link>
//       </CarouselContent>
//       <CarouselPrevious />
//       <CarouselNext />
//     </Carousel>
//   );
// }

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CardTitle } from "react-bootstrap";
import { Link } from "react-router-dom"; // Correct package
import Autoplay from "embla-carousel-autoplay";

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
  | "HEALTH"
  | "LIFE"
  | "PROPERTY"
  | "TRAVEL"
  | "LIABILITY"
  | "PET";

export type InsuraceProduct = {
  id: number;
  productCode: string;
  displayName: string;
  description: string;
  productType: ProductType;
  basePremium: MonetaryAmount;
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
  policies: InsuraceProduct[];
}

export function InsuranceCardCarousel({ policies }: Props) {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[Autoplay({ delay: 3000, stopOnInteraction: false })]}
      className="w-full max-w-7xl mx-auto "
    >
      <CarouselContent>
        {policies.map((policy) => (
          <CarouselItem
            key={policy.id}
            className="pl-3 basis-1/1 sm:basis-1/2 md:basis-1/3"
          >
            <Link to={`/policies/${policy.id}`}>
              <div className="m-1 transition-shadow hover:shadow-xl rounded-2xl hover:shadow-gray-800">
                <Card className="flex justify-around p-2 h-80 text-white bg-blue-600">
                  <CardTitle className="text-md px-2 pt-3">
                    {policy.displayName}
                  </CardTitle>
                  <CardContent className="flex flex-col items-center justify-between gap-5 p-6">
                    <span>{policy.description}</span>
                    <div className="flex  align-bottom align-center justify-around w-full  gap-1.5 h-10  ">
                      {policy?.targetAudience &&
                        policy?.targetAudience.map((audience, index) => {
                          return <div key={index}>{audience}</div>;
                        })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
