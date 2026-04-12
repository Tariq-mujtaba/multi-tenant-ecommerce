import { Inject, Injectable } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { DB_TOKEN } from '../db/constants';
import { categories } from '../db/schema';

export interface ChildCategoryDto {
  id: string;
  name: string;
  displayName: string;
}

export interface CategoryDto {
  id: string;
  name: string;
  displayName: string;
  color: string;
  children: ChildCategoryDto[];
}

@Injectable()
export class CategoriesService {
  constructor(@Inject(DB_TOKEN) private readonly db: NeonHttpDatabase) {}

  async findAll(): Promise<CategoryDto[]> {
    const rows = await this.db
      .select({
        id: categories.id,
        name: categories.name,
        displayName: categories.displayName,
        color: categories.color,
        parentId: categories.parentId,
      })
      .from(categories);

    const topLevel = rows.filter((r) => r.parentId === null);
    const children = rows.filter((r) => r.parentId !== null);

    return topLevel.map((parent) => ({
      id: parent.id,
      name: parent.name,
      displayName: parent.displayName,
      color: parent.color ?? '#cccccc',
      children: children
        .filter((c) => c.parentId === parent.id)
        .map((c) => ({ id: c.id, name: c.name, displayName: c.displayName })),
    }));
  }
}
