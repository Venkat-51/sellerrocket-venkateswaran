import { Rocket } from 'lucide-react';
import { Button } from './ui/button';

export function Hero() {
  const scrollToForm = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative py-20 sm:py-28 lg:py-36">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Icon */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <Rocket className="w-8 h-8 text-primary" />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Skyrocket Your Online Sales
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Expert e-commerce management and development services for Amazon, Shopify, and WordPress
          </p>

          {/* CTA Button */}
          <Button
            size="lg"
            onClick={scrollToForm}
            className="text-base px-8 py-6 h-auto"
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </section>
  );
}
