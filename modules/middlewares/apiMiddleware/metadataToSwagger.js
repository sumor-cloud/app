/**
 * 将API元数据转换为Swagger UI格式
 * @param {Object} metadata - API元数据对象
 * @returns {Object} Swagger UI格式的API文档
 */
export default function convertToSwagger(metadata) {
  const swaggerDoc = {
    openapi: '3.0.0',
    info: {
      title: metadata.name,
      version: '1.0.0',
      description: metadata.desc || '接口文档'
    },
    tags: [
      {
        name: '接口列表',
        description: `共${Object.keys(metadata.apis).length}个接口`
      }
    ],
    paths: {},
    components: {
      schemas: {}
    }
  }

  // 遍历所有API端点
  Object.entries(metadata.apis)
    .sort(([a], [b]) => a.localeCompare(b))
    .forEach(([path, apiInfo]) => {
      const swaggerPath = {}

      let methods = apiInfo.methods
      if (methods.includes('POST')) {
        methods = ['POST']
      } else if (methods.includes('GET')) {
        methods = ['GET']
      }

      // 处理每个HTTP方法
      methods.forEach(method => {
        const methodLower = method.toLowerCase()
        swaggerPath[methodLower] = {
          tags: ['接口列表'],
          summary: apiInfo.name || path,
          description: apiInfo.desc || '',
          parameters: [],
          responses: {
            200: {
              description: '成功响应',
              content: {
                'application/json': {
                  schema: {
                    type: 'object'
                  }
                }
              }
            }
          }
        }

        // 处理路径参数
        if (path.includes(':')) {
          const pathParams = path.match(/:[^/]+/g) || []
          pathParams.forEach(param => {
            const paramName = param.slice(1)
            const paramInfo = apiInfo.parameters[paramName]
            if (paramInfo) {
              swaggerPath[methodLower].parameters.push({
                name: paramName,
                in: 'path',
                required: paramInfo.required,
                schema: {
                  type: paramInfo.type,
                  description: paramInfo.desc
                },
                description: paramInfo.name
              })
            }
          })
        }

        // 处理查询参数
        Object.entries(apiInfo.parameters).forEach(([paramName, paramInfo]) => {
          if (!path.includes(`:${paramName}`) && paramInfo.type !== 'file') {
            swaggerPath[methodLower].parameters.push({
              name: paramName,
              in: 'query',
              required: paramInfo.required,
              schema: {
                type: paramInfo.type,
                description: paramInfo.desc
              },
              description: paramInfo.name
            })
          }
        })

        // 处理文件上传
        if (method === 'POST' && Object.values(apiInfo.parameters).some(p => p.type === 'file')) {
          swaggerPath[methodLower].requestBody = {
            content: {
              'multipart/form-data': {
                schema: {
                  type: 'object',
                  properties: {}
                }
              }
            }
          }

          // 添加文件参数到schema
          Object.entries(apiInfo.parameters).forEach(([paramName, paramInfo]) => {
            if (paramInfo.type === 'file') {
              swaggerPath[methodLower].requestBody.content['multipart/form-data'].schema.properties[
                paramName
              ] = {
                type: 'array',
                items: {
                  type: 'string',
                  format: 'binary'
                },
                description: paramInfo.desc || paramInfo.name
              }
            }
          })
        }
      })

      // 将处理后的路径添加到swagger文档中
      swaggerDoc.paths[path] = swaggerPath
    })

  return swaggerDoc
}

// 使用示例
// import metadata from './sample-metadata.json' assert { type: 'json' };
// const swaggerDoc = convertToSwagger(metadata);
// console.log(JSON.stringify(swaggerDoc, null, 2));
