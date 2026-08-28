import { promises as fs } from 'fs';
import { join } from 'path';
import {
  validateDataset,
  DatasetInput,
  ValidationIssue,
} from '../src/tools/dataset-validation/validate-dataset';

async function loadJson<T>(fileName: string): Promise<T> {
  const filePath = join(process.cwd(), 'data', fileName);
  const raw = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

function formatIssue(issue: ValidationIssue): string {
  const parts: string[] = [issue.resource];
  if (issue.id !== undefined) parts.push(`id=${issue.id}`);
  if (issue.field !== undefined) parts.push(issue.field);
  return `${parts.join(' ')}: ${issue.problem}`;
}

async function main(): Promise<void> {
  const [characters, movies, books, quotes, places, races, ainur] = await Promise.all([
    loadJson<DatasetInput['characters']>('characters.json'),
    loadJson<DatasetInput['movies']>('movies.json'),
    loadJson<DatasetInput['books']>('books.json'),
    loadJson<DatasetInput['quotes']>('quotes.json'),
    loadJson<DatasetInput['places']>('places.json'),
    loadJson<DatasetInput['races']>('races.json'),
    loadJson<DatasetInput['ainur']>('ainur.json'),
  ]);

  const result = validateDataset({
    characters,
    movies,
    books,
    quotes,
    places,
    races,
    ainur,
  });

  console.log('Dataset counts');
  console.log(`  Characters: ${result.counts.characters}`);
  console.log(`  Movies:     ${result.counts.movies}`);
  console.log(`  Books:      ${result.counts.books}`);
  console.log(`  Quotes:     ${result.counts.quotes}`);
  console.log(`  Places:     ${result.counts.places}`);
  console.log(`  Races:      ${result.counts.races}`);
  console.log(`  Ainur:      ${result.counts.ainur}`);
  console.log('');

  if (result.warnings.length > 0) {
    console.log(`Warnings (${result.warnings.length}):`);
    for (const warning of result.warnings) console.log(`  - ${formatIssue(warning)}`);
    console.log('');
  }

  if (result.errors.length > 0) {
    console.log(`Errors (${result.errors.length}):`);
    for (const error of result.errors) console.log(`  - ${formatIssue(error)}`);
    console.log('');
    console.log('Dataset validation FAILED');
    process.exitCode = 1;
    return;
  }

  console.log('Dataset validation passed');
  console.log('');
  console.log(`Errors: ${result.errors.length}`);
  console.log(`Warnings: ${result.warnings.length}`);
}

main().catch((error) => {
  console.error('Dataset validation crashed:', error);
  process.exitCode = 1;
});
