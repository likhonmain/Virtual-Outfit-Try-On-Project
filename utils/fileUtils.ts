
import type { GenerativePart } from '../types';

export function fileToGenerativePart(file: File): Promise<GenerativePart> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error('Failed to read file as data URL.'));
      }
      // The result looks like "data:image/jpeg;base64,LzlqLzRBQ...".
      // We need to extract the mimeType and the base64 data.
      const [header, data] = reader.result.split(',');
      const mimeType = header.split(':')[1].split(';')[0];
      
      resolve({
        inlineData: {
          data,
          mimeType,
        },
      });
    };
    reader.onerror = (error) => reject(error);
  });
}
