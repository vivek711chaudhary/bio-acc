import React from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Send } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold text-primary mb-4">Welcome to BIO/ACC</h1>
        <p className="text-lg text-secondary max-w-2xl mx-auto">
          Explore the intersection of decentralized science (DeSci) and biotechnology with BIO/ACC. Join our movement to accelerate innovation and collaboration.
        </p>
      </header>

      <section className="py-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-primary mb-4">Our Vision</h2>
          <p className="text-secondary mb-6">
            To build a dynamic meme-driven community that attracts public interest and promotes the bio/acc movement, while educating on decentralized science and biotechnology, and exploring synergies with AI and crypto.
          </p>
          <h2 className="text-3xl font-semibold text-primary mb-4">Our Mission</h2>
          <p className="text-secondary">
            Support the bio/acc movement to promote awareness and education in DeSci. Increase public engagement and interest in DeSci initiatives. Act as a traffic aggregator to connect resources and attention to DeSci projects.
          </p>
        </div>
      </section>

      <section className="py-10 bg-secondary/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-primary mb-4">Key Features</h2>
          <ul className="text-secondary list-disc list-inside">
            <li>Community-driven innovation</li>
            <li>Decentralized collaboration</li>
            <li>Integration with AI and crypto</li>
            <li>Educational resources and support</li>
          </ul>
        </div>
      </section>

      <footer className="text-center py-10">
        <div className="flex justify-center mb-4">
          <ModeToggle />
        </div>
        <Button variant="default" size="lg" className="mx-2">
          <a href="/chat" className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Join the Chat
          </a>
        </Button>
        <Button variant="secondary" size="lg" className="mx-2">
          <a href="https://www.bioacc.meme/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Visit BIO/ACC
          </a>
        </Button>
      </footer>
    </div>
  );
} 