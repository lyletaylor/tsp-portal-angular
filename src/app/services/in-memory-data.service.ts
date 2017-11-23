import { InMemoryDbService } from 'angular-in-memory-web-api';
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const areas = [
      { id: 0, properties: { name: 'Home', description: '' } },
      { id: 1, properties: { name: 'Work', description: '' } },
      { id: 2, properties: { name: 'Church', description: '' } }
    ];

    const domains = [
      { id: 3, properties: { name: 'Config Mgmt', description: '' }, area: 1 },
      { id: 4, properties: { name: 'Asset Mgtm', description: '' }, area: 1 },
      { id: 5, properties: { name: 'Lessons', description: '' }, area: 2 }
    ];

    const topics = [
      { id: 6, properties: { name: 'Topic 1', description: '' } },
      { id: 7, properties: { name: 'Topic 2', description: '' } },
      { id: 8, properties: { name: 'Topic 3', description: '' } }
    ];
    
    return {areas, domains, topics};
  }
}