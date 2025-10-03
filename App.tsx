import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { TryOnButton } from './components/TryOnButton';
import { generateTryOnImage } from './services/geminiService';
import { fileToGenerativePart } from './utils/fileUtils';
import type { ImageFile } from './types';
import { IconArrowPath } from './components/Icons';

const App: React.FC = () => {
  const [personImage, setPersonImage] = useState<ImageFile | null>(null);
  const [outfitImage, setOutfitImage] = useState<ImageFile | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadCount, setDownloadCount] = useState<number>(1);

  const handlePersonImageChange = useCallback((file: ImageFile | null) => {
    setPersonImage(file);
    if (generatedImage || error) {
      setGeneratedImage(null);
      setError(null);
    }
  }, [generatedImage, error]);

  const handleOutfitImageChange = useCallback((file: ImageFile | null) => {
    setOutfitImage(file);
    if (generatedImage || error) {
      setGeneratedImage(null);
      setError(null);
    }
  }, [generatedImage, error]);

  const handleGenerate = useCallback(async () => {
    if (!personImage || !outfitImage) {
      setError('Please upload both a person and an outfit image.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const personPart = await fileToGenerativePart(personImage.file);
      const outfitPart = await fileToGenerativePart(outfitImage.file);

      const prompt = `Your task is to perform a virtual try-on. You will be given two images: the first contains a person and the background, and the second contains an outfit.

      Your goal is to extract ONLY the clothing from the second image and realistically place it onto the person from the first image. If the second image contains a person or model, ignore them completely—only their attire is relevant.
      
      **Crucial constraints to follow:**
      1.  **Face Integrity:** The person's face must be perfectly preserved from the first image. It cannot be altered, distorted, or replaced.
      2.  **Background Preservation:** The original background from the person's photo must be kept intact. Do not change or replace the background.
      3.  **Outfit Replacement & Body Preservation:** Realistically fit the new clothing onto the person's body. It is critical to preserve the person's original body shape, proportions, height, and width. Pay strict attention to maintaining the original length and thickness of their legs, thighs, arms, and torso. Do not alter the subject's physical build.
      4.  **Exclusivity of Change:** The ONLY element that should change in the original image is the person's clothing. All other elements (hair, accessories not part of the outfit, background, lighting) must remain identical.
      5.  **Composite Image Requirement:** The output MUST be a NEW image synthesized from the two inputs. Crucially, DO NOT return the original person's image or the original outfit image unchanged. The result must show the person from the first image wearing the outfit from the second image.`;

      const result = await generateTryOnImage(personPart, outfitPart, prompt);
      setGeneratedImage(result);

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [personImage, outfitImage]);

  const handleDownload = useCallback(() => {
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    const mimeType = generatedImage.split(';')[0].split(':')[1];
    const extension = mimeType.split('/')[1] || 'png';
    link.download = `virtual-try-on-${downloadCount}.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadCount(prevCount => prevCount + 1);
  }, [generatedImage, downloadCount]);

  const handleReset = useCallback(() => {
    setPersonImage(null);
    setOutfitImage(null);
    setGeneratedImage(null);
    setError(null);
  }, []);

  const canReset = personImage || outfitImage || generatedImage;

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center">
        <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <ImageUploader 
            title="1. Upload Person" 
            onFileChange={handlePersonImageChange}
            file={personImage}
          />
          <ImageUploader 
            title="2. Upload Outfit" 
            onFileChange={handleOutfitImageChange}
            file={outfitImage}
          />
          <ResultDisplay 
            generatedImage={generatedImage} 
            isLoading={isLoading} 
            error={error}
            onDownload={handleDownload}
            onRetry={handleGenerate}
          />
        </div>
        <div className="flex items-center space-x-4">
          <TryOnButton 
            onClick={handleGenerate}
            isDisabled={!personImage || !outfitImage || isLoading}
            isLoading={isLoading}
            hasResult={!!generatedImage && !error}
          />
          {canReset && (
            <button
              onClick={handleReset}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-6 py-4 text-base font-bold text-gray-300 bg-gray-700/50 rounded-lg shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-900 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-200"
              aria-label="Reset application"
            >
              <IconArrowPath className="mr-2 h-5 w-5" />
              Reset
            </button>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
