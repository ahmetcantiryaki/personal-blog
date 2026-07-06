import * as migration_20260706_154436_initial from './20260706_154436_initial';
import * as migration_20260706_165836_add_taxonomy_key from './20260706_165836_add_taxonomy_key';

export const migrations = [
  {
    up: migration_20260706_154436_initial.up,
    down: migration_20260706_154436_initial.down,
    name: '20260706_154436_initial',
  },
  {
    up: migration_20260706_165836_add_taxonomy_key.up,
    down: migration_20260706_165836_add_taxonomy_key.down,
    name: '20260706_165836_add_taxonomy_key'
  },
];
