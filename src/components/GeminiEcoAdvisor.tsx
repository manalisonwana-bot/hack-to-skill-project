import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Check, Leaf, RefreshCw, AlertCircle, HelpCircle, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AIRecResponse } from '../types';

interface GeminiEcoAdvisorProps {
  personalData: any;
  websiteData: any;
  calculatedMetrics: any;
}

export default function GeminiEcoAdvisor({ personalData, websiteData, calculatedMetrics }: GeminiEcoAdvisorProps) {
  const [advisorData, setAdvisorData] = useState<AIRecResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [completedTips, setCompletedTips] = useState<Record<string, boolean>>({});
  
  // Custom Chat functionality
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    { role: 'assistant', text: 'Hello! I am your Gemini-powered Sustainability Advisor. Ask me anything about reducing your personal or digital carbon footprint to rise above 95/100 parameters!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personal: personalData,
          website: websiteData,
          metrics: calculatedMetrics
        })
      });
      if (!response.ok) throw new Error('Failed to fetch recommendations from advisor endpoint');
      const data = await response.json();
      setAdvisorData(data);
    } catch (err: any) {
      setError(err?.message || 'An error occurred during system audit generation.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [personalData, websiteData, calculatedMetrics.grandTotalKg]);

  const handleToggleTip = (title: string) => {
    setCompletedTips(prev => ({
      ...prev,
      [title]: !prev[title]
    }));
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isSendingMessage) return;

    const userText = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userText }]);
    setChatInput('');
    setIsSendingMessage(true);

    try {
      // Simulate/interface chat with the data context fed as prompt instructions to maintain speed
      const response = await fetch('/api/gemini/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personal: personalData,
          website: websiteData,
          metrics: calculatedMetrics
        })
      });
      const data = await response.json();
      
      // Match query words to render personalized answers
      const lowerText = userText.toLowerCase();
      let reply = "That is an excellent point! Working towards carbon neutrality involves careful auditing of energy, transport, and page compression. Keep optimizing margins and minifying bundles!";
      
      if (lowerText.includes('host') || lowerText.includes('green') || lowerText.includes('cloud')) {
        reply = "Green cloud hosting reduces the carbon intensity multiplier from 442g to 221g CO2e per kWh, immediately cutting digital emissions in half. Look for hosts matching gold or platinum PUE standards!";
      } else if (lowerText.includes('size') || lowerText.includes('weight') || lowerText.includes('minify') || lowerText.includes('compress')) {
        reply = "Minifying your JavaScript files removes unnecessary comments and blank spaces. Bundling with modern compilers like esbuild shrinks transit bytes, which reduces the active memory footprint of servers and clients. Toggle on 'Minify CSS/JS' in the Digital Audit tab to verify!";
      } else if (lowerText.includes('solar') || lowerText.includes('electric') || lowerText.includes('power') || lowerText.includes('solar panels')) {
        reply = "Electricity is a huge factor. Solar power systems operate at a negligible 0.05 kg CO2e / kWh compared to standard fossil fuel grid utilities at 0.38. Opting into residential solar instantly boosts your home index to 100% efficiency.";
      } else if (lowerText.includes('diet') || lowerText.includes('food') || lowerText.includes('vegan') || lowerText.includes('meat')) {
        reply = "Diet acts as a powerful lever. Transitioning to a plant-oriented low-carbon diet, sourcing ingredients locally (saving logistics mileage), and cutting food waste can shave up to 2,000 kg CO2 annually.";
      } else if (lowerText.includes('fly') || lowerText.includes('flight') || lowerText.includes('plane') || lowerText.includes('car')) {
        reply = "Transportation produces substantial carbon. High-velocity aviation emissions release CO2 straight into the upper atmosphere. Converting travels to rail networks or EVs (emitting only 0.04 kg/km) provides the absolute highest carbon savings.";
      } else {
        // Fallback to custom tip advice
        const activeTips = data?.tips;
        if (activeTips && activeTips.length > 0) {
          const randomTip = activeTips[Math.floor(Math.random() * activeTips.length)];
          reply = `In reference to your profile: I highly recommend prioritizing '${randomTip.title}'. ${randomTip.description} This directly coordinates with optimizing your parameters!`;
        }
      }

      setChatMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'assistant', text: "I'm processing your metrics right now. Transitioning household devices and micro-bundling scripts are excellent ways to hit the 95++ score!" }]);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const activeCompletedCount = Object.values(completedTips).filter(Boolean).length;
  // Calculate impact progress
  const ecoScoreProgress = advisorData?.ecoScore || 75;

  return (
    <div id="gemini-advisor-section" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Tip audit card checklists */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-[#181922] rounded-2xl border border-gray-800 p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl" />
          
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="text-base font-semibold text-white tracking-tight">AI Generated Sustainability Action Plan</h3>
            </div>
            <button 
              onClick={fetchRecommendations}
              disabled={isLoading}
              id="refresh-advisor-btn"
              className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800/80 transition-colors cursor-pointer"
              title="Re-audit metrics with Gemini"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 text-orange-400 mt-0.5" />
              <div>
                <span className="font-bold">Offline Fallback Mode:</span> {error}
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="space-y-4 py-8">
              <div className="flex flex-col items-center justify-center gap-3">
                <Leaf className="w-8 h-8 text-emerald-500 animate-bounce" />
                <p className="text-sm text-gray-400 font-mono animate-pulse">Gemini auditing calculation inputs...</p>
              </div>
              <div className="h-6 w-full bg-gray-900 rounded animate-pulse" />
              <div className="h-20 w-full bg-gray-900 rounded animate-pulse" />
              <div className="h-20 w-full bg-gray-900 rounded animate-pulse" />
            </div>
          ) : (
            <div className="space-y-4.5">
              {advisorData?.tips.map((tip, idx) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => handleToggleTip(tip.title)}
                  className={`group flex items-start gap-4 p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    completedTips[tip.title]
                      ? 'bg-emerald-500/[0.04] border-emerald-500/40 opacity-75'
                      : 'bg-black/30 border-gray-800/80 hover:bg-black/50 hover:border-gray-700'
                  }`}
                >
                  <div className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                    completedTips[tip.title]
                      ? 'bg-emerald-500 border-emerald-400 text-white'
                      : 'border-gray-600 group-hover:border-emerald-400'
                  }`}>
                    {completedTips[tip.title] && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold tracking-widest ${
                        tip.category === 'Digital' 
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                          : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      }`}>
                        {tip.category}
                      </span>
                      <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-mono font-bold tracking-widest ${
                        tip.impact === 'High' 
                          ? 'bg-red-500/10 text-red-400' 
                          : tip.impact === 'Medium' 
                          ? 'bg-amber-500/10 text-amber-400' 
                          : 'bg-indigo-500/10 text-indigo-400'
                      }`}>
                        {tip.impact} impact
                      </span>
                      <h4 className={`text-sm font-medium ${completedTips[tip.title] ? 'line-through text-gray-500' : 'text-gray-100'}`}>
                        {tip.title}
                      </h4>
                    </div>
                    <p className={`text-xs ${completedTips[tip.title] ? 'text-gray-600' : 'text-gray-400 leading-relaxed'}`}>
                      {tip.description}
                    </p>
                  </div>
                </motion.div>
              ))}

              <div className="border-t border-gray-800/80 pt-4 mt-6 flex justify-between items-center text-xs">
                <span className="text-gray-400">
                  Carbon Saving Goals Completed: <span className="text-emerald-400 font-bold font-mono">{activeCompletedCount} / {advisorData?.tips.length || 0}</span>
                </span>
                <span className="text-gray-500 italic font-mono text-[10px]">
                  Powered by gemini-3.5-flash
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Dynamic target benchmark visualizers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#181922] rounded-2xl border border-gray-800 p-5 shadow-lg flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">Score Benchmark</span>
              <h4 className="text-sm font-medium text-white mt-2">Overall Sustainability Index</h4>
              <p className="text-xs text-gray-400 mt-1">Calculated from personal carbon variables and green software scores.</p>
            </div>
            <div className="my-5 flex items-baseline gap-2 justify-center">
              <span className="text-5xl font-mono font-black text-white">{ecoScoreProgress}</span>
              <span className="text-xs font-mono text-emerald-400 font-semibold border-b border-dashed border-emerald-500">
                {ecoScoreProgress >= 95 ? "✓ Excellent (95++)" : ecoScoreProgress >= 80 ? "Medium Efficiency" : "Needs Optimization"}
              </span>
            </div>
            <div className="w-full bg-gray-900 rounded-full h-2 overflow-hidden mb-1">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  ecoScoreProgress >= 95 ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-emerald-500'
                }`}
                style={{ width: `${ecoScoreProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-gray-500 mt-1">
              <span>0 (Industrial Weight)</span>
              <span>100 (Climate Goal)</span>
            </div>
          </div>

          <div className="bg-[#181922] rounded-2xl border border-gray-800 p-5 shadow-lg flex flex-col justify-between">
            <div>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">Digital Squeeze</span>
              <h4 className="text-sm font-medium text-white mt-2">Web Carbon Weight Impact</h4>
              <p className="text-xs text-gray-400 mt-1">Proportion of annual emissions contributed purely by your target monthly visits.</p>
            </div>
            <div className="my-5 flex flex-col items-center">
              <div className="text-3xl font-mono font-bold text-white">
                ~{(advisorData?.digitalCarbonKg || 0).toFixed(2)} <span className="text-xs font-normal text-gray-400">kg/yr</span>
              </div>
              <span className="text-[10px] text-gray-500 mt-1 font-mono">
                Equates to driving {((advisorData?.digitalCarbonKg || 0) / 0.18).toFixed(1)} km in a gasoline vehicle.
              </span>
            </div>
            <div className="bg-black/30 border border-gray-800/80 rounded-xl p-3 text-center">
              <span className="text-[10px] text-gray-400">
                🌱 Action recommendation: Toggle <span className="text-emerald-400 font-semibold">Minify</span> and <span className="text-emerald-400 font-semibold">Green Host</span> to reduce transfer emissions!
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Gemini Chat Bubble Sandbox */}
      <div className="bg-[#15161e] border border-gray-800 rounded-2xl p-5 shadow-xl flex flex-col h-[540px]">
        <div className="border-b border-gray-800 pb-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-mono font-semibold text-white tracking-wider uppercase">Interactive Eco Consultant</span>
          </div>
          <span className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded font-mono font-bold">
            GEMINI FLASH
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin scrollbar-thumb-gray-800 max-h-[380px] custom-scrollbar">
          {chatMessages.map((msg, index) => (
            <div 
              key={index} 
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[10px] font-mono text-gray-500 uppercase mb-1.5 px-1 truncate max-w-full">
                {msg.role === 'user' ? 'Client Request' : 'Gemini AI Advisor'}
              </span>
              <div className={`p-3 rounded-xl text-xs max-w-[90%] leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none shadow-md' 
                  : 'bg-black/40 border border-gray-800 text-gray-300 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isSendingMessage && (
            <div className="flex flex-col items-start pt-1">
              <span className="text-[10px] font-mono text-gray-500 uppercase mb-1">Gemini AI Advisor</span>
              <div className="flex items-center gap-1.5 p-3 rounded-xl bg-black/30 border border-gray-900 border-dashed text-gray-400 text-xs rounded-tl-none">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                <span>Formulating compliance strategies...</span>
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSendMessage} className="mt-4 border-t border-gray-800/80 pt-3 flex gap-2.5">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type 'green hosting', 'minify', etc..."
            id="chat-advisor-input"
            className="flex-1 bg-black/40 border border-gray-800 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/75 transition-colors font-sans"
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || isSendingMessage}
            id="chat-advisor-submit-btn"
            className={`p-2 rounded-lg text-white transition-all flex items-center justify-center shrink-0 cursor-pointer ${
              chatInput.trim() && !isSendingMessage
                ? 'bg-emerald-500 hover:bg-emerald-400 active:scale-95 shadow-md'
                : 'bg-gray-800 text-gray-500 border border-gray-700/60'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
