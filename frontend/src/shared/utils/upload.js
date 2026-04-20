import api from './api';

/**
 * Uploads a file to Cloudinary via the backend proxy
 * @param {File|Blob} file The file to upload
 * @returns {Promise<string>} The Cloudinary URL
 */
export const uploadImage = async (file) => {
  if (!file) return null;
  
  // If it's already a URL, just return it
  if (typeof file === 'string' && file.startsWith('http')) {
    return file;
  }

  const formData = new FormData();
  formData.append('image', file);
  
  const { data } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  
  return data.url;
};
