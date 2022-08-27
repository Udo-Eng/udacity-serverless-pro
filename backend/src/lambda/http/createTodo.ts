import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId } from '../utils';
import { createTodo } from '../../businessLogic/todos';
import {TodoItem} from '../../models/TodoItem';



export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
   
    // TODO: Implement creating a new TODO item
 
      const userId : string  =  getUserId(event);


    const  TodoItem : TodoItem  = await createTodo(userId , newTodo ) 

    return {
      statusCode: 200,
       headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body : JSON.stringify({
          'item': TodoItem
      })
    }
  }
);

handler.use(
  cors({
    credentials: true
  })
)


