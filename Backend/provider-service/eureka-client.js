const Eureka = require('eureka-js-client').Eureka;
const dotenv = require('dotenv');
dotenv.config();

const port = process.env.PORT || 5001;
const hostName = process.env.HOST_NAME || 'provider-service';
const ipAddr = process.env.IP_ADDR || '127.0.0.1';

// We format Eureka URL properly, extracting host/port dynamically.
// EUREKA_SERVER_URL typically comes as http://eureka-server:8761/eureka/

const eurekaHost = process.env.EUREKA_HOST || 'eureka-server';
const eurekaPort = process.env.EUREKA_PORT || 8761;

const eurekaClient = new Eureka({
  instance: {
    app: 'provider-service',
    hostName: hostName,
    ipAddr: ipAddr,
    statusPageUrl: `http://${hostName}:${port}/api/health`,
    port: {
      '$': port,
      '@enabled': 'true',
    },
    vipAddress: 'provider-service',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn',
    },
  },
  eureka: {
    host: eurekaHost,
    port: eurekaPort,
    servicePath: '/eureka/apps/',
    maxRetries: 10,
    requestRetryDelay: 2000,
  },
});

// Auto-start Eureka
eurekaClient.start((error) => {
  console.log('Eureka Registration Complete!', error || '');
});

// Helper Function for Cross-Service Discovery
const getServiceUrl = (serviceName) => {
  const instances = eurekaClient.getInstancesByAppId(serviceName);
  if (instances && instances.length > 0) {
    const instance = instances[0];
    return `http://${instance.hostName}:${instance.port.$}`;
  }
  return null;
};

module.exports = { eurekaClient, getServiceUrl };
