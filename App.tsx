import React, { useState, useEffect } from 'react';
import { Beer, Users, UserPlus, ArrowRight, Save, RefreshCw, Trophy, Loader2 } from 'lucide-react';
import { COMMERCIAL_BEERS, CRAFT_STYLES, INITIAL_EXPERTS } from './constants';
import { BeerCard } from './components/BeerCard';
import { ResultsChart } from './components/ResultsChart';
import { generateRecommendations } from './services/recommendationEngine';
import { getSommelierInsight } from './services/geminiService';
import { UserProfile, RecommendationResult, GeminiInsight } from './types';

type ViewMode = 'home' | 'upt_intro' | 'upt_commercial' | 'upt_craft' | 'tpu_intro' | 'tpu_commercial' | 'tpu_results';

function App() {
  const [view, setView] = useState<ViewMode>('home');
  const [experts, setExperts] = useState<UserProfile[]>(INITIAL_EXPERTS);
  const [currentRatings, setCurrentRatings] = useState<Record<string, number>>({});
  const [uptName, setUptName] = useState('');
  
  // Results State
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [topNeighbors, setTopNeighbors] = useState<string[]>([]);
  const [geminiInsight, setGeminiInsight] = useState<GeminiInsight | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Load experts from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('craftbeer_experts');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setExperts([...INITIAL_EXPERTS, ...parsed]);
        }
      } catch (e) {
        console.error("Failed to load experts", e);
      }
    }
  }, []);

  const handleRate = (id: string, rating: number) => {
    setCurrentRatings(prev => ({ ...prev, [id]: rating }));
  };

  const resetFlow = () => {
    setCurrentRatings({});
    setUptName('');
    setRecommendations([]);
    setGeminiInsight(null);
    setView('home');
  };

  // --- UPT (Expert) Handlers ---
  const saveExpert = () => {
    const newExpert: UserProfile = {
      id: `upt-${Date.now()}`,
      name: uptName || 'Experto Anónimo',
      type: 'UPT',
      commercialRatings: Object.fromEntries(
        Object.entries(currentRatings).filter(([k]) => k.startsWith('cc'))
      ) as Record<string, number>,
      craftRatings: Object.fromEntries(
        Object.entries(currentRatings).filter(([k]) => k.startsWith('ca'))
      ) as Record<string, number>
    };

    const updatedExperts = [...experts, newExpert];
    setExperts(updatedExperts);
    
    // Persist only the new ones to avoid duplicating initial constants on reload logic check
    const userAdded = updatedExperts.filter(e => !INITIAL_EXPERTS.find(ie => ie.id === e.id));
    localStorage.setItem('craftbeer_experts', JSON.stringify(userAdded));

    alert('¡Gracias! Tu perfil de experto ha sido guardado y ayudará a futuros usuarios.');
    resetFlow();
  };

  // --- TPU (Novice) Handlers ---
  const processRecommendations = async () => {
    const { results, neighbors } = generateRecommendations(currentRatings, experts);
    setRecommendations(results);
    setTopNeighbors(neighbors);
    setView('tpu_results');

    // Fetch AI Insight
    setLoadingInsight(true);
    const insight = await getSommelierInsight(results);
    setGeminiInsight(insight);
    setLoadingInsight(false);
  };

  // --- Render Helpers ---

  const isFormComplete = (prefix: 'cc' | 'ca', total: number) => {
    const count = Object.keys(currentRatings).filter(k => k.startsWith(prefix)).length;
    return count === total;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-20">
      
      {/* Header */}
      <header className="flex items-center justify-between mb-10 border-b border-gray-800 pb-6">
        <div className="flex items-center gap-3">
          <div className="bg-beer-amber p-2 rounded-lg text-white">
            <Beer size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">CraftBeer Matcher</h1>
            <p className="text-gray-400 text-sm">Descubre tu estilo ideal</p>
          </div>
        </div>
        {view !== 'home' && (
          <button onClick={resetFlow} className="text-sm text-gray-500 hover:text-white flex items-center gap-1">
            <RefreshCw size={14} /> Reiniciar
          </button>
        )}
      </header>

      {/* VIEW: HOME */}
      {view === 'home' && (
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <button 
            onClick={() => setView('tpu_intro')}
            className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-beer-gold transition-all hover:shadow-[0_0_30px_rgba(251,191,36,0.2)] text-left"
          >
            <div className="absolute top-6 right-6 text-gray-600 group-hover:text-beer-gold transition-colors">
              <Users size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-beer-gold">Todos para Uno</h2>
            <p className="text-gray-400 mb-6">
              ¿Eres nuevo en el mundo artesanal? Califica cervezas comerciales que ya conoces y te diremos qué estilos artesanales te encantarán.
            </p>
            <span className="inline-flex items-center text-beer-gold font-semibold">
              Comenzar <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          <button 
            onClick={() => setView('upt_intro')}
            className="group relative bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-2xl border border-gray-700 hover:border-beer-amber transition-all hover:shadow-[0_0_30px_rgba(217,119,6,0.2)] text-left"
          >
            <div className="absolute top-6 right-6 text-gray-600 group-hover:text-beer-amber transition-colors">
              <UserPlus size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 group-hover:text-beer-amber">Uno para Todos</h2>
            <p className="text-gray-400 mb-6">
              ¿Eres un experto conocedor? Ayúdanos a mejorar nuestro algoritmo compartiendo tus preferencias tanto comerciales como artesanales.
            </p>
            <span className="inline-flex items-center text-beer-amber font-semibold">
              Contribuir <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
          
          <div className="md:col-span-2 text-center text-gray-500 text-sm mt-8">
            Base de datos actual: <span className="text-white font-mono">{experts.length}</span> expertos registrados.
          </div>
        </div>
      )}

      {/* VIEW: TPU INTRO */}
      {view === 'tpu_intro' && (
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-beer-gold">Modo Descubrimiento</h2>
          <p className="text-gray-300 text-lg mb-8">
            Para encontrar tu "alma gemela" cervecera, necesitamos saber qué te gusta actualmente. 
            Te presentaremos 10 cervezas comerciales populares. Sé honesto con tus calificaciones.
          </p>
          <button 
            onClick={() => setView('tpu_commercial')}
            className="bg-beer-gold text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors"
          >
            Empezar Encuesta
          </button>
        </div>
      )}

      {/* VIEW: UPT INTRO */}
      {view === 'upt_intro' && (
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4 text-beer-amber">Modo Experto</h2>
          <p className="text-gray-300 text-lg mb-8">
            Gracias por contribuir. El proceso consta de dos partes:
            <br />
            1. Calificar 10 cervezas comerciales (para establecer tu línea base).
            <br />
            2. Calificar 8 estilos artesanales (para enseñar al sistema).
          </p>
          <div className="mb-8">
            <label className="block text-left text-sm font-medium text-gray-400 mb-1">Tu Nombre / Apodo</label>
            <input 
              type="text" 
              value={uptName}
              onChange={(e) => setUptName(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-beer-amber outline-none"
              placeholder="Ej. Lord Lúpulo"
            />
          </div>
          <button 
            disabled={!uptName.trim()}
            onClick={() => setView('upt_commercial')}
            className="bg-beer-amber text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar
          </button>
        </div>
      )}

      {/* VIEW: COMMERCIAL RATINGS (Shared Layout) */}
      {(view === 'tpu_commercial' || view === 'upt_commercial') && (
        <div>
          <h2 className="text-2xl font-bold mb-2">Paso 1: Cervezas Comerciales</h2>
          <p className="text-gray-400 mb-6">Califica del 1 al 5. Si no has probado alguna, déjala vacía (se considerará neutral).</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {COMMERCIAL_BEERS.map(beer => (
              <BeerCard 
                key={beer.id} 
                beer={beer} 
                rating={currentRatings[beer.id] || 0} 
                onRate={handleRate} 
              />
            ))}
          </div>

          <div className="flex justify-end sticky bottom-4 z-10">
             <button 
                onClick={() => {
                  if (view === 'tpu_commercial') processRecommendations();
                  else setView('upt_craft');
                }}
                className={`px-8 py-3 rounded-full font-bold text-lg shadow-xl transition-all ${
                  view === 'tpu_commercial' 
                  ? 'bg-beer-gold text-black hover:bg-yellow-400' 
                  : 'bg-beer-amber text-white hover:bg-amber-600'
                }`}
              >
                {view === 'tpu_commercial' ? 'Ver Resultados' : 'Siguiente Paso'}
              </button>
          </div>
        </div>
      )}

      {/* VIEW: UPT CRAFT RATINGS */}
      {view === 'upt_craft' && (
        <div>
          <h2 className="text-2xl font-bold mb-2">Paso 2: Estilos Artesanales</h2>
          <p className="text-gray-400 mb-6">Indica tu preferencia para estos estilos clásicos.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {CRAFT_STYLES.map(beer => (
              <div key={beer.id} className="flex flex-col h-full">
                <BeerCard 
                  beer={beer} 
                  rating={currentRatings[beer.id] || 0} 
                  onRate={handleRate} 
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end sticky bottom-4 z-10">
             <button 
                onClick={saveExpert}
                className="bg-green-600 text-white px-8 py-3 rounded-full font-bold text-lg shadow-xl hover:bg-green-500 transition-all flex items-center gap-2"
              >
                <Save size={20} /> Guardar Perfil
              </button>
          </div>
        </div>
      )}

      {/* VIEW: TPU RESULTS */}
      {view === 'tpu_results' && (
        <div className="animate-in fade-in duration-500">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Tu ADN Cervecero</h2>
            <p className="text-gray-400">
              Basado en tus gustos, te comparamos con los 5 expertos más similares ({topNeighbors.join(', ')}) y calculamos tu afinidad.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Chart Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Trophy className="text-beer-gold" size={20}/> Afinidad por Estilo
                </h3>
                <ResultsChart data={recommendations} />
              </div>
            </div>

            {/* AI Insight Section */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-6 border border-gray-700 h-full">
                 <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-beer-gold to-beer-amber">
                   Análisis del Sommelier
                 </h3>
                 
                 {loadingInsight ? (
                   <div className="flex flex-col items-center justify-center h-40 text-gray-500 gap-3">
                     <Loader2 className="animate-spin" size={32} />
                     <p className="text-sm">Analizando paladar...</p>
                   </div>
                 ) : geminiInsight ? (
                   <div className="space-y-4">
                     <div className="bg-black/30 p-4 rounded-lg border border-white/10">
                        <h4 className="font-serif text-xl italic text-beer-gold mb-2">"{geminiInsight.title}"</h4>
                        <p className="text-gray-300 leading-relaxed text-sm">
                          {geminiInsight.content}
                        </p>
                     </div>
                     <div className="text-xs text-gray-500 text-center">
                       Powered by Gemini
                     </div>
                   </div>
                 ) : (
                   <p className="text-red-400 text-sm">No se pudo cargar el análisis detallado.</p>
                 )}

                 {/* Top Recommendations Text List */}
                 <div className="mt-8">
                    <h4 className="font-bold text-white mb-3">Top 3 Recomendaciones:</h4>
                    <ul className="space-y-3">
                      {recommendations.slice(0,3).map((rec, i) => (
                        <li key={rec.styleId} className="flex items-center gap-3 bg-gray-800 p-2 rounded-lg">
                          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-700 text-xs font-bold text-gray-300">
                            {i+1}
                          </span>
                          <span className={`font-medium ${rec.category === 'Lager' ? 'text-beer-gold' : 'text-beer-amber'}`}>
                            {rec.styleName}
                          </span>
                          <span className="ml-auto text-sm text-gray-400">{rec.affinityScore}%</span>
                        </li>
                      ))}
                    </ul>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;