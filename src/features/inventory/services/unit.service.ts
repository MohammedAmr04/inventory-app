import { UnitRepository } from "../repositories/unit.repository";
import { logger } from "@/lib/logger";
import type { Unit, CreateUnitInput, UpdateUnitInput } from "../types";

export const UnitService = {
  async getAll(): Promise<Unit[]> {
    try {
      return await UnitRepository.findAll();
    } catch (error) {
      logger.error("Failed to fetch units", { error });
      throw error;
    }
  },

  async getById(id: number): Promise<Unit | undefined> {
    try {
      return await UnitRepository.findById(id);
    } catch (error) {
      logger.error("Failed to fetch unit", { id, error });
      throw error;
    }
  },

  async search(query: string): Promise<Unit[]> {
    try {
      return await UnitRepository.search(query);
    } catch (error) {
      logger.error("Failed to search units", { query, error });
      throw error;
    }
  },

  async create(input: CreateUnitInput): Promise<Unit> {
    try {
      return await UnitRepository.create(input);
    } catch (error) {
      logger.error("Failed to create unit", { input, error });
      throw error;
    }
  },

  async update(id: number, input: UpdateUnitInput): Promise<Unit | undefined> {
    try {
      return await UnitRepository.update(id, input);
    } catch (error) {
      logger.error("Failed to update unit", { id, input, error });
      throw error;
    }
  },

  async archive(id: number): Promise<void> {
    try {
      await UnitRepository.archive(id);
    } catch (error) {
      logger.error("Failed to archive unit", { id, error });
      throw error;
    }
  },
};
