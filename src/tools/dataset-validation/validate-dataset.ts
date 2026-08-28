import { Character } from '../../modules/characters/domain/character.entity';
import { Movie } from '../../modules/movies/domain/movie.entity';
import { Book } from '../../modules/books/domain/book.entity';
import { Quote } from '../../modules/quotes/domain/quote.entity';

export type ResourceName =
  'characters' | 'movies' | 'books' | 'quotes' | 'places' | 'races' | 'ainur';

/**
 * No API module exists for Places yet (dataset + validator only, per
 * PLACES-DATASET-001.md). This type mirrors the approved schema from
 * PLACE-SCHEMA-REVIEW-001.md and is intentionally local to the validator
 * until a real domain entity is introduced alongside the API.
 */
export interface Place {
  id: number;
  name: string;
  type: string;
  parentId: number | null;
  wikiUrl: string | null;
}

export const PLACE_TYPES = [
  'region',
  'realm',
  'settlement',
  'fortress',
  'landmark',
  'geographic feature',
  'dwelling',
] as const;

/**
 * No API module exists for Races yet (dataset + validator only, per
 * RACES-DATASET-001.md). Mirrors the approved schema from
 * RACE-SCHEMA-REVIEW-001.md.
 */
export interface Race {
  id: number;
  name: string;
  type: string;
  parentId: number | null;
  wikiUrl: string | null;
}

export const RACE_TYPES = ['major-race', 'subgroup'] as const;

/**
 * Mirrors the approved schema from GOD-SCHEMA-REVIEW-001.md.
 * characterId links an Ainur row to an existing Character record
 * (e.g. Gandalf) with zero duplicated fields; null when no such
 * Character exists (e.g. Manwe).
 */
export interface Ainur {
  id: number;
  name: string;
  type: string;
  characterId: number | null;
  wikiUrl: string | null;
}

export const AINUR_TYPES = ['creator', 'Vala', 'Maia'] as const;

export interface ValidationIssue {
  resource: ResourceName;
  id?: number | string;
  field?: string;
  problem: string;
}

export interface DatasetInput {
  characters: Character[];
  movies: Movie[];
  books: Book[];
  quotes: Quote[];
  places: Place[];
  races: Race[];
  ainur: Ainur[];
}

export interface ValidationResult {
  counts: {
    characters: number;
    movies: number;
    books: number;
    quotes: number;
    places: number;
    races: number;
    ainur: number;
  };
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

const CURRENT_YEAR = new Date().getFullYear();
const MIN_PLAUSIBLE_YEAR = 1800;

function isWhitespaceOnly(value: string): boolean {
  return value.length > 0 && value.trim().length === 0;
}

function isValidUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

function checkId(
  resource: ResourceName,
  record: { id: unknown },
  seenIds: Set<number>,
  errors: ValidationIssue[],
): void {
  const { id } = record;
  if (id === undefined || id === null) {
    errors.push({ resource, field: 'id', problem: 'id is missing' });
    return;
  }
  if (typeof id !== 'number' || Number.isNaN(id)) {
    errors.push({
      resource,
      id: id as never,
      field: 'id',
      problem: 'id is not numeric',
    });
    return;
  }
  if (!Number.isInteger(id)) {
    errors.push({ resource, id, field: 'id', problem: 'id is not an integer' });
    return;
  }
  if (id <= 0) {
    errors.push({
      resource,
      id,
      field: 'id',
      problem: 'id must be a positive integer',
    });
    return;
  }
  if (seenIds.has(id)) {
    errors.push({ resource, id, field: 'id', problem: `duplicate id ${id}` });
    return;
  }
  seenIds.add(id);
}

function checkRequiredString(
  resource: ResourceName,
  id: number | string | undefined,
  field: string,
  value: unknown,
  errors: ValidationIssue[],
): void {
  if (value === undefined || value === null) {
    errors.push({ resource, id, field, problem: `${field} is missing` });
    return;
  }
  if (typeof value !== 'string') {
    errors.push({ resource, id, field, problem: `${field} must be a string` });
    return;
  }
  if (value.length === 0) {
    errors.push({
      resource,
      id,
      field,
      problem: `${field} is an empty string`,
    });
    return;
  }
  if (isWhitespaceOnly(value)) {
    errors.push({
      resource,
      id,
      field,
      problem: `${field} is whitespace-only`,
    });
  }
}

function checkNullableString(
  resource: ResourceName,
  id: number | string | undefined,
  field: string,
  value: unknown,
  errors: ValidationIssue[],
): void {
  if (value === null || value === undefined) return;
  if (typeof value !== 'string') {
    errors.push({
      resource,
      id,
      field,
      problem: `${field} must be a string or null`,
    });
    return;
  }
  if (value.length === 0) {
    errors.push({
      resource,
      id,
      field,
      problem: `${field} is an empty string; use null for unknown/absent values`,
    });
    return;
  }
  if (isWhitespaceOnly(value)) {
    errors.push({
      resource,
      id,
      field,
      problem: `${field} is whitespace-only`,
    });
  }
}

function checkRequiredInteger(
  resource: ResourceName,
  id: number | string | undefined,
  field: string,
  value: unknown,
  errors: ValidationIssue[],
  options: { min?: number; max?: number } = {},
): void {
  if (value === undefined || value === null) {
    errors.push({ resource, id, field, problem: `${field} is missing` });
    return;
  }
  if (
    typeof value !== 'number' ||
    Number.isNaN(value) ||
    !Number.isFinite(value)
  ) {
    errors.push({ resource, id, field, problem: `${field} must be a number` });
    return;
  }
  if (!Number.isInteger(value)) {
    errors.push({
      resource,
      id,
      field,
      problem: `${field} must be an integer`,
    });
    return;
  }
  if (options.min !== undefined && value < options.min) {
    errors.push({
      resource,
      id,
      field,
      problem: `${field} is below the plausible minimum (${options.min})`,
    });
  }
  if (options.max !== undefined && value > options.max) {
    errors.push({
      resource,
      id,
      field,
      problem: `${field} is above the plausible maximum (${options.max})`,
    });
  }
}

function checkNonNegativeNumber(
  resource: ResourceName,
  id: number | string | undefined,
  field: string,
  value: unknown,
  errors: ValidationIssue[],
): void {
  if (value === undefined || value === null) {
    errors.push({ resource, id, field, problem: `${field} is missing` });
    return;
  }
  if (
    typeof value !== 'number' ||
    Number.isNaN(value) ||
    !Number.isFinite(value)
  ) {
    errors.push({ resource, id, field, problem: `${field} must be a number` });
    return;
  }
  if (value < 0) {
    errors.push({
      resource,
      id,
      field,
      problem: `${field} must not be negative`,
    });
  }
}

function checkNullableRelation(
  resource: ResourceName,
  id: number | string | undefined,
  field: string,
  value: unknown,
  validIds: Set<number>,
  targetResource: ResourceName,
  errors: ValidationIssue[],
): void {
  if (value === null || value === undefined) return;
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    errors.push({
      resource,
      id,
      field,
      problem: `${field} must be a positive integer or null`,
    });
    return;
  }
  if (!validIds.has(value)) {
    errors.push({
      resource,
      id,
      field,
      problem: `references missing ${targetResource.slice(0, -1)} ${value}`,
    });
  }
}

function checkPlaceType(
  id: number | string | undefined,
  value: unknown,
  errors: ValidationIssue[],
): void {
  if (value === undefined || value === null) {
    errors.push({
      resource: 'places',
      id,
      field: 'type',
      problem: 'type is missing',
    });
    return;
  }
  if (
    typeof value !== 'string' ||
    !(PLACE_TYPES as readonly string[]).includes(value)
  ) {
    errors.push({
      resource: 'places',
      id,
      field: 'type',
      problem: `type must be one of: ${PLACE_TYPES.join(', ')}`,
    });
  }
}

function checkPlaceParentHierarchy(
  places: Place[],
  placeIds: Set<number>,
  errors: ValidationIssue[],
): void {
  const byId = new Map<number, Place>();
  for (const place of places) {
    if (typeof place.id === 'number' && placeIds.has(place.id)) {
      byId.set(place.id, place);
    }
  }

  for (const place of places) {
    if (place.parentId === null || place.parentId === undefined) continue;
    if (
      typeof place.parentId !== 'number' ||
      !Number.isInteger(place.parentId) ||
      place.parentId <= 0
    ) {
      errors.push({
        resource: 'places',
        id: place.id,
        field: 'parentId',
        problem: 'parentId must be a positive integer or null',
      });
      continue;
    }
    if (place.parentId === place.id) {
      errors.push({
        resource: 'places',
        id: place.id,
        field: 'parentId',
        problem: 'parentId cannot reference itself',
      });
      continue;
    }
    if (!placeIds.has(place.parentId)) {
      errors.push({
        resource: 'places',
        id: place.id,
        field: 'parentId',
        problem: `references missing place ${place.parentId}`,
      });
      continue;
    }

    const visited = new Set<number>([place.id]);
    let current: Place | undefined = byId.get(place.parentId);
    let cycleFound = false;
    while (current) {
      if (visited.has(current.id)) {
        cycleFound = true;
        break;
      }
      visited.add(current.id);
      if (current.parentId === null || current.parentId === undefined) break;
      current = byId.get(current.parentId);
    }
    if (cycleFound) {
      errors.push({
        resource: 'places',
        id: place.id,
        field: 'parentId',
        problem: 'parentId forms a cycle',
      });
    }
  }
}

function checkRaceType(
  id: number | string | undefined,
  value: unknown,
  errors: ValidationIssue[],
): void {
  if (value === undefined || value === null) {
    errors.push({
      resource: 'races',
      id,
      field: 'type',
      problem: 'type is missing',
    });
    return;
  }
  if (
    typeof value !== 'string' ||
    !(RACE_TYPES as readonly string[]).includes(value)
  ) {
    errors.push({
      resource: 'races',
      id,
      field: 'type',
      problem: `type must be one of: ${RACE_TYPES.join(', ')}`,
    });
  }
}

function checkRaceParentHierarchy(
  races: Race[],
  raceIds: Set<number>,
  errors: ValidationIssue[],
): void {
  const byId = new Map<number, Race>();
  for (const race of races) {
    if (typeof race.id === 'number' && raceIds.has(race.id)) {
      byId.set(race.id, race);
    }
  }

  for (const race of races) {
    if (race.parentId === null || race.parentId === undefined) continue;
    if (
      typeof race.parentId !== 'number' ||
      !Number.isInteger(race.parentId) ||
      race.parentId <= 0
    ) {
      errors.push({
        resource: 'races',
        id: race.id,
        field: 'parentId',
        problem: 'parentId must be a positive integer or null',
      });
      continue;
    }
    if (race.parentId === race.id) {
      errors.push({
        resource: 'races',
        id: race.id,
        field: 'parentId',
        problem: 'parentId cannot reference itself',
      });
      continue;
    }
    if (!raceIds.has(race.parentId)) {
      errors.push({
        resource: 'races',
        id: race.id,
        field: 'parentId',
        problem: `references missing race ${race.parentId}`,
      });
      continue;
    }

    const visited = new Set<number>([race.id]);
    let current: Race | undefined = byId.get(race.parentId);
    let cycleFound = false;
    while (current) {
      if (visited.has(current.id)) {
        cycleFound = true;
        break;
      }
      visited.add(current.id);
      if (current.parentId === null || current.parentId === undefined) break;
      current = byId.get(current.parentId);
    }
    if (cycleFound) {
      errors.push({
        resource: 'races',
        id: race.id,
        field: 'parentId',
        problem: 'parentId forms a cycle',
      });
    }
  }
}

function checkAinurType(
  id: number | string | undefined,
  value: unknown,
  errors: ValidationIssue[],
): void {
  if (value === undefined || value === null) {
    errors.push({
      resource: 'ainur',
      id,
      field: 'type',
      problem: 'type is missing',
    });
    return;
  }
  if (
    typeof value !== 'string' ||
    !(AINUR_TYPES as readonly string[]).includes(value)
  ) {
    errors.push({
      resource: 'ainur',
      id,
      field: 'type',
      problem: `type must be one of: ${AINUR_TYPES.join(', ')}`,
    });
  }
}

function checkAinurCharacterId(
  id: number | string | undefined,
  value: unknown,
  characterIds: Set<number>,
  errors: ValidationIssue[],
): void {
  if (value === null || value === undefined) return;
  if (typeof value !== 'number' || !Number.isInteger(value) || value <= 0) {
    errors.push({
      resource: 'ainur',
      id,
      field: 'characterId',
      problem: 'characterId must be a positive integer or null',
    });
    return;
  }
  if (!characterIds.has(value)) {
    errors.push({
      resource: 'ainur',
      id,
      field: 'characterId',
      problem: `references missing character ${value}`,
    });
  }
}

function checkDuplicateNames(
  resource: ResourceName,
  records: { id: unknown; name?: unknown }[],
  warnings: ValidationIssue[],
): void {
  const byName = new Map<string, (number | string)[]>();
  for (const record of records) {
    if (typeof record.name !== 'string' || record.name.length === 0) continue;
    const ids = byName.get(record.name) ?? [];
    ids.push(record.id as never);
    byName.set(record.name, ids);
  }
  for (const [name, ids] of byName) {
    if (ids.length > 1) {
      warnings.push({
        resource,
        field: 'name',
        problem: `duplicate name "${name}" used by ids [${ids.join(', ')}]`,
      });
    }
  }
}

export function validateDataset(input: DatasetInput): ValidationResult {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  const characterIds = new Set<number>();
  for (const character of input.characters) {
    checkId('characters', character, characterIds, errors);
    checkRequiredString(
      'characters',
      character.id,
      'name',
      character.name,
      errors,
    );
    checkRequiredString(
      'characters',
      character.id,
      'race',
      character.race,
      errors,
    );
    checkNullableString(
      'characters',
      character.id,
      'gender',
      character.gender,
      errors,
    );
    checkNullableString(
      'characters',
      character.id,
      'birth',
      character.birth,
      errors,
    );
    checkNullableString(
      'characters',
      character.id,
      'death',
      character.death,
      errors,
    );
    checkNullableString(
      'characters',
      character.id,
      'hair',
      character.hair,
      errors,
    );
    checkNullableString(
      'characters',
      character.id,
      'height',
      character.height,
      errors,
    );
    checkNullableString(
      'characters',
      character.id,
      'realm',
      character.realm,
      errors,
    );
    checkNullableString(
      'characters',
      character.id,
      'spouse',
      character.spouse,
      errors,
    );
    if (character.wikiUrl !== null && character.wikiUrl !== undefined) {
      checkNullableString(
        'characters',
        character.id,
        'wikiUrl',
        character.wikiUrl,
        errors,
      );
      if (
        typeof character.wikiUrl === 'string' &&
        character.wikiUrl.length > 0
      ) {
        if (!isValidUrl(character.wikiUrl)) {
          errors.push({
            resource: 'characters',
            id: character.id,
            field: 'wikiUrl',
            problem: `wikiUrl is not a structurally valid URL: "${character.wikiUrl}"`,
          });
        }
      }
    }
  }
  checkDuplicateNames('characters', input.characters, warnings);

  const movieIds = new Set<number>();
  for (const movie of input.movies) {
    checkId('movies', movie, movieIds, errors);
    checkRequiredString('movies', movie.id, 'name', movie.name, errors);
    checkRequiredInteger(
      'movies',
      movie.id,
      'releaseYear',
      movie.releaseYear,
      errors,
      {
        min: MIN_PLAUSIBLE_YEAR,
        max: CURRENT_YEAR + 1,
      },
    );
    checkNonNegativeNumber(
      'movies',
      movie.id,
      'runtimeInMinutes',
      movie.runtimeInMinutes,
      errors,
    );
    checkNonNegativeNumber(
      'movies',
      movie.id,
      'budgetInMillions',
      movie.budgetInMillions,
      errors,
    );
    checkNonNegativeNumber(
      'movies',
      movie.id,
      'boxOfficeRevenueInMillions',
      movie.boxOfficeRevenueInMillions,
      errors,
    );
    checkNonNegativeNumber(
      'movies',
      movie.id,
      'academyAwardNominations',
      movie.academyAwardNominations,
      errors,
    );
    checkNonNegativeNumber(
      'movies',
      movie.id,
      'academyAwardWins',
      movie.academyAwardWins,
      errors,
    );
    checkRequiredInteger(
      'movies',
      movie.id,
      'rottenTomatoesScore',
      movie.rottenTomatoesScore,
      errors,
      { min: 0, max: 100 },
    );
    if (
      typeof movie.academyAwardWins === 'number' &&
      typeof movie.academyAwardNominations === 'number' &&
      movie.academyAwardWins > movie.academyAwardNominations
    ) {
      errors.push({
        resource: 'movies',
        id: movie.id,
        field: 'academyAwardWins',
        problem: 'academyAwardWins cannot exceed academyAwardNominations',
      });
    }
  }
  checkDuplicateNames('movies', input.movies, warnings);

  const bookIds = new Set<number>();
  for (const book of input.books) {
    checkId('books', book, bookIds, errors);
    checkRequiredString('books', book.id, 'name', book.name, errors);
    checkRequiredString('books', book.id, 'author', book.author, errors);
    checkRequiredInteger(
      'books',
      book.id,
      'releaseYear',
      book.releaseYear,
      errors,
      {
        min: MIN_PLAUSIBLE_YEAR,
        max: CURRENT_YEAR + 1,
      },
    );
  }
  checkDuplicateNames('books', input.books, warnings);

  const quoteIds = new Set<number>();
  for (const quote of input.quotes) {
    checkId('quotes', quote, quoteIds, errors);
    checkRequiredString('quotes', quote.id, 'dialog', quote.dialog, errors);
    checkNullableRelation(
      'quotes',
      quote.id,
      'characterId',
      quote.characterId,
      characterIds,
      'characters',
      errors,
    );
    checkNullableRelation(
      'quotes',
      quote.id,
      'movieId',
      quote.movieId,
      movieIds,
      'movies',
      errors,
    );
  }

  const placeIds = new Set<number>();
  for (const place of input.places) {
    checkId('places', place, placeIds, errors);
    checkRequiredString('places', place.id, 'name', place.name, errors);
    checkPlaceType(place.id, place.type, errors);
    if (place.wikiUrl !== null && place.wikiUrl !== undefined) {
      checkNullableString('places', place.id, 'wikiUrl', place.wikiUrl, errors);
      if (typeof place.wikiUrl === 'string' && place.wikiUrl.length > 0) {
        if (!isValidUrl(place.wikiUrl)) {
          errors.push({
            resource: 'places',
            id: place.id,
            field: 'wikiUrl',
            problem: `wikiUrl is not a structurally valid URL: "${place.wikiUrl}"`,
          });
        }
      }
    }
  }
  checkPlaceParentHierarchy(input.places, placeIds, errors);
  checkDuplicateNames('places', input.places, warnings);

  const raceIds = new Set<number>();
  for (const race of input.races) {
    checkId('races', race, raceIds, errors);
    checkRequiredString('races', race.id, 'name', race.name, errors);
    checkRaceType(race.id, race.type, errors);
    if (race.wikiUrl !== null && race.wikiUrl !== undefined) {
      checkNullableString('races', race.id, 'wikiUrl', race.wikiUrl, errors);
      if (typeof race.wikiUrl === 'string' && race.wikiUrl.length > 0) {
        if (!isValidUrl(race.wikiUrl)) {
          errors.push({
            resource: 'races',
            id: race.id,
            field: 'wikiUrl',
            problem: `wikiUrl is not a structurally valid URL: "${race.wikiUrl}"`,
          });
        }
      }
    }
  }
  checkRaceParentHierarchy(input.races, raceIds, errors);
  checkDuplicateNames('races', input.races, warnings);

  const ainurIds = new Set<number>();
  for (const entity of input.ainur) {
    checkId('ainur', entity, ainurIds, errors);
    checkRequiredString('ainur', entity.id, 'name', entity.name, errors);
    checkAinurType(entity.id, entity.type, errors);
    checkAinurCharacterId(entity.id, entity.characterId, characterIds, errors);
    if (entity.wikiUrl !== null && entity.wikiUrl !== undefined) {
      checkNullableString(
        'ainur',
        entity.id,
        'wikiUrl',
        entity.wikiUrl,
        errors,
      );
      if (typeof entity.wikiUrl === 'string' && entity.wikiUrl.length > 0) {
        if (!isValidUrl(entity.wikiUrl)) {
          errors.push({
            resource: 'ainur',
            id: entity.id,
            field: 'wikiUrl',
            problem: `wikiUrl is not a structurally valid URL: "${entity.wikiUrl}"`,
          });
        }
      }
    }
  }
  checkDuplicateNames('ainur', input.ainur, warnings);

  return {
    counts: {
      characters: input.characters.length,
      movies: input.movies.length,
      books: input.books.length,
      quotes: input.quotes.length,
      places: input.places.length,
      races: input.races.length,
      ainur: input.ainur.length,
    },
    errors,
    warnings,
  };
}
