class Dictionary<T> {
  items: {[key: string]: T} = {};
  constructor() {
    this.items = {};
  }
  public has(key: string) {
    return key in this.items;
  }
  public set(key: string, value: T) {
    this.items[key] = value;
  }
  public get(key: string) {
    return this.items[key];
  }
  public delete(key: string) {
    if( this.has(key) ){
      delete this.items[key]
      return true;
    }
    return false;
  }

  public get values(): T[] {
    let resultArray: T[] = [];
    for (let key in this.items) {
      resultArray.push(this.items[key]);
    }
    return resultArray
  }
  public get keys(): string[] {
    let resultArray: string[] = [];
    for (let key in this.items) {
      resultArray.push(key);
    }
    return resultArray
  }
}
