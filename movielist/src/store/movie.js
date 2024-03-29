import axios from "axios";

const API_KEY = "1709ec8c";

export default {
  namespaced: true,
  state: () => ({
    title: "",
    movies: [],
    loading: false,
  }),
  mutations: {
    updateState(state, payload) {
      Object.keys(payload).forEach((key) => {
        state[key] = payload[key];
      });
    },
    pushIntoMovies(state, movies) {
      state.movies.push(...movies);
    },
  },
  actions: {
    async fetchMovies({ state, commit }, pageNum) {
      const requestUrl = `https://www.omdbapi.com/?apikey=${API_KEY}&s=${state.title}&page=${pageNum}`;
      const res = await axios.get(requestUrl);
      commit("pushIntoMovies", res.data.Search);
      return res.data;
    },
    async searchMovies({ commit, dispatch }) {
      commit("updateState", {
        loading: true, // 로딩 애니메이션 시작
        movies: [], // 초기화
      });

      const { totalResults } = await dispatch("fetchMovies", 1);
      const pageLength = Math.ceil(totalResults / 10);

      if (pageLength > 1) {
        for (let i = 2; i <= pageLength; i += 1) {
          if (i > 4) break;
          await dispatch("fetchMovies", i);
        }
      }

      commit("updateState", {
        loading: false, // 로딩 애니메이션 종료
      });
    },
  },
};
