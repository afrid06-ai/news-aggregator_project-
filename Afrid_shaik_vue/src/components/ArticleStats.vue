<template>
  <div class="statsBox">
    <h3>Article Statistics</h3>
    <div class="statsGrid">
      <div class="statCard">
        <div class="statNum">{{ totalArticles }}</div>
        <div class="statText">Total Articles</div>
      </div>
      <div class="statCard">
        <div class="statNum">{{ favoriteArticles }}</div>
        <div class="statText">Favorites</div>
      </div>
      <div class="statCard">
        <div class="statNum">{{ readLaterArticles }}</div>
        <div class="statText">Read Later</div>
      </div>
      <div class="statCard">
        <div class="statNum">{{ categoriesCount }}</div>
        <div class="statText">Categories</div>
      </div>
    </div>
    <div v-if="Object.keys(categoriesBreakdown).length > 0" class="catBreakdown">
      <h4>By Category</h4>
      <div class="catList">
        <div v-for="(count, category) in categoriesBreakdown" :key="category" class="catItem">
          <span class="catName">{{ category }}</span>
          <span class="catCount">{{ count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleStats',
  props: {
    articles: {
      type: Array,
      required: true
    }
  },
  computed: {
    totalArticles() {
      return this.articles.length
    },
    favoriteArticles() {
      return this.articles.filter(a => a.favorite).length
    },
    readLaterArticles() {
      return this.articles.filter(a => a.readLater).length
    },
    categoriesCount() {
      return new Set(this.articles.map(a => a.category)).size
    },
    categoriesBreakdown() {
      const categories = {}
      this.articles.forEach(a => {
        categories[a.category] = (categories[a.category] || 0) + 1
      })
      return categories
    }
  }
}
</script>
