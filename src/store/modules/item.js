import { fetchItemDetail, fetchItemReviewCount } from '@/api/item';

export default {
  namespaced: true,
  state: () => ({
    item: null,
    loading: false,
    error: null,
    reviewCount: 0,
  }),
  mutations: {
    SET_ITEM(state, payload) {
      state.item = payload;
    },
    SET_REVIEW_COUNT(state, payload) {
      state.item.reviewCount = payload;
    },
    SET_LOADING(state, payload) {
      state.loading = payload;
    },
    SET_ERROR(state, payload) {
      state.error = payload;
    },
  },
  actions: {
    async loadItem({ commit }, itemId) {
      commit('SET_LOADING', true);
      commit('SET_ERROR', null);
      try {
        const { data: itemData } = await fetchItemDetail(itemId);
        commit('SET_ITEM', itemData);
        // Ensure reviewCount is set; fallback to separate endpoint if not present
        if (itemData.reviewCount == null) {
          const { data } = await fetchItemReviewCount(itemId);
          commit('SET_REVIEW_COUNT', data.count);
        } else {
          commit('SET_REVIEW_COUNT', itemData.reviewCount);
        }
      } catch (err) {
        commit('SET_ERROR', err.response?.data?.message || err.message);
      } finally {
        commit('SET_LOADING', false);
      }
    },
  },
  getters: {
    getItem: (state) => state.item,
    getReviewCount: (state) => state.item?.reviewCount ?? 0,
  },
};