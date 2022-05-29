import fs from 'fs';
import path from 'path';

  /** @todo To remake this class in a decent way (abstracting some concepts into objects) */
export class RuimDatabase
{
  constructor(path)
  {
    this.path = path;
  }

  getFilePath(id) {
    return path.join(this.path, (id || '') + '.json');
  }

  getCollectionPath(collection) {
    return path.join(this.path, collection || '');
  }

  async save(data, id) {
    const filePath = this.getFilePath(id);

    if (!fs.existsSync(path.dirname(filePath)))
      fs.mkdirSync(path.dirname(filePath), { recursive: true });

    fs.writeFileSync(filePath, JSON.stringify(data));
  }

  async get(id) {
    const filePath = this.getFilePath(id);
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  }

  async getAll(collection) {
    const collectionPath = this.getCollectionPath(collection);

    if (!fs.existsSync(collectionPath) || !fs.lstatSync(collectionPath).isDirectory())
      return [];

    const documents = fs
      .readdirSync(collectionPath)
      .map(filename => path.join(collectionPath, filename))
      .filter(filename => fs.lstatSync(filename).isFile());

    return documents.map(
      filename => JSON.parse(fs.readFileSync(filename))
    );
  }

  async delete(id) {
    const filePath = this.getFilePath(id);
    fs.unlinkSync(filePath);
  }

  exists(id) {
    return fs.existsSync(this.getFilePath(id));
  }
}