export function getCodeKeyByValue<T extends Record<string, any>>(object: T, value: T[keyof T]): keyof T | undefined {
  return Object.keys(object).find(key => object[key] === value) as keyof T | undefined;
}

export function getCodeValues<T extends Record<string, any>>(code: T): T[keyof T][] {
  return Object.values(code);
}

export function getCodeKeys<T extends Record<string, any>>(code: T): (keyof T)[] {
  return Object.keys(code) as (keyof T)[];
} 