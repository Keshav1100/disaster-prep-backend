import fs from 'fs';
import path from 'path';

class FileDB {
  constructor() {
    this.dataDir = './data';
    this.ensureDataDir();
  }

  ensureDataDir() {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }
  }

  getFilePath(collection) {
    return path.join(this.dataDir, `${collection}.json`);
  }

  readCollection(collection) {
    try {
      const filePath = this.getFilePath(collection);
      if (!fs.existsSync(filePath)) {
        return [];
      }
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${collection}:`, error);
      return [];
    }
  }

  writeCollection(collection, data) {
    try {
      const filePath = this.getFilePath(collection);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      return true;
    } catch (error) {
      console.error(`Error writing ${collection}:`, error);
      return false;
    }
  }

  insert(collection, doc) {
    const data = this.readCollection(collection);
    doc._id = this.generateId();
    doc.createdAt = new Date().toISOString();
    data.push(doc);
    this.writeCollection(collection, data);
    return doc;
  }

  find(collection, query = {}) {
    const data = this.readCollection(collection);
    if (Object.keys(query).length === 0) {
      return data;
    }

    return data.filter(item => {
      return Object.keys(query).every(key => {
        if (key === '_id' && typeof query[key] === 'string') {
          return item[key] === query[key];
        }
        return item[key] === query[key];
      });
    });
  }

  findOne(collection, query) {
    const results = this.find(collection, query);
    return results.length > 0 ? results[0] : null;
  }

  update(collection, query, updateDoc) {
    const data = this.readCollection(collection);
    const index = data.findIndex(item => {
      return Object.keys(query).every(key => item[key] === query[key]);
    });

    if (index !== -1) {
      data[index] = { ...data[index], ...updateDoc, updatedAt: new Date().toISOString() };
      this.writeCollection(collection, data);
      return data[index];
    }
    return null;
  }

  delete(collection, query) {
    const data = this.readCollection(collection);
    const newData = data.filter(item => {
      return !Object.keys(query).every(key => item[key] === query[key]);
    });

    if (newData.length !== data.length) {
      this.writeCollection(collection, newData);
      return true;
    }
    return false;
  }

  generateId() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}

export default FileDB;