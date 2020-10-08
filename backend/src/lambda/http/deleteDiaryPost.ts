import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { deleteDiaryPost } from '../../businessLogic/diaryPosts';
import { createLogger } from '../../utils/logger';
import { getUserId } from '../utils';

const logger = createLogger('deleteDiaryPost');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info(`Processing deleteDiaryPost event`, { event });

  const { diaryPostId  } = event.pathParameters;
  const userId = getUserId(event);

  await deleteDiaryPost(userId, diaryPostId);

  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }

}