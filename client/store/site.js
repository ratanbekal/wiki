import { make } from 'vuex-pathify'

/* global siteConfig */

const state = {
  company: '',
  dark: siteConfig.darkMode,
  mascot: true,
  title: siteConfig.title,
  search: '',
  searchIsLoading: false,
  searchRestrictLocale: false,
  searchRestrictPath: false
}

export default {
  namespaced: true,
  state,
  mutations: make.mutations(state)
}
