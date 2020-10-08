import 'source-map-support/register';

import * as AWS from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb'


import { DiaryCreate } from '../models/DiaryCreate';
import { DiaryUpdate } from '../models/DiaryUpdate';
import { createLogger } from '../utils/logger';

const logger = createLogger("diaryAccess");

const AWSXRay = require('aws-xray-sdk');

const XAWS = AWSXRay.captureAWS(AWS);

export class DiaryAccess {

  constructor(
    private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly diaryTable = process.env.DIARY_TABLE,
    private readonly bucketName = process.env.ATTACHMENTS_S3_BUCKET,
    private readonly diaryPostByUserIndex = process.env.DIARY_POST_BY_USER_INDEX
  ) {};

  async diaryPostExists(diaryPostId: string): Promise<Boolean> {
    const item = await this.getDiaryPosts(diaryPostId);
    return !!item;
  }

  async getDiaryPosts(userId: string): Promise<DiaryCreate[]> {
    logger.info(`Getting all posts for user: ${userId} from ${this.diaryTable}`)

    const result = await this.docClient.query({
      TableName: this.diaryTable,
      IndexName: this.diaryPostByUserIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }).promise();

    const items = result.Items;

    logger.info(`Found ${items.length} todos for user: ${userId} in ${this.diaryTable}`);

    return items as DiaryCreate[];
  };

  async createDiaryPost(diaryPost: DiaryCreate) {
    logger.info(`Putting todo: ${diaryPost.diaryPostId} into ${this.diaryTable}`);

    await this.docClient.put({
      TableName: this.diaryTable,
      Item: diaryPost,
    }).promise();
  };

  async getDiaryPost(diaryPostId: string): Promise<DiaryCreate> {
    logger.info(`Getting diary post: ${diaryPostId} from ${this.diaryTable}`);

    const result = await this.docClient.get({
      TableName: this.diaryTable,
      Key: {
        diaryPostId
      }
    }).promise();

    const item = result.Item;

    return item as DiaryCreate;
  }

  async updateDiaryPost(diaryPostId: string, diaryPostToUpdate: DiaryUpdate) {
    logger.info(`Updating diary post: ${diaryPostId} in ${this.diaryTable}`);

    await this.docClient.update({
      TableName: this.diaryTable,
      Key: {
        diaryPostId
      },
      UpdateExpression: 'set #title = :title, #body = :body',
      ExpressionAttributeNames: {
        "#title": "title",
        "#body": "body"
      },
      ExpressionAttributeValues: {
        ":title": diaryPostToUpdate.title,
        ":body": diaryPostToUpdate.body
      }

    }).promise();

    
  }

  async deleteDiaryPost(diaryPostId: string) {
    logger.info(`Deleting diary post: ${diaryPostId} from ${this.diaryTable}`);

    await this.docClient.delete({
      TableName: this.diaryTable,
      Key: {
        diaryPostId
      }
    }).promise();
  }

  async updateAttachmentUrl(diaryPostId: string, attachmentUrl: string) {
    logger.info(`Updating attachment URL for todo: ${diaryPostId} in ${this.diaryTable}`)

    await this.docClient.update({
      TableName: this.diaryTable,
      Key: {
        diaryPostId
      },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      }
    }).promise()
  }

  async getAttachmentUrl(attachmentId: string): Promise<string> {
    const attachmentUrl = `https://${this.bucketName}.s3.amazonaws.com/${attachmentId}`
    return attachmentUrl
  }

  async getUploadUrl(attachmentId: string): Promise<string> {
    const uploadUrl = this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: attachmentId,
      Expires: this.urlExpiration
    })
    return uploadUrl;
  }
 
}