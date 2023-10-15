import * as apiEnv from "src/enviroment.prod.json"

export interface ApiEnvI {
  apiUrl: string
}

export const apiEnviroment = {
  apiEnv: apiEnv
}
