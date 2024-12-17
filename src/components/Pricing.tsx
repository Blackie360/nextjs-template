import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Starter",
    price: "$29",
    features: ["Up to 5 users", "Basic analytics", "24/7 support", "1 project"],
  },
  {
    name: "Professional",
    price: "$99",
    features: ["Up to 20 users", "Advanced analytics", "Priority support", "10 projects"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    features: ["Unlimited users", "Custom analytics", "Dedicated support", "Unlimited projects"],
  },
];

export const Pricing = () => {
  return (
    <div id="pricing" className="py-24 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Choose the plan that's right for you
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card key={plan.name} className="animate-fade-up">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                <p className="text-4xl font-bold mt-4">{plan.price}</p>
                <p className="text-gray-600 mt-2">per month</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-8">Get Started</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};