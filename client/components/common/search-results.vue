<template lang="pug">
  .search-results(v-if='search.length > 1')
    .search-results-container
      .search-results-loader(v-if='searchIsLoading && results.length < 1')
        orbit-spinner(
          :animation-duration='1000'
          :size='100'
          color='#FFF'
        )
        .headline.mt-5 Searching...
      .search-results-none(v-if='!searchIsLoading && results.length < 1')
        img(src='/svg/icon-no-results.svg', alt='No Results')
        .subheading No pages matching your query.
      template(v-if='results.length > 0')
        v-subheader.white--text Found {{response.totalHits}} results
        v-list.radius-7(two-line)
          template(v-for='(item, idx) of results')
            v-list-tile(@click='', :key='item.id')
              v-list-tile-avatar(tile)
                img(src='/svg/icon-selective-highlighting.svg')
              v-list-tile-content
                v-list-tile-title(v-html='item.title')
                v-list-tile-sub-title(v-html='item.description')
                .caption.grey--text.mt-1(v-html='item.path')
              v-list-tile-action
                v-chip(label) {{item.locale.toUpperCase()}}
            v-divider(v-if='idx < results.length - 1')
        v-pagination.mt-3(
          v-if='paginationLength > 1'
          dark
          v-model='pagination'
          :length='paginationLength'
        )
      template(v-if='suggestions.length > 0')
        v-subheader.white--text.mt-3 Did you mean...
        v-list.radius-7(dense, dark)
          template(v-for='(term, idx) of suggestions')
            v-list-tile(:key='term', @click='setSearchTerm(term)')
              v-list-tile-avatar
                v-icon search
              v-list-tile-content
                v-list-tile-title(v-html='term')
            v-divider(v-if='idx < suggestions.length - 1')
      .text-xs-center.pt-4
        v-btn(outline, color='orange', @click='search = ``', v-if='results.length > 0')
          v-icon(left) save
          span Copy Search Link
        v-btn(outline, color='pink', @click='search = ``')
          v-icon(left) clear
          span Close
</template>

<script>
import _ from 'lodash'
import { get, sync } from 'vuex-pathify'
import { OrbitSpinner } from 'epic-spinners'

import searchPagesQuery from 'gql/common/common-pages-query-search.gql'

export default {
  components: {
    OrbitSpinner
  },
  data() {
    return {
      pagination: 1,
      response: {
        results: [],
        suggestions: [],
        totalHits: 0
      }
    }
  },
  computed: {
    search: sync('site/search'),
    searchIsLoading: sync('site/searchIsLoading'),
    searchRestrictLocale: sync('site/searchRestrictLocale'),
    searchRestrictPath: sync('site/searchRestrictPath'),
    results() {
      return this.response.results ? this.response.results : []
    },
    hits() {
      return this.response.totalHits ? this.response.totalHits : 0
    },
    suggestions() {
      return this.response.suggestions ? this.response.suggestions : []
    },
    paginationLength() {
      return this.response.totalHits > 0 ? 0 : Math.ceil(this.response.totalHits / 10)
    }
  },
  methods: {
    setSearchTerm(term) {
      this.search = term
    }
  },
  apollo: {
    response: {
      query: searchPagesQuery,
      variables() {
        return {
          query: this.search
        }
      },
      fetchPolicy: 'cache-and-network',
      throttle: 1000,
      skip() {
        return !this.search || this.search.length < 2
      },
      update: (data) => _.get(data, 'pages.search', {}),
      watchLoading (isLoading) {
        this.searchIsLoading = isLoading
      }
    }
  }
}
</script>

<style lang="scss">
.search-results {
  position: fixed;
  top: 64px;
  left: 0;
  width: 100%;
  height: calc(100% - 64px);
  background-color: rgba(0,0,0,.9);
  z-index: 100;
  text-align: center;
  animation: searchResultsReveal .6s ease;

  @media #{map-get($display-breakpoints, 'sm-and-down')} {
    top: 112px;
  }

  &-container {
    margin: 12px auto;
    width: 90vw;
    max-width: 1024px;
  }

  &-loader {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding: 32px 0;
    color: #FFF;
  }

  &-none {
    color: #FFF;

    img {
      width: 200px;
    }
  }
}

@keyframes searchResultsReveal {
  0% {
    background-color: rgba(0,0,0,0);
    padding-top: 32px;
  }
  100% {
    background-color: rgba(0,0,0,.9);
    padding-top: 0;
  }
}
</style>
