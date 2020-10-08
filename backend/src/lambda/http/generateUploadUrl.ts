import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import * as uuid from 'uuid'

import { generateUploadUrl, updateAttachmentUrl } from '../../businessLogic/diaryPosts'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'

const logger = createLogger('generateUploadUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('Processing generateUploadUrl event', { event });

  const { diaryPostId } = event.pathParameters;
  const userId = getUserId(event);

  const attachmentId = uuid.v4();

  const uploadUrl = await generateUploadUrl(attachmentId);

  await updateAttachmentUrl(userId, diaryPostId, attachmentId);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ uploadUrl })
  }
}