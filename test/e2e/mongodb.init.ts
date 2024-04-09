import { GenericContainer } from 'testcontainers';
import * as process from 'process';
import { resolve } from 'path';
import { pickPort } from 'pick-port';

async function createContainer(initScript?: string) {
  const containerPort = 27017;
  const hostPort = await pickPort({
    type: 'tcp',
    minPort: 27000,
    maxPort: 27099
  });
  // const hostPort = 27017;
  const copyFiles = initScript ? [
    {
      source: resolve(initScript),
      target: `/docker-entrypoint-initdb.d/mongo-init.js`
    }
  ] : [];


  const container = new GenericContainer('mongo')
    .withEnvironment({ MONGO_INITDB_DATABASE: process.env.MONGO_INITDB_DATABASE })
    .withEnvironment({ MONGO_INITDB_ROOT_USERNAME: process.env.MONGO_INITDB_ROOT_USERNAME })
    .withEnvironment({ MONGO_INITDB_ROOT_PASSWORD: process.env.MONGO_INITDB_ROOT_PASSWORD })
    .withCopyFilesToContainer(copyFiles)
    .withExposedPorts({ container: containerPort, host: hostPort });

  return container;
}

export { createContainer };
