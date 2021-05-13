import { IDBPDatabase, openDB, deleteDB } from 'idb';

const IndexedDb = {
  deleteDb: async () => await deleteDB('alphaTasks'),

  createObjectStore: async (tableNames: string[]) => {
    try {
      const a = await openDB('alphaTasks', undefined, {
        upgrade(db: IDBPDatabase) {
          for (const tableName of tableNames) {
            if (db.objectStoreNames.contains(tableName)) {
              continue;
            }
            db.createObjectStore(tableName, { autoIncrement: true, keyPath: 'taskId' });
          }
        },
      });
      return a;
    } catch (error) {
      console.log(`Error on createObjectStore: ${ error }`);
      return false;
    }
  },

  getValue: (tableName: string, taskId: number) => {
    return openDB('alphaTasks').then(async db => {
      const tx = db.transaction(tableName, 'readonly');
      const store = tx.objectStore(tableName);
      return await store.get(taskId);
    })
  },

  getAllValue: (tableName: string) => {
    return openDB('alphaTasks').then(async db => {
      const tx = db.transaction(tableName, 'readonly');
      const store = tx.objectStore(tableName);
      return await store.getAll();
    })
  },

  putValue: (tableName: string, value: object) => {
    return openDB('alphaTasks').then(async db => {
      const tx = db.transaction(tableName, 'readwrite');
      const store = tx.objectStore(tableName);
      return await store.put(value);
    })
  },

  putBulkValue: (tableName: string, values: object[]) => {
    openDB('alphaTasks').then(async db => {
      const tx = db.transaction(tableName, 'readwrite');
      const store = tx.objectStore(tableName);
      for (const value of values) {
        const result = await store.put(value);
        console.log('Put Bulk Data ', JSON.stringify(result));
      }
    })
  },

  deleteValue: async (tableName: string, id: number) => {
    return openDB('alphaTasks').then(async db => {
      const tx = db.transaction(tableName, 'readwrite');
      const store = tx.objectStore(tableName);
      const result = await store.get(id);

      if (!result) {
        console.log('Id not found', id);
        return result;
      }

      await store.delete(id);
      console.log('Deleted Data', id);
      return id;
    })
  }
}

export default IndexedDb;
