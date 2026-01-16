
import { DailyRecord } from '../types';
import { STORAGE_KEY } from '../constants';

export const getRecords = (): DailyRecord[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveRecord = (record: DailyRecord): void => {
  const records = getRecords();
  const updated = [record, ...records];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const deleteRecord = (id: string): void => {
  const records = getRecords();
  const updated = records.filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};
