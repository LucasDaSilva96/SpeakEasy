export const stringifyResponse = (data: any): string => {
  return JSON.stringify(data);
};

export const parseResponse = <T>(data: string, typeOfData: T): T => {
  return JSON.parse(data) as typeof typeOfData;
};
