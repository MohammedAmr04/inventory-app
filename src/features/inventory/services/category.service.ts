import { CategoryRepository } from "../repositories/category.repository";
import { logger } from "@/lib/logger";
import type { Category, CreateCategoryInput, UpdateCategoryInput } from "../types";

export const CategoryService = {
  async getAll(): Promise<Category[]> {
    try {
      return await CategoryRepository.findAll();
    } catch (error) {
      logger.error("Failed to fetch categories", { error });
      throw error;
    }
  },

  async getById(id: number): Promise<Category | undefined> {
    try {
      return await CategoryRepository.findById(id);
    } catch (error) {
      logger.error("Failed to fetch category", { id, error });
      throw error;
    }
  },

  async search(query: string): Promise<Category[]> {
    try {
      return await CategoryRepository.search(query);
    } catch (error) {
      logger.error("Failed to search categories", { query, error });
      throw error;
    }
  },

  async create(input: CreateCategoryInput): Promise<Category> {
    try {
      return await CategoryRepository.create(input);
    } catch (error) {
      logger.error("Failed to create category", { input, error });
      throw error;
    }
  },

  async update(id: number, input: UpdateCategoryInput): Promise<Category | undefined> {
    try {
      return await CategoryRepository.update(id, input);
    } catch (error) {
      logger.error("Failed to update category", { id, input, error });
      throw error;
    }
  },

  async archive(id: number): Promise<void> {
    try {
      await CategoryRepository.archive(id);
    } catch (error) {
      logger.error("Failed to archive category", { id, error });
      throw error;
    }
  },
};
