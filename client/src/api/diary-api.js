import { apiEndpoint } from '../config';
import axios from 'axios';

export async function getDiaryPosts(idToken) {
  

  const response = await axios.get(`${apiEndpoint}/diary`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });

  return response.data.items
}

export async function createDiaryPost(idToken, newDiaryPost) {
  const response = await axios.post(`${apiEndpoint}/diary`,  JSON.stringify(newDiaryPost), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item;
}

export async function patchDiaryPost(idToken, diaryPostId, updatedDiaryPost) {
  await axios.patch(`${apiEndpoint}/diary/${diaryPostId}`, JSON.stringify(updatedDiaryPost), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });
};

export async function deleteDiaryPost(idToken, diaryPostId) {
  await axios.delete(`${apiEndpoint}/diary/${diaryPostId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });
};

export async function getUploadUrl(idToken, diaryPostId) {
  const response = await axios.post(`${apiEndpoint}/diary/${diaryPostId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl, file) {
  await axios.put(uploadUrl, file);
}