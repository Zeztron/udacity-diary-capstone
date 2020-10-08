import 'source-map-support/register';
import * as uuid from 'uuid';

import { DiaryCreate } from '../models/DiaryCreate';
import { DiaryUpdate } from '../models/DiaryUpdate';
import { DiaryAccess } from '../dataLayer/diaryAccess';
import { CreateDiaryPostRequest } from '../requests/CreateDiaryPostRequest';
import { UpdateDiaryPostRequest } from '../requests/UpdateDiaryPostRequest';

import { createLogger } from '../utils/logger';

const logger = createLogger("diaryPosts");
const diaryAccess = new DiaryAccess();

export async function getDiaryPosts(userId: string): Promise<DiaryCreate[]> {
  logger.info(`Retrieving todos for user: ${userId}`);

  return await diaryAccess.getDiaryPosts(userId);
}

export async function createDiaryPost(userId: string, createDiaryPostRequest: CreateDiaryPostRequest): Promise<DiaryCreate> {
  const diaryPostId: string = uuid.v4();

  const newDiaryPost: DiaryCreate = {
    userId,
    diaryPostId,
    createdAt: new Date().toISOString(),
    attachmentUrl: null,
    ...createDiaryPostRequest
  }

  logger.info(`Adding new diary post: ${diaryPostId} for user: ${userId}`);

  await diaryAccess.createDiaryPost(newDiaryPost);

  return newDiaryPost;
}

export async function updateDiaryPost(userId: string, diaryPostId: string, updateDiaryPostRequest: UpdateDiaryPostRequest) {
  logger.info(`Updating diary post: ${diaryPostId} for user: ${userId}`);

  const diaryPost = await diaryAccess.getDiaryPost(diaryPostId);

  if (!diaryPost) {
    logger.error(`No post found for diaryPostId: ${diaryPostId}`);
    throw new Error('No diary post found');
  }

  if (diaryPost.userId !== userId) {
    logger.error(`Permission error: User: ${userId} is not authorized to update this diary post: ${diaryPostId}.`);
    throw new Error('Permission error: User is not authorized to update this post.');
  }

  diaryAccess.updateDiaryPost(diaryPostId, updateDiaryPostRequest as DiaryUpdate);

}

export async function deleteDiaryPost(userId: string, diaryPostId: string) {
  logger.info(`Deleting post: ${diaryPostId} for user: ${userId}`);

  const postToDelete = await diaryAccess.getDiaryPost(diaryPostId);

  if (!postToDelete) {
    logger.error(`No post found for diaryPostId: ${diaryPostId}`);
    throw new Error('No diary post found');
  }

  if (postToDelete.userId !== userId) {
    logger.error(`Permission error: User: ${userId} is not authorized to delete this diary post: ${diaryPostId}.`);
    throw new Error('Permission error: User is not authorized to delete this post.');
  }

  diaryAccess.deleteDiaryPost(diaryPostId);
}

export async function updateAttachmentUrl(userId: string, diaryPostId: string, attachmentId: string) {
  logger.info(`Creating the attachment URL for attachment: ${attachmentId}`);

  const attachmentUrl = await diaryAccess.getAttachmentUrl(attachmentId);

  logger.info(`Updating the diary post: ${diaryPostId} with attachment URL: ${attachmentUrl}`);

  const post = await diaryAccess.getDiaryPost(diaryPostId);

  if (!post) { 
    logger.error(`No todo found for diaryPostId: ${diaryPostId}`);
    throw new Error('No post found');
  }

  if (post.userId !== userId) {
    logger.error(`Permission error: User: ${userId} is not authorized to update this post: ${diaryPostId}.`);
    throw new Error('Permission error: User is not authorized to update this post.');
  }

  await diaryAccess.updateAttachmentUrl(diaryPostId, attachmentUrl);
}

export async function generateUploadUrl(attachmentId: string): Promise<string> {
  logger.info(`Generating upload URL for attachment: ${attachmentId}`);

  return await diaryAccess.getUploadUrl(attachmentId);
}