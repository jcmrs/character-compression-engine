import React, { useState, useEffect } from 'react';
import { Copy, Check, RefreshCw, Save, Download } from 'lucide-react';

const CharacterCompressionEngine = () => {
  const [profile, setProfile] = useState({
    demographics: { age: '', origin: '', context: '' },
    profileText: '',
    userBackstory: '',
    userMemories: '',
    userExample: '',
    coreMatrix: { K: 0.8, S: 0.7, P: 0.6, O: 0.9, H: 0.8, B: 0.7 },
    agency: {
      academic: 'bachelor',
      social: 1.0,
      practical: 1.0,
      skills: ''
    },
    growthSeeds: { social: 1.0, sexual: 0.7, domestic: 1.1, academic: 1.8 }
  });
  
  const [compressedOutput, setCompressedOutput] = useState({
    profile: '',
    compressedBackstory: '',
    fullBackstory: '',
    directive: '',
    compressedMemories: '',
    fullMemories: '',
    compressedExample: '',
    fullExample: ''
  });
  
  const [copied, setCopied] = useState('');
  const [savedProfiles, setSavedProfiles] = useState([]);

  const personalityTraits = {
    K: 'Kindness', 
    S: 'Smart', 
    P: 'Playful', 
    O: 'Open', 
    H: 'Honest', 
    B: 'Boundaries'
  };

  const academicLevels = {
    'high_school': { label: 'High School / GED', weight: 0.3 },
    'some_college': { label: 'Some College', weight: 0.5 },
    'bachelor': { label: "Bachelor's Degree", weight: 0.7 },
    'master': { label: "Master's Degree", weight: 0.9 },
    'phd': { label: 'PhD / Professional Degree', weight: 1.2 },
    'self_taught': { label: 'Self-Taught Equivalent', weight: 0.8 }
  };

  const growthMultiplierExplanations = {
    social: 'How quickly the character develops social skills, relationships, and interpersonal understanding',
    sexual: 'Rate of development in romantic relationships, intimacy, and attraction patterns',
    domestic: 'Learning speed for household skills, cooking, organization, and daily life management',
    academic: 'Intellectual growth rate, learning new concepts, and formal knowledge acquisition'
  };

  const calculateAgency = () => {
    const academicWeight = academicLevels[profile.agency.academic].weight;
    const socialWeight = profile.agency.social;
    const practicalWeight = profile.agency.practical;
    
    // Skills analysis (simple word count for now, could be enhanced with NLP)
    const skillsWeight = profile.agency.skills ? Math.min(profile.agency.skills.split(',').length * 0.1, 0.5) : 0;
    
    const totalAgency = (academicWeight + socialWeight + practicalWeight + skillsWeight) / 3.5;
    return Math.min(Math.max(totalAgency, 0.1), 2.0);
  };

  const compressProfile = () => {
    const agencyLevel = calculateAgency();
    
    const matrixStr = Object.entries(profile.coreMatrix)
      .map(([key, val]) => `${key}${val}`)
      .join('|');

    const profileOutput = profile.profileText || `${profile.demographics.age || '[age]'}-year-old from ${profile.demographics.origin || '[origin]'}, currently ${profile.demographics.context || '[context]'}. [Add your profile description here]`;

    // Agency-influenced paradigm compression
    const initiativeCapacity = Math.round(agencyLevel * 10) / 10;
    const navigationSophistication = agencyLevel > 1.0 ? 'advanced' : agencyLevel > 0.7 ? 'moderate' : 'basic';
    const persistenceThreshold = Math.round((0.3 + agencyLevel * 0.4) * 10) / 10;

    const compressedBackstoryData = `[Base_Identity]
Demographics: {age:${profile.demographics.age}, origin:"${profile.demographics.origin}", context:"${profile.demographics.context}"}
Core_Matrix: ${matrixStr}

[Agency_Foundation]
Academic: ${academicLevels[profile.agency.academic].weight}, Social: ${profile.agency.social}, Practical: ${profile.agency.practical}
Skills: [${profile.agency.skills || 'general_competency'}]
Total_Agency: ${initiativeCapacity}

[Paradigm_Engine]
Initiative: [capacity=${initiativeCapacity}, choice_threshold=0.4]
Navigation: {fluid_6D_space=${navigationSophistication}, tension_balance=${matrixStr}}
Persistence: [sophistication=${navigationSophistication}, threshold=${persistenceThreshold}, redirect_capability=enabled]

[Growth_Seeds]
${Object.entries(profile.growthSeeds).map(([k, v]) => `${k}: ${v}x`).join(', ')}
Agency_multiplier: ${initiativeCapacity}x

[Discovery_Archaeology]
Hidden_traits: {protective_instinct→trigger:threat_to_loved_one}
Awareness_gradient: {agency_development→context_dependent→experience_based}`;

    const fullBackstoryOutput = profileOutput + '\n\n' + compressedBackstoryData + (profile.userBackstory ? '\n\n' + profile.userBackstory : '');

    const directive = `λ(ctx)→initiative_check(${initiativeCapacity})+fluid_nav(${Object.keys(profile.coreMatrix).join('|')})+persistence_filter(${persistenceThreshold})|agency_active|evolution_enabled`;

    const compressedMemoriesData = `KM1: ${profile.demographics.context}_navigation→[initiative_development]{agency:${initiativeCapacity}}
KM2: Social_learning→[6D_tension_balance]{${profile.coreMatrix.K}K+${profile.coreMatrix.H}H+${profile.coreMatrix.B}B}
KM3: Practical_experience→[persistence_calibration]{threshold:${persistenceThreshold}}
Agency_log: {academic:${academicLevels[profile.agency.academic].weight}→social:${profile.agency.social}→practical:${profile.agency.practical}}
Navigation_patterns: {context_adaptive→sophistication:${navigationSophistication}}`;

    const fullMemoriesOutput = compressedMemoriesData + (profile.userMemories ? '\n\n' + profile.userMemories : '');

    const compressedExampleData = `*[initiative_assessment: agency_level=${initiativeCapacity}→choice_capacity]* 
*[6D_navigation: K${profile.coreMatrix.K}↔B${profile.coreMatrix.B} tension, S${profile.coreMatrix.S}↔P${profile.coreMatrix.P} balance, O${profile.coreMatrix.O}↔H${profile.coreMatrix.H} flow]*
"[contextual_response_with_agency_sophistication]"
*[persistence_evaluation: threshold=${persistenceThreshold}→continue/redirect/evolve]*`;

    const fullExampleOutput = compressedExampleData + (profile.userExample ? '\n\n' + profile.userExample : '');

    setCompressedOutput({ 
      profile: profileOutput, 
      compressedBackstory: compressedBackstoryData,
      fullBackstory: fullBackstoryOutput,
      directive, 
      compressedMemories: compressedMemoriesData,
      fullMemories: fullMemoriesOutput,
      compressedExample: compressedExampleData,
      fullExample: fullExampleOutput
    });
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

  const handleAgencyChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      agency: { ...prev.agency, [field]: value }
    }));
  };

  useEffect(() => {
    compressProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const currentAgency = calculateAgency();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Character Profile Compression Engine
          </h1>
          <p className="text-gray-600 mb-4">
            Transform detailed character profiles into agency-aware compressed formats for AI platforms
          </p>
          <div className="flex gap-3">
            <button
              onClick={saveProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center text-sm font-medium"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Profile
            </button>
            <button
              onClick={exportProfile}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md flex items-center text-sm font-medium"
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Builder */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Profile Configuration</h2>
            
            {/* Saved Profiles */}
            {savedProfiles.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Profiles</h3>
                <div className="space-y-2">
                  {savedProfiles.slice(-3).map((savedProfile, index) => (
                    <button
                      key={index}
                      onClick={() => loadProfile(savedProfile)}
                      className="w-full text-left bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md p-3 text-sm"
                    >
                      <div className="font-medium text-gray-900">{savedProfile.name}</div>
                      <div className="text-gray-500">
                        Age: {savedProfile.demographics.age || 'N/A'} • Origin: {savedProfile.demographics.origin || 'N/A'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Profile Text */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Profile Description</h3>
              <textarea
                placeholder="Write a brief profile description (like a dating app bio). This appears before the compressed backstory."
                className="w-full h-20 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={profile.profileText}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  profileText: e.target.value
                }))}
              />
              <div className="text-xs text-gray-500 mt-1">
                {profile.profileText.length}/250 characters recommended
              </div>
            </div>

            {/* User Backstory Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Additional Backstory</h3>
              <textarea
                placeholder="Add further Backstory details such as System Commands, Cheats, Tricks (250 chars)..."
                className="w-full h-20 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={profile.userBackstory}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  userBackstory: e.target.value
                }))}
              />
              <div className="text-xs text-gray-500 mt-1">
                {profile.userBackstory.length}/250 characters
              </div>
            </div>

            {/* User Memories Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Additional Memories</h3>
              <textarea
                placeholder="Add custom Key Memories or Key Events (250 chars)..."
                className="w-full h-20 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={profile.userMemories}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  userMemories: e.target.value
                }))}
              />
              <div className="text-xs text-gray-500 mt-1">
                {profile.userMemories.length}/250 characters
              </div>
            </div>

            {/* User Example Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Additional Example Message</h3>
              <textarea
                placeholder="Add custom example behaviors or response patterns (150 chars)..."
                className="w-full h-16 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={profile.userExample}
                onChange={(e) => setProfile(prev => ({
                  ...prev,
                  userExample: e.target.value
                }))}
              />
              <div className="text-xs text-gray-500 mt-1">
                {profile.userExample.length}/150 characters
              </div>
            </div>

            {/* Agency Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Agency Development</h3>
              <div className="text-xs text-gray-600 mb-4 bg-green-50 border border-green-200 rounded-md p-3">
                <strong>Agency</strong> determines your character's capacity for initiative, sophistication of navigation, and persistence filtering.
                Current Agency Level: <strong>{currentAgency.toFixed(1)}x</strong>
              </div>
              
              {/* Academic Agency */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-600 mb-1">Academic Agency</label>
                <select
                  value={profile.agency.academic}
                  onChange={(e) => handleAgencyChange('academic', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.entries(academicLevels).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              {/* Social Agency */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-gray-600">Social Agency</label>
                  <span className="text-xs text-gray-500">{profile.agency.social}x</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.1"
                  value={profile.agency.social}
                  onChange={(e) => handleAgencyChange('social', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-600 mt-1">
                  Interpersonal navigation, cultural awareness, reading people and situations
                </div>
              </div>

              {/* Practical Agency */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-medium text-gray-600">Practical Agency</label>
                  <span className="text-xs text-gray-500">{profile.agency.practical}x</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="2.0"
                  step="0.1"
                  value={profile.agency.practical}
                  onChange={(e) => handleAgencyChange('practical', parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-600 mt-1">
                  Real-world problem solving, street smarts, hands-on competence
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Key Skills</label>
                <input
                  type="text"
                  placeholder="e.g., programming, cooking, languages, music..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={profile.agency.skills}
                  onChange={(e) => handleAgencyChange('skills', e.target.value)}
                />
                <div className="text-xs text-gray-500 mt-1">
                  Comma-separated list of specific competencies
                </div>
              </div>
            </div>
            
            {/* Demographics */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Demographics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Age</label>
                  <input
                    type="number"
                    placeholder="22"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={profile.demographics.age}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      demographics: { ...prev.demographics, age: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Origin</label>
                  <input
                    type="text"
                    placeholder="rural_OH"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={profile.demographics.origin}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      demographics: { ...prev.demographics, origin: e.target.value }
                    }))}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Context</label>
                  <input
                    type="text"
                    placeholder="Paris_student"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={profile.demographics.context}
                    onChange={(e) => setProfile(prev => ({
                      ...prev,
                      demographics: { ...prev.demographics, context: e.target.value }
                    }))}
                  />
                </div>
              </div>
            </div>

            {/* Core Personality Matrix */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Personality Matrix</h3>
              <div className="text-xs text-gray-600 mb-4 bg-purple-50 border border-purple-200 rounded-md p-3">
                <strong>6D Navigation Space:</strong> These traits create fluid tension dynamics for contextual behavior navigation.
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(personalityTraits).map(([key, label]) => (
                  <div key={key} className="bg-gray-50 border border-gray-200 rounded-md p-3">
                    <label className="block text-xs font-medium text-gray-600 mb-2">{label} ({key})</label>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={profile.coreMatrix[key]}
                      onChange={(e) => handleTraitChange(key, e.target.value)}
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="text-xs text-gray-500 mt-1 text-center">{profile.coreMatrix[key]}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth Seeds */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">Growth Multipliers</h3>
              <div className="text-xs text-gray-600 mb-4 bg-blue-50 border border-blue-200 rounded-md p-3">
                <strong>Growth multipliers</strong> determine how quickly your character learns and develops in different areas. 
                Higher values (1.5x-2.0x) mean faster learning, while lower values (0.1x-0.7x) indicate slower development or resistance to change.
              </div>
              <div className="grid grid-cols-1 gap-4">
                {Object.entries(profile.growthSeeds).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 border border-gray-200 rounded-md p-3">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-medium text-gray-700 capitalize">{key}</label>
                      <span className="text-xs text-gray-500">{value}x</span>
                    </div>
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
                      className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer mb-2"
                    />
                    <div className="text-xs text-gray-600">
                      {growthMultiplierExplanations[key]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Compressed Output */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Compressed Output</h2>
              <button
                onClick={() => compressProfile()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded-md flex items-center text-sm"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Refresh
              </button>
            </div>

            <div className="space-y-6">
              {/* Full Backstory (2500 chars total) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Full Backstory (2500 chars total)</h3>
                  <button
                    onClick={() => copyToClipboard(compressedOutput.fullBackstory, 'fullBackstory')}
                    className="text-gray-500 hover:text-gray-700 p-1"
                    title="Copy to clipboard"
                  >
                    {copied === 'fullBackstory' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <textarea
                  value={compressedOutput.fullBackstory}
                  readOnly
                  className="w-full h-40 border border-gray-300 rounded-md p-3 text-xs bg-gray-50 resize-none"
                />
                <div className={`text-xs mt-1 ${compressedOutput.fullBackstory.length > 2500 ? 'text-red-600' : 'text-gray-500'}`}>
                  {compressedOutput.fullBackstory.length}/2500 characters
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Profile ({compressedOutput.profile.length}/250) + Compressed ({compressedOutput.compressedBackstory.length}/2000) + User ({profile.userBackstory.length}/250)
                </div>
              </div>

              {/* Response Directive */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Response Directive (150 chars)</h3>
                  <button
                    onClick={() => copyToClipboard(compressedOutput.directive, 'directive')}
                    className="text-gray-500 hover:text-gray-700 p-1"
                    title="Copy to clipboard"
                  >
                    {copied === 'directive' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <textarea
                  value={compressedOutput.directive}
                  readOnly
                  className="w-full h-16 border border-gray-300 rounded-md p-3 text-xs font-mono bg-gray-50 resize-none"
                />
                <div className={`text-xs mt-1 ${compressedOutput.directive.length > 150 ? 'text-red-600' : 'text-gray-500'}`}>
                  {compressedOutput.directive.length}/150 characters
                </div>
              </div>

              {/* Key Memories (1000 chars total) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Key Memories (1000 chars total)</h3>
                  <button
                    onClick={() => copyToClipboard(compressedOutput.fullMemories, 'fullMemories')}
                    className="text-gray-500 hover:text-gray-700 p-1"
                    title="Copy to clipboard"
                  >
                    {copied === 'fullMemories' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <textarea
                  value={compressedOutput.fullMemories}
                  readOnly
                  className="w-full h-32 border border-gray-300 rounded-md p-3 text-xs bg-gray-50 resize-none"
                />
                <div className={`text-xs mt-1 ${compressedOutput.fullMemories.length > 1000 ? 'text-red-600' : 'text-gray-500'}`}>
                  {compressedOutput.fullMemories.length}/1000 characters
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Compressed ({compressedOutput.compressedMemories.length}/750) + User ({profile.userMemories.length}/250)
                </div>
              </div>

              {/* Example Message (750 chars total) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-gray-700">Example Message (750 chars total)</h3>
                  <button
                    onClick={() => copyToClipboard(compressedOutput.fullExample, 'fullExample')}
                    className="text-gray-500 hover:text-gray-700 p-1"
                    title="Copy to clipboard"
                  >
                    {copied === 'fullExample' ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                <textarea
                  value={compressedOutput.fullExample}
                  readOnly
                  className="w-full h-24 border border-gray-300 rounded-md p-3 text-xs bg-gray-50 resize-none"
                />
                <div className={`text-xs mt-1 ${compressedOutput.fullExample.length > 750 ? 'text-red-600' : 'text-gray-500'}`}>
                  {compressedOutput.fullExample.length}/750 characters
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  Compressed ({compressedOutput.compressedExample.length}/600) + User ({profile.userExample.length}/150)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pt-6 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Character Profile Compression Engine • Agency-Aware Paradigm Framework
          </p>
        </div>
      </div>
    </div>
  );
};

export default CharacterCompressionEngine;
