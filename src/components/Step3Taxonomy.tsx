import React, { useState } from 'react';
import { 
  ProjectData, 
  TaxonomyCategory, 
  KeywordItem, 
  KeywordType, 
  TermCritique 
} from '../types';
import { 
  Tag, 
  RotateCw, 
  Plus, 
  Trash2, 
  CheckSquare, 
  Square, 
  AlertTriangle, 
  ArrowRight,
  Info,
  Edit2,
  Check
} from 'lucide-react';

interface Step3TaxonomyProps {
  project: ProjectData;
  onUpdateProject: (updates: Partial<ProjectData>) => void;
  onContinue: () => void;
}

const TYPE_COLORS: Record<KeywordType, string> = {
  core: 'bg-blue-950/80 text-blue-300 border-blue-800',
  synonym: 'bg-emerald-950/80 text-emerald-300 border-emerald-800',
  related: 'bg-purple-950/80 text-purple-300 border-purple-800',
  abbreviation: 'bg-amber-950/80 text-amber-300 border-amber-800',
  wildcard: 'bg-rose-950/80 text-rose-300 border-rose-800',
  phrase: 'bg-indigo-950/80 text-indigo-300 border-indigo-800'
};

export const Step3Taxonomy: React.FC<Step3TaxonomyProps> = ({
  project,
  onUpdateProject,
  onContinue
}) => {
  const [taxonomy, setTaxonomy] = useState<TaxonomyCategory[]>(project.taxonomy || []);
  const [critiques, setCritiques] = useState<TermCritique[]>(project.termCritiques || []);
  const [loading, setLoading] = useState(false);

  // New category / concept modal state
  const [newCatName, setNewCatName] = useState('');
  const [newConceptCatId, setNewConceptCatId] = useState<string | null>(null);
  const [newConceptName, setNewConceptName] = useState('');
  const [newKeywordCatId, setNewKeywordCatId] = useState<string | null>(null);
  const [newKeywordConceptId, setNewKeywordConceptId] = useState<string | null>(null);
  const [newKeywordTerm, setNewKeywordTerm] = useState('');
  const [newKeywordType, setNewKeywordType] = useState<KeywordType>('core');

  const handleRegenerate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/taxonomy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: project.title,
          decomposition: project.decomposition
        })
      });
      const data = await res.json();
      if (data.taxonomy) {
        setTaxonomy(data.taxonomy);
        setCritiques(data.termCritiques || []);
        onUpdateProject({
          taxonomy: data.taxonomy,
          termCritiques: data.termCritiques || []
        });
      }
    } catch (e) {
      console.error('Error generating taxonomy:', e);
    } finally {
      setLoading(false);
    }
  };

  const toggleKeywordSelection = (catId: string, conceptId: string, keywordId: string) => {
    const updated = taxonomy.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        concepts: cat.concepts.map(con => {
          if (con.id !== conceptId) return con;
          return {
            ...con,
            keywords: con.keywords.map(kw => {
              if (kw.id !== keywordId) return kw;
              return { ...kw, selected: !kw.selected };
            })
          };
        })
      };
    });
    setTaxonomy(updated);
  };

  const toggleAllConceptKeywords = (catId: string, conceptId: string, select: boolean) => {
    const updated = taxonomy.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        concepts: cat.concepts.map(con => {
          if (con.id !== conceptId) return con;
          return {
            ...con,
            keywords: con.keywords.map(kw => ({ ...kw, selected: select }))
          };
        })
      };
    });
    setTaxonomy(updated);
  };

  const deleteKeyword = (catId: string, conceptId: string, keywordId: string) => {
    const updated = taxonomy.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        concepts: cat.concepts.map(con => {
          if (con.id !== conceptId) return con;
          return {
            ...con,
            keywords: con.keywords.filter(kw => kw.id !== keywordId)
          };
        })
      };
    });
    setTaxonomy(updated);
  };

  const addCategory = () => {
    if (!newCatName.trim()) return;
    const newCat: TaxonomyCategory = {
      id: `cat_${Date.now()}`,
      name: newCatName.trim(),
      concepts: []
    };
    setTaxonomy([...taxonomy, newCat]);
    setNewCatName('');
  };

  const addConcept = (catId: string) => {
    if (!newConceptName.trim()) return;
    const updated = taxonomy.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        concepts: [
          ...cat.concepts,
          {
            id: `con_${Date.now()}`,
            name: newConceptName.trim(),
            keywords: []
          }
        ]
      };
    });
    setTaxonomy(updated);
    setNewConceptName('');
    setNewConceptCatId(null);
  };

  const addKeyword = (catId: string, conceptId: string) => {
    if (!newKeywordTerm.trim()) return;
    const updated = taxonomy.map(cat => {
      if (cat.id !== catId) return cat;
      return {
        ...cat,
        concepts: cat.concepts.map(con => {
          if (con.id !== conceptId) return con;
          return {
            ...con,
            keywords: [
              ...con.keywords,
              {
                id: `kw_${Date.now()}`,
                term: newKeywordTerm.trim(),
                type: newKeywordType,
                selected: true
              }
            ]
          };
        })
      };
    });
    setTaxonomy(updated);
    setNewKeywordTerm('');
    setNewKeywordCatId(null);
    setNewKeywordConceptId(null);
  };

  const handleSaveAndContinue = () => {
    onUpdateProject({ taxonomy, termCritiques: critiques });
    onContinue();
  };

  const totalKeywords = taxonomy.flatMap(c => c.concepts.flatMap(con => con.keywords)).length;
  const selectedKeywords = taxonomy.flatMap(c => c.concepts.flatMap(con => con.keywords.filter(k => k.selected))).length;

  return (
    <div className="max-w-6xl mx-auto py-8 px-6 space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
            <Tag className="w-4 h-4" />
            <span>Step 3 of 9</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Taxonomy & Keyword Expansion
          </h1>
          <p className="text-sm text-slate-400">
            Structure research facets into categories, concepts, and classified keywords. Only selected keywords will be converted into database search strings in Step 4.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
          >
            <RotateCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-amber-400' : ''}`} />
            <span>{loading ? 'Analyzing...' : 'Regenerate Taxonomy'}</span>
          </button>
        </div>
      </div>

      {/* Summary and Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <span className="text-[10px] uppercase font-bold text-slate-400">Categories</span>
          <p className="text-lg font-bold text-white mt-0.5">{taxonomy.length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <span className="text-[10px] uppercase font-bold text-slate-400">Concepts</span>
          <p className="text-lg font-bold text-white mt-0.5">{taxonomy.flatMap(c => c.concepts).length}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <span className="text-[10px] uppercase font-bold text-slate-400">Total Keywords</span>
          <p className="text-lg font-bold text-white mt-0.5">{totalKeywords}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-3">
          <span className="text-[10px] uppercase font-bold text-amber-400">Selected for Search</span>
          <p className="text-lg font-bold text-amber-400 mt-0.5">{selectedKeywords} of {totalKeywords}</p>
        </div>
      </div>

      {/* AI Keyword Intelligence & Critiques */}
      {critiques.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-4 space-y-2.5">
          <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wide">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>AI Keyword Intelligence Audit</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {critiques.map((cr, idx) => (
              <div key={idx} className="bg-slate-950/70 p-3 rounded-lg border border-amber-900/30 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-200">"{cr.term}"</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-400/20 text-amber-300 font-bold">
                    {cr.issue.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">{cr.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-2 text-[11px] bg-slate-900/60 p-3 rounded-lg border border-slate-800">
        <span className="font-semibold text-slate-400 mr-2">Keyword Classification:</span>
        {(['core', 'synonym', 'related', 'abbreviation', 'wildcard', 'phrase'] as KeywordType[]).map((type) => (
          <span key={type} className={`px-2 py-0.5 rounded border capitalize font-medium ${TYPE_COLORS[type]}`}>
            {type}
          </span>
        ))}
      </div>

      {/* Taxonomy Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[11px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 w-48">Category</th>
                <th className="py-3 px-4 w-52">Concept</th>
                <th className="py-3 px-4">Expanded Keywords & Terms</th>
                <th className="py-3 px-4 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {taxonomy.map((category) => (
                <React.Fragment key={category.id}>
                  {category.concepts.map((concept, cIdx) => (
                    <tr key={concept.id} className="hover:bg-slate-800/40 transition-colors">
                      {cIdx === 0 && (
                        <td 
                          rowSpan={category.concepts.length || 1} 
                          className="py-4 px-4 font-bold text-slate-200 bg-slate-950/40 border-r border-slate-800 align-top"
                        >
                          <div className="space-y-2">
                            <span className="text-sm text-amber-300">{category.name}</span>
                            <button
                              onClick={() => setNewConceptCatId(category.id)}
                              className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center space-x-1"
                            >
                              <Plus className="w-3 h-3" />
                              <span>Add Concept</span>
                            </button>
                          </div>
                        </td>
                      )}
                      
                      <td className="py-4 px-4 font-semibold text-slate-300 border-r border-slate-800 align-top">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span>{concept.name}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-[10px] text-slate-400">
                            <button 
                              onClick={() => toggleAllConceptKeywords(category.id, concept.id, true)}
                              className="hover:text-amber-400"
                            >
                              Select All
                            </button>
                            <span>•</span>
                            <button 
                              onClick={() => toggleAllConceptKeywords(category.id, concept.id, false)}
                              className="hover:text-amber-400"
                            >
                              Deselect
                            </button>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <div className="flex flex-wrap gap-1.5 items-center">
                          {concept.keywords.map((kw) => (
                            <div
                              key={kw.id}
                              className={`group inline-flex items-center space-x-1 px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                                kw.selected 
                                  ? TYPE_COLORS[kw.type] 
                                  : 'bg-slate-950/40 text-slate-600 border-slate-800 opacity-60'
                              }`}
                            >
                              <button
                                onClick={() => toggleKeywordSelection(category.id, concept.id, kw.id)}
                                className="mr-1 focus:outline-none"
                              >
                                {kw.selected ? (
                                  <CheckSquare className="w-3 h-3 text-amber-400" />
                                ) : (
                                  <Square className="w-3 h-3 text-slate-500" />
                                )}
                              </button>
                              <span>{kw.term}</span>
                              <button
                                onClick={() => deleteKeyword(category.id, concept.id, kw.id)}
                                className="opacity-0 group-hover:opacity-100 hover:text-rose-400 ml-1 text-slate-400 transition-opacity"
                                title="Delete keyword"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}

                          <button
                            onClick={() => {
                              setNewKeywordCatId(category.id);
                              setNewKeywordConceptId(concept.id);
                            }}
                            className="inline-flex items-center space-x-1 px-2 py-1 rounded-md text-[11px] bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-amber-300 border border-dashed border-slate-700 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Keyword</span>
                          </button>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right align-top">
                        <span className="text-[11px] font-mono text-slate-400">
                          {concept.keywords.filter(k => k.selected).length}/{concept.keywords.length}
                        </span>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Add New Category bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 max-w-md w-full">
            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="New Category Name (e.g. Environmental Factors)..."
              className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-400"
            />
            <button
              onClick={addCategory}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Category</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Concept Modal / Drawer */}
      {newConceptCatId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Add New Concept</h3>
            <p className="text-xs text-slate-400">Add a sub-concept under category: <span className="text-amber-400 font-semibold">{taxonomy.find(c => c.id === newConceptCatId)?.name}</span></p>
            <input
              type="text"
              value={newConceptName}
              onChange={(e) => setNewConceptName(e.target.value)}
              placeholder="e.g. Vessel Hydrodynamics"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
              autoFocus
            />
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setNewConceptCatId(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => addConcept(newConceptCatId)}
                className="px-4 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300"
              >
                Create Concept
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Keyword Modal */}
      {newKeywordCatId && newKeywordConceptId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white">Add Keyword Term</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Keyword or Phrase</label>
                <input
                  type="text"
                  value={newKeywordTerm}
                  onChange={(e) => setNewKeywordTerm(e.target.value)}
                  placeholder="e.g. Holtrop-Mennen, PINN, biofouling"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Term Classification</label>
                <select
                  value={newKeywordType}
                  onChange={(e) => setNewKeywordType(e.target.value as KeywordType)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:ring-1 focus:ring-amber-400 focus:outline-none"
                >
                  <option value="core">Core Term</option>
                  <option value="synonym">Synonym</option>
                  <option value="related">Related Term</option>
                  <option value="abbreviation">Abbreviation</option>
                  <option value="wildcard">Wildcard Term (*)</option>
                  <option value="phrase">Phrase Term ("...")</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => {
                  setNewKeywordCatId(null);
                  setNewKeywordConceptId(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => addKeyword(newKeywordCatId, newKeywordConceptId)}
                className="px-4 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-bold text-xs hover:bg-amber-300"
              >
                Add Term
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Continue */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-400 flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-amber-400" />
          <span>{selectedKeywords} keywords ready to construct Scopus, WoS, and Google Scholar search queries.</span>
        </div>

        <button
          onClick={handleSaveAndContinue}
          disabled={selectedKeywords === 0}
          className="flex items-center space-x-2 px-6 py-3 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-slate-950 font-bold text-sm transition-all shadow-md"
        >
          <span>Continue to Search Strategy</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
