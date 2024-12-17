import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="bg-white border-t">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Ready to Get Started?</h2>
            <p className="mt-4 text-lg text-gray-600">
              Join thousands of satisfied customers today
            </p>
            <Button size="lg" className="mt-8">
              Start Free Trial
            </Button>
          </div>

          <div className="mt-12 border-t pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="text-xl font-bold text-primary">SaaSLogo</span>
                <span className="text-gray-500">&copy; 2024 All rights reserved.</span>
              </div>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-600 hover:text-gray-900">Terms</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Privacy</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};