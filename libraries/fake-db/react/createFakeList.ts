import React from 'react';
import { useList } from 'react-use';

import type { FakeTable, FakeRecord } from '../core';

export type CreateInput<T extends FakeRecord = FakeRecord> = Partial<
  Omit<T, 'id' | 'version'>
>;

export type UpdateInput<T extends FakeRecord = FakeRecord> = Partial<
  Omit<T, 'version'>
> & { id: string };

function isSame(a: FakeRecord, b: FakeRecord) {
  return a.id === b.id;
}

export function createFakeList<T extends FakeRecord = FakeRecord>(
  table: FakeTable<T>
) {
  const [items, op] = useList(table.values());

  const map = React.useMemo(() => {
    const record = {};

    for (const item of items) {
      record[item.id] = item;
    }

    return record;
  }, [items]);

  function get(id: string): T | undefined {
    return map[id];
  }

  function has(id: string): boolean {
    return map.hasOwnProperty(id);
  }

  function findMany(predicate: (value: T) => boolean) {
    return items.filter(predicate);
  }

  function create(item: CreateInput<T>) {
    const newItem = table.create(item);
    op.insertAt(0, newItem);
    return newItem;
  }

  function update(item: UpdateInput<T>) {
    const newItem = table.update(item);
    op.update(isSame, newItem);
    return newItem;
  }

  function upsert(item: CreateInput<T> | UpdateInput<T>) {
    if (has((item as UpdateInput<T>).id)) {
      return update(item as UpdateInput<T>);
    } else {
      return create(item as CreateInput<T>);
    }
  }

  function remove(id: string) {
    table.delete(id);
    op.removeAt(items.findIndex((item) => item.id === id));
  }

  return { items, get, has, findMany, create, update, upsert, remove } as const;
}

export type FakeList<T extends FakeRecord = FakeRecord> = ReturnType<
  typeof createFakeList<T>
>;
