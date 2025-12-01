import React, { useState, useRef } from 'react';
import { SparklesIcon, XIcon } from './components/Icon';
import ComparisonViewer from './components/ComparisonViewer';
import { DESIGN_STYLES, ROOM_TYPES } from './constants';
import { RoomType, DesignStyle } from './types';
import { renovateRoom } from './services/geminiService';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<RoomType>('Living Room');
  const [selectedStyle, setSelectedStyle] = useState<DesignStyle | null>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size too large. Please upload an image under 5MB.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target?.result as string);
        setGeneratedImage(null);
        setError(null);
        // Do not reset style or room to allow quick testing of same settings on new image
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleReset = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setSelectedStyle(null);
    setError(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  // Generate Image
  const handleGenerate = async () => {
    if (!originalImage) {
        setError("Please upload an original image first.");
        return;
    }
    if (!selectedStyle) {
        setError("Please select a design style below.");
        return;
    }
    
    setIsLoading(true);
    setError(null);

    // Scroll to top to see result
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const result = await renovateRoom(originalImage, selectedRoom, selectedStyle);
      setGeneratedImage(result);
    } catch (err: any) {
      setError(err.message || "Something went wrong during generation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#131314] text-gray-200 font-sans selection:bg-blue-500/30 flex flex-col">
      {/* Hidden File Input for reuse */}
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        accept="image/*"
        onChange={handleFileUpload}
      />

      {/* Header */}
      <header className="border-b border-[#33333f] bg-[#1e1e2e] flex-none z-50 sticky top-0">
        <div className="w-full px-6 h-14 flex items-center justify-between max-w-[1920px] mx-auto">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white">
              <SparklesIcon />
            </div>
            <h1 className="text-lg font-semibold tracking-tight text-white">AI Interior Architect</h1>
          </div>
          {originalImage && (
            <button 
              onClick={handleReset}
              className="text-xs font-medium bg-[#33333f] hover:bg-[#444455] text-white px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
            >
              <XIcon />
              Clear All
            </button>
          )}
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[60] bg-red-900/90 border border-red-800 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-4 animate-bounce-in backdrop-blur-md">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="opacity-80 hover:opacity-100"><XIcon/></button>
        </div>
      )}

      {/* Main Content Area - Full page scrolling */}
      <main className="w-full max-w-[1920px] mx-auto p-6 flex flex-col gap-8">
          
          {/* TOP: Image Display Area (Increased Height to 75vh) */}
          <div className="h-[75vh] w-full bg-[#0a0a0a] rounded-2xl border border-[#33333f] overflow-hidden shadow-2xl relative">
              <ComparisonViewer 
                originalImage={originalImage} 
                generatedImage={generatedImage} 
                isLoading={isLoading} 
                onUpload={triggerFileUpload}
              />
          </div>

          {/* MIDDLE: Generate Button Section */}
          <div className="flex justify-center py-2 sticky top-[60px] z-40 pointer-events-none">
             {/* Pointer events auto enables clicking on the button itself but lets clicks pass through to content behind/beside */}
             <button
                onClick={handleGenerate}
                disabled={isLoading || !originalImage || !selectedStyle}
                className={`
                   pointer-events-auto
                   relative group flex items-center gap-3 px-8 py-4 rounded-full font-bold text-lg shadow-2xl transition-all transform hover:scale-105 active:scale-95
                   ${isLoading || !originalImage || !selectedStyle
                      ? 'bg-[#2a2a35] text-gray-500 cursor-not-allowed border border-[#444455]'
                      : 'bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] animate-gradient text-white border border-white/10 hover:shadow-blue-900/50'}
                `}
             >
                {isLoading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Designing...</span>
                    </>
                ) : (
                    <>
                        <SparklesIcon />
                        <span>Generate Renovation</span>
                    </>
                )}
             </button>
          </div>

          {/* BOTTOM: Controls Section */}
          <div className="bg-[#1e1e2e] rounded-2xl border border-[#33333f] p-8 shadow-xl">
              
              <div className="flex flex-col gap-8">
                  {/* Room Type Selector */}
                  <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30">1</span>
                        <h3 className="text-gray-200 text-sm font-bold uppercase tracking-wider">Select Room Type</h3>
                      </div>
                      <div className="flex flex-wrap gap-3">
                          {ROOM_TYPES.map((type) => (
                          <button
                              key={type}
                              onClick={() => setSelectedRoom(type)}
                              className={`
                              px-5 py-3 rounded-lg text-sm font-medium transition-all duration-200 border
                              ${selectedRoom === type 
                                  ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/30 transform scale-105' 
                                  : 'bg-[#131314] border-[#33333f] text-gray-400 hover:border-gray-500 hover:text-gray-200 hover:bg-[#1a1a20]'}
                              `}
                          >
                              {type}
                          </button>
                          ))}
                      </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-[#33333f] w-full"></div>

                  {/* Style Grid */}
                  <div>
                      <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                             <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold border border-purple-500/30">2</span>
                             <h3 className="text-gray-200 text-sm font-bold uppercase tracking-wider">Choose Design Style</h3>
                          </div>
                          <span className="text-xs bg-[#2a2a35] text-gray-500 px-2 py-0.5 rounded border border-[#33333f]">{DESIGN_STYLES.length} Styles</span>
                      </div>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-6 gap-4">
                          {DESIGN_STYLES.map((style) => (
                          <button
                              key={style.id}
                              onClick={() => setSelectedStyle(style)}
                              className={`
                              relative group flex flex-col items-start justify-between p-5 h-28 rounded-xl border text-left transition-all duration-200
                              ${selectedStyle?.id === style.id
                                  ? 'bg-blue-600/20 border-blue-500 ring-1 ring-blue-500 transform scale-[1.02] shadow-xl shadow-blue-900/20' 
                                  : 'bg-[#131314] border-[#33333f] hover:border-blue-500/50 hover:bg-[#1a1a20]'}
                              `}
                          >
                              <div className="w-full">
                                <span className={`font-semibold text-sm block mb-1 ${selectedStyle?.id === style.id ? 'text-blue-400' : 'text-gray-200 group-hover:text-white'}`}>
                                    {style.name}
                                </span>
                                <p className="text-[10px] text-gray-500 leading-tight line-clamp-2 group-hover:text-gray-400 transition-colors">
                                    {style.promptDescription}
                                </p>
                              </div>
                              
                              <div className={`absolute bottom-3 right-3 transition-all duration-300 ${selectedStyle?.id === style.id ? 'opacity-100 scale-100' : 'opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100'}`}>
                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedStyle?.id === style.id ? 'bg-blue-500 text-white' : 'bg-[#33333f] text-gray-400'}`}>
                                     {selectedStyle?.id === style.id ? <SparklesIcon /> : <div className="w-2 h-2 rounded-full bg-gray-500"></div>}
                                  </div>
                              </div>
                          </button>
                          ))}
                      </div>
                  </div>
              </div>
          </div>
      </main>
    </div>
  );
};

export default App;