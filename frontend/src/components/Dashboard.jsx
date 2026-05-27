import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, BarChart2, ShieldAlert, Cpu } from 'lucide-react';

export default function Dashboard({ setActiveTab }) {
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    const stored = localStorage.getItem('vanguard_scan_history');
    if (stored) {
      setHistory(JSON.parse(stored));
    } else {
      const defaultHistory = [
        { id: 1, type: 'Email', name: 'suspicious_invoice.eml', result: 'phishing', confidence: 0.94, time: '10 mins ago' },
        { id: 2, type: 'Image', name: 'ceo_profile_headshot.png', result: 'pristine', confidence: 0.98, time: '1 hour ago' },
        { id: 3, type: 'Video', name: 'interview_dubbed.mp4', result: 'deepfake', confidence: 0.87, time: '3 hours ago' },
        { id: 4, type: 'Audio', name: 'voice_note_verification.wav', result: 'pristine', confidence: 0.92, time: '5 hours ago' }
      ];
      localStorage.setItem('vanguard_scan_history', JSON.stringify(defaultHistory));
      setHistory(defaultHistory);
    }
  }, []);

  const totalScans = history.length;
  const threatCount = history.filter(h => h.result === 'phishing' || h.result === 'deepfake').length;
  const safeCount = totalScans - threatCount;
  const threatRatio = totalScans > 0 ? (threatCount / totalScans) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Security Intelligence Console
          </h1>
          <p className="text-slate-400 mt-1">Real-time deepfake and phishing detection center.</p>
        </div>
        <div className="flex items-center gap-2 bg-dark-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-cyber-cyan">
          <Cpu className="w-4 h-4 animate-pulse" />
          <span>Models: Active & Optimised</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-dark-900 border border-slate-800/80 rounded-xl p-6 glow-border transition-all">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm font-medium">Total Scans Executed</span>
            <BarChart2 className="w-5 h-5 text-cyber-cyan" />
          </div>
          <p className="text-4xl font-bold mt-2 font-mono">{totalScans}</p>
          <div className="mt-4 text-xs text-slate-500">Live request counter active</div>
        </div>

        <div className="bg-dark-900 border border-slate-800/80 rounded-xl p-6 glow-border transition-all">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm font-medium">Threats Intercepted</span>
            <ShieldAlert className="w-5 h-5 text-cyber-rose" />
          </div>
          <p className="text-4xl font-bold mt-2 font-mono text-cyber-rose">{threatCount}</p>
          <div className="mt-4 text-xs text-cyber-rose/80 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Action required on flagged items</span>
          </div>
        </div>

        <div className="bg-dark-900 border border-slate-800/80 rounded-xl p-6 glow-border transition-all">
          <div className="flex justify-between items-center">
            <span className="text-slate-400 text-sm font-medium">Safe Declarations</span>
            <CheckCircle className="w-5 h-5 text-cyber-emerald" />
          </div>
          <p className="text-4xl font-bold mt-2 font-mono text-cyber-emerald">{safeCount}</p>
          <div className="mt-4 text-xs text-cyber-emerald/80 flex items-center gap-1">
            <Shield className="w-3.5 h-3.5" />
            <span>{(totalScans > 0 ? (safeCount / totalScans * 100).toFixed(0) : 100)}% integrity rate</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-dark-900 border border-slate-800/80 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span>Threat Ratio Analysis</span>
          </h2>
          <div className="flex flex-col md:flex-row items-center gap-8 justify-around">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#1e293b" strokeWidth="12" fill="transparent" />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="40" 
                  stroke="url(#gradient-cyan-purple)" 
                  strokeWidth="12" 
                  fill="transparent" 
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * threatRatio) / 100}
                  strokeLinecap="round"
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="gradient-cyan-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold font-mono">{threatRatio.toFixed(0)}%</span>
                <span className="text-xs text-slate-400 uppercase tracking-widest mt-1">Malicious</span>
              </div>
            </div>
            
            <div className="space-y-4 w-full max-w-xs">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyber-cyan" />
                  <span className="text-sm text-slate-300">Pristine Verification</span>
                </div>
                <span className="text-sm font-semibold font-mono">{safeCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-cyber-violet" />
                  <span className="text-sm text-slate-300">Deepfake/Phishing</span>
                </div>
                <span className="text-sm font-semibold font-mono">{threatCount}</span>
              </div>
              <div className="border-t border-slate-800 pt-4 flex justify-between items-center text-xs text-slate-400">
                <span>Calculated over total archive logs</span>
                <span>Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-dark-900 border border-slate-800/80 rounded-xl p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Active Modalities</h2>
            <span className="text-xs text-cyber-cyan bg-cyber-cyan/10 px-2 py-0.5 rounded">All Secure</span>
          </div>
          <div className="space-y-4 flex-1 flex flex-col justify-between">
            <button onClick={() => setActiveTab('email')} className="flex items-center justify-between p-3 rounded-lg border border-slate-800 hover:border-slate-700/80 bg-slate-900/40 hover:bg-slate-900/80 text-left transition-all group">
              <div>
                <p className="text-sm font-semibold group-hover:text-cyber-cyan transition-colors">Email Phishing</p>
                <p className="text-xs text-slate-400 mt-0.5">Scikit-learn TF-IDF model</p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-cyber-emerald animate-pulse" />
            </button>

            <button onClick={() => setActiveTab('image')} className="flex items-center justify-between p-3 rounded-lg border border-slate-800 hover:border-slate-700/80 bg-slate-900/40 hover:bg-slate-900/80 text-left transition-all group">
              <div>
                <p className="text-sm font-semibold group-hover:text-cyber-cyan transition-colors">Image Deepfake</p>
                <p className="text-xs text-slate-400 mt-0.5">PyTorch CNN classification</p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-cyber-emerald animate-pulse" />
            </button>

            <button onClick={() => setActiveTab('audio')} className="flex items-center justify-between p-3 rounded-lg border border-slate-800 hover:border-slate-700/80 bg-slate-900/40 hover:bg-slate-900/80 text-left transition-all group">
              <div>
                <p className="text-sm font-semibold group-hover:text-cyber-cyan transition-colors">Audio Deepfake</p>
                <p className="text-xs text-slate-400 mt-0.5">PyTorch Waveform model</p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-cyber-emerald animate-pulse" />
            </button>

            <button onClick={() => setActiveTab('video')} className="flex items-center justify-between p-3 rounded-lg border border-slate-800 hover:border-slate-700/80 bg-slate-900/40 hover:bg-slate-900/80 text-left transition-all group">
              <div>
                <p className="text-sm font-semibold group-hover:text-cyber-cyan transition-colors">Video Deepfake</p>
                <p className="text-xs text-slate-400 mt-0.5">OpenCV + PyTorch multi-frame</p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-cyber-emerald animate-pulse" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-dark-900 border border-slate-800/80 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-6">Recent Detection Logs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Modality</th>
                <th className="py-3 px-4">Target Name</th>
                <th className="py-3 px-4">Result</th>
                <th className="py-3 px-4">Confidence</th>
                <th className="py-3 px-4 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {history.map((item) => (
                <tr key={item.id} className="hover:bg-slate-900/20 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-cyber-cyan">{item.type}</td>
                  <td className="py-3.5 px-4 max-w-xs truncate">{item.name}</td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      item.result === 'phishing' || item.result === 'deepfake'
                        ? 'bg-cyber-rose/10 text-cyber-rose'
                        : 'bg-cyber-emerald/10 text-cyber-emerald'
                    }`}>
                      {item.result.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono">{(item.confidence * 100).toFixed(1)}%</td>
                  <td className="py-3.5 px-4 text-right text-slate-400">{item.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
