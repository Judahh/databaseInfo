import { PersistenceInfo } from 'flexiblepersistence';
import { ConnectionOptions } from 'tls';
const writeDatabaseSSLEnv =
  process.env.DATABASE_SSL || process.env.DATABASE_WRITE_SSL || 'false';

const parse = <T = any>(value) => {
  try {
    return JSON.parse(value) as T | undefined;
  } catch (error) {
    return value as T | undefined;
  }
};

let writeDatabaseOptions = parse<object | string>(
  process.env.DATABASE_OPTIONS || process.env.DATABASE_WRITE_OPTIONS
);

const writeDatabaseAdditionalParamsString: string | undefined =
  process.env.DATABASE_ADDITIONAL_PARAMS ||
  process.env.DATABASE_WRITE_ADDITIONAL_PARAMS;

const writeDatabaseAdditionalParams = parse<{ [key: string]: any }>(
  writeDatabaseAdditionalParamsString
);

const writeDatabaseSSL = parse<
  boolean | ConnectionOptions | ConnectionOptions | string
>(writeDatabaseSSLEnv);

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
        ...(writeDatabaseAdditionalParams || {}),
        uri: process.env.DATABASE_URI || process.env.DATABASE_WRITE_URI,
        connectionType:
          process.env.DATABASE_CONNECTION_TYPE ||
          process.env.DATABASE_WRITE_CONNECTION_TYPE,
        options: writeDatabaseOptions,
        database:
          process.env.DATABASE_NAME ||
          process.env.DATABASE_WRITE_NAME ||
          'write',
        host: parse(
          process.env.DATABASE_HOST || process.env.DATABASE_WRITE_HOST
        ),
        port: parse(
          process.env.DATABASE_PORT || process.env.DATABASE_WRITE_PORT
        ),
        username: process.env.DATABASE_USER || process.env.DATABASE_WRITE_USER,
        password:
          process.env.DATABASE_PASSWORD || process.env.DATABASE_WRITE_PASSWORD,
        ssl: writeDatabaseSSL,
        connectionTimeout: writeDatabaseConnectionTimeoutNumber,
        requestTimeout: writeDatabaseRequestTimeoutNumber,
      };

const readDatabaseSSLEnv =
  process.env.DATABASE_SSL || process.env.DATABASE_READ_SSL || 'false';

let readDatabaseOptions = parse<object | string>(
  process.env.DATABASE_OPTIONS || process.env.DATABASE_READ_OPTIONS
);

const readDatabaseAdditionalParamsString: string | undefined =
  process.env.DATABASE_ADDITIONAL_PARAMS ||
  process.env.DATABASE_READ_ADDITIONAL_PARAMS;

const readDatabaseAdditionalParams = parse<{ [key: string]: any }>(
  readDatabaseAdditionalParamsString
);

const readDatabaseSSL = parse<
  boolean | ConnectionOptions | ConnectionOptions | string
>(readDatabaseSSLEnv);

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
        ...(readDatabaseAdditionalParams || {}),
        uri: process.env.DATABASE_URI || process.env.DATABASE_READ_URI,
        connectionType:
          process.env.DATABASE_CONNECTION_TYPE ||
          process.env.DATABASE_READ_CONNECTION_TYPE,
        options: readDatabaseOptions,
        database:
          process.env.DATABASE_NAME || process.env.DATABASE_READ_NAME || 'read',
        host: parse(
          process.env.DATABASE_HOST || process.env.DATABASE_READ_HOST
        ),
        port: parse(
          process.env.DATABASE_PORT || process.env.DATABASE_READ_PORT
        ),
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
  if (readInfo === undefined && eventInfo !== undefined) return undefined;
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
