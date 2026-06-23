'use client';

import { useState, useEffect } from 'react';

// Inline SVG Icons to avoid NPM package dependency issues
const Icons = {
  Sparkles: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  Key: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m-3.418 3.84a2 2 0 11-2.828-2.828 2 2 0 012.828 2.828zm-4.243 4.243L3 21v-3m0 0l.75-.75M3 18h3m0 0l3-3m0 0l.75-.75M9 12l3 3" />
    </svg>
  ),
  Gear: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  ArrowRight: () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  ),
  Brush: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-3M9.707 9.707a1 1 0 00-1.414-1.414l-4 4a1 1 0 000 1.414l4 4a1 1 0 001.414-1.414" />
    </svg>
  ),
  Download: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  ZoomIn: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
    </svg>
  ),
  Refresh: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3m-3-3v12" />
    </svg>
  ),
  Close: () => (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l18 18" />
    </svg>
  ),
  FileText: () => (
    <svg className="w-16 h-16 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
};

export default function Workspace() {
  const [mode, setMode] = useState('article'); // 'article' or 'concept'
  const [inputText, setInputText] = useState('');
  const [shotCount, setShotCount] = useState(4);
  const [apiKey, setApiKey] = useState('');
  const [tempApiKey, setTempApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  // Provider settings
  const [provider, setProvider] = useState('openai');
  const [tempProvider, setTempProvider] = useState('openai');
  const [customBaseUrl, setCustomBaseUrl] = useState('');
  const [tempBaseUrl, setTempBaseUrl] = useState('');
  const [customTextModel, setCustomTextModel] = useState('');
  const [tempTextModel, setTempTextModel] = useState('');
  const [customImageModel, setCustomImageModel] = useState('');
  const [tempImageModel, setTempImageModel] = useState('');
  
  // Developer configuration status (from server side check)
  const [hasDefaultKey, setHasDefaultKey] = useState(false);
  const [defaultProvider, setDefaultProvider] = useState('openai');
  
  // App States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzeStep, setAnalyzeStep] = useState(0); // 0: Idle, 1: Reading, 2: Metaphors, 3: Formatting
  const [shots, setShots] = useState([]);
  const [lightboxUrl, setLightboxUrl] = useState(null);

  // User name States
  const [userName, setUserName] = useState('');
  const [tempUserName, setTempUserName] = useState('');
  const [showNameModal, setShowNameModal] = useState(false);
  const [hasLoadedName, setHasLoadedName] = useState(false);

  // Load API Key, provider settings, and user name from localStorage, and check server API Key configs
  useEffect(() => {
    const savedProvider = localStorage.getItem('api_provider') || 'openai';
    const savedKey = localStorage.getItem('api_key') || localStorage.getItem('openai_api_key') || '';
    const savedBaseUrl = localStorage.getItem('api_base_url') || '';
    const savedTextModel = localStorage.getItem('api_text_model') || '';
    const savedImageModel = localStorage.getItem('api_image_model') || '';
    const savedName = localStorage.getItem('user_name') || '';
    
    setProvider(savedProvider);
    setTempProvider(savedProvider);
    setApiKey(savedKey);
    setTempApiKey(savedKey);
    setCustomBaseUrl(savedBaseUrl);
    setTempBaseUrl(savedBaseUrl);
    setCustomTextModel(savedTextModel);
    setTempTextModel(savedTextModel);
    setCustomImageModel(savedImageModel);
    setTempImageModel(savedImageModel);
    setUserName(savedName);
    setTempUserName(savedName);
    setHasLoadedName(true);
    if (!savedName) {
      setShowNameModal(true);
    }

    // Fetch server side default config status
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/config');
        if (res.ok) {
          const data = await res.json();
          setHasDefaultKey(data.hasDefaultKey || false);
          setDefaultProvider(data.defaultProvider || 'openai');
          
          // If the server has a default key and the user hasn't configured a personal key yet,
          // automatically default the client provider state to match the server default provider
          if (data.hasDefaultKey && !savedKey && !localStorage.getItem('api_provider')) {
            setProvider(data.defaultProvider);
            setTempProvider(data.defaultProvider);
            if (data.defaultProvider === 'grok') {
              setCustomBaseUrl('https://api.x.ai/v1');
              setTempBaseUrl('https://api.x.ai/v1');
              setCustomTextModel('grok-2');
              setTempTextModel('grok-2');
              setCustomImageModel('grok-2');
              setTempImageModel('grok-2');
            } else if (data.defaultProvider === 'groq') {
              setCustomBaseUrl('https://api.groq.com/openai/v1');
              setTempBaseUrl('https://api.groq.com/openai/v1');
              setCustomTextModel('llama-3.3-70b-versatile');
              setTempTextModel('llama-3.3-70b-versatile');
              setCustomImageModel('pollinations-flux');
              setTempImageModel('pollinations-flux');
            }
          }
        }
      } catch (e) {
        console.error("Failed to load server config", e);
      }
    };
    fetchConfig();
  }, []);

  // Update browser tab title dynamically
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.title = userName ? `${userName} Illustrations` : 'Personnel Illustrations Generator';
    }
  }, [userName]);

  const handleSaveSettings = () => {
    localStorage.setItem('api_provider', tempProvider);
    localStorage.setItem('api_key', tempApiKey);
    localStorage.setItem('api_base_url', tempBaseUrl);
    localStorage.setItem('api_text_model', tempTextModel);
    localStorage.setItem('api_image_model', tempImageModel);
    localStorage.setItem('user_name', tempUserName);
    
    setProvider(tempProvider);
    setApiKey(tempApiKey);
    setCustomBaseUrl(tempBaseUrl);
    setCustomTextModel(tempTextModel);
    setCustomImageModel(tempImageModel);
    setUserName(tempUserName);
    setShowSettings(false);
  };

  const handleClearSettings = () => {
    localStorage.removeItem('api_provider');
    localStorage.removeItem('api_key');
    localStorage.removeItem('openai_api_key');
    localStorage.removeItem('api_base_url');
    localStorage.removeItem('api_text_model');
    localStorage.removeItem('api_image_model');
    localStorage.removeItem('user_name');
    
    setProvider('openai');
    setTempProvider('openai');
    setApiKey('');
    setTempApiKey('');
    setCustomBaseUrl('');
    setTempBaseUrl('');
    setCustomTextModel('');
    setTempTextModel('');
    setCustomImageModel('');
    setTempImageModel('');
    setUserName('');
    setTempUserName('');
    setShowSettings(false);
    setShowNameModal(true);
  };

  // Run the analysis prompt to design a shot list
  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    
    setIsAnalyzing(true);
    setAnalyzeStep(1);
    
    // Smooth step transition simulation in UI
    const timer1 = setTimeout(() => setAnalyzeStep(2), 2500);
    const timer2 = setTimeout(() => setAnalyzeStep(3), 5500);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'x-provider': provider,
          'x-base-url': customBaseUrl,
          'x-text-model': customTextModel
        },
        body: JSON.stringify({
          text: inputText,
          mode: mode,
          count: shotCount,
          userName: userName
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to analyze text.');
      }

      const data = await response.json();
      
      // Initialize image URLs and generating state
      const processedShots = data.shots.map(shot => ({
        ...shot,
        imageUrl: null,
        isGeneratingImage: false,
        imageError: null
      }));

      clearTimeout(timer1);
      clearTimeout(timer2);
      setShots(processedShots);
    } catch (error) {
      alert(`Error: ${error.message}. Please check your API key and connection.`);
      clearTimeout(timer1);
      clearTimeout(timer2);
    } finally {
      setIsAnalyzing(false);
      setAnalyzeStep(0);
    }
  };

  // Generate an individual shot image via DALL-E 3
  const handleGenerateImage = async (shotId) => {
    const shotIndex = shots.findIndex(s => s.id === shotId);
    if (shotIndex === -1) return;

    // Update state to generating
    const updatedShots = [...shots];
    updatedShots[shotIndex].isGeneratingImage = true;
    updatedShots[shotIndex].imageError = null;
    setShots(updatedShots);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'x-provider': provider,
          'x-base-url': customBaseUrl,
          'x-image-model': customImageModel
        },
        body: JSON.stringify({
          shot: shots[shotIndex],
          userName: userName
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Generation failed.');
      }

      const data = await response.json();
      
      // Update shot with resulting image URL
      const finalShots = [...shots];
      finalShots[shotIndex].imageUrl = data.imageUrl;
      finalShots[shotIndex].isGeneratingImage = false;
      setShots(finalShots);
    } catch (error) {
      const errorShots = [...shots];
      errorShots[shotIndex].isGeneratingImage = false;
      errorShots[shotIndex].imageError = error.message;
      setShots(errorShots);
    }
  };

  // Export/Download PNG helper
  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Fallback: open in new tab
      window.open(url, '_blank');
    }
  };

  // Open settings with override confirmation alert if server has a default key configured
  const handleOpenSettings = () => {
    if (!apiKey && hasDefaultKey) {
      const continueOverride = window.confirm(
        "The developer has already configured a default API key for this workspace. You do not need to configure one.\n\nWould you like to continue and set up your own personal API key instead?"
      );
      if (!continueOverride) return;
    }
    setTempUserName(userName);
    setShowSettings(true);
  };

  // Compute key setup button label dynamically
  const getSettingsButtonLabel = () => {
    if (apiKey) return 'Personal Key Active';
    if (hasDefaultKey) return 'Default API Key Active';
    return 'Configure API Key';
  };

  const replaceXiaohei = (text) => {
    if (!text) return '';
    if (!userName) return text;
    return text.replace(/xiaohei/gi, userName);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-section">
          <div className="logo-dot"></div>
          <h1 className="app-title">
            {userName ? `${userName} Illustrations` : 'Illustrations'}
          </h1>
          <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', padding: '0.2rem 0.4rem', backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '4px', color: 'var(--text-muted)' }}>Workspace</span>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }} onClick={handleOpenSettings}>
            <Icons.Key />
            <span className="btn-text">{getSettingsButtonLabel()}</span>
          </button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="workspace-grid">
        {/* Left Column - Input Panel */}
        <aside className="sidebar">
          <div>
            <h2 className="panel-title"><Icons.Sparkles /> Config Panel</h2>
            
            {/* Mode selection */}
            <div className="tab-container">
              <button 
                className={`tab-btn ${mode === 'article' ? 'active' : ''}`}
                onClick={() => { setMode('article'); setInputText(''); }}
              >
                Paste Article
              </button>
              <button 
                className={`tab-btn ${mode === 'concept' ? 'active' : ''}`}
                onClick={() => { setMode('concept'); setInputText(''); }}
              >
                Single Concept
              </button>
            </div>

            {/* Main Input field */}
            <div className="form-group">
              <label className="form-label">
                {mode === 'article' ? 'Paste your article/post content:' : 'Enter the visual concept or metaphor statement:'}
              </label>
              {mode === 'article' ? (
                <textarea 
                  className="textarea-input"
                  placeholder={`e.g., How to turn decisions, workflows, states, and metaphors in an article into clean, hand-drawn visual explanations featuring ${userName || 'Xiaohei'}...`}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              ) : (
                <input 
                  type="text"
                  className="text-input"
                  placeholder="e.g., Trust is built piece by piece, not shouted out."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              )}
            </div>

            {/* Slider for image count (Only in article mode) */}
            {mode === 'article' && (
              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <label className="form-label">Suggested Illustration Count</label>
                  <span className="range-value">{shotCount}</span>
                </div>
                <div className="range-container">
                  <input 
                    type="range" 
                    min="1" 
                    max="9" 
                    className="range-slider"
                    value={shotCount}
                    onChange={(e) => setShotCount(parseInt(e.target.value))}
                  />
                </div>
              </div>
            )}

            {/* Analyze button */}
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '0.5rem' }} 
              disabled={isAnalyzing || !inputText.trim()}
              onClick={handleAnalyze}
            >
              {isAnalyzing ? 'Analyzing Layout...' : 'Plan Illustration Strategy'}
              <Icons.ArrowRight />
            </button>
          </div>

          {/* Design DNA Cheat Card */}
          <div className="info-card" style={{ marginTop: 'auto' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '0.25rem' }}>Visual DNA DNA</h3>
            <p style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>
              We automatically guide the AI to generate:
            </p>
            <ul style={{ fontSize: '0.775rem', paddingLeft: '1rem', lineHeight: '1.5' }}>
              <li><strong>Pure White Background:</strong> Clean look without paper textures.</li>
              <li><strong>Handdrawn Linework:</strong> Thin, slightly wobbly sketch art.</li>
              <li><strong>{userName || 'Xiaohei'} character:</strong> Actively participating in the visual metaphors.</li>
              <li><strong>Color Highlights:</strong> Clean red (warnings), orange (flows), blue (details).</li>
            </ul>
          </div>
        </aside>

        {/* Right Column - Work Area */}
        <main className="main-content">
          {/* Empty State */}
          {!isAnalyzing && shots.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon-wrapper">✍️</div>
              <h2 className="empty-title">Workspace Ready</h2>
              <p className="empty-desc">
                Paste your article or write down a conceptual statement in the configuration panel on the left, then click <strong>"Plan Illustration Strategy"</strong> to extract visual nodes and plan your images.
              </p>
            </div>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <div className="empty-state" style={{ minHeight: '300px' }}>
              <div className="spinner" style={{ width: '3rem', height: '3rem', marginBottom: '1.5rem' }}></div>
              <h2 className="empty-title">
                {analyzeStep === 1 && 'Reading Content Structure...'}
                {analyzeStep === 2 && 'Deconstructing Visual Metaphors...'}
                {analyzeStep === 3 && 'Formulating Illustration Strategies...'}
              </h2>
              <p className="empty-desc">
                Analyzing paragraph flow to anchor high-value cognitive pivots. Designing {userName || 'Xiaohei'} actions and handwritten annotation labels.
              </p>
            </div>
          )}

          {/* Output strategy layout */}
          {!isAnalyzing && shots.length > 0 && (
            <div>
              <div className="shot-list-header">
                <div>
                  <h2 style={{ fontSize: '1.4rem' }}>Illustration Strategy Blueprint</h2>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Generated {shots.length} cognitive anchors. Click <strong>"Generate Illustration"</strong> on any card to sketch the final image using AI.
                  </p>
                </div>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                  onClick={() => setShots([])}
                >
                  Clear Board
                </button>
              </div>

              <div className="shot-grid">
                {shots.map((shot) => (
                  <div className="shot-card" key={shot.id}>
                    {/* Header line */}
                    <div className="shot-badge-row">
                      <span className="shot-number">Anchor #{shot.id}</span>
                      <span className="shot-type">{shot.structureType}</span>
                    </div>

                    {/* Metadata information */}
                    <div className="shot-info">
                      <h3 className="shot-title">{replaceXiaohei(shot.theme)}</h3>
                      <p className="shot-desc">{replaceXiaohei(shot.metaphor)}</p>
                      
                      {shot.paragraphAfter && (
                        <div className="shot-meta-item">
                          <strong>Section Placement:</strong> {replaceXiaohei(shot.paragraphAfter)}
                        </div>
                      )}
                      
                      <div className="shot-meta-item xiaohei">
                        <strong>{userName ? `${userName} Action` : 'Xiaohei Action'}:</strong> {replaceXiaohei(shot.xiaoheiAction)}
                      </div>
                    </div>

                    {/* Labels representation */}
                    {shot.labels && shot.labels.length > 0 && (
                      <div className="shot-labels">
                        {shot.labels.map((label, idx) => (
                          <span className="label-pill" key={idx}>{replaceXiaohei(label)}</span>
                        ))}
                      </div>
                    )}

                    {/* Image Generation canvas */}
                    <div className="image-preview-block">
                      {/* Standard Preview */}
                      {!shot.imageUrl && !shot.isGeneratingImage && (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', color: 'var(--text-dark)' }}>
                          <button 
                            className="btn btn-primary" 
                            style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
                            onClick={() => handleGenerateImage(shot.id)}
                          >
                            <Icons.Brush />
                            Generate Illustration
                          </button>
                          {shot.imageError && (
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent-red)', maxWidth: '250px', textAlign: 'center' }}>
                              Error: {shot.imageError}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Loading Image */}
                      {shot.isGeneratingImage && (
                        <div className="loading-overlay">
                          <div className="spinner spinner-blue"></div>
                          <span className="loading-text">AI sketching illustrations...</span>
                        </div>
                      )}

                      {/* Rendered Image */}
                      {shot.imageUrl && (
                        <>
                          <img src={shot.imageUrl} alt={shot.theme} />
                          <div className="image-overlay-actions">
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: 'rgba(15,20,32,0.9)' }}
                              onClick={() => setLightboxUrl(shot.imageUrl)}
                              title="Zoom View"
                            >
                              <Icons.ZoomIn />
                            </button>
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: 'rgba(15,20,32,0.9)' }}
                              onClick={() => handleDownload(shot.imageUrl, `${userName ? userName.toLowerCase() : 'xiaohei'}-${shot.id}.png`)}
                              title="Download PNG"
                            >
                              <Icons.Download />
                            </button>
                            <button 
                              className="btn btn-secondary" 
                              style={{ padding: '0.5rem', borderRadius: '50%', backgroundColor: 'rgba(15,20,32,0.9)' }}
                              onClick={() => handleGenerateImage(shot.id)}
                              title="Regenerate"
                            >
                              <Icons.Refresh />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '550px' }}>
            <h3 className="modal-title">API Provider Settings</h3>
            <p className="modal-desc text-dark" style={{ marginBottom: '1rem', fontSize: '0.825rem' }}>
              Your API settings are stored locally in your browser cache and only sent when requesting illustrations.
            </p>

            {/* Display Name Input */}
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Workspace Settings</h4>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Display Name / Brand Name</label>
                <input 
                  type="text"
                  className="text-input"
                  placeholder="Enter your name... (e.g., Ian)"
                  value={tempUserName}
                  onChange={(e) => setTempUserName(e.target.value)}
                />
              </div>
            </div>

            <h4 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>API Configuration</h4>
            
            {/* Provider selection */}
            <div className="form-group">
              <label className="form-label">API Provider</label>
              <select 
                className="text-input" 
                value={tempProvider} 
                onChange={(e) => {
                  const val = e.target.value;
                  setTempProvider(val);
                  if (val === 'grok') {
                    setTempBaseUrl('https://api.x.ai/v1');
                    setTempTextModel('grok-2');
                    setTempImageModel('grok-2');
                  } else if (val === 'groq') {
                    setTempBaseUrl('https://api.groq.com/openai/v1');
                    setTempTextModel('llama-3.3-70b-versatile');
                    setTempImageModel('pollinations-flux');
                  } else if (val === 'openai') {
                    setTempBaseUrl('');
                    setTempTextModel('gpt-4o-mini');
                    setTempImageModel('dall-e-3');
                  }
                }}
              >
                <option value="openai">OpenAI</option>
                <option value="groq">Groq (Fast LPU)</option>
                <option value="grok">Grok (xAI)</option>
                <option value="custom">Custom (OpenAI-Compatible)</option>
              </select>
            </div>

            {/* API Key */}
            <div className="form-group">
              <label className="form-label">
                {tempProvider === 'openai' ? 'OpenAI API Key' : tempProvider === 'grok' ? 'Grok API Key' : tempProvider === 'groq' ? 'Groq API Key' : 'Custom Provider API Key'}
              </label>
              <input 
                type="password"
                className="text-input"
                placeholder={tempProvider === 'openai' ? 'sk-...' : tempProvider === 'grok' ? 'xai-...' : tempProvider === 'groq' ? 'gsk_...' : 'API Key...'}
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
              />
            </div>

            {/* Custom Configuration Section */}
            {tempProvider === 'custom' && (
              <div style={{ padding: '0.75rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '6px', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Base Endpoint URL</label>
                  <input 
                    type="text"
                    className="text-input"
                    style={{ fontSize: '0.85rem', padding: '0.5rem' }}
                    placeholder="https://api.x.ai/v1"
                    value={tempBaseUrl}
                    onChange={(e) => setTempBaseUrl(e.target.value)}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Text LLM Model</label>
                    <input 
                      type="text"
                      className="text-input"
                      style={{ fontSize: '0.85rem', padding: '0.5rem' }}
                      placeholder="grok-2-latest"
                      value={tempTextModel}
                      onChange={(e) => setTempTextModel(e.target.value)}
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Image Gen Model</label>
                    <input 
                      type="text"
                      className="text-input"
                      style={{ fontSize: '0.85rem', padding: '0.5rem' }}
                      placeholder="grok-2-vision-latest"
                      value={tempImageModel}
                      onChange={(e) => setTempImageModel(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            <span style={{ fontSize: '0.75rem', color: 'var(--text-dark)' }}>
              If left blank, the app will try to fall back to the environment variables set on the hosting server.
            </span>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={handleClearSettings}>
                Clear Settings
              </button>
              <button className="btn btn-primary" onClick={handleSaveSettings}>
                Save Settings
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ border: 'none' }}
                onClick={() => {
                  setTempProvider(provider);
                  setTempApiKey(apiKey);
                  setTempBaseUrl(customBaseUrl);
                  setTempTextModel(customTextModel);
                  setTempImageModel(customImageModel);
                  setTempUserName(userName);
                  setShowSettings(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox / Zoom Image Modal */}
      {lightboxUrl && (
        <div className="modal-overlay" onClick={() => setLightboxUrl(null)}>
          <div className="lightbox-image-container" onClick={(e) => e.stopPropagation()}>
            <img src={lightboxUrl} alt="Visual Metaphor" />
            <button 
              className="btn btn-secondary" 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', padding: '0.4rem', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.7)', border: 'none' }}
              onClick={() => setLightboxUrl(null)}
            >
              <Icons.Close />
            </button>
          </div>
        </div>
      )}

      {/* First-time Name Prompt Modal */}
      {showNameModal && (
        <div className="modal-overlay" style={{ zIndex: 1100 }}>
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icons.Sparkles /> Welcome to Illustrations
            </h3>
            <p className="modal-desc text-dark" style={{ marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              Please enter your name to customize your illustration workspace.
            </p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              if (tempUserName.trim()) {
                const name = tempUserName.trim();
                localStorage.setItem('user_name', name);
                setUserName(name);
                setShowNameModal(false);
              }
            }}>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Your Name</label>
                <input 
                  type="text"
                  className="text-input"
                  placeholder="e.g., Ian, Alex, Sarah"
                  value={tempUserName}
                  onChange={(e) => setTempUserName(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  disabled={!tempUserName.trim()}
                >
                  Enter Workspace
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
