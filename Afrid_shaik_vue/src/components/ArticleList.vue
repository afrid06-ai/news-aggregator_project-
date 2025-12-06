<template>
  <div class="articleList">
    <div v-if="articles.length === 0" class="emptyMsg">
      <p>No articles found. Search for news or save your first article!</p>
    </div>
    <div v-else class="articlesGrid">
      <ArticleCard
        v-for="article in articles"
        :key="article._id || article.url"
        :article="article"
        :api-url="apiUrl"
        :is-saved="!!article._id"
        @delete="handleDelete"
        @edit="handleEdit"
        @save="handleSave"
      />
    </div>
  </div>
</template>

<script>
import ArticleCard from './ArticleCard.vue'

export default {
  name: 'ArticleList',
  components: {
    ArticleCard
  },
  props: {
    articles: {
      type: Array,
      required: true
    },
    apiUrl: {
      type: String,
      default: '/api'
    }
  },
  emits: ['delete', 'edit', 'save'],
  methods: {
    handleDelete(id) {
      this.$emit('delete', id)
    },
    handleEdit(article) {
      this.$emit('edit', article)
    },
    handleSave(article) {
      this.$emit('save', article)
    }
  }
}
</script>
