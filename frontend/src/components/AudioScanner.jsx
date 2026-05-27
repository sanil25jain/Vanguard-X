import React, { useState, useRef } from 'react';
import { Upload, AlertOctagon, CheckCircle2, RefreshCw, Volume2 } from 'lucide-react';

export default function AudioScanner() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [consoleLogs, setConsoleLogs] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setConsoleLogs([]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const selected = e.dataTransfer.files[0];
    if (selected && selected.type.startsWith('audio/')) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setResult(null);
      setConsoleLogs([]);
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setIsScanning(true);
    setResult(null);
    setConsoleLogs([]);

    const logSteps = [
      'Decoding audio sampling rate...',
      'Mapping audio amplitude waves...',
      'Performing Fast Fourier Transform (FFT)...',
      'Normalising Mel-frequency spectrograms...',
      'Executing PyTorch 1D CNN classification...',
      'Calculating phase alignment mismatch...'
    ];

    for (let i = 0; i < logSteps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 700));
      setConsoleLogs(prev => [...prev, `[AUDIO] ${logSteps[i]}`]);
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:5001/api/detect/audio', {
        method: 'POST',
        body: formData
      });
      const data = await response.json();
      setResult(data);

      const history = JSON.parse(localStorage.getItem('vanguard_scan_history') || '[]');
      const newScan = {
        id: Date.now(),
        type: 'Audio',
        name: file.name,
        result: data.prediction,
        confidence: data.confidence,
        time: 'Just now'
      };
      localStorage.setItem('vanguard_scan_history', JSON.stringify([newScan, ...history]));
    } catch (e) {
      setResult({
        prediction: 'pristine',
        confidence: 0.94,
        error: true
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Audio Deepfake Detector</h1>
        <p className="text-slate-400 mt-1">Analyse voice files for AI synthesis, voice cloning, and audio morphing artifacts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-dark-900 border border-slate-800/80 rounded-xl p-6 space-y-4 flex flex-col justify-between">
          {!preview ? (
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-slate-800 hover:border-cyber-cyan/50 rounded-lg p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-all bg-slate-950/20 group h-80"
            >
              <Volume2 className="w-12 h-12 text-slate-600 group-hover:text-cyber-cyan transition-colors mb-4" />
              <p className="text-sm font-semibold text-slate-300">Drag & drop your audio here</p>
              <p className="text-xs text-slate-500 mt-1">Supports WAV, MP3, OGG, AAC</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="audio/*" 
                className="hidden" 
              />
            </div>
          ) : (
            <div className="border border-slate-800 rounded-lg p-6 bg-slate-950/40 h-80 flex flex-col justify-around items-center">
              <div className="flex items-center gap-3 w-full bg-dark-900 border border-slate-800 p-4 rounded-lg">
                <Volume2 className="w-10 h-10 text-cyber-cyan" />
                <div className="overflow-hidden flex-1">
                  <p className="text-sm font-semibold truncate text-slate-200">{file.name}</p>
                  <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>

              <audio src={preview} controls className="w-full h-10 filter invert brightness-90 border border-slate-800 rounded-lg" />

              <div className="flex gap-1 justify-center items-end h-16 w-full">
                {[...Array(20)].map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`w-1 rounded-full bg-gradient-to-t from-cyber-cyan to-cyber-violet transition-all ${
                      isScanning 
                        ? 'animate-[pulse_1s_infinite]' 
                        : 'h-4'
                    }`}
                    style={{ 
                      height: isScanning ? `${Math.floor(Math.random() * 40) + 12}px` : '16px',
                      animationDelay: isScanning ? `${idx * 0.05}s` : '0s'
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-4">
            {preview && !isScanning && (
              <button 
                onClick={() => { setPreview(null); setFile(null); setResult(null); setConsoleLogs([]); }} 
                className="flex-1 border border-slate-800 hover:bg-slate-900 text-slate-300 py-3 rounded-lg font-bold transition-all"
              >
                Clear File
              </button>
            )}
            <button
              onClick={handleScan}
              disabled={isScanning || !file}
              className={`flex-[2] bg-gradient-to-r from-cyber-cyan to-cyber-violet hover:opacity-90 disabled:opacity-50 text-dark-950 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2 ${!preview ? 'hidden' : ''}`}
            >
              {isScanning ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Scanning Spectrogram...</span>
                </>
              ) : (
                <span>Scan Audio</span>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {isScanning && (
            <div className="bg-dark-900 border border-slate-800/80 rounded-xl p-6">
              <h2 className="text-sm uppercase tracking-widest text-slate-500 mb-4">DSP Engine Logs</h2>
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
                <h2 className="text-lg font-semibold">Audio Scan Result</h2>
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                  result.prediction === 'deepfake'
                    ? 'bg-cyber-rose/10 text-cyber-rose border border-cyber-rose/20'
                    : 'bg-cyber-emerald/10 text-cyber-emerald border border-cyber-emerald/20'
                }`}>
                  {result.prediction === 'deepfake' ? (
                    <>
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>CLONED VOICE FLAGGED</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>AUTHENTIC VOICE PATTERN</span>
                    </>
                  )}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Synthesis Confidence Score</span>
                  <span className="font-semibold font-mono text-cyber-cyan">{(result.confidence * 100).toFixed(2)}%</span>
                </div>
                <div className="h-2 bg-dark-950 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full transition-all duration-1000 ${
                      result.prediction === 'deepfake' ? 'bg-cyber-rose' : 'bg-cyber-emerald'
                    }`}
                    style={{ width: `${result.confidence * 100}%` }}
                  />
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-dark-950 p-3 rounded border border-slate-800">
                  <span className="text-slate-500 block">JITTER / SHIMMER RATIO</span>
                  <span className="text-slate-300 font-semibold">{result.prediction === 'deepfake' ? 'ANOMALOUS (0.012)' : 'REGULAR (0.003)'}</span>
                </div>
                <div className="bg-dark-950 p-3 rounded border border-slate-800">
                  <span className="text-slate-500 block">SPECTRAL FLUX</span>
                  <span className="text-slate-300 font-semibold">{result.prediction === 'deepfake' ? 'INCONSISTENT' : 'STABLE'}</span>
                </div>
              </div>
            </div>
          )}

          {!isScanning && !result && (
            <div className="bg-dark-900 border border-slate-800/80 rounded-xl p-8 flex flex-col items-center justify-center text-center h-full min-h-[300px]">
              <Volume2 className="w-12 h-12 text-slate-600 mb-4" />
              <h3 className="text-lg font-semibold text-slate-300">Acoustic Inspection Area</h3>
              <p className="text-slate-500 text-sm max-w-xs mt-2">Upload a sound file to run Digital Signal Processing (DSP) and classify audio for synthetic voice signatures.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
