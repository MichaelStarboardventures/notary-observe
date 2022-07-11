export const queryParse = (url?: string) => {
  if (!url) return {};

  return url
    .split('&')
    .reduce((prev: { [key in string]: string }, cur: string) => {
      const keys = cur.split('=');

      prev[keys[0]] = keys[1];

      return prev;
    }, {});
};
