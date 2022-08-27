import * as AWS from 'aws-sdk';
import { Types } from 'aws-sdk/clients/s3'
import * as AWSXRay from 'aws-xray-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createLogger } from '../utils/logger';
import { TodoItem } from '../models/TodoItem';
import { TodoUpdate } from '../models/TodoUpdate';


const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess');
const expiration = process.env.SIGNED_URL_EXPIRATION;

// TODO: Implement the dataLayer logic


export class TodosAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly s3: Types = new XAWS.S3({ signatureVersion: 'v4' }),
    private readonly todoTable = process.env.TODOS_TABLE,
    private readonly indexName = process.env.TODOS_CREATED_AT_INDEX,
    private readonly BUCKET_NAME = process.env.ATTACHMENT_S3_BUCKET
  ) {}

  // Method to get all Todo Items
  async getTodos(userId: string): Promise<TodoItem[]> {
    logger.info('Getting all todos')



    const queryParams = {
      TableName: this.todoTable,
      IndexName: this.indexName,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }

    const result = await this.docClient.query(queryParams).promise()

    logger.info(JSON.stringify(result))

    const items = result.Items

    return items as TodoItem[];

  }

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    logger.info('Creating new todo')

    const result = await this.docClient
      .put({
        TableName: this.todoTable,
        Item: todoItem
      })
      .promise()

    logger.info(JSON.stringify(result))

    return todoItem as TodoItem
  }

  // Method to update Todo Item
  async updateTodo(
    todoUpdate: TodoUpdate,
    todoId: string,
    userId: string
  ): Promise<string> {
    logger.info('Updating todo')

    const params = {
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId
      },
      UpdateExpression: 'set #x = :a, #y = :b, #z= :c',
      ExpressionAttributeNames: {
        '#x': 'name',
        '#y': 'dueDate',
        '#z': 'done'
      },
      ExpressionAttributeValues: {
        ':a': todoUpdate['name'],
        ':b': todoUpdate['dueDate'],
        ':c': todoUpdate['done']
      },
      ReturnValues: 'NONE'
    }

    await this.docClient.update(params).promise();

  
    return ' ' as string ;
  }

  // Method to delete Todo Item
  async deleteTodo(todoId: string, userId: string): Promise<string> {

    logger.info('Deleting todo')

    const params = {
      TableName: this.todoTable,
      Key: {
        userId: userId,
        todoId: todoId
      }
    }

    const result = await this.docClient.delete(params).promise()
    logger.info(JSON.stringify(result))

    return '' as string
  }

  // Method to generate the uploadUrl for the Todo Item
  async generateUploadUrl(todoId: string): Promise<string> {

    logger.info('Generating URL');

    const url = await this.s3.getSignedUrl('putObject', {
      Bucket: this.BUCKET_NAME,
      Key: todoId,
      Expires: expiration
    })

    logger.info(JSON.stringify(url));

    return url as string;
  }
}

