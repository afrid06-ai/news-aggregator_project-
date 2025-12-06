<template>
  <div class="searchBox">
    <input 
      type="text" 
      v-model="query" 
      @input="handleSearch"
      placeholder="Search articles by title, description, category, or author..."
      class="searchField"
    />
    <button v-if="query" @click="clearSearch" class="clearButton" title="Clear search">×</button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  emits: ['search'],
  data() {
    return {
      query: ''
    }
  },
  methods: {
    handleSearch() {
      this.$emit('search', this.query)
    },
    clearSearch() {
      this.query = ''
      this.$emit('search', '')
    }
  }
}
</script>
