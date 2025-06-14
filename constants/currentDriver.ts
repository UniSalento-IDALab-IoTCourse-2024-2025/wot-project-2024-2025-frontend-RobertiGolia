import { Driver } from '../types/Driver';

let currentDriver: Driver | null = null;

export const getCurrentDriver = (): Driver | null => {
  return currentDriver;
};

export const setCurrentDriver = (driver: Driver) => {
  currentDriver = driver;
};

export const clearCurrentDriver = () => {
  currentDriver = null;
}; 