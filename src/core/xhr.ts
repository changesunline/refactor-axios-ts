import { AxiosRequestConfig, AxiosResponse, AxiosPromise } from '../types'
import { parseHeaders } from '../helpers/headers'
import {createError} from '../helpers/error'

export function xhr(config: AxiosRequestConfig): AxiosPromise {
  const { data = null, url, method = 'get', headers, responseType, timeout } = config
  const request = new XMLHttpRequest()
  
  if (responseType) {
    request.responseType = responseType
  }

  if (timeout) {
    request.timeout = timeout
  }
  return new Promise((resolve, reject) => {
    request.open(method.toUpperCase(), url!, true)

    request.onreadystatechange = function handleload() {
      if (request.readyState !== 4) {
        return
      }

      if (request.status === 0) {
        return
      }
      const responseHeaders = parseHeaders(request.getAllResponseHeaders())
      const responseData = responseType === 'text' ? request.responseText : request.response
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      handleResponse(response)
    }

    request.onerror = function handleError () {
      reject(createError('Network Error',config,null,request))
    }

    request.ontimeout = function handleTimeout () {
      reject(createError(`Timeout of ${timeout} exceeded`,config,'ECONNABOTED',request))
    }

    Object.keys(headers).forEach(name => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)

    function handleResponse(response: AxiosResponse): void {
      if (request.status >= 200 || request.status < 300) {
        resolve(response)
      } else {
        reject(createError(`Request failed with status code ${request.status}`,config,null,request,response))
      }
    }
  })
}
