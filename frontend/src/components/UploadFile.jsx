const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset=import.meta.env.VITE_UPLOAD_PRESET;

console.log('All env vars:', import.meta.env);

console.log("uploadPreset:",uploadPreset);
const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

export const UploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append("upload_preset",uploadPreset );

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  const responseData = await response.json();

  return responseData;
};

