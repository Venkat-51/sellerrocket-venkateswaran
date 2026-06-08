import { Mail, Phone } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Name */}
          <div>
            <h3 className="text-lg font-bold mb-4">Seller Rocket</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted partner for e-commerce success
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <a
                href="mailto:hello@sellerrocket.com"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />
                hello@sellerrocket.com
              </a>
              <a
                href="tel:+919876543210"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="w-4 h-4" />
                +91 98765 43210
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <button
                onClick={() => {
                  const element = document.getElementById('services');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Services
              </button>
              <button
                onClick={() => {
                  const element = document.getElementById('contact');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Contact
              </button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Seller Rocket. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
