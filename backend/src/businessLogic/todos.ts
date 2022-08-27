import { TodosAccess } from '../dataLayer/todosAcess'
// import { AttachmentUtils } from '../helpers/attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'

// TODO: Implement businessLogic


const logger  = createLogger('Todos Logic');

const todosAcess = new TodosAccess();

    export const getTodosForUser = async  (userId: string) : Promise<TodoItem[]>=> {

                try{
                const todos =   await todosAcess.getTodos(userId);

                return todos;

                }catch(err){
                    // createError()
                    
                    logger.info('An error occurred while getting the Users Todos');

                      const processId = uuid.v4()
                      const errorTime = new Date().toISOString()
                      logger.info(
                        `${processId}: \n  unable to get User Todos at ${errorTime}`
                      )
                }

        }


  export const createTodo = async (
        userId: string,
        newTodo: CreateTodoRequest
        ): Promise<TodoItem> => {
            
            try {
                const todoId: string = uuid.v4()
                const createdAt: string = new Date().toISOString()


                const TodoItem: TodoItem = {
                  todoId,
                  createdAt,
                  userId,
                  done: false,
                  ...newTodo
                  //   attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`
                }

                await todosAcess.createTodo(TodoItem)

             return TodoItem;

            } catch (err) {
            
            const processId = uuid.v4()
            const errorTime = new Date().toISOString()
            logger.info(
              `${processId}: \n TodoItem  Was not created sucessfully -${errorTime}`
            );
        }
}



export const updateTodo  = async (todoId : string , userId : string, updatedTodo : UpdateTodoRequest  ): Promise<string> => {


        
        try{


            const result  =   await todosAcess.updateTodo(updatedTodo ,todoId ,userId );


                return result as string;

        }catch(err){
            const processId = uuid.v4();
            const errorTime = new Date().toISOString();
            logger.info(`${processId}: \n Todo Was not Updated sucessfully - ${errorTime}`);
  
        }
  

}


export const deleteTodo  = async (todoId : string , userId : string  ): Promise<string> => {


        
        try{


            const result  =   await todosAcess.deleteTodo(todoId ,userId );


          return result as string;

        }catch(err){
            const processId = uuid.v4();
            const errorTime = new Date().toISOString();
            logger.info(`${processId}: \n TodoItem  was not deleted sucessfully - ${errorTime}`);
  
        }
  

}


export const createAttachmentPresignedUrl = async (
  todoId: string
): Promise<string> => {
  const url = await todosAcess.generateUploadUrl(todoId)

  return url as string
}