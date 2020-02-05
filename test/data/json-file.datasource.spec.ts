import { FileDataSource } from '../../src/data/datasource/file.datasource';
import { JsonFileDataSource } from '../../src/data/datasource/json-file.datasource';
import * as fs from 'fs';

describe('JSON Array File DataSource', () => {
  let jsonArrayFileDataSource: FileDataSource;
  const validObjectOne = { attributeOne: 'attributeOne' };
  const validObjectTwo = { attributeTwo: 'attributeTwo' };
  const validArrayOfObjects = [validObjectOne, validObjectTwo];
  let fileBuffer: Buffer;
  const spy = jest.spyOn(fs.promises, 'readFile');

  beforeEach(() => {
    jest.resetAllMocks();
    jsonArrayFileDataSource = new JsonFileDataSource('./mock-file.json');
  });

  it('Should create valid instance of JsonArrayFileDataSource', () => {
    expect(jsonArrayFileDataSource).toBeInstanceOf(JsonFileDataSource);
  });

  describe('getEntities', () => {
    beforeEach(() => {
      fileBuffer = Buffer.from(JSON.stringify(validArrayOfObjects), 'utf8');
    });

    it('Should resolve an array of object if the given file contains valid content', done => {
      spy.mockReturnValue(Promise.resolve(fileBuffer));
      jsonArrayFileDataSource.getEntities().then(actual => {
        expect(actual).toEqual(validArrayOfObjects);
        done();
      });
    });

    it('Should reject an error fiven readFile rejects', done => {
      spy.mockReturnValue(Promise.reject(() => {}));
      jsonArrayFileDataSource.getEntities().catch(error => {
        done();
      });
    });

    it('Should reject given JSON content is not an array', done => {
      fileBuffer = Buffer.from('{}', 'utf8');
      spy.mockReturnValue(Promise.resolve(fileBuffer));
      jsonArrayFileDataSource
        .getEntities()
        .then(() => {
          fail('Promise should reject');
        })
        .catch(error => {
          done();
        });
    });
  });

  describe('getEntity', () => {
    beforeEach(() => {
      fileBuffer = Buffer.from(JSON.stringify(validObjectOne), 'utf8');
    });

    it('Should resolve validObjectOne given fileBuffer is its JSON Representation read from file', done => {
      spy.mockReturnValue(Promise.resolve(fileBuffer));
      return jsonArrayFileDataSource.getEntity().then(entity => {
        expect(entity).toEqual(validObjectOne);
        done();
      });
    });

    it('Should reject if readFile rejects', done => {
      spy.mockReturnValue(Promise.reject());
      jsonArrayFileDataSource.getEntities().catch(error => {
        done();
      });
    });

    it('Should reject given JSON content is an array', done => {
      fileBuffer = Buffer.from('[]', 'utf8');
      spy.mockReturnValue(Promise.resolve(fileBuffer));
      jsonArrayFileDataSource
        .getEntity()
        .then(() => {
          fail('Promise should reject');
        })
        .catch(error => {
          done();
        });
    });
  });
});
