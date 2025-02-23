import os from 'os';

export const load = () => {
  return {
    serverHostname: os.hostname(), // To see which server is handling the request (just some tmp debugging info)
  }
}