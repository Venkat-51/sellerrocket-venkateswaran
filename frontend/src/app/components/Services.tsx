import { ShoppingCart, Store, Globe } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from './ui/card';

const services = [
  {
    icon: ShoppingCart,
    title: 'Amazon Management',
    description: 'Complete Amazon store setup, optimization, and management. We handle listings, PPC campaigns, inventory, and customer service to maximize your sales.',
  },
  {
    icon: Store,
    title: 'Shopify Store Setup',
    description: 'Custom Shopify store design and development. From theme customization to app integration, we build beautiful stores that convert visitors into customers.',
  },
  {
    icon: Globe,
    title: 'WordPress Development',
    description: 'Professional WordPress website development and e-commerce solutions. We create fast, secure, and SEO-optimized sites tailored to your business needs.',
  },
];

export function Services() {
  return (
    <section id="services" className="py-20 sm:py-28 bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
            Our Services
          </h2>
          <p className="text-lg text-muted-foreground">
            Comprehensive e-commerce solutions to grow your business
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.title} className="relative hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mb-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
