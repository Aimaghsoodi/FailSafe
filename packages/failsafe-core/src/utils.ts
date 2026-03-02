import { nanoid } from 'nanoid';
import crypto from 'crypto';

export function generateId(prefix: string): string {
  return `${prefix}_${nanoid(12)}`;
}

export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

export function hashString(str: string): string {
  return crypto.createHash('sha256').update(str).digest('hex');
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function normalizeScore(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

export function isTimestampInRange(timestamp: string, startTime: string, endTime: string): boolean {
  const ts = new Date(timestamp).getTime();
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  return ts >= start && ts <= end;
}