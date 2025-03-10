'use client';

import React from 'react';
import Chat from '../components/Chat';
import { Button } from "@/components/ui/button";
import { GithubIcon, TwitterIcon, Send, Globe, BookOpen, ChevronRight, ArrowRight, Beaker, Brain, Network, Users } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-emerald-50">
      {/* Hero Section */}
      <header className="relative overflow-hidden pt-20 pb-16 px-6 md:px-10 lg:px-16">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-block mb-6 px-6 py-2 bg-emerald-100 rounded-full">
              <span className="text-emerald-700 font-semibold text-sm">Building the future of decentralized science</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
              Welcome to <span className="bg-gradient-to-r from-emerald-600 to-blue-500 bg-clip-text text-transparent">BIO/ACC</span>
            </h1>
            <p className="text-xl text-gray-700 max-w-2xl mx-auto mb-10 leading-relaxed">
              Explore the intersection of decentralized science (DeSci) and biotechnology with BIO/ACC. Join our movement to accelerate innovation and collaboration.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Button size="lg" className="group px-6 bg-emerald-600 hover:bg-emerald-700 text-white">
                <a href="/chat" className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Join the Chat
                  <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="px-6 border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                <a href="https://www.bioacc.meme/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Visit BIO/ACC
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Vision & Mission Section */}
      <section className="py-20 px-6 md:px-10 lg:px-16 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <div className="p-8 rounded-2xl bg-white border border-emerald-200 shadow">
              <div className="mb-4 p-3 bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center">
                <Brain className="text-emerald-600 h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold text-emerald-600 mb-4">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                To build a dynamic meme-driven community that attracts public interest and promotes the bio/acc movement, while educating on decentralized science and biotechnology, and exploring synergies with AI and crypto.
              </p>
            </div>
            <div className="p-8 rounded-2xl bg-white border border-emerald-200 shadow">
              <div className="mb-4 p-3 bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center">
                <Network className="text-emerald-600 h-6 w-6" />
              </div>
              <h2 className="text-3xl font-bold text-emerald-600 mb-4">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                Support the bio/acc movement to promote awareness and education in DeSci. Increase public engagement and interest in DeSci initiatives. Act as a traffic aggregator to connect resources and attention to DeSci projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 md:px-10 lg:px-16 bg-emerald-50">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <div className="inline-block mb-4 px-6 py-2 bg-emerald-100 rounded-full">
            <span className="text-emerald-700 font-semibold text-sm">Accelerating Biotechnology</span>
          </div>
          <h2 className="text-4xl font-bold text-emerald-700">Key Features</h2>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <div className="p-6 rounded-xl bg-white border border-emerald-200 hover:border-emerald-400 transition-all shadow hover:shadow-md flex flex-col items-center text-center">
            <div className="mb-4 p-3 bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center">
              <Users className="text-emerald-600 h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-emerald-600 mb-2">Community-driven innovation</h3>
            <p className="text-gray-700">Harnessing collective intelligence to solve complex biotech challenges</p>
          </div>
          
          <div className="p-6 rounded-xl bg-white border border-emerald-200 hover:border-emerald-400 transition-all shadow hover:shadow-md flex flex-col items-center text-center">
            <div className="mb-4 p-3 bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center">
              <Network className="text-emerald-600 h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-emerald-600 mb-2">Decentralized collaboration</h3>
            <p className="text-gray-700">Building borderless scientific communities that transcend traditional boundaries</p>
          </div>
          
          <div className="p-6 rounded-xl bg-white border border-emerald-200 hover:border-emerald-400 transition-all shadow hover:shadow-md flex flex-col items-center text-center">
            <div className="mb-4 p-3 bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center">
              <Brain className="text-emerald-600 h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-emerald-600 mb-2">Integration with AI & crypto</h3>
            <p className="text-gray-700">Leveraging cutting-edge technologies to accelerate scientific progress</p>
          </div>
          
          <div className="p-6 rounded-xl bg-white border border-emerald-200 hover:border-emerald-400 transition-all shadow hover:shadow-md flex flex-col items-center text-center">
            <div className="mb-4 p-3 bg-emerald-100 rounded-full w-12 h-12 flex items-center justify-center">
              <BookOpen className="text-emerald-600 h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-emerald-600 mb-2">Educational resources</h3>
            <p className="text-gray-700">Democratizing access to biotech knowledge and research opportunities</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 md:px-10 lg:px-16 text-center relative bg-white">
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl font-bold text-emerald-600 mb-6">Ready to accelerate biotech innovation?</h2>
          <p className="text-xl text-gray-700 mb-10">Join our community of scientists, developers, and enthusiasts building the future of decentralized science.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="group px-8 bg-emerald-600 hover:bg-emerald-700 text-white">
              <a href="/chat" className="flex items-center gap-2">
                <Send className="h-5 w-5" />
                Join the Chat
                <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="px-8 border-emerald-600 text-emerald-700 hover:bg-emerald-50">
              <a href="https://www.bioacc.meme/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Visit BIO/ACC
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 md:px-10 lg:px-16 border-t border-emerald-200 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <p className="text-emerald-600 font-bold text-xl">BIO/ACC</p>
            <p className="text-gray-600 text-sm">Accelerating the future of biotechnology</p>
          </div>
          <div className="flex gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <TwitterIcon className="h-5 w-5 text-gray-600 hover:text-emerald-600 transition-colors" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Twitter</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <a href="#" target="_blank" rel="noopener noreferrer">
                      <GithubIcon className="h-5 w-5 text-gray-600 hover:text-emerald-600 transition-colors" />
                    </a>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>GitHub</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <ModeToggle />
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-emerald-100 text-center">
          <p className="text-sm text-gray-600">© 2025 BIO/ACC. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}