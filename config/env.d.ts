/**
 *  Declare ENV variables for typescript
 *
 *  To add more ENV variables
 *
 *    Add it to package.json under "environment" dev, staging, and prod
 *    Add its type here in the ENV object for typescript
 */

interface IEnvironment {
  // Api
  apiRoot: string;
  apiPort: number;
  MONGO_URL: string;

  // Client
  authToken: string;
  port: number;

  // Local Storage namespace
  STORAGE_NAMESPACE: string;

  // Client or server
  BUILD_TARGET: string;

  // dev / staging / production
  DEPLOY_TARGET: string;

  // constants for use with DEPLOY_TARGET
  TARGET_DEV: string;
  TARGET_STAGING: string;
  TARGET_PRODUCTION: string;
}

// export declare var ENV: IEnvironment;
declare var ENV: IEnvironment;