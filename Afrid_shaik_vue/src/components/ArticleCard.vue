<template>
  <div class="articleCard">
    <div v-if="article.urlToImage" class="articleImg">
      <img :src="article.urlToImage" :alt="article.title" />
    </div>
    <div class="cardBody">
      <div class="cardHead">
        <h3 class="articleTitle">{{ article.title }}</h3>
        <span class="articleCat">{{ article.category }}</span>
      </div>
      <p class="articleDesc">{{ article.description }}</p>
      <div class="metaInfo">
        <div class="metaRow">
          <span class="labelText">Author:</span>
          <span class="valueText">{{ article.author || 'Unknown' }}</span>
        </div>
        <div class="metaRow">
          <span class="labelText">Source:</span>
          <span class="valueText">{{ article.source }}</span>
        </div>
        <div class="metaRow">
          <span class="labelText">Published:</span>
          <span class="valueText">{{ formatDate(article.publishedDate) }}</span>
        </div>
      </div>
      <div v-if="article.tags && article.tags.length > 0" class="tagList">
        <span v-for="tag in article.tags" :key="tag" class="tagItem">{{ tag }}</span>
      </div>
      <div v-if="article.notes" class="notesBox">
        <strong>Notes:</strong> {{ article.notes }}
      </div>
      <div class="badges">
        <span v-if="article.favorite" class="badgeItem favorite">⭐ Favorite</span>
        <span v-if="article.readLater" class="badgeItem read-later">📌 Read Later</span>
      </div>
      <div class="actionButtons">
        <a :href="article.url" target="_blank" class="linkButton">Read Article</a>
        <button v-if="!isSaved" @click="handleSave" class="saveBtn">💾 Save</button>
        <button v-if="isSaved" @click="handleEdit" class="editBtn">✏️ Edit</button>
        <button v-if="isSaved" @click="handleDelete" class="deleteBtn">🗑️ Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleCard',
  props: {
    article: {
      type: Object,
      required: true
    },
    apiUrl: {
      type: String,
      default: 'http://localhost:3000/api'
    },
    isSaved: {
      type: Boolean,
      default: true
    }
  },
  emits: ['delete', 'edit', 'save'],
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    },
    handleDelete() {
      this.$emit('delete', this.article._id)
    },
    handleEdit() {
      this.$emit('edit', this.article)
    },
    handleSave() {
      this.$emit('save', this.article)
    }
  }
}
</script>
