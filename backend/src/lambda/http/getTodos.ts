import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy';
import { cors } from 'middy/middlewares'
import { getTodosForUser as getTodosForUser } from '../../businessLogic/todos';
import { getUserId } from '../utils';



// TODO: Get all TODO items for a current user
// Wrap the handler function with middy middleware 
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

      console.log('Caller event', event)
    // Write your code here

    const userId: string = getUserId(event);

    const todos = await getTodosForUser(userId);

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        'items': todos
      })
    }

  });



handler.use(
  cors({
    credentials: true
  })
);


