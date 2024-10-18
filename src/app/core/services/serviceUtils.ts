export function removeNull<T>(obj: T | any): T | any {
  Object.keys(obj).forEach((key) => {
    // Delete if the value is null or undefined
    if (obj[key] == null) {
      delete obj[key];
    }
    else if (obj[key] && typeof obj[key] === 'object') {
      // Recursively call removeNull for nested objects
      removeNull(obj[key]);
    }
    // If the object is an empty array, delete the key
    else if (Array.isArray(obj[key]) && obj[key].length === 0) {
      delete obj[key];
    }
    // If the object is an empty object, delete the key
    else if (Object.keys(obj[key]).length === 0) {
      delete obj[key];
    }
  })
  return obj;
}
