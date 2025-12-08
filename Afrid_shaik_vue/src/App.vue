<template>
  <div class="mainWrapper">
    <header class="headerSection">
      <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
        <div>
          <h1>News Aggregator</h1>
          <p>Discover, save, and organize news articles from around the world</p>
        </div>
        <a href="/portfolio" style="padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">View Portfolio</a>
      </div>
    </header>
    
    <div v-if="error" class="errorBox">
      Error: {{ error }}
    </div>
    
    <div class="catFilters">
      <button 
        v-for="cat in categories" 
        :key="cat"
        @click="selectCategory(cat)"
        :class="['catBtn', { active: selectedCategory === cat }]"
      >
        {{ cat }}
      </button>
      <button 
        @click="selectCategory(null)"
        :class="['catBtn', { active: selectedCategory === null }]"
      >
        All
      </button>
    </div>
    
    <div class="controlBar">
      <div class="searchToggle">
        <label class="toggleLabel">
          <span>Search Mode:</span>
          <div class="switchToggle">
            <input type="checkbox" v-model="searchNewsAPI" @change="handleModeChange" />
            <span class="slider"></span>
          </div>
          <span class="toggleText">{{ searchNewsAPI ? 'NewsAPI' : 'Database' }}</span>
        </label>
      </div>
      <SearchBar @search="handleSearch" />
      <button @click="fetchNewsFromAPI" class="button primaryBtn">{{ searchQuery && searchQuery.trim() ? '🔍 Search NewsAPI' : '🔍 Browse NewsAPI' }}</button>
      <button @click="openCreateForm" class="button secondaryBtn">+ Save Article</button>
    </div>
    
    <div v-if="loading" class="loadingSpinner">
      Loading articles...
    </div>
    
    <div v-else>
      <ArticleStats :articles="savedArticles" />
      
      <ArticleList 
        :articles="filteredArticles"
        :api-url="apiUrl"
        @delete="deleteArticle"
        @edit="openEditForm"
        @save="saveArticleFromNews"
      />
    </div>
    
    <ArticleForm 
      v-if="showForm"
      :article="editingArticle"
      @submit="handleFormSubmit"
      @cancel="closeForm"
    />
  </div>
</template>

<script>
import ArticleList from './components/ArticleList.vue'
import ArticleForm from './components/ArticleForm.vue'
import SearchBar from './components/SearchBar.vue'
import ArticleStats from './components/ArticleStats.vue'

export default {
  name: 'App',
  components: {
    ArticleList,
    ArticleForm,
    SearchBar,
    ArticleStats
  },
  data() {
    return {
      savedArticles: [],
      filteredArticles: [],
      newsApiArticles: [],
      searchQuery: '',
      selectedCategory: null,
      showForm: false,
      editingArticle: null,
      loading: false,
      error: null,
      apiUrl: '/api',
      categories: ['technology', 'business', 'sports', 'science', 'health', 'entertainment', 'general'],
      searchNewsAPI: false
    }
  },
  mounted() {
    this.fetchSavedArticles()
  },
  methods: {
    async fetchSavedArticles() {
      this.loading = true
      this.error = null
      try {
        const response = await fetch(this.apiUrl)
        if (!response.ok) throw new Error('Failed to fetch articles')
        this.savedArticles = await response.json()
        if (!this.searchNewsAPI) {
          if (this.searchQuery) {
            this.searchDatabaseArticles(this.searchQuery)
          } else {
            this.filteredArticles = this.savedArticles
          }
        }
      } catch (error) {
        this.error = error.message
        console.error('Error fetching articles:', error)
      } finally {
        this.loading = false
      }
    },
    async fetchNewsFromAPI() {
      this.loading = true
      this.error = null
      try {
        if (this.searchQuery && this.searchQuery.trim()) {
          await this.searchNewsAPIArticles(this.searchQuery)
        } else {
          const category = this.selectedCategory || 'general'
          const response = await fetch(`${this.apiUrl}/news/category/${category}?pageSize=20`)
          if (!response.ok) throw new Error('Failed to fetch news')
          const data = await response.json()
          this.newsApiArticles = data.articles || []
          this.filteredArticles = this.newsApiArticles
        }
      } catch (error) {
        this.error = error.message
        console.error('Error fetching news:', error)
      } finally {
        this.loading = false
      }
    },
    async saveArticleFromNews(article) {
      try {
        const articleData = {
          title: article.title,
          author: article.author || 'Unknown',
          source: article.source?.name || 'Unknown',
          publishedDate: new Date(article.publishedAt),
          description: article.description || '',
          url: article.url,
          urlToImage: article.urlToImage || '',
          category: this.selectedCategory || 'general',
          tags: [],
          notes: '',
          readLater: false,
          favorite: false
        }
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(articleData),
        })
        if (!response.ok) throw new Error('Failed to save article')
        await this.fetchSavedArticles()
      } catch (error) {
        this.error = error.message
        console.error('Error saving article:', error)
      }
    },
    async createArticle(articleData) {
      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(articleData),
        })
        if (!response.ok) throw new Error('Failed to create article')
        await this.fetchSavedArticles()
        this.showForm = false
      } catch (error) {
        this.error = error.message
        console.error('Error creating article:', error)
      }
    },
    async updateArticle(id, articleData) {
      try {
        const response = await fetch(`${this.apiUrl}/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(articleData),
        })
        if (!response.ok) throw new Error('Failed to update article')
        await this.fetchSavedArticles()
        this.editingArticle = null
      } catch (error) {
        this.error = error.message
        console.error('Error updating article:', error)
      }
    },
    async deleteArticle(id) {
      if (!confirm('Are you sure you want to delete this article?')) return
      try {
        const response = await fetch(`${this.apiUrl}/${id}`, {
          method: 'DELETE',
        })
        if (!response.ok) throw new Error('Failed to delete article')
        await this.fetchSavedArticles()
      } catch (error) {
        this.error = error.message
        console.error('Error deleting article:', error)
      }
    },
    async handleSearch(query) {
      this.searchQuery = query
      
      if (!query.trim()) {
        if (this.searchNewsAPI) {
          this.filteredArticles = []
        } else {
          this.filteredArticles = this.savedArticles
        }
        return
      }

      if (this.searchNewsAPI) {
        await this.searchNewsAPIArticles(query)
      } else {
        this.searchDatabaseArticles(query)
      }
    },
    searchDatabaseArticles(query) {
      if (!this.savedArticles || this.savedArticles.length === 0) {
        this.filteredArticles = []
        return
      }
      
      let articlesToSearch = this.savedArticles
      
      if (this.selectedCategory) {
        articlesToSearch = articlesToSearch.filter(a => a.category === this.selectedCategory)
      }
      
      this.filteredArticles = articlesToSearch.filter(article => {
        const title = article.title ? article.title.toLowerCase().trim() : ''
        const description = article.description ? article.description.toLowerCase().trim() : ''
        const category = article.category ? article.category.toLowerCase().trim() : ''
        const author = article.author ? article.author.toLowerCase().trim() : ''
        const searchTerm = query.toLowerCase().trim()
        
        if (!searchTerm) return true
        
        return title.includes(searchTerm) ||
               description.includes(searchTerm) ||
               category.includes(searchTerm) ||
               (author && author.includes(searchTerm))
      })
    },
    async searchNewsAPIArticles(query) {
      this.loading = true
      this.error = null
      try {
        const response = await fetch(`${this.apiUrl}/news/search?q=${encodeURIComponent(query)}&pageSize=20`)
        if (!response.ok) throw new Error('Failed to search news')
        const data = await response.json()
        this.newsApiArticles = data.articles || []
        this.filteredArticles = this.newsApiArticles
      } catch (error) {
        this.error = error.message
        console.error('Error searching news:', error)
        this.filteredArticles = []
      } finally {
        this.loading = false
      }
    },
    handleModeChange() {
      const currentQuery = this.searchQuery
      if (!this.searchNewsAPI) {
        this.filteredArticles = this.savedArticles
        this.newsApiArticles = []
        if (currentQuery && currentQuery.trim()) {
          this.searchDatabaseArticles(currentQuery)
        }
      } else {
        this.filteredArticles = []
        if (currentQuery && currentQuery.trim()) {
          this.searchNewsAPIArticles(currentQuery)
        }
      }
    },
    selectCategory(category) {
      this.selectedCategory = category
      if (this.searchQuery) {
        this.handleSearch(this.searchQuery)
      } else {
        if (category) {
          this.filteredArticles = this.savedArticles.filter(a => a.category === category)
        } else {
          this.filteredArticles = this.savedArticles
        }
      }
    },
    openCreateForm() {
      this.editingArticle = null
      this.showForm = true
    },
    openEditForm(article) {
      this.editingArticle = { ...article }
      this.showForm = true
    },
    closeForm() {
      this.showForm = false
      this.editingArticle = null
    },
    handleFormSubmit(articleData) {
      if (this.editingArticle) {
        this.updateArticle(this.editingArticle._id, articleData)
      } else {
        this.createArticle(articleData)
      }
      this.closeForm()
    }
  }
}
</script>
