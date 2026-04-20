export interface Policy {
  _id?: string;
  policyName: string;
  premium: number;
  coverageAmount: number;
  duration: string;
  eligibility: string;
  benefits: string[];
  createdAt?: string;
  updatedAt?: string;
}
