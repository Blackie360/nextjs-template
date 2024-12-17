import { CheckCircle, Zap, Shield, BarChart } from "lucide-react";

const features = [
  {
    name: "Lightning Fast",
    description: "Experience blazing-fast performance with our optimized platform.",
    icon: Zap,
  },
  {
    name: "Secure by Design",
    description: "Enterprise-grade security to protect your valuable data.",
    icon: Shield,
  },
  {
    name: "Advanced Analytics",
    description: "Gain deep insights with our powerful analytics tools.",
    icon: BarChart,
  },
  {
    name: "99.9% Uptime",
    description: "Rely on our highly available infrastructure.",
    icon: CheckCircle,
  },
];

export const Features = () => {
  return (
    <div id="features" className="py-24 bg-secondary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Features that Set Us Apart
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Everything you need to succeed, in one powerful platform
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <div key={feature.name} className="relative animate-fade-up">
              <div className="absolute flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
                <feature.icon className="h-6 w-6" />
              </div>
              <div className="ml-16">
                <h3 className="text-xl font-medium text-gray-900">{feature.name}</h3>
                <p className="mt-2 text-base text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};