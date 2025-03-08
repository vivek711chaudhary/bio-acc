import Chat from './components/Chat';
import { Button } from "@/components/ui/button";
import { GithubIcon, TwitterIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">BIO/ACC Chat Assistant</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the intersection of biotechnology, decentralized science, and the future of human advancement.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button variant="outline" size="sm" asChild>
              <a href="https://www.bioacc.meme/" target="_blank" rel="noopener noreferrer">
                Website
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://x.com/USDesci" target="_blank" rel="noopener noreferrer">
                <TwitterIcon className="w-4 h-4 mr-2" />
                Twitter
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href="https://github.com/Bio-Acc" target="_blank" rel="noopener noreferrer">
                <GithubIcon className="w-4 h-4 mr-2" />
                GitHub
              </a>
            </Button>
          </div>
        </div>

        <Chat />

        <footer className="mt-12 text-center text-gray-600">
          <p className="text-sm">
            Powered by Together AI • Built with Next.js and shadcn/ui
          </p>
        </footer>
      </div>
    </main>
  );
}
