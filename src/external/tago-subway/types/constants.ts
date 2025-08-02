export const DataType = {
  XML: 'xml',
  JSON: 'json',
} as const;

export type DataTypeValue = typeof DataType[keyof typeof DataType]; 