import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateDiaryPostRequest } from '../../requests/CreateDiaryPostRequest'
import { createDiaryPost } from '../../businessLogic/diaryPosts';
import { createLogger } from '../../utils/logger';

import { getUserId } from '../utils';

const logger = createLogger('createDiaryPost');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info(`Processing createDiaryPost event`, { event });

  const userId = getUserId(event);
  const newDiaryPost: CreateDiaryPostRequest = JSON.parse(event.body)

  const item = await createDiaryPost(userId, newDiaryPost);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({ item })
  }
}