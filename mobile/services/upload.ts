import api from './api';

/**
 * Uploads a locally-captured photo (local file URI or web blob URI) to the
 * backend, which stores it in Cloudinary and returns a public HTTPS URL.
 * This is required before sending the image to any AI analysis endpoint,
 * since those need a real fetchable URL, not a local device path.
 */
export const uploadImage = async (localUri: string): Promise<string> => {
  const formData = new FormData();

  // On web, localUri is a blob: URL — fetch it into a real Blob first.
  // On native (iOS/Android), we can pass the { uri, name, type } shape
  // directly, which React Native's FormData implementation understands.
  if (localUri.startsWith('blob:') || localUri.startsWith('data:')) {
    const response = await fetch(localUri);
    const blob = await response.blob();
    formData.append('image', blob, 'photo.jpg');
  } else {
    formData.append('image', {
      uri: localUri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    } as any);
  }

  const { data } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return data.data.url as string;
};
