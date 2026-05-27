import React, { useState } from 'react';
import { Shield, LayoutDashboard, Mail, Image, Volume2, Film, Server, Globe } from 'lucide-react';
import Dashboard from './components/Dashboard';
import EmailScanner from './components/EmailScanner';
import ImageScanner from './components/ImageScanner';
import AudioScanner from './components/AudioScanner';
import VideoScanner from './components/VideoScanner';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const navItems = [
    { id: 'dashboard', label: 'Console Dashboard', icon: LayoutDashboard },
    { id: 'email', label: 'Email Phishing', icon: Mail },
    { id: 'image', label: 'Image Deepfake', icon: Image },
    { id: 'audio', label: 'Audio Deepfake', icon: Volume2 },
    { id: 'video', label: 'Video Deepfake', icon: Film }
  ];

  return (
    <div className="flex min-h-screen bg-dark-950 text-slate-100 overflow-hidden font-sans">
      <aside className="w-80 bg-slate-900/30 border-r border-slate-800/80 p-6 flex flex-col justify-between hidden md:flex backdrop-blur-md">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-tr from-cyber-cyan to-cyber-violet rounded-lg shadow-lg shadow-cyber-cyan/15">
              <Shield className="w-6 h-6 text-dark-950 stroke-[2.5]" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-mono tracking-wider bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">VANGUARD X</h2>
              <span className="text-[10px] uppercase tracking-widest text-cyber-cyan font-mono font-semibold">Security Core v1.0</span>
            </div>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 group text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-cyber-cyan/15 to-cyber-violet/5 border border-cyber-cyan/35 text-cyber-cyan shadow-sm shadow-cyber-cyan/5'
                      : 'border border-transparent hover:bg-slate-900/50 hover:border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 duration-200 ${isActive ? 'text-cyber-cyan' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4 border-t border-slate-800/80 pt-6">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5" />
              <span>Node API Port</span>
            </span>
            <span className="font-mono font-semibold text-slate-400">5001</span>
          </div>
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>Vite Webserver</span>
            </span>
            <span className="font-mono font-semibold text-slate-400">3000</span>
          </div>
          <div className="bg-dark-900/60 border border-slate-850 p-3 rounded-lg flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-pulse" />
            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-semibold">Integrity Shield Online</span>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="border-b border-slate-800/60 p-4 md:p-6 bg-slate-900/10 flex justify-between items-center md:hidden backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyber-cyan" />
            <span className="font-bold font-mono tracking-wider text-sm">VANGUARD X</span>
          </div>
          <div className="flex gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`p-2 rounded-lg transition-all ${
                    isActive ? 'bg-cyber-cyan/10 text-cyber-cyan border border-cyber-cyan/20' : 'text-slate-400'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </button>
              );
            })}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-5xl w-full mx-auto pb-16">
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'email' && <EmailScanner />}
          {activeTab === 'image' && <ImageScanner />}
          {activeTab === 'audio' && <AudioScanner />}
          {activeTab === 'video' && <VideoScanner />}
        </main>
      </div>
    </div>
  );
}
