import { DockerComposeEnvironment, StartedDockerComposeEnvironment } from 'testcontainers';
import { Environment } from 'testcontainers/build/types';
import { pickPort } from 'pick-port';

export class DockerServices {
  private dockerComposeEnvironment: DockerComposeEnvironment;
  private startedDockerComposeEnvironment: StartedDockerComposeEnvironment;
  private freePortDb: number;
  private freePortApp: number;
  private appLogs = 'APP LOGS:\n';
  private mongodbLogs = 'MONGODB LOGS:\n';
  private mongodbContainerName: string;
  private appContainerName: string;
  private initDataBaseScript: string;

  constructor() {

    this.dockerComposeEnvironment = new DockerComposeEnvironment('.', 'test/playwright/docker/docker-compose-test.yml');
  }

  withEnvironment(environment: Environment): DockerServices {
    this.dockerComposeEnvironment = this.dockerComposeEnvironment.withEnvironment(environment);
    return this;
  }

  withInitDatabaseScript(initScript: string): DockerServices {
    this.initDataBaseScript = initScript;
    return this;
  }

  async up() {
    this.freePortDb = await pickPort({
      type: 'tcp',
      minPort: 27017,
      maxPort: 27037
    });
    this.freePortApp = await pickPort({
      type: 'tcp',
      minPort: 3001,
      maxPort: 3020
    });
    this.mongodbContainerName = `mongodb${this.freePortApp}`;
    this.appContainerName = `bookstore${this.freePortApp}`;


    this.startedDockerComposeEnvironment = await this.dockerComposeEnvironment
      .withEnvironment({ MONGO_INITDB_SCRIPT: this.initDataBaseScript || 'mongo-init.js' })
      .withEnvironment({ MONGO_INITDB_PORT: this.freePortDb.toString() })
      .withEnvironment({ APP_PORT: this.freePortApp.toString() })
      .withEnvironment({ CONTAINER_NAME: this.freePortApp.toString() })
      .up();
    process.env.APP_URI = `http://localhost:${this.freePortApp}`;

    const appLogs = await this.startedDockerComposeEnvironment.getContainer(this.appContainerName).logs();
    appLogs
      .on('data', line => this.appLogs += line.toString())
      .on('err', line => this.appLogs += line.toString());

    const mongodbLogs = await this.startedDockerComposeEnvironment.getContainer(this.mongodbContainerName).logs();
    mongodbLogs
      .on('data', line => this.mongodbLogs += line.toString())
      .on('err', line => this.mongodbLogs += line.toString());
    return this;
  }

  async down() {
    await this.startedDockerComposeEnvironment.down();
  }

  getAppLogs() {
    return this.appLogs;
  }

  getMongodbLogs() {
    return this.mongodbLogs;
  }
}
