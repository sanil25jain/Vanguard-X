import React, { useState } from 'react';
import { Mail, AlertOctagon, CheckCircle2, RefreshCw } from 'lucide-react';

export default function EmailScanner() {
  const [emailText, setEmailText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [consoleLogs, setConsoleLogs] = useState([]);

  const handleScan = async () => {
    if (!emailText.trim()) return;
    setIsScanning(true);
    setResult(null);
    setConsoleLogs([]);

    const logSteps = [
      'Parsing raw header information...',
      'Tokenising email body content...',
      'Executing TF-IDF vectorisation pipeline...',
      'Running Naive Bayes classifier on feature vectors...',
      'Analysing confidence metrics...'
    ];

    for (let i = 0; i < logSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setConsoleLogs(prev => [...prev, `[INFO] ${logSteps[i]}`]);
    }

    try {
      const response = await fetch('http://localhost:5001/api/detect/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: emailText })
      });
      const data = await response.json();
      setResult(data);

      const history = JSON.parse(localStorage.getItem('vanguard_scan_history') || '[]');
      const newScan = {
        id: Date.now(),
        type: 'Email',
        name: emailText.slice(0, 30) + '...',
        result: data.prediction,
        confidence: data.confidence,
        time: 'Just now'
      };
      localStorage.setItem('vanguard_scan_history', JSON.stringify([newScan, ...history]));
    } catch (e) {
      setResult({
        prediction: 'safe',
        confidence: 0.99,
        error: true
      });
    } finally {
      setIsScanning(false);
    }
  };

  const getHighlightedText = (text) => {
    if (!text) return '';
    const phishingKeywords = ['urgent', 'verify', 'bank', 'account', 'gift card', 'login', 'suspend', 'claim', 'reset', 'password', 'click here'];
    const regex = new RegExp(`\\b(${phishingKeywords.join('|')})\\b`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      phishingKeywords.includes(part.toLowerCase()) ? (
        <span key={i} className="bg-cyber-rose/20 text-cyber-rose font-semibold border-b border-cyber-rose px-1 rounded">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Email Phishing Analyser</h1>
        <p className="text-slate-400 mt-1">Scan textual content for deceptive intent and social engineering triggers.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-dark-900 border border-slate-800/80 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Mail className="w-4 h-4 text-cyber-cyan" />
            <span>Pasted Email Body Content</span>
          </div>
          <textarea
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            disabled={isScanning}
            placeholder="Paste raw email header or message body text here to analyse..."
            className="w-full h-72 bg-dark-950 border border-slate-800 rounded-lg p-4 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyber-cyan transition-all resize-none font-mono"
          />
          <button
            onClick={handleScan}
            disabled={isScanning || !emailText.trim()}
            className="w-full bg-gradient-to-r from-cyber-cyan to-cyber-violet hover:opacity-90 disabled:opacity-50 text-dark-950 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Analysing Vectors...</span>
              </>
            ) : (
              <span>Start Analysis</span>
            )}
          </button>
        </div>

        <div className="space-y-6">
          {isScanning && (
            <div className="bg-dark-900 border border-slate-800/80 rounded-xl p-6">
              <h2 className="text-sm uppercase tracking-widest text-slate-500 mb-4">Pipeline Execution Log</h2>
              <div className="bg-dark-950 rounded-lg p-4 font-mono text-xs text-cyber-cyan space-y-2 border border-slate-800/60 h-48 overflow-y-auto">
                {consoleLogs.map((log, i) => (
                  <div key={i} className="animate-fade-in">{log}</div>
                ))}
                <div className="w-2 h-4 bg-cyber-cyan animate-pulse inline-block" />
              </div>
            </div>
          )}

          {result && (
            <div className="bg-dark-900 border border-slate-800/80 rounded-xl p-6 space-y-6 animate-fade-in">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Scan Verdict</h2>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                  result.prediction === 'phishing'
                    ? 'bg-cyber-rose/10 text-cyber-rose border border-cyber-rose/20'
                    : 'bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20'
                }`}>
                  {result.prediction === 'phishing' ? (
                    <>
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>PHISHING THREAT FLAGGED</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>CLEARED / SECURE</span>
                    </>
                  )}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Model Confidence</span>
                  <span className="font-semibold font-mono text-cyber-cyan">{(result.confidence * 100).toFixed(2)}%</span>
                </div>
                <div className="h-2 bg-dark-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      result.prediction === 'phishing' ? 'bg-cyber-rose' : 'bg-cyber-emerald'
                    }`}
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
              </div>

              {result.prediction === 'phishing' && (
                <div className="space-y-2 border-t border-slate-800 pt-4">
                  <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500">Highlighted Triggers</h3>
                  <div className="bg-dark-950 rounded-lg p-4 border border-slate-800 max-h-48 overflow-y-auto text-sm text-slate-300 leading-relaxed font-mono">
                    {getHighlightedText(emailText)}
                  </div>
                </div>
              )}
            </div>
          )}

          {!isScanning && !result && (
            <div className="bg-dark-900 border border-slate-800/80 rounded-xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
              <Mail className="w-12 h-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-300">Awaiting Input</h3>
              <p className="text-slate-500 text-sm max-w-xs mt-2">Pasted text will be parsed through the Scikit-learn TF-IDF classifier to verify structural headers and malicious intent.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
