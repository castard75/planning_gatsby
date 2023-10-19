import { createSelector } from 'reselect';

const animations = state => state.animations;
export const selectAnimations = createSelector([animations], state => state.data?.results);

const animateurs = state => state.animateurs;
export const selectAnimateurs = createSelector([animateurs], state => state.data?.results);

const clients = state => state.clients;
export const selectClients = createSelector([clients], state => state.data?.results);

const lieux = state => state.lieux;
export const selectLieux = createSelector([lieux], state => state.data?.results);
