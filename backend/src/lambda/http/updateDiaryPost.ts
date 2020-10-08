import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { updateDiaryPost } from '../../businessLogic/diaryPosts'
import { UpdateDiaryPostRequest } from '../../requests/UpdateDiaryPostRequest'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('updateDiaryPost')


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing updateDiaryPost event', { event });

  const { diaryPostId } = event.pathParameters;
  const updatedDiaryPost: UpdateDiaryPostRequest = JSON.parse(event.body);

  const userId = getUserId(event);

  await updateDiaryPost(userId, diaryPostId, updatedDiaryPost);
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: ''
  }
}