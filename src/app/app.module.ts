import {OAuthStorage} from "angular-oauth2-oidc";

// Storage factory for OAuthModule
export function storageFactory(): OAuthStorage {
  return localStorage
}


