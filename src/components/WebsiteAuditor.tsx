import React, { useState } from 'react';
import { Network, Globe, Database, HelpCircle, Lock, Layout, ShieldCheck, Zap, X, Shield, Palette, Sparkles, AlertTriangle } from 'lucide-react';
import { WebsiteAudit, AuditParameters } from '../types';

interface WebsiteAuditorProps {
  data: WebsiteAudit;
  onChange: (updates: Partial<WebsiteAudit>) => void;
  calculatedMetrics: any;
  auditProfile: 'sandbox' | 'attempt2' | 'attempt3';
  setAuditProfile: (profile: 'sandbox' | 'attempt2' | 'attempt3') => void;
}

export default function WebsiteAuditor({
  data,
  onChange,
  calculatedMetrics,
  auditProfile,
  setAuditProfile
}: WebsiteAuditorProps) {
  const scores: AuditParameters = calculatedMetrics.scores;
  const rawPageWeight = data.pageWeightKb;
  const currentComputedWeight = calculatedMetrics.computedWeightKb;

  // Toggle for pixel-perfect reproduction theme vs modern dark theme
  const [classicWhiteTheme, setClassicWhiteTheme] = useState<boolean>(true);

  // Dynamic Overall Score formatted exactly as user's photo (e.g. 91.43 /100)
  let overallScore = '91.43';
  if (auditProfile === 'attempt2') {
    overallScore = '91.43';
  } else if (auditProfile === 'attempt3') {
    overallScore = '98.29';
  } else {
    const avg = Object.values(scores).reduce((a, b) => a + b, 0) / 7;
    overallScore = avg.toFixed(2);
  }

  // Visual helper for progress bar coloring
  const getScoreColorClass = (score: number) => {
    // Under 80 is orange as shown in the screenshot ("Testing is 78 and has orange bar")
    if (score >= 80) {
      return classicWhiteTheme ? 'bg-[#22c55e]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
    }
    return 'bg-[#f97316]'; // Orange for scores < 80
  };

  const getScoreTextClass = (score: number) => {
    if (score >= 80) {
      return classicWhiteTheme ? 'text-[#22c55e]' : 'text-emerald-400';
    }
    return 'text-[#f97316]';
  };

  return (
    <div id="website-auditor-panel" className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      
      {/* 🔮 INTERACTIVE ATTEMPT PROFILE SELECTOR BANNER */}
      <div className="lg:col-span-5 bg-[#12131a] border border-gray-800 rounded-2xl p-5 flex flex-col md:flex-row justify-between items-center gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <Sparkles className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white font-sans">Evaluation & Attempt Simulation Manager</h4>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Select predefined grading sheets or customize metrics via inputs below.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Attempt 2 Button */}
          <button
            onClick={() => setAuditProfile('attempt2')}
            className={`px-3 py-2 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
              auditProfile === 'attempt2'
                ? 'bg-[#1e3a8a]/40 text-blue-300 border-blue-500 shadow-[0_0_12px_rgba(37,99,235,0.2)]'
                : 'bg-[#181922] text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'
            }`}
          >
            📸 Attempt 2 (Photo Baseline: 91.43)
          </button>

          {/* Attempt 3 Button */}
          <button
            onClick={() => setAuditProfile('attempt3')}
            className={`px-3 py-2 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
              auditProfile === 'attempt3'
                ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                : 'bg-[#181922] text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'
            }`}
          >
            🏆 Attempt 3 (Optimized 95++: 98.29)
          </button>

          {/* Sandbox Button */}
          <button
            onClick={() => setAuditProfile('sandbox')}
            className={`px-3 py-2 rounded-lg text-xs font-mono font-medium border transition-all cursor-pointer ${
              auditProfile === 'sandbox'
                ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500 shadow-[0_0_12px_rgba(6,182,212,0.2)]'
                : 'bg-[#181922] text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'
            }`}
          >
            ⚙️ Sandbox Mode (Live Knobs)
          </button>
        </div>
      </div>

      {/* ⚙️ CONTROLS SIDE: SLIDERS & OPTIONS */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-[#181922] rounded-2xl border border-gray-800 p-5 shadow-lg">
          <div className="flex items-center gap-2.5 mb-4 text-emerald-400 border-b border-gray-800 pb-3">
            <Network className="w-5 h-5 shrink-0" />
            <h3 className="font-semibold text-white tracking-tight">Software Code Parameters</h3>
          </div>

          {auditProfile !== 'sandbox' && (
            <div className="mb-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-3 py-2 rounded-lg text-[10px] font-mono leading-relaxed flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Editing parameters starts Sandbox Mode automatically.</span>
            </div>
          )}

          <div className="space-y-5">
            {/* Sliders */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label htmlFor="pageweight-slider" className="font-mono text-gray-400 uppercase tracking-wide">Base Page Weight</label>
                <span className="text-emerald-400 font-mono font-bold">{rawPageWeight} KB</span>
              </div>
              <input
                id="pageweight-slider"
                type="range"
                min="50"
                max="4000"
                step="50"
                value={rawPageWeight}
                onChange={(e) => onChange({ pageWeightKb: parseInt(e.target.value) || 120 })}
                className="w-full h-1.5 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <span className="text-[10px] text-gray-500 font-mono italic block mt-1">
                Optimized Weight (post modifiers): <span className="text-emerald-400">{currentComputedWeight.toFixed(0)} KB</span>
              </span>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label htmlFor="views-slider" className="font-mono text-gray-400 uppercase tracking-wide">Monthly Pageviews</label>
                <span className="text-emerald-400 font-mono font-bold">{data.monthlyPageViews.toLocaleString()} views</span>
              </div>
              <input
                id="views-slider"
                type="range"
                min="1000"
                max="1000000"
                step="5000"
                value={data.monthlyPageViews}
                onChange={(e) => onChange({ monthlyPageViews: parseInt(e.target.value) || 10000 })}
                className="w-full h-1.5 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
            </div>

            {/* Diagnostic Carbon Booster Switches */}
            <div className="border-t border-gray-800/80 pt-4 space-y-3.5">
              <span className="block text-[10px] uppercase font-mono tracking-widest text-emerald-400/90 font-bold mb-1">
                Optimizations (Strive for 95++)
              </span>

              {/* Green Hosting */}
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-black/20 transition-all">
                <div className="flex items-start gap-2.5">
                  <Database className="w-4 h-4 text-emerald-400 mt-0.5" />
                  <div>
                    <label htmlFor="greenhost-cb" className="block text-xs font-semibold text-gray-200 cursor-pointer">Green Cloud Hosting</label>
                    <span className="block text-[10px] text-gray-400 leading-normal">Halves grid CO2 emission coefficient</span>
                  </div>
                </div>
                <input
                  id="greenhost-cb"
                  type="checkbox"
                  checked={data.isGreenHost}
                  onChange={(e) => onChange({ isGreenHost: e.target.checked })}
                  className="w-4.5 h-4.5 rounded text-emerald-500 border-gray-800 bg-gray-900 focus:ring-emerald-500 focus:ring-opacity-25"
                />
              </div>

              {/* Minify Code */}
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-black/20 transition-all">
                <div className="flex items-start gap-2.5">
                  <Layout className="w-4 h-4 text-blue-400 mt-0.5" />
                  <div>
                    <label htmlFor="minify-cb" className="block text-xs font-semibold text-gray-200 cursor-pointer">Minify CSS/JS Bundles</label>
                    <span className="block text-[10px] text-gray-400 leading-normal">Shrinks data bundle transfer rate by 15%</span>
                  </div>
                </div>
                <input
                  id="minify-cb"
                  type="checkbox"
                  checked={data.isMinified}
                  onChange={(e) => onChange({ isMinified: e.target.checked })}
                  className="w-4.5 h-4.5 rounded text-emerald-500 border-gray-800 bg-gray-900 focus:ring-emerald-500 focus:ring-opacity-25"
                />
              </div>

              {/* Cache Assets */}
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-black/20 transition-all">
                <div className="flex items-start gap-2.5">
                  <Globe className="w-4 h-4 text-yellow-500 mt-0.5" />
                  <div>
                    <label htmlFor="cached-cb" className="block text-xs font-semibold text-gray-200 cursor-pointer">Local Static Caching</label>
                    <span className="block text-[10px] text-gray-400 leading-normal">Reduces repeat view payload standard</span>
                  </div>
                </div>
                <input
                  id="cached-cb"
                  type="checkbox"
                  checked={data.isCached}
                  onChange={(e) => onChange({ isCached: e.target.checked })}
                  className="w-4.5 h-4.5 rounded text-emerald-500 border-gray-800 bg-gray-900 focus:ring-emerald-500 focus:ring-opacity-25"
                />
              </div>

              {/* Image Compression selector */}
              <div>
                <label htmlFor="image-opt-select" className="block text-[11px] font-mono text-gray-400 uppercase mb-1">Image Asset Conversion</label>
                <select
                  id="image-opt-select"
                  value={data.imageOptimization}
                  onChange={(e) => onChange({ imageOptimization: e.target.value as any })}
                  className="w-full bg-black/40 border border-gray-800 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-emerald-500/70 transition-colors"
                >
                  <option value="none">None / Raw PNG/JPG format (No impact)</option>
                  <option value="basic">WebP Conversion (25% reduction)</option>
                  <option value="high">Next-Gen AVIF Rendering (50% reduction)</option>
                </select>
              </div>

              {/* HTTPS Secure SSL */}
              <div className="flex items-center justify-between p-2 rounded-lg hover:bg-black/20 transition-all border-t border-gray-800/80 pt-3">
                <div className="flex items-start gap-2.5">
                  <Lock className="w-4 h-4 text-rose-400 mt-0.5" />
                  <div>
                    <label htmlFor="https-cb" className="block text-xs font-semibold text-gray-200 cursor-pointer">Enforce HTTPS / Security</label>
                    <span className="block text-[10px] text-gray-400 leading-normal">Applies TLS encryption to server proxy</span>
                  </div>
                </div>
                <input
                  id="https-cb"
                  type="checkbox"
                  checked={data.securityHttps}
                  onChange={(e) => onChange({ securityHttps: e.target.checked })}
                  className="w-4.5 h-4.5 rounded text-emerald-500 border-gray-800 bg-gray-900 focus:ring-emerald-500 focus:ring-opacity-25"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 📊 SCORECARD SIDE: REAL AUDIT VISUALS DIRECTLY MATCHING USER'S PHOTO */}
      <div className="lg:col-span-3 space-y-6">
        
        {/* Render Card which switches beautifully between Photo Light Theme & Sleek Dark theme */}
        <div className={`rounded-3xl border transition-all duration-300 relative overflow-hidden ${
          classicWhiteTheme 
            ? 'bg-[#ffffff] border-gray-200 shadow-2xl text-slate-800 p-6 md:p-8' 
            : 'bg-[#181922] border-gray-800 shadow-xl text-gray-200 p-6'
        }`}>
          {/* Subtle design element */}
          {!classicWhiteTheme && <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />}

          {/* Header Bar */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className={`text-lg font-bold font-sans tracking-tight ${classicWhiteTheme ? 'text-[#1e293b]' : 'text-white'}`}>
                  {auditProfile === 'attempt2' ? 'Attempt 2' : auditProfile === 'attempt3' ? 'Attempt 3' : 'Current Attempt'}
                </h3>
                <span className={`text-xs ${classicWhiteTheme ? 'text-[#94a3b8]' : 'text-gray-500'} font-normal font-mono`}>
                  {auditProfile === 'attempt2' ? '(a month ago)' : '(just now)'}
                </span>
                {auditProfile === 'attempt2' && (
                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-mono tracking-wider font-bold">
                    Screenshot Match
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={() => setClassicWhiteTheme(!classicWhiteTheme)}
                className={`flex items-center gap-1.5 text-[10px] font-mono px-2 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                  classicWhiteTheme
                    ? 'bg-[#f8fafc] text-[#475569] border-[#e2e8f0] hover:bg-[#f1f5f9]'
                    : 'bg-black/30 text-gray-400 border-gray-800 hover:text-white hover:border-gray-700'
                }`}
                title="Toggle visual style"
              >
                <Palette className="w-3.5 h-3.5" />
                <span>{classicWhiteTheme ? 'Sleek Dark' : 'Photo Light'}</span>
              </button>

              {/* Reset/Close Option matching photo X closely */}
              <button
                onClick={() => setAuditProfile('sandbox')}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                  classicWhiteTheme ? 'hover:bg-gray-100 text-gray-400 hover:text-gray-600' : 'hover:bg-gray-800 text-gray-500 hover:text-gray-300'
                }`}
                title="Reset to Sandbox Mode"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Large overall score display */}
          <div className="mb-4">
            <div className="flex items-baseline gap-1">
              <span className={`text-5xl font-black tracking-tight font-sans ${classicWhiteTheme ? 'text-[#2563eb]' : 'text-emerald-400 animate-pulse'}`}>
                {overallScore}
              </span>
              <span className={`text-sm font-semibold ${classicWhiteTheme ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
                /100
              </span>
            </div>
          </div>

          {classicWhiteTheme && <hr className="border-[#f1f5f9] my-4" />}

          {/* Score breakdown label */}
          <div className="mb-4 flex justify-between items-center">
            <h4 className={`text-xs font-bold tracking-wider uppercase font-mono ${classicWhiteTheme ? 'text-[#475569]' : 'text-emerald-500'}`}>
              Detailed Score Breakdown
            </h4>
            <span className={`text-[10px] font-mono ${classicWhiteTheme ? 'text-[#94a3b8]' : 'text-gray-500'}`}>
              LIVE RATING SYSTEM
            </span>
          </div>

          {/* 7 PARAMETERS METRICS GRID AS SHOWN IN THE RUBRIC IMAGE */}
          <div className="space-y-3 font-sans">
            
            {/* 1. Code Quality */}
            <div className={`p-4 rounded-2xl border transition-all ${
              classicWhiteTheme 
                ? 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-md' 
                : 'bg-black/30 border-gray-850 hover:bg-black/50'
            }`}>
              <div className="flex justify-between items-center text-xs mb-2 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className={getScoreTextClass(scores.codeQuality)}>⚐</span>
                  <span className={`font-semibold font-sans ${classicWhiteTheme ? 'text-[#334155]' : 'text-gray-200'}`}>
                    Code Quality
                  </span>
                </div>
                <span className={`font-mono font-bold ${classicWhiteTheme ? 'text-[#1e293b]' : 'text-white'}`}>
                  {scores.codeQuality}
                </span>
              </div>
              <div className={`w-full rounded-full h-2 overflow-hidden ${classicWhiteTheme ? 'bg-[#f1f5f9]' : 'bg-black/40 border border-gray-900'}`}>
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getScoreColorClass(scores.codeQuality)}`}
                  style={{ width: `${scores.codeQuality}%` }}
                />
              </div>
            </div>

            {/* 2. Security */}
            <div className={`p-4 rounded-2xl border transition-all ${
              classicWhiteTheme 
                ? 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-md' 
                : 'bg-black/30 border-gray-850 hover:bg-black/50'
            }`}>
              <div className="flex justify-between items-center text-xs mb-2 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className={getScoreTextClass(scores.security)}>⚐</span>
                  <span className={`font-semibold font-sans ${classicWhiteTheme ? 'text-[#334155]' : 'text-gray-200'}`}>
                    Security
                  </span>
                </div>
                <span className={`font-mono font-bold ${classicWhiteTheme ? 'text-[#1e293b]' : 'text-white'}`}>
                  {scores.security}
                </span>
              </div>
              <div className={`w-full rounded-full h-2 overflow-hidden ${classicWhiteTheme ? 'bg-[#f1f5f9]' : 'bg-black/40 border border-gray-900'}`}>
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getScoreColorClass(scores.security)}`}
                  style={{ width: `${scores.security}%` }}
                />
              </div>
            </div>

            {/* 3. Efficiency */}
            <div className={`p-4 rounded-2xl border transition-all ${
              classicWhiteTheme 
                ? 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-md' 
                : 'bg-black/30 border-gray-850 hover:bg-black/50'
            }`}>
              <div className="flex justify-between items-center text-xs mb-2 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className={getScoreTextClass(scores.efficiency)}>⚐</span>
                  <span className={`font-semibold font-sans ${classicWhiteTheme ? 'text-[#334155]' : 'text-gray-200'}`}>
                    Efficiency
                  </span>
                </div>
                <span className={`font-mono font-bold ${classicWhiteTheme ? 'text-[#1e293b]' : 'text-white'}`}>
                  {scores.efficiency}
                </span>
              </div>
              <div className={`w-full rounded-full h-2 overflow-hidden ${classicWhiteTheme ? 'bg-[#f1f5f9]' : 'bg-black/40 border border-gray-900'}`}>
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getScoreColorClass(scores.efficiency)}`}
                  style={{ width: `${scores.efficiency}%` }}
                />
              </div>
            </div>

            {/* 4. Testing */}
            <div className={`p-4 rounded-2xl border transition-all ${
              classicWhiteTheme 
                ? 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-md' 
                : 'bg-black/30 border-gray-880 hover:bg-black/50'
            }`}>
              <div className="flex justify-between items-center text-xs mb-2 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className={getScoreTextClass(scores.testing)}>⚐</span>
                  <span className={`font-semibold font-sans ${classicWhiteTheme ? 'text-[#334155]' : 'text-gray-200'}`}>
                    Testing
                  </span>
                </div>
                <span className={`font-mono font-bold ${classicWhiteTheme ? 'text-[#1e293b]' : 'text-white'}`}>
                  {scores.testing}
                </span>
              </div>
              <div className={`w-full rounded-full h-2 overflow-hidden ${classicWhiteTheme ? 'bg-[#f1f5f9]' : 'bg-black/40 border border-gray-900'}`}>
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getScoreColorClass(scores.testing)}`}
                  style={{ width: `${scores.testing}%` }}
                />
              </div>
              {auditProfile === 'attempt2' && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-1.5 font-sans leading-relaxed">
                  ⚠ Note: Testing score of 78 holds orange progress styling matching your screenshot. Enable local static caching + minification in Sandbox or select Attempt 3 to optimize this score to 95+!
                </p>
              )}
            </div>

            {/* 5. Accessibility */}
            <div className={`p-4 rounded-2xl border transition-all ${
              classicWhiteTheme 
                ? 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-md' 
                : 'bg-black/30 border-gray-850 hover:bg-black/50'
            }`}>
              <div className="flex justify-between items-center text-xs mb-2 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className={getScoreTextClass(scores.accessibility)}>⚐</span>
                  <span className={`font-semibold font-sans ${classicWhiteTheme ? 'text-[#334155]' : 'text-gray-200'}`}>
                    Accessibility
                  </span>
                </div>
                <span className={`font-mono font-bold ${classicWhiteTheme ? 'text-[#1e293b]' : 'text-white'}`}>
                  {scores.accessibility}
                </span>
              </div>
              <div className={`w-full rounded-full h-2 overflow-hidden ${classicWhiteTheme ? 'bg-[#f1f5f9]' : 'bg-black/40 border border-gray-900'}`}>
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getScoreColorClass(scores.accessibility)}`}
                  style={{ width: `${scores.accessibility}%` }}
                />
              </div>
            </div>

            {/* 6. Google Services */}
            <div className={`p-4 rounded-2xl border transition-all ${
              classicWhiteTheme 
                ? 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-md' 
                : 'bg-black/30 border-gray-850 hover:bg-black/50'
            }`}>
              <div className="flex justify-between items-center text-xs mb-2 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className={getScoreTextClass(scores.googleServices)}>⚐</span>
                  <span className={`font-semibold font-sans ${classicWhiteTheme ? 'text-[#334155]' : 'text-gray-200'}`}>
                    Google Services
                  </span>
                </div>
                <span className={`font-mono font-bold ${classicWhiteTheme ? 'text-[#1e293b]' : 'text-white'}`}>
                  {scores.googleServices}
                </span>
              </div>
              <div className={`w-full rounded-full h-2 overflow-hidden ${classicWhiteTheme ? 'bg-[#f1f5f9]' : 'bg-black/40 border border-gray-900'}`}>
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getScoreColorClass(scores.googleServices)}`}
                  style={{ width: `${scores.googleServices}%` }}
                />
              </div>
            </div>

            {/* 7. Problem Statement Alignment */}
            <div className={`p-4 rounded-2xl border transition-all ${
              classicWhiteTheme 
                ? 'bg-[#ffffff] border-[#e2e8f0] hover:shadow-md' 
                : 'bg-black/30 border-gray-850 hover:bg-black/50'
            }`}>
              <div className="flex justify-between items-center text-xs mb-2 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className={getScoreTextClass(scores.problemStatementAlignment)}>⚐</span>
                  <span className={`font-semibold font-sans ${classicWhiteTheme ? 'text-[#334155]' : 'text-gray-200'}`}>
                    Problem Statement Alignment
                  </span>
                </div>
                <span className={`font-mono font-bold ${classicWhiteTheme ? 'text-[#1e293b]' : 'text-white'}`}>
                  {scores.problemStatementAlignment}
                </span>
              </div>
              <div className={`w-full rounded-full h-2 overflow-hidden ${classicWhiteTheme ? 'bg-[#f1f5f9]' : 'bg-black/40 border border-gray-900'}`}>
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getScoreColorClass(scores.problemStatementAlignment)}`}
                  style={{ width: `${scores.problemStatementAlignment}%` }}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
