import { AxiosInstance } from "./types"
import Axios from './core/Axios'
import {extend} from './helpers/utils'

function createInstance (): AxiosInstance {
  const content = new Axios()
  const instance = Axios.prototype.request.bind(content)

  extend(instance, content)

  return instance as AxiosInstance
}

const axios = createInstance()

export default axios