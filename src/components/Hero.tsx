import { Button } from "@/components/ui/button";

export const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white pt-16">
      <div className="relative pt-16 pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center animate-fade-up">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Transform Your Business with Our SaaS Solution
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Streamline your workflow, boost productivity, and scale your business with our powerful platform.
              Join thousands of satisfied customers who have already transformed their operations.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Button size="lg" className="text-lg">
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg" className="text-lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};