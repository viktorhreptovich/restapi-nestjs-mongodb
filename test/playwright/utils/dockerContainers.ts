import { pickPort } from 'pick-port';
import { DockerComposeEnvironment, StartedDockerComposeEnvironment } from 'testcontainers';

export async function dockerContainers(name: string, initScript?: string): Promise<StartedDockerComposeEnvironment> {
  const freePortDb = await pickPort({
    type: 'tcp',
    minPort: 27017,
    maxPort: 27037
  });
  const freePortApp = await pickPort({
    type: 'tcp',
    minPort: 3001,
    maxPort: 3020
  });
  const container = await
    new DockerComposeEnvironment('.', 'test/playwright/docker/docker-compose-test.yml')
      .withEnvironment({ MONGO_INITDB_SCRIPT: initScript || 'mongo-init.js' })
      .withEnvironment({ MONGO_INITDB_PORT: freePortDb.toString() })
      .withEnvironment({ APP_PORT: freePortApp.toString() })
      .withEnvironment({ CONTAINER_NAME: name })
      .up();
  process.env.APP_URI = `http://localhost:${container.getContainer(`bookstore${name}`).getFirstMappedPort()}`;
  return container;
}
