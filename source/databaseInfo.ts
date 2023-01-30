import { PersistenceInfo } from 'flexiblepersistence';
import { ConnectionOptions } from 'tls';
let writeDatabaseOptions: object | string | undefined =
  process.env.DATABASE_OPTIONS || process.env.DATABASE_WRITE_OPTIONS;
const writeDatabaseSSLEnv =
  process.env.DATABASE_SSL || process.env.DATABASE_WRITE_SSL || 'false';
let writeDatabaseSSL:
  | boolean
  | ConnectionOptions
  | ConnectionOptions
  | string
  | undefined;

try {
  writeDatabaseOptions = writeDatabaseOptions
    ? JSON.parse(writeDatabaseOptions)
    : undefined;
} catch (error) {
  writeDatabaseOptions = writeDatabaseOptions;
}

try {
  writeDatabaseSSL = writeDatabaseSSLEnv
    ? JSON.parse(writeDatabaseSSLEnv)
    : undefined;
} catch (error) {
  writeDatabaseSSL = writeDatabaseSSLEnv;
}

const writeDatabaseConnectionTimeout =
  process.env.DATABASE_CONNECTION_TIMEOUT ||
  process.env.DATABASE_WRITE_CONNECTION_TIMEOUT;
const writeDatabaseConnectionTimeoutNumber = writeDatabaseConnectionTimeout
  ? +writeDatabaseConnectionTimeout
  : 60000;
const writeDatabaseRequestTimeout =
  process.env.DATABASE_REQUEST_TIMEOUT ||
  process.env.DATABASE_WRITE_REQUEST_TIMEOUT;
const writeDatabaseRequestTimeoutNumber = writeDatabaseRequestTimeout
  ? +writeDatabaseRequestTimeout
  : 60000;

const writeDatabaseEncryptionDisabledEnv =
  process.env.DATABASE_ENCRYPTION_DISABLED?.toLowerCase() === 'true' ||
  process.env.DATABASE_ENCRYPTION_DISABLED?.toLowerCase() === '1' ||
  process.env.DATABASE_WRITE_ENCRYPTION_DISABLED?.toLowerCase() === 'true' ||
  process.env.DATABASE_WRITE_ENCRYPTION_DISABLED?.toLowerCase() === '1';

const writeDatabaseEncryptionDisabled = writeDatabaseEncryptionDisabledEnv
  ? {
      encrypt: false,
      trustServerCertificate: false,
    }
  : undefined;

writeDatabaseOptions = writeDatabaseOptions
  ? writeDatabaseOptions
  : writeDatabaseEncryptionDisabled;

const eventInfo =
  process.env.DATABASE_DISABLED?.toLowerCase() === 'true' ||
  process.env.DATABASE_DISABLED?.toLowerCase() === '1' ||
  process.env.DATABASE_WRITE_DISABLED?.toLowerCase() === 'true' ||
  process.env.DATABASE_WRITE_DISABLED?.toLowerCase() === '1'
    ? undefined
    : {
        uri: process.env.DATABASE_URI || process.env.DATABASE_WRITE_URI,
        connectionType:
          process.env.DATABASE_CONNECTION_TYPE ||
          process.env.DATABASE_WRITE_CONNECTION_TYPE,
        options: writeDatabaseOptions,
        database:
          process.env.DATABASE_NAME ||
          process.env.DATABASE_WRITE_NAME ||
          'write',
        host: process.env.DATABASE_HOST || process.env.DATABASE_WRITE_HOST,
        port: process.env.DATABASE_PORT || process.env.DATABASE_WRITE_PORT,
        username: process.env.DATABASE_USER || process.env.DATABASE_WRITE_USER,
        password:
          process.env.DATABASE_PASSWORD || process.env.DATABASE_WRITE_PASSWORD,
        ssl: writeDatabaseSSL,
        connectionTimeout: writeDatabaseConnectionTimeoutNumber,
        requestTimeout: writeDatabaseRequestTimeoutNumber,
      };

let readDatabaseOptions: object | string | undefined =
  process.env.DATABASE_OPTIONS || process.env.DATABASE_READ_OPTIONS;
const readDatabaseSSLEnv =
  process.env.DATABASE_SSL || process.env.DATABASE_READ_SSL || 'false';
let readDatabaseSSL:
  | boolean
  | ConnectionOptions
  | ConnectionOptions
  | string
  | undefined;

try {
  readDatabaseOptions = readDatabaseOptions
    ? JSON.parse(readDatabaseOptions)
    : undefined;
} catch (error) {
  readDatabaseOptions = readDatabaseOptions;
}

try {
  readDatabaseSSL = readDatabaseSSLEnv
    ? JSON.parse(readDatabaseSSLEnv)
    : undefined;
} catch (error) {
  readDatabaseSSL = readDatabaseSSLEnv;
}

const readDatabaseConnectionTimeout =
  process.env.DATABASE_CONNECTION_TIMEOUT ||
  process.env.DATABASE_READ_CONNECTION_TIMEOUT;
const readDatabaseConnectionTimeoutNumber = readDatabaseConnectionTimeout
  ? +readDatabaseConnectionTimeout
  : 60000;
const readDatabaseRequestTimeout =
  process.env.DATABASE_REQUEST_TIMEOUT ||
  process.env.DATABASE_READ_REQUEST_TIMEOUT;
const readDatabaseRequestTimeoutNumber = readDatabaseRequestTimeout
  ? +readDatabaseRequestTimeout
  : 60000;

const readDatabaseEncryptionDisabledEnv =
  process.env.DATABASE_ENCRYPTION_DISABLED?.toLowerCase() === 'true' ||
  process.env.DATABASE_ENCRYPTION_DISABLED?.toLowerCase() === '1' ||
  process.env.DATABASE_READ_ENCRYPTION_DISABLED?.toLowerCase() === 'true' ||
  process.env.DATABASE_READ_ENCRYPTION_DISABLED?.toLowerCase() === '1';

const readDatabaseEncryptionDisabled = readDatabaseEncryptionDisabledEnv
  ? {
      encrypt: false,
      trustServerCertificate: false,
    }
  : undefined;

readDatabaseOptions = readDatabaseOptions
  ? readDatabaseOptions
  : readDatabaseEncryptionDisabled;

const readInfo =
  process.env.DATABASE_DISABLED?.toLowerCase() === 'true' ||
  process.env.DATABASE_DISABLED?.toLowerCase() === '1' ||
  process.env.DATABASE_READ_DISABLED?.toLowerCase() === 'true' ||
  process.env.DATABASE_READ_DISABLED?.toLowerCase() === '1'
    ? undefined
    : {
        uri: process.env.DATABASE_URI || process.env.DATABASE_READ_URI,
        connectionType:
          process.env.DATABASE_CONNECTION_TYPE ||
          process.env.DATABASE_READ_CONNECTION_TYPE,
        options: readDatabaseOptions,
        database:
          process.env.DATABASE_NAME || process.env.DATABASE_READ_NAME || 'read',
        host: process.env.DATABASE_HOST || process.env.DATABASE_READ_HOST,
        port: process.env.DATABASE_PORT || process.env.DATABASE_READ_PORT,
        username: process.env.DATABASE_USER || process.env.DATABASE_READ_USER,
        password:
          process.env.DATABASE_PASSWORD || process.env.DATABASE_READ_PASSWORD,
        ssl: readDatabaseSSL,
        connectionTimeout: readDatabaseConnectionTimeoutNumber,
        requestTimeout: readDatabaseRequestTimeoutNumber,
      };

let readDatabase;
let eventDatabase;

const setEventDatabase = (journaly) => {
  if (eventInfo === undefined) return undefined;
  else eventDatabase = new PersistenceInfo(eventInfo, journaly);
  if (
    process.env.SHOW_DATABASE_INFO?.toLowerCase() === 'true' ||
    process.env.SHOW_DATABASE_INFO?.toLowerCase() === '1' ||
    eventDatabase !== undefined
  ) {
    console.log(
      'eventInfo:',
      eventDatabase?.host,
      eventDatabase?.port,
      eventDatabase?.database
    );
  }
};

const setReadDatabase = (journaly) => {
  if (readInfo === undefined) {
    if (eventInfo === undefined) {
      readDatabase = journaly;
      return readDatabase;
    }
    return undefined;
  } else readDatabase = new PersistenceInfo(readInfo, journaly);
  if (
    process.env.SHOW_DATABASE_INFO?.toLowerCase() === 'true' ||
    process.env.SHOW_DATABASE_INFO?.toLowerCase() === '1' ||
    readDatabase !== undefined
  ) {
    console.log(
      'readInfo:',
      readDatabase?.host,
      readDatabase?.port,
      readDatabase?.database
    );
  }
};

const getEventDatabase = (journaly?) => {
  if (eventInfo === undefined) return undefined;
  if (eventDatabase !== undefined) {
    return eventDatabase;
  } else if (journaly) {
    setEventDatabase(journaly);
    return eventDatabase;
  }
  return undefined;
};

const getReadDatabase = (journaly?) => {
  if (readInfo === undefined) return undefined;
  if (readDatabase !== undefined) {
    return readDatabase;
  } else if (journaly) {
    setReadDatabase(journaly);
    return readDatabase;
  }
  return undefined;
};

export {
  eventInfo,
  readInfo,
  setEventDatabase,
  setReadDatabase,
  getEventDatabase,
  getReadDatabase,
};
