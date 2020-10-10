import { apiEndpoint } from '../config'
import { DiaryPost } from '../types/DiaryPost';
import { CreateDiaryPostRequest } from '../types/CreateDiaryPostRequest';
import axios from 'axios'
import { UpdateDiaryPostRequest } from '../types/UpdateDiaryPostRequest';

export async function getDiaryPosts(idToken: string): Promise<DiaryPost[]> {
  

  const response = await axios.get(`${apiEndpoint}/diary`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });

  return response.data.items
}

export async function createDiaryPost(idToken: string, newDiaryPost: CreateDiaryPostRequest): Promise<DiaryPost> {
  const response = await axios.post(`${apiEndpoint}/diary`,  JSON.stringify(newDiaryPost), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item;
}

export async function patchDiaryPost(idToken: string, diaryPostId: string, updatedDiaryPost: UpdateDiaryPostRequest): Promise<void> {
  await axios.patch(`${apiEndpoint}/diary/${diaryPostId}`, JSON.stringify(updatedDiaryPost), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });
};

export async function deleteDiaryPost(idToken: string, diaryPostId: string): Promise<void> {
  await axios.delete(`${apiEndpoint}/diary/${diaryPostId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  });
};

export async function getUploadUrl(idToken: string, diaryPostId: string): Promise<string> {
  const response = await axios.post(`${apiEndpoint}/diary/${diaryPostId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await axios.put(uploadUrl, file);
}
