import React from 'react';
import { DownloadIcon, UploadIcon } from './Icon';

interface ComparisonViewerProps {
  originalImage: string | null;
  generatedImage: string | null;
  isLoading: boolean;
  onUpload: () => void;
}

const ComparisonViewer: React.FC<ComparisonViewerProps> = ({ originalImage, generatedImage, isLoading, onUpload }) => {
  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = 'renovated-design.png';
      link.click();
    }
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row gap-10 p-8 bg-transparent">
      {/* Left: Original Image or Upload Zone */}
      <div className="flex-1 relative overflow-hidden bg-[#1e1e2e] group flex flex-col rounded-2xl border border-[#33333f] shadow-lg">
        <div className="absolute top-0 left-0 right-0 p-4 z-10 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
            <span className="text-xs font-bold text-gray-300 uppercase tracking-wider bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                Original Image
            </span>
        </div>
        
        {originalImage ? (
          <div className="w-full h-full relative group/image">
            <img 
              src={originalImage} 
              alt="Original" 
              className="w-full h-full object-cover md:object-contain bg-black/50"
            />
            {/* Hover overlay to change image */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/image:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={onUpload}>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 hover:bg-white/20 transition-colors">
                    <UploadIcon />
                    <span>Change Image</span>
                </div>
            </div>
          </div>
        ) : (
          <div 
            onClick={onUpload}
            className="w-full h-full flex flex-col items-center justify-center cursor-pointer hover:bg-[#252530] transition-colors gap-6 p-8 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-[#2a2a35] flex items-center justify-center border border-[#33333f] group-hover:scale-110 transition-transform duration-300 group-hover:border-blue-500/50 shadow-2xl">
                <UploadIcon />
            </div>
            <div>
                <h3 className="text-white font-bold text-xl mb-2">Upload Your Space</h3>
                <p className="text-gray-400 text-sm max-w-xs mx-auto">Click to browse or drop a photo of your room to get started.</p>
            </div>
          </div>
        )}
      </div>

      {/* Right: Generated Image or Placeholder */}
      <div className="flex-1 relative overflow-hidden bg-[#1e1e2e] flex flex-col rounded-2xl border border-[#33333f] shadow-lg">
        <div className="absolute top-0 left-0 right-0 p-4 z-10 bg-gradient-to-b from-black/50 to-transparent pointer-events-none">
            <span className="text-xs font-bold text-blue-400 uppercase tracking-wider bg-blue-900/30 backdrop-blur-md px-3 py-1 rounded-full border border-blue-500/30">
                AI Renovation
            </span>
        </div>

        {isLoading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-blue-400 gap-6 bg-[#131314]/80 backdrop-blur-sm">
            <div className="w-16 h-16 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin"></div>
            <div className="text-center">
                <p className="font-bold text-lg text-white mb-1">Generating Design</p>
                <p className="animate-pulse font-medium text-sm text-blue-300">Applying architectural details...</p>
            </div>
          </div>
        ) : generatedImage ? (
          <div className="w-full h-full relative group">
             <img 
              src={generatedImage} 
              alt="Renovated" 
              className="w-full h-full object-cover md:object-contain bg-black/50"
            />
             <button 
              onClick={handleDownload}
              className="absolute top-5 right-5 bg-white text-black p-3 rounded-full shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 z-30 hover:bg-gray-100 border border-gray-200"
              title="Download Image"
            >
              <DownloadIcon />
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 text-gray-600 bg-[#15151a]">
            <div className="w-20 h-20 rounded-full bg-[#1e1e2e] flex items-center justify-center border border-[#2a2a35] opacity-50">
              <span className="text-3xl grayscale">✨</span>
            </div>
            <p className="text-sm font-medium">Select a style and click Generate</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonViewer;