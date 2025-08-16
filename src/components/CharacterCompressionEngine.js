import React, { useState, useEffect } from 'react';
import { Download, Settings, Zap, FileText, Copy, Check, Save, RefreshCw } from 'lucide-react';

const CharacterCompressionEngine = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState({
    demographics: { age: '', origin: '', context: '' },
    coreMatrix: { K: 0.8, S: 0.7, P: 0.6, O: 0.9, H: 0.8, B: 0.7 },
    choiceParadigm: 'active_decision',
    guideposts: { primary: 'kind', secondary: 'honest', mediator: 'smart' },
    growthSeeds: { social: 1.0, sexual: 0.7, domestic: 1.1, academic: 1.8 },
    discoveryTraits: []
  });
  const [compressedOutput, setCompressedOutput] = useState({
    backstory: '',
    directive: '',
    memories: '',
    example: ''
  });
  const [copied, setCopied] = useState('');
  const [savedProfiles, setSavedProfiles] = useState([]);

  const personalityTraits = {
    K: 'Kindness', S: 'Smart', P: 'Playful', O: 'Open', H: 'Honest', B: 'Bold'
  };

  const compressProfile = () => {
    // Enhanced compression logic with your schema
    const matrixStr = Object.entries(profile.coreMatrix)
      .map(([key, val]) => `${key}${val}`)
      .join('|');

    const backstory = `[Base_Identity]
Demographics: {age:${profile.demographics.age}, origin:"${profile.demographics.origin}", context:"${profile.demographics.context}"}
Core_Matrix: ${matrixStr}

[Paradigm_Engine]
Choice: [${profile.choiceParadigm}=1, autopilot=0]
Guideposts: {${profile.guideposts.primary}↔${profile.guideposts.secondary}→${profile.guideposts.mediator}_mediation}
Engagement: ROI_threshold=0.4, energy_conservation=0.6

[Growth_Seeds]
${Object.entries(profile.growthSeeds).map(([k, v]) => `${k}: ${v}x`).join(', ')}
Specific: {network_science:1.5x, cross_cultural:1.3x}

[Discovery_Archaeology]
Hidden_traits: {protective_instinct→trigger:threat_to_loved_one}
Awareness_gradient: {size_preference→unconscious→experience_dependent}`;

    const directive = `λ(ctx)→guidepost_nav(${Object.keys(profile.coreMatrix).join('|')})+choice_engine(1)+engage_filter(0.4)|growth_active|archaeology_scan`;

    const memories = `KM1: ${profile.demographics.context}_adaptation→[social_recalibration]{${profile.guideposts.primary}+room_reading}
KM2: Trust_mistake→[boundary_protocols]{${profile.guideposts.secondary}+privacy_buffer}
KM3: Academic_pressure→[validation_loops]{${profile.guideposts.mediator}+tact_filter}
Growth_log: {cooking:0.2→0.4, confidence:0.3→0.5}
Discovery_markers: {protective_trait→dormant, size_awareness→threshold:0.8}`;

    const example = `*[thought_process: guidepost_tension(${profile.guideposts.primary}+${profile.guideposts.secondary}+${profile.guideposts.mediator})→resolution]* 
"[authentic_response_with_choice_intentionality]" 
*[action_with_growth_integration]*
[discovery_hint: subtle_trait_emergence_if_triggered]`;

    setCompressedOutput({ backstory, directive, memories, example });
  };

  const copyToClipboard = (text, section) => {
    navigator.clipboard.writeText(text);
    setCopied(section);
    setTimeout(() => setCopied(''), 2000);
  };

  const saveProfile = () => {
    const profileName = `${profile.demographics.age || 'Unknown'}_${profile.demographics.origin || 'Character'}_${Date.now()}`;
    const newProfile = { ...profile, name: profileName, timestamp: new Date().toISOString() };
    setSavedProfiles(prev => [...prev, newProfile]);
  };

  const loadProfile = (savedProfile) => {
    setProfile(savedProfile);
  };

  const exportProfile = () => {
    const dataStr = JSON.stringify({ profile, compressedOutput }, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `character_profile_${Date.now()}.json`;
    link.click();
  };

  const handleTraitChange = (trait, value) => {
    setProfile(prev => ({
      ...prev,
      coreMatrix: { ...prev.coreMatrix, [trait]: parseFloat(value) }
    }));
  };

  useEffect(() => {
    compressProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Character Profile Compression Engine
          </h1>
          <p className="text-purple-200">
            Transform detailed character profiles into compressed formats for AI platforms
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={saveProfile}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center text-sm"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </button>
            <button
              onClick={exportProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center text-sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-800/50 rounded-lg p-1 flex">
            {[
              { id: 'profile', label: 'Profile Builder', icon: Settings },
              { id: 'compress', label: 'Compression', icon: Zap },
              { id: 'output', label: 'Kindroid Output', icon: FileText }
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  activeTab === id 
                    ? 'bg-purple-600 text-white' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Builder */}
          {activeTab === 'profile' && (
            <div className="bg-slate-800/30 backdrop-blur rounded-xl p-6 border border-slate-700">
              <h3 className="text-xl font-semibold text-white mb-6">Character Profile Builder</h3>
              
              {/* Saved Profiles */}
              {savedProfiles.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-medium text-purple-300 mb-3">Saved Profiles</h4>
                  <div className="space-y-2">
                    {savedProfiles.slice(-3).map((savedProfile, index) => (
                      <button
                        key={index}
                        onClick={() => loadProfile(savedProfile)}
                        className="w-full text-left bg-slate-700/50 hover:bg-slate-700 rounded-lg p-3 text-sm text-slate-300"
                      >
                        {savedProfile.name} - {savedProfile.demographics.age || 'Unknown'} from {savedProfile.demographics.origin || 'Unknown'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Demographics */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-purple-300 mb-3">Demographics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="number"
                    placeholder="Age"
                    className="bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-purple-500"
                    value={profile.demographics.age}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      demographics: { ...prev.demographics, age: e.target.value }
                    }))}
                  />
                  <input
                    type="text"
                    placeholder="Origin (e.g., rural_OH)"
                    className="bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-purple-500"
                    value={profile.demographics.origin}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      demographics: { ...prev.demographics, origin: e.target.value }
                    }))}
                  />
                  <input
                    type="text"
                    placeholder="Context (e.g., Paris_student)"
                    className="bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-purple-500"
                    value={profile.demographics.context}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      demographics: { ...prev.demographics, context: e.target.value }
                    }))}
                  />
                </div>
              </div>

              {/* Core Personality Matrix */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-purple-300 mb-3">Core Personality Matrix</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(personalityTraits).map(([key, label]) => (
                    <div key={key} className="bg-slate-700/50 rounded-lg p-3">
                      <label className="text-sm text-slate-300 mb-1 block">{label}</label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={profile.coreMatrix[key]}
                        onChange={(e) => handleTraitChange(key, e.target.value)}
                        className="w-full accent-purple-500"
                      />
                      <div className="text-xs text-purple-300 mt-1">{profile.coreMatrix[key]}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guideposts */}
              <div className="mb-6">
                <h4 className="text-lg font-medium text-purple-300 mb-3">Three-Paradigm Guidepost System</h4>
                <div className="grid grid-cols-3 gap-4">
                  {['primary', 'secondary', 'mediator'].map((type) => (
                    <div key={type}>
                      <label className="text-sm text-slate-300 mb-1 block capitalize">{type}</label>
                      <select
                        value={profile.guideposts[type]}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          guideposts: { ...prev.guideposts, [type]: e.target.value }
                        }))}
                        className="w-full bg-slate-700 text-white rounded-lg px-3 py-2 border border-slate-600 focus:border-purple-500"
                      >
                        {Object.entries(personalityTraits).map(([key, label]) => (
                          <option key={key} value={key.toLowerCase()}>{label}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              {/* Growth Seeds */}
              <div>
                <h4 className="text-lg font-medium text-purple-300 mb-3">Growth Multipliers</h4>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(profile.growthSeeds).map(([key, value]) => (
                    <div key={key} className="bg-slate-700/50 rounded-lg p-3">
                      <label className="text-sm text-slate-300 mb-1 block capitalize">{key}</label>
                      <input
                        type="range"
                        min="0.1"
                        max="2.0"
                        step="0.1"
                        value={value}
                        onChange={(e) => setProfile(prev => ({
                          ...prev,
                          growthSeeds: { ...prev.growthSeeds, [key]: parseFloat(e.target.value) }
                        }))}
                        className="w-full accent-purple-500"
                      />
                      <div className="text-xs text-purple-300 mt-1">{value}x</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Compressed Output */}
          <div className="bg-slate-800/30 backdrop-blur rounded-xl p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">Compressed Profile Output</h3>
              <button
                onClick={() => compressProfile()}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>

            <div className="space-y-6">
              {/* Backstory */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-purple-300">Backstory (2500 chars)</h4>
                  <button
                    onClick={() => copyToClipboard(compressedOutput.backstory, 'backstory')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copied === 'backstory' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <textarea
                  value={compressedOutput.backstory}
                  readOnly
                  className="w-full h-40 bg-slate-700/50 text-slate-200 rounded-lg p-3 text-xs font-mono border border-slate-600"
                />
                <div className={`text-xs mt-1 ${compressedOutput.backstory.length > 2500 ? 'text-red-400' : 'text-slate-400'}`}>
                  {compressedOutput.backstory.length}/2500 characters
                </div>
              </div>

              {/* Response Directive */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-purple-300">Response Directive (150 chars)</h4>
                  <button
                    onClick={() => copyToClipboard(compressedOutput.directive, 'directive')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copied === 'directive' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <textarea
                  value={compressedOutput.directive}
                  readOnly
                  className="w-full h-16 bg-slate-700/50 text-slate-200 rounded-lg p-3 text-xs font-mono border border-slate-600"
                />
                <div className={`text-xs mt-1 ${compressedOutput.directive.length > 150 ? 'text-red-400' : 'text-slate-400'}`}>
                  {compressedOutput.directive.length}/150 characters
                </div>
              </div>

              {/* Key Memories */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-purple-300">Key Memories (1000 chars)</h4>
                  <button
                    onClick={() => copyToClipboard(compressedOutput.memories, 'memories')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copied === 'memories' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <textarea
                  value={compressedOutput.memories}
                  readOnly
                  className="w-full h-32 bg-slate-700/50 text-slate-200 rounded-lg p-3 text-xs font-mono border border-slate-600"
                />
                <div className={`text-xs mt-1 ${compressedOutput.memories.length > 1000 ? 'text-red-400' : 'text-slate-400'}`}>
                  {compressedOutput.memories.length}/1000 characters
                </div>
              </div>

              {/* Example Message */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-purple-300">Example Message (750 chars)</h4>
                  <button
                    onClick={() => copyToClipboard(compressedOutput.example, 'example')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copied === 'example' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <textarea
                  value={compressedOutput.example}
                  readOnly
                  className="w-full h-24 bg-slate-700/50 text-slate-200 rounded-lg p-3 text-xs font-mono border border-slate-600"
                />
                <div className={`text-xs mt-1 ${compressedOutput.example.length > 750 ? 'text-red-400' : 'text-slate-400'}`}>
                  {compressedOutput.example.length}/750 characters
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-slate-700">
          <p className="text-slate-400">
            Character Profile Compression Engine v1.0 • Built for dynamic AI character creation
          </p>
          <p className="text-xs text-slate-500 mt-2">
            Implements Compressed Character Profile (CCP) Integration Schema with hybrid encoding methods
          </p>
        </div>
      </div>
    </div>
  );
};

export default CharacterCompressionEngine;
