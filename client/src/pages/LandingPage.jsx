import Hero from '../components/Landing/Hero';
import Features from '../components/Landing/Features';
import DemoGraph from '../components/Landing/DemoGraph';

export default function LandingPage() {
  return (
    <div className="w-full">
      <Hero />
      <DemoGraph />
      <Features />

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 text-center text-sm text-gray-500">
        <p>
          CodeMap — AI-Powered Codebase Visualizer • <a href="https://github.com" target="_blank" rel="noreferrer" className="text-accent-blue hover:underline">View Source</a>
        </p>
      </footer>
    </div>
  );
}
