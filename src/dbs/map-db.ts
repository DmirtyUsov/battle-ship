export abstract class MapDB<I, T> {
  private db = new Map<I, T>();

  list(): T[] {
    return Array.from(this.db.values());
  }

  // add(id: I, item: T): T {
  //   return this.update(id, item);
  // }

  get(id: I): T | undefined {
    return this.db.get(id);
  }

  delete(id: I): T | undefined {
    const deletedT = this.db.get(id);

    if (deletedT) {
      this.db.delete(id);
    }

    return deletedT;
  }

  update(id: I, item: T): T {
    this.db.set(id, item);
    return { ...item };
  }
}
