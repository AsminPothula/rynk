export class LocalStorage {
  static get = <T>(key: string): T | null => {
    const value = localStorage.getItem(key);
    if (!value) {
      return null;
    }
    return JSON.parse(value);
  };

  static save = <T>(key: string, value: T) => {
    const stringifiedValue = JSON.stringify(value);
    localStorage.setItem(key, stringifiedValue);
  };

  static delete = (key: string) => {
    localStorage.removeItem(key);
  };
}
