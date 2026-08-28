import { InternalServerErrorException } from '@nestjs/common';
import { JsonDataLoader } from './json-data-loader';

describe('JsonDataLoader', () => {
  let loader: JsonDataLoader;

  beforeEach(() => {
    loader = new JsonDataLoader();
  });

  it('throws when the file does not exist', async () => {
    await expect(loader.load('does-not-exist.json')).rejects.toThrow(
      InternalServerErrorException,
    );
  });
});
