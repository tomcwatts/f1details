import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Flag, 
  Github, 
  Twitter, 
  Mail,
  Heart
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card/50 border-t border-border/40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="f1-gradient rounded-lg p-2">
                <Flag className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold f1-text-glow">F1 Insights</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your ultimate destination for Formula 1 race data, insights, and real-time timing information.
            </p>
            <div className="flex space-x-4">
              <Button size="sm" variant="ghost">
                <Github className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="ghost">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#races" className="text-muted-foreground hover:text-primary transition-colors">
                  Race Calendar
                </a>
              </li>
              <li>
                <a href="#drivers" className="text-muted-foreground hover:text-primary transition-colors">
                  Driver Standings
                </a>
              </li>
              <li>
                <a href="#teams" className="text-muted-foreground hover:text-primary transition-colors">
                  Constructor Standings
                </a>
              </li>
              <li>
                <a href="#circuits" className="text-muted-foreground hover:text-primary transition-colors">
                  Circuit Guide
                </a>
              </li>
              <li>
                <a href="#live" className="text-muted-foreground hover:text-primary transition-colors">
                  Live Timing
                </a>
              </li>
            </ul>
          </div>

          {/* Data Sources */}
          <div className="space-y-4">
            <h3 className="font-semibold">Data & Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="https://openf1.org" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  OpenF1 API
                </a>
              </li>
              <li>
                <a href="https://formula1.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  Official F1 Website
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Data Sources
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Get the latest F1 news and race updates delivered to your inbox.
            </p>
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-background/50"
              />
              <Button className="w-full f1-gradient text-white border-0 hover:opacity-90">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="text-sm text-muted-foreground">
              © {currentYear} F1 Insights. Built with{' '}
              <Heart className="inline h-4 w-4 text-red-500" />{' '}
              for Formula 1 fans.
            </div>
            <div className="text-sm text-muted-foreground">
              Data provided by OpenF1 API • Not affiliated with Formula 1
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

