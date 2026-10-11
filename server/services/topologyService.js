import axios from 'axios';

export const registerTopologyOnBoot = async () => {
  const topologyUrl = process.env.NEXORA_TOPOLOGY_URL || 'http://localhost:8080/api/topology';
  const port = process.env.PORT || 5000;

  const payload = {
    application: 'ecom-synthetic-workload',
    environment: process.env.NODE_ENV || 'local-dev',
    topology: {
      services: [
        { id: 'api-gateway', type: 'gateway', target: `localhost:${port}` },
        { id: 'auth-service', type: 'service', dependencies: ['mongodb-local'] },
        { id: 'catalog-service', type: 'service', dependencies: ['mongodb-local', 'fs-cache'] },
        { id: 'checkout-service', type: 'service', dependencies: ['payment-simulator', 'mongodb-local'] },
        { id: 'payment-simulator', type: 'mock-service', dependencies: [] },
        { id: 'mongodb-local', type: 'database', target: 'localhost:27017' },
        { id: 'fs-cache', type: 'storage', target: 'local-disk' },
      ],
      edges: [
        { from: 'api-gateway', to: 'auth-service' },
        { from: 'api-gateway', to: 'catalog-service' },
        { from: 'api-gateway', to: 'checkout-service' },
        { from: 'auth-service', to: 'mongodb-local' },
        { from: 'catalog-service', to: 'mongodb-local' },
        { from: 'catalog-service', to: 'fs-cache' },
        { from: 'checkout-service', to: 'payment-simulator' },
        { from: 'checkout-service', to: 'mongodb-local' },
      ],
    },
  };

  console.log(`[SF-4 Topology] Registering microservice graph with NEXORA endpoint: ${topologyUrl}...`);

  try {
    const response = await axios.post(topologyUrl, payload, { timeout: 3000 });
    console.log(`[SF-4 Topology] Topology successfully mapped to NEXORA: status ${response.status}`);
    return true;
  } catch (error) {
    console.warn(`[SF-4 Topology] NEXORA endpoint (${topologyUrl}) unreachable (${error.message}). Continuing local workload boot.`);
    return false;
  }
};
