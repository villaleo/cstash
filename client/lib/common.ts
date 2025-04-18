/**
 * Encodes an array of data for use in a URL query string. Spaces are replaced
 * with a '&' and each element in data is prefixed with key=.
 *
 * For example, if data=[a, b, c] and key="tags", then
 * urlEncodeQueryArray(key, data) will return "tags=a&tags=b&tags=c".
 * @param key The query key to repeat for each item in data
 * @param data The data to be encoded
 * @returns Array data encoded to safely be used as a URL query value
 */
export function urlEncodeQueryArray(key: string, data: string[]): string {
  return data.map((tag) => `${key}=${tag}`).join("&");
}
