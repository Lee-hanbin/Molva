import Vue from "vue"
import Vuex from "vuex"
import axios from "axios"
import createPersistedState from "vuex-persistedstate"
import router from '@/router'

const API_URL = "http://127.0.0.1:8000"
const YOUTUBE_URL = 'https://www.googleapis.com/youtube/v3/search'
const YOUTUBE_KEY = process.env.VUE_APP_YOUTUBE_API

Vue.use(Vuex)

export default new Vuex.Store({
  plugins:[
    createPersistedState(),
  ],
  state: {
    token: null,
    movie: null,
    reviews:null,
    movies: null,
    loading: true,
    youtubeVideos: [],
    genre_movies: null,
    ott_wavve_movies: null,
    ott_watcha_movies: null,
    ott_disney_movies: null,
    ott_netflix_movies: null,
  },
  getters: {
    isLogin(state) {
      return state.token ? true : false
    }
  },
  mutations: {
    SET_LOADING(state, data){
      state.loading = data;
    },
    SAVE_TOKEN(state, token) {
      state.token = token
      router.push({ name: 'home' })
    },
    LOG_OUT(state) {
      state.token = null
      router.push({ name: 'home' })
    },
    GET_MOVIES(state, payload) {
      state.movies = payload.movies
    },
    GET_DETAIL(state, payload) {
      state.movie = payload
    },
    GET_REVIEWS(state, payload) {
      state.reviews = payload
    },
    GET_OTT_MOVIE(state, ott_movies) {
      const ottId = ott_movies['ottId']
      const ott_movie = ott_movies['data']
      // console.log('tttt')
      // console.log(ottId)

      if (ottId === 8){
        state.ott_netflix_movies = ott_movie
      } else if (ottId === 337) {
        state.ott_disney_movies = ott_movie
      } else if (ottId === 97) {
        state.ott_watcha_movies = ott_movie
      } else if (ottId === 356) {
        state.ott_wavve_movies = ott_movie
      }
      // state.ott_movies = ott_movies
    },
    GET_GENRE_MOVIE(state, genre_movies) {
      state.genre_movies = genre_movies
    }
  },
  actions: {
    // 회원가입
    signUp(context, payload) {
      const username = payload.username
      const password1 = payload.password1
      const password2 = payload.password2

      axios({
        method: "post",
        url: `${API_URL}/accounts/signup/`,
        data: {
          username,
          password1,
          password2,
        },
      })
        .then((res) => {
          context.commit("SAVE_TOKEN", res.data.key)
          
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // 로그인
    login(context, payload) {
      const username = payload.username
      const password = payload.password
      
      axios({
        method: "post",
        url: `${API_URL}/accounts/login/`,
        data: {
          username,
          password,
        }
      })
      .then((res) => {
        context.commit("SAVE_TOKEN", res.data.key)
      })
      .catch((err) => {
        console.log(err)
      })
    },
    // 로그아웃
    logOut(context) {
      axios({
        method: "post",
        url: `${API_URL}/accounts/logout/`,
      })
        .then((res) => {
          context.commit("LOG_OUT", res.data.key)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // GET_MOVIES
    getMovies(context, payload) {
      let params = null

      if (payload) {
        params = {
          sorted: payload,
        }
      }

      axios({
        method: "get",
        url: `${API_URL}/movies/`,
        params: params,
      })
        .then((res) => {
          const moviePayload = {
            sorted: payload,
            movies: res.data,
          }
          context.commit("GET_MOVIES", moviePayload)
        })
        .catch((err) => {
          console.log(err)
        })
    },
    // GET MOVIE DETAIL
    getDetail(context, movieId){
      axios({
        method: "get",
        url: `${API_URL}/movies/${movieId}/`,
      })
        .then((res)=>{
          context.commit("GET_DETAIL", res.data)
        })
        .catch((err)=>{
          router.push('/404-not-found')
          console.log(err)
        })
    },
    // GET REVIEWS
    getReviews(context, movieId){
      axios({
        method:'get',
        url: `${API_URL}/movies/${movieId}/reviews/`,
      })
        .then((res)=>{
          context.commit('GET_REVIEWS', res.data)
        })
        .catch((err)=>{
          console.log(err)
        })
    },
    // GET OTT MOVIE
    getOttMovie(context, ottId){
      axios({
        method: "get",
        url: `${API_URL}/movies/create_ott_list/${ottId}/`,
      })
        .then((res) => {
          // console.log(ottId)
          const payload = {
            data: res.data, 
            ottId: ottId
          }
          context.commit("GET_OTT_MOVIE", payload)
        })
        .catch((err)=>{
          router.push('/404-not-found')
          console.log(err)
        })
    },
    // GET GENRE MOVIE
    getgenreMovie(context, genreId){
      axios({
        method: "get",
        url: `${API_URL}/movies/create_genre_list/${genreId}/`,
      })
        .then((res) => {
          context.commit("GET_GENRE_MOVIE", res.data)
        })
        .catch((err)=>{
          router.push('/404-not-found')
          console.log(err)
        })
    },
    // Search Youtube
    searchYoutube: function ({ commit }, searchText) {
      const params = {
        q: searchText+'movie',
        key: YOUTUBE_KEY,
        part: 'snippet',
        type: 'video'
      }
      axios({
        method: 'get',
        url: YOUTUBE_URL,
        params,
      })
      .then(res => {
        // console.log(res.data.items)
        commit('SEARCH_YOUTUBE', res)
      })
      .catch(err => console.log(err))
    },
  },
  modules: {},
})