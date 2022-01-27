import { storage } from '../firebase';

export const getDateByNumberOfDays = (days = 1) => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - days);
  return yesterday;
};

export const getDateFromTimeStamp = (timestamp) => {
  const formattedDate = new Date(timestamp * 1000).toLocaleDateString();
  return formattedDate;
};

export const putImagetoStorage = async ({ img, imgPath }) => {
  const refs = `${imgPath}${img.name}`;
  try {
    const snapshot = await storage.ref(refs).put(img);
    //let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    return await snapshot.ref.getDownloadURL();
  } catch (error) {
    console.log('One failed:', img, error.message);
  }
};
