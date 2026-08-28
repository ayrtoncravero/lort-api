import { Ainur } from '../../domain/ainur.entity';

export interface AinurRepository {
  findAll(): Promise<Ainur[]>;
  findById(id: number): Promise<Ainur | null>;
}

export const AINUR_REPOSITORY = Symbol('AINUR_REPOSITORY');
