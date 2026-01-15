/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    REACT_APP_AUTH0_DOMAIN?: string;
    REACT_APP_AUTH0_CLIENT_ID?: string;
    REACT_APP_AUTH0_AUDIENCE?: string;
  }
}
