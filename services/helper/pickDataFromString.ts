import * as cheerio from "cheerio";

const pickDataFromString = <
  T extends Record<string, string> = Record<string, string>
>(
  html: string,
  map: T
): Record<keyof T, string> => {
  const $ = cheerio.load(html);

  return Object.keys(map).reduce<T>((act, key) => {
    const selector = map[key];
    const value = $(selector).text().trim();
    return {
      ...act,
      [key as keyof T]: value as string,
    };
  }, {} as unknown as T);
};

export default pickDataFromString;
