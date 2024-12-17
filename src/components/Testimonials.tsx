import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote: "This platform has completely transformed how we operate. The efficiency gains are remarkable.",
    author: "Sarah Johnson",
    role: "CEO, TechCorp",
  },
  {
    quote: "The best investment we've made for our business. Customer support is outstanding.",
    author: "Michael Chen",
    role: "CTO, StartupX",
  },
  {
    quote: "Intuitive interface, powerful features. It's everything we needed and more.",
    author: "Emily Rodriguez",
    role: "Operations Director, ScaleUp",
  },
];

export const Testimonials = () => {
  return (
    <div id="testimonials" className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by Industry Leaders
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Don't just take our word for it
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="animate-fade-up">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  <p className="text-lg text-gray-600 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};