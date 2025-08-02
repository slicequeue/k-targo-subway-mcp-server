export function getKeyByValue<T extends Record<string, any>>(object: T, value: T[keyof T]): keyof T | undefined {
  return Object.keys(object).find(key => object[key] === value) as keyof T | undefined;
} 