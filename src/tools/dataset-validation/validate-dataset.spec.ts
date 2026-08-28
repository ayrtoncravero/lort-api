import { readFileSync } from 'fs';
import { join } from 'path';
import {
  validateDataset,
  DatasetInput,
  Place,
  Race,
  Ainur,
} from './validate-dataset';
import { Character } from '../../modules/characters/domain/character.entity';
import { Movie } from '../../modules/movies/domain/movie.entity';
import { Book } from '../../modules/books/domain/book.entity';
import { Quote } from '../../modules/quotes/domain/quote.entity';

const character: Character = {
  id: 1,
  name: 'Frodo Baggins',
  race: 'Hobbit',
  gender: 'Male',
  birth: null,
  death: null,
  hair: null,
  height: null,
  realm: null,
  spouse: null,
  wikiUrl: 'https://lotr.fandom.com/wiki/Frodo_Baggins',
};

const movie: Movie = {
  id: 1,
  name: 'The Fellowship of the Ring',
  releaseYear: 2001,
  runtimeInMinutes: 178,
  budgetInMillions: 93,
  boxOfficeRevenueInMillions: 871.5,
  academyAwardNominations: 13,
  academyAwardWins: 4,
  rottenTomatoesScore: 91,
};

const book: Book = {
  id: 1,
  name: 'The Fellowship of the Ring',
  author: 'J.R.R. Tolkien',
  releaseYear: 1954,
};

const quote: Quote = {
  id: 1,
  dialog: 'You shall not pass!',
  movieId: 1,
  characterId: 1,
};

const place: Place = {
  id: 1,
  name: 'The Shire',
  type: 'realm',
  parentId: null,
  wikiUrl: null,
};

const race: Race = {
  id: 1,
  name: 'Men',
  type: 'major-race',
  parentId: null,
  wikiUrl: null,
};

const ainurEntity: Ainur = {
  id: 1,
  name: 'Manwe',
  type: 'Vala',
  characterId: null,
  wikiUrl: null,
};

function baseDataset(): DatasetInput {
  return {
    characters: [character],
    movies: [movie],
    books: [book],
    quotes: [quote],
    places: [place],
    races: [race],
    ainur: [ainurEntity],
  };
}

describe('validateDataset', () => {
  it('passes on a valid dataset with no errors or warnings', () => {
    const result = validateDataset(baseDataset());
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
    expect(result.counts).toEqual({
      characters: 1,
      movies: 1,
      books: 1,
      quotes: 1,
      places: 1,
      races: 1,
      ainur: 1,
    });
  });

  it('reports real dataset counts, not hardcoded values', () => {
    const dataset = baseDataset();
    dataset.characters.push({ ...character, id: 2, name: 'Sam' });
    const result = validateDataset(dataset);
    expect(result.counts.characters).toBe(2);
  });

  it('detects duplicate ids within a resource', () => {
    const dataset = baseDataset();
    dataset.characters.push({ ...character, id: 1, name: 'Duplicate' });
    const result = validateDataset(dataset);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        resource: 'characters',
        field: 'id',
        problem: 'duplicate id 1',
      }),
    );
  });

  it('detects invalid (non-positive, non-integer) ids', () => {
    const dataset = baseDataset();
    dataset.movies.push({ ...movie, id: -1 });
    dataset.movies.push({ ...movie, id: 1.5 });
    const result = validateDataset(dataset);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        resource: 'movies',
        id: -1,
        problem: 'id must be a positive integer',
      }),
    );
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        resource: 'movies',
        id: 1.5,
        problem: 'id is not an integer',
      }),
    );
  });

  it('detects a missing required field', () => {
    const dataset = baseDataset();
    // @ts-expect-error intentionally malformed fixture
    dataset.books[0] = { id: 2, name: 'No Author', releaseYear: 1954 };
    const result = validateDataset(dataset);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        resource: 'books',
        field: 'author',
        problem: 'author is missing',
      }),
    );
  });

  it('detects an empty string on a required field', () => {
    const dataset = baseDataset();
    dataset.characters[0] = { ...character, name: '' };
    const result = validateDataset(dataset);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        resource: 'characters',
        field: 'name',
        problem: 'name is an empty string',
      }),
    );
  });

  it('detects a whitespace-only string', () => {
    const dataset = baseDataset();
    dataset.characters[0] = { ...character, race: '   ' };
    const result = validateDataset(dataset);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        resource: 'characters',
        field: 'race',
        problem: 'race is whitespace-only',
      }),
    );
  });

  it('rejects empty string used as missing data on a nullable field', () => {
    const dataset = baseDataset();
    dataset.characters[0] = { ...character, spouse: '' };
    const result = validateDataset(dataset);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        resource: 'characters',
        field: 'spouse',
        problem:
          'spouse is an empty string; use null for unknown/absent values',
      }),
    );
  });

  it('detects an invalid relationship (orphan reference)', () => {
    const dataset = baseDataset();
    dataset.quotes[0] = { ...quote, characterId: 999 };
    const result = validateDataset(dataset);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        resource: 'quotes',
        id: 1,
        field: 'characterId',
        problem: 'references missing character 999',
      }),
    );
  });

  it('accepts a null relationship with no error', () => {
    const dataset = baseDataset();
    dataset.quotes[0] = { ...quote, characterId: null, movieId: null };
    const result = validateDataset(dataset);
    expect(result.errors).toEqual([]);
  });

  it('detects a structurally invalid wikiUrl', () => {
    const dataset = baseDataset();
    dataset.characters[0] = { ...character, wikiUrl: 'not-a-url' };
    const result = validateDataset(dataset);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ resource: 'characters', field: 'wikiUrl' }),
    );
  });

  it('detects an obviously invalid numeric value (implausible releaseYear)', () => {
    const dataset = baseDataset();
    dataset.movies[0] = { ...movie, releaseYear: 1500 };
    const result = validateDataset(dataset);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ resource: 'movies', field: 'releaseYear' }),
    );
  });

  it('warns, but does not error, on duplicate names across records', () => {
    const dataset = baseDataset();
    dataset.movies.push({ ...movie, id: 2, name: movie.name });
    const result = validateDataset(dataset);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toContainEqual(
      expect.objectContaining({ resource: 'movies', field: 'name' }),
    );
  });

  describe('places', () => {
    it('passes on a valid Place dataset', () => {
      const dataset = baseDataset();
      const result = validateDataset(dataset);
      expect(result.errors).toEqual([]);
      expect(result.warnings).toEqual([]);
    });

    it('detects an invalid Place id', () => {
      const dataset = baseDataset();
      dataset.places[0] = { ...place, id: -1 };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          resource: 'places',
          id: -1,
          field: 'id',
          problem: 'id must be a positive integer',
        }),
      );
    });

    it('detects a duplicate Place id', () => {
      const dataset = baseDataset();
      dataset.places.push({ ...place, id: 1, name: 'Bree' });
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          resource: 'places',
          field: 'id',
          problem: 'duplicate id 1',
        }),
      );
    });

    it('detects an invalid type', () => {
      const dataset = baseDataset();
      dataset.places[0] = { ...place, type: 'castle' };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ resource: 'places', field: 'type' }),
      );
    });

    it('detects a missing name', () => {
      const dataset = baseDataset();
      // @ts-expect-error intentionally malformed fixture
      dataset.places[0] = {
        id: 1,
        type: 'realm',
        parentId: null,
        wikiUrl: null,
      };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          resource: 'places',
          field: 'name',
          problem: 'name is missing',
        }),
      );
    });

    it('detects an empty/whitespace-only name', () => {
      const dataset = baseDataset();
      dataset.places[0] = { ...place, name: '   ' };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          resource: 'places',
          field: 'name',
          problem: 'name is whitespace-only',
        }),
      );
    });

    it('detects an invalid parentId (not a positive integer)', () => {
      const dataset = baseDataset();
      dataset.places[0] = { ...place, parentId: -5 };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          resource: 'places',
          field: 'parentId',
          problem: 'parentId must be a positive integer or null',
        }),
      );
    });

    it('detects an orphan parentId', () => {
      const dataset = baseDataset();
      dataset.places[0] = { ...place, parentId: 999 };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          resource: 'places',
          field: 'parentId',
          problem: 'references missing place 999',
        }),
      );
    });

    it('detects a self-parent', () => {
      const dataset = baseDataset();
      dataset.places[0] = { ...place, parentId: 1 };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          resource: 'places',
          id: 1,
          field: 'parentId',
          problem: 'parentId cannot reference itself',
        }),
      );
    });

    it('detects a parentId cycle', () => {
      const dataset = baseDataset();
      dataset.places = [
        { ...place, id: 1, name: 'A', parentId: 2 },
        { ...place, id: 2, name: 'B', parentId: 1 },
      ];
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          resource: 'places',
          field: 'parentId',
          problem: 'parentId forms a cycle',
        }),
      );
    });

    it('accepts a null parentId with no error', () => {
      const dataset = baseDataset();
      dataset.places[0] = { ...place, parentId: null };
      const result = validateDataset(dataset);
      expect(result.errors).toEqual([]);
    });

    it('detects a structurally invalid wikiUrl', () => {
      const dataset = baseDataset();
      dataset.places[0] = { ...place, wikiUrl: 'not-a-url' };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ resource: 'places', field: 'wikiUrl' }),
      );
    });

    it('accepts a valid nullable wikiUrl', () => {
      const dataset = baseDataset();
      dataset.places[0] = {
        ...place,
        wikiUrl: 'https://tolkiengateway.net/wiki/The_Shire',
      };
      const result = validateDataset(dataset);
      expect(result.errors).toEqual([]);
    });

    it('warns, but does not error, on duplicate Place names', () => {
      const dataset = baseDataset();
      dataset.places.push({ ...place, id: 2, name: place.name });
      const result = validateDataset(dataset);
      expect(result.errors).toEqual([]);
      expect(result.warnings).toContainEqual(
        expect.objectContaining({ resource: 'places', field: 'name' }),
      );
    });
  });

  describe('races', () => {
    it('passes on a valid Race dataset', () => {
      const dataset = baseDataset();
      const result = validateDataset(dataset);
      expect(result.errors).toEqual([]);
      expect(result.warnings).toEqual([]);
    });

    it('detects an invalid Race id', () => {
      const dataset = baseDataset();
      dataset.races[0] = { ...race, id: -1 };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          resource: 'races',
          id: -1,
          field: 'id',
          problem: 'id must be a positive integer',
        }),
      );
    });

    it('detects a duplicate Race id', () => {
      const dataset = baseDataset();
      dataset.races.push({ ...race, id: 1, name: 'Elves' });
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          resource: 'races',
          field: 'id',
          problem: 'duplicate id 1',
        }),
      );
    });

    it('detects an invalid type', () => {
      const dataset = baseDataset();
      dataset.races[0] = { ...race, type: 'species' };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ resource: 'races', field: 'type' }),
      );
    });

    it('detects a missing name', () => {
      const dataset = baseDataset();
      // @ts-expect-error intentionally malformed fixture
      dataset.races[0] = {
        id: 1,
        type: 'major-race',
        parentId: null,
        wikiUrl: null,
      };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          resource: 'races',
          field: 'name',
          problem: 'name is missing',
        }),
      );
    });

    it('detects an empty name', () => {
      const dataset = baseDataset();
      dataset.races[0] = { ...race, name: '' };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          resource: 'races',
          field: 'name',
          problem: 'name is an empty string',
        }),
      );
    });

    it('detects a whitespace-only name', () => {
      const dataset = baseDataset();
      dataset.races[0] = { ...race, name: '   ' };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          resource: 'races',
          field: 'name',
          problem: 'name is whitespace-only',
        }),
      );
    });

    it('detects an invalid parentId (not a positive integer)', () => {
      const dataset = baseDataset();
      dataset.races[0] = { ...race, parentId: -5 };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          resource: 'races',
          field: 'parentId',
          problem: 'parentId must be a positive integer or null',
        }),
      );
    });

    it('detects an orphan parentId', () => {
      const dataset = baseDataset();
      dataset.races[0] = { ...race, parentId: 999 };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          resource: 'races',
          field: 'parentId',
          problem: 'references missing race 999',
        }),
      );
    });

    it('detects a self-parent', () => {
      const dataset = baseDataset();
      dataset.races[0] = { ...race, parentId: 1 };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          resource: 'races',
          id: 1,
          field: 'parentId',
          problem: 'parentId cannot reference itself',
        }),
      );
    });

    it('detects a parentId cycle', () => {
      const dataset = baseDataset();
      dataset.races = [
        { ...race, id: 1, name: 'A', parentId: 2 },
        { ...race, id: 2, name: 'B', parentId: 1 },
      ];
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          resource: 'races',
          field: 'parentId',
          problem: 'parentId forms a cycle',
        }),
      );
    });

    it('accepts a null parentId with no error', () => {
      const dataset = baseDataset();
      dataset.races[0] = { ...race, parentId: null };
      const result = validateDataset(dataset);
      expect(result.errors).toEqual([]);
    });

    it('detects a structurally invalid wikiUrl', () => {
      const dataset = baseDataset();
      dataset.races[0] = { ...race, wikiUrl: 'not-a-url' };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ resource: 'races', field: 'wikiUrl' }),
      );
    });

    it('warns, but does not error, on duplicate Race names', () => {
      const dataset = baseDataset();
      dataset.races.push({ ...race, id: 2, name: race.name });
      const result = validateDataset(dataset);
      expect(result.errors).toEqual([]);
      expect(result.warnings).toContainEqual(
        expect.objectContaining({ resource: 'races', field: 'name' }),
      );
    });
  });

  describe('ainur', () => {
    it('passes on a valid Ainur dataset', () => {
      const dataset = baseDataset();
      const result = validateDataset(dataset);
      expect(result.errors).toEqual([]);
      expect(result.warnings).toEqual([]);
    });

    it('detects an invalid Ainur id', () => {
      const dataset = baseDataset();
      dataset.ainur[0] = { ...ainurEntity, id: -1 };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          resource: 'ainur',
          id: -1,
          field: 'id',
          problem: 'id must be a positive integer',
        }),
      );
    });

    it('detects a duplicate Ainur id', () => {
      const dataset = baseDataset();
      dataset.ainur.push({ ...ainurEntity, id: 1, name: 'Varda' });
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          resource: 'ainur',
          field: 'id',
          problem: 'duplicate id 1',
        }),
      );
    });

    it('detects an invalid type', () => {
      const dataset = baseDataset();
      dataset.ainur[0] = { ...ainurEntity, type: 'demigod' };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ resource: 'ainur', field: 'type' }),
      );
    });

    it('detects a missing name', () => {
      const dataset = baseDataset();
      // @ts-expect-error intentionally malformed fixture
      dataset.ainur[0] = {
        id: 1,
        type: 'Vala',
        characterId: null,
        wikiUrl: null,
      };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          resource: 'ainur',
          field: 'name',
          problem: 'name is missing',
        }),
      );
    });

    it('detects an empty name', () => {
      const dataset = baseDataset();
      dataset.ainur[0] = { ...ainurEntity, name: '' };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          resource: 'ainur',
          field: 'name',
          problem: 'name is an empty string',
        }),
      );
    });

    it('detects an invalid characterId (not a positive integer)', () => {
      const dataset = baseDataset();
      dataset.ainur[0] = { ...ainurEntity, characterId: -5 };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          resource: 'ainur',
          field: 'characterId',
          problem: 'characterId must be a positive integer or null',
        }),
      );
    });

    it('detects an orphan characterId', () => {
      const dataset = baseDataset();
      dataset.ainur[0] = { ...ainurEntity, characterId: 999999 };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({
          resource: 'ainur',
          field: 'characterId',
          problem: 'references missing character 999999',
        }),
      );
    });

    it('accepts a valid characterId that exists in Characters', () => {
      const dataset = baseDataset();
      dataset.ainur[0] = { ...ainurEntity, characterId: 1 };
      const result = validateDataset(dataset);
      expect(result.errors).toEqual([]);
    });

    it('accepts a null characterId with no error', () => {
      const dataset = baseDataset();
      dataset.ainur[0] = { ...ainurEntity, characterId: null };
      const result = validateDataset(dataset);
      expect(result.errors).toEqual([]);
    });

    it('detects a structurally invalid wikiUrl', () => {
      const dataset = baseDataset();
      dataset.ainur[0] = { ...ainurEntity, wikiUrl: 'not-a-url' };
      const result = validateDataset(dataset);
      expect(result.errors).toContainEqual(
        expect.objectContaining({ resource: 'ainur', field: 'wikiUrl' }),
      );
    });

    it('warns, but does not error, on duplicate Ainur names', () => {
      const dataset = baseDataset();
      dataset.ainur.push({ ...ainurEntity, id: 2, name: ainurEntity.name });
      const result = validateDataset(dataset);
      expect(result.errors).toEqual([]);
      expect(result.warnings).toContainEqual(
        expect.objectContaining({ resource: 'ainur', field: 'name' }),
      );
    });
  });

  describe('real dataset', () => {
    function loadJson<T>(fileName: string): T {
      const filePath = join(process.cwd(), 'data', fileName);
      return JSON.parse(readFileSync(filePath, 'utf-8')) as T;
    }

    it('passes validation and reports the actual counts of every JSON file on disk', () => {
      const characters = loadJson<Character[]>('characters.json');
      const movies = loadJson<Movie[]>('movies.json');
      const books = loadJson<Book[]>('books.json');
      const quotes = loadJson<Quote[]>('quotes.json');
      const places = loadJson<Place[]>('places.json');
      const races = loadJson<Race[]>('races.json');
      const ainur = loadJson<Ainur[]>('ainur.json');

      const result = validateDataset({
        characters,
        movies,
        books,
        quotes,
        places,
        races,
        ainur,
      });

      expect(result.errors).toEqual([]);
      expect(result.counts).toEqual({
        characters: characters.length,
        movies: movies.length,
        books: books.length,
        quotes: quotes.length,
        places: places.length,
        races: races.length,
        ainur: ainur.length,
      });
      expect(result.counts.characters).toBe(50);
      expect(result.counts.movies).toBe(6);
      expect(result.counts.books).toBe(5);
      expect(result.counts.quotes).toBe(8);
      expect(result.counts.places).toBe(41);
      expect(result.counts.races).toBe(19);
    });
  });
});
