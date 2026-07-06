import * as migration_20260706_154436_initial from './20260706_154436_initial';

export const migrations = [
  {
    up: migration_20260706_154436_initial.up,
    down: migration_20260706_154436_initial.down,
    name: '20260706_154436_initial'
  },
];
