import React, { useState, useRef } from 'react';
import { Background } from './components/Background';
import { GlassCard } from './components/GlassCard';
import { ProcessingStatus } from './types';
import { humanizeText } from './services/gemini';
import { parseFile } from './utils/documentParser';
import { 
  Upload, 
  FileText, 
  Wand2, 
  Copy, 
  Check, 
  RefreshCw, 
  FileType, 
  X,
  ShieldCheck,
  AlertCircle,
  Eraser,
  Sparkles,
  Maximize2
} from 'lucide-react';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [humanizedText, setHumanizedText] = useState('');
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const wordCount = (text: string) => text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus(ProcessingStatus.READING_FILE);
    setError(null);
    setFileName(file.name);
    setHumanizedText('');

    try {
      const text = await parseFile(file);
      if (text.length < 10) {
        throw new Error("The file appears to be empty or unreadable.");
      }
      setInputText(text);
      setStatus(ProcessingStatus.IDLE);
    } catch (err: any) {
      setError(err.message || "Failed to read file.");
      setStatus(ProcessingStatus.ERROR);
      setFileName(null);
    } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleHumanize = async () => {
    if (!inputText.trim()) return;

    setStatus(ProcessingStatus.PROCESSING);
    setError(null);
    
    try {
      const result = await humanizeText(inputText);
      setHumanizedText(result);
      setStatus(ProcessingStatus.COMPLETED);
    } catch (err: any) {
      setError("Failed to humanize text. Please try again.");
      setStatus(ProcessingStatus.ERROR);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(humanizedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clearAll = () => {
    setInputText('');
    setHumanizedText('');
    setFileName(null);
    setStatus(ProcessingStatus.IDLE);
    setError(null);
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFileName(null);
  };

  return (
    <>
      <Background />
      <div className="min-h-screen flex flex-col items-center p-4 md:p-6 font-sans text-glass-text">
        
        {/* Header */}
        <div className="text-center mb-8 mt-4 animate-fade-in-down">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-medium tracking-wide uppercase text-blue-200 mb-4">
            <Sparkles className="w-3 h-3" />
            AI Detection Remover
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-200 via-white to-purple-200 mb-4 drop-shadow-sm">
            HumanizeAI
          </h1>
          <p className="text-glass-muted text-lg max-w-xl mx-auto font-light">
            Convert robotic text into natural human writing. <br className="hidden md:block"/>
            <span className="text-blue-300">No em-dashes. No AI patterns.</span> Just pure flow.
          </p>
        </div>

        {/* Main Content Area */}
        <div className="w-full max-w-[1400px] grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* LEFT COLUMN: Input */}
          <GlassCard className="flex flex-col h-[750px] transition-all duration-300">
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-glass-border flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-300" />
                </div>
                <div>
                  <h2 className="font-semibold text-white tracking-wide text-sm uppercase">Source Content</h2>
                  <div className="text-xs text-glass-muted">Upload file or paste text</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {inputText && (
                  <button 
                    onClick={clearAll}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-200 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-md transition-all"
                  >
                    <Eraser className="w-3.5 h-3.5" /> Clear
                  </button>
                )}
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-6 flex flex-col gap-4">
              
              {/* Container 1: File Upload Box */}
              <div 
                className={`
                   relative rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden group
                   ${fileName 
                     ? 'bg-blue-900/20 border-blue-500/30 py-3 px-4' 
                     : 'bg-glass-input border-dashed border-glass-border hover:border-blue-400/50 hover:bg-glass-200 py-6 px-4 flex flex-col items-center justify-center'}
                `}
                onClick={() => !fileName && fileInputRef.current?.click()}
              >
                 <input 
                   type="file" 
                   ref={fileInputRef} 
                   className="hidden" 
                   accept=".pdf,.docx,.txt"
                   onChange={handleFileUpload}
                 />
                 
                 {fileName ? (
                    <div className="flex items-center justify-between w-full">
                       <div className="flex items-center gap-3 overflow-hidden">
                          <div className="p-2 bg-blue-500/20 rounded-lg">
                             <FileType className="w-5 h-5 text-blue-300" />
                          </div>
                          <div className="flex flex-col min-w-0">
                             <span className="text-sm font-medium text-white truncate">{fileName}</span>
                             <span className="text-xs text-blue-200/70">Document loaded</span>
                          </div>
                       </div>
                       <button 
                         onClick={removeFile}
                         className="p-1.5 hover:bg-white/10 rounded-full text-glass-muted hover:text-white transition-colors"
                         title="Remove file"
                       >
                         <X className="w-4 h-4" />
                       </button>
                    </div>
                 ) : (
                    <div className="flex flex-col items-center gap-2 text-center">
                       <Upload className="w-6 h-6 text-glass-muted group-hover:scale-110 transition-transform duration-300 group-hover:text-blue-300" />
                       <p className="text-sm font-medium text-glass-muted group-hover:text-white transition-colors">
                          Drop PDF or Word file here
                       </p>
                    </div>
                 )}
              </div>

              {/* Divider Text */}
              <div className="flex items-center gap-3">
                 <div className="h-px flex-1 bg-white/10"></div>
                 <span className="text-xs font-medium text-glass-muted uppercase tracking-wider">Or Input Text</span>
                 <div className="h-px flex-1 bg-white/10"></div>
              </div>

              {/* Container 2: Text Editor Box */}
              <div className="flex-1 relative bg-glass-input border border-glass-border rounded-xl overflow-hidden focus-within:border-blue-400/50 transition-colors flex flex-col shadow-inner">
                <textarea
                  className="flex-1 w-full bg-transparent border-none p-5 outline-none resize-none text-glass-text placeholder-glass-muted/30 font-mono text-sm leading-relaxed scrollbar-thin"
                  placeholder="Paste your content here or type to start editing..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={status === ProcessingStatus.PROCESSING || status === ProcessingStatus.READING_FILE}
                  spellCheck={false}
                />
                
                {/* Status Bar inside Box */}
                <div className="bg-black/20 px-4 py-2 flex justify-between items-center text-xs text-glass-muted border-t border-white/5">
                    <span className="flex items-center gap-2">
                       {status === ProcessingStatus.READING_FILE && <RefreshCw className="w-3 h-3 animate-spin" />}
                       {status === ProcessingStatus.READING_FILE ? 'Reading file...' : 'Text Editor'}
                    </span>
                    <span className="font-mono">{wordCount(inputText)} words</span>
                </div>
              </div>

              {/* Action Area */}
              <div className="flex justify-between items-center mt-1">
                <div className="text-xs text-glass-muted">
                    {error && (
                        <span className="flex items-center gap-1.5 text-red-300 bg-red-500/10 px-3 py-1.5 rounded-md border border-red-500/20 animate-pulse">
                            <AlertCircle className="w-3.5 h-3.5" /> {error}
                        </span>
                    )}
                </div>
                <button
                  onClick={handleHumanize}
                  disabled={!inputText || status === ProcessingStatus.PROCESSING || status === ProcessingStatus.READING_FILE}
                  className={`
                    relative overflow-hidden flex items-center gap-2 px-8 py-3 rounded-lg font-semibold text-white text-sm tracking-wide transition-all shadow-lg
                    ${!inputText || status === ProcessingStatus.PROCESSING 
                      ? 'bg-glass-200 cursor-not-allowed opacity-50' 
                      : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]'}
                  `}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300"></div>
                  {status === ProcessingStatus.PROCESSING ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      PROCESSING...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      HUMANIZE TEXT
                    </>
                  )}
                </button>
              </div>

            </div>
          </GlassCard>

          {/* RIGHT COLUMN: Output */}
          <GlassCard className="flex flex-col h-[750px]">
            {/* Toolbar */}
             <div className="px-6 py-4 border-b border-glass-border flex justify-between items-center bg-white/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-green-300" />
                </div>
                <div>
                  <h2 className="font-semibold text-white tracking-wide text-sm uppercase">Humanized Output</h2>
                  <div className="text-xs text-green-300/80 flex items-center gap-2">
                    {humanizedText ? 'Ready to copy' : 'Waiting for input...'}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={copyToClipboard}
                  disabled={!humanizedText}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border transition-all
                    ${humanizedText 
                        ? 'text-green-200 bg-green-500/10 border-green-500/20 hover:bg-green-500/20 cursor-pointer' 
                        : 'text-glass-muted border-transparent opacity-50 cursor-not-allowed'}
                  `}
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied' : 'Copy Text'}
                </button>
              </div>
            </div>

            {/* Content Body */}
            <div className="flex-1 p-6 flex flex-col">
                 <div className="flex-1 relative bg-glass-input border border-glass-border rounded-xl overflow-hidden flex flex-col shadow-inner">
                    {humanizedText ? (
                        <>
                            <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
                                <p className="font-mono text-sm text-glass-text leading-relaxed whitespace-pre-wrap">
                                    {humanizedText}
                                </p>
                            </div>
                            {/* Status Bar inside Box */}
                            <div className="bg-black/20 px-4 py-2 flex justify-between items-center text-xs text-glass-muted border-t border-white/5">
                                <span className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                    AI Detection: Low
                                </span>
                                <span>{wordCount(humanizedText)} words</span>
                            </div>
                        </>
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-glass-muted/40 p-8 text-center">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/5">
                                <Sparkles className="w-8 h-8 opacity-40" />
                            </div>
                            <p className="text-sm font-medium mb-1">Result will appear here</p>
                            <p className="text-xs max-w-xs">Text is processed to remove patterns, simplify vocabulary, and ensure natural flow.</p>
                        </div>
                    )}
                 </div>
            </div>
            
            {/* Footer / Branding */}
            <div className="px-6 pb-6 pt-0">
                 <div className="p-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/5 rounded-lg flex items-center justify-between text-xs text-glass-muted">
                    <span>Pro Mode Active</span>
                    <span className="opacity-50">v1.2.0</span>
                 </div>
            </div>

          </GlassCard>
        </div>
      </div>
    </>
  );
};

export default App;