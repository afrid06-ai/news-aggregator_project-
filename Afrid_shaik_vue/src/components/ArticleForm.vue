<template>
  <div class="modalBg" @click.self="handleCancel">
    <div class="modalBox">
      <div class="modalHead">
        <h2>{{ article ? 'Edit Article' : 'Save New Article' }}</h2>
        <button @click="handleCancel" class="closeButton">&times;</button>
      </div>
      <form @submit.prevent="handleSubmit" class="formContainer">
        <div class="formField">
          <label for="title">Title *</label>
          <input 
            id="title" 
            v-model="formData.title" 
            type="text" 
            required 
            placeholder="Enter article title"
          />
        </div>
        
        <div class="formRow">
          <div class="formField">
            <label for="author">Author</label>
            <input 
              id="author" 
              v-model="formData.author" 
              type="text" 
              placeholder="Author name"
            />
          </div>
          
          <div class="formField">
            <label for="source">Source *</label>
            <input 
              id="source" 
              v-model="formData.source" 
              type="text" 
              required
              placeholder="News source"
            />
          </div>
        </div>
        
        <div class="formField">
          <label for="description">Description *</label>
          <textarea 
            id="description" 
            v-model="formData.description" 
            required 
            rows="4"
            placeholder="Enter article description"
          ></textarea>
        </div>
        
        <div class="formRow">
          <div class="formField">
            <label for="category">Category *</label>
            <select id="category" v-model="formData.category" required>
              <option value="">Select category</option>
              <option value="technology">Technology</option>
              <option value="business">Business</option>
              <option value="sports">Sports</option>
              <option value="science">Science</option>
              <option value="health">Health</option>
              <option value="entertainment">Entertainment</option>
              <option value="general">General</option>
              <option value="environment">Environment</option>
            </select>
          </div>
          
          <div class="formField">
            <label for="publishedDate">Published Date *</label>
            <input 
              id="publishedDate" 
              v-model="formData.publishedDate" 
              type="date" 
              required
            />
          </div>
        </div>
        
        <div class="formField">
          <label for="url">Article URL *</label>
          <input 
            id="url" 
            v-model="formData.url" 
            type="url" 
            required
            placeholder="https://example.com/article"
          />
        </div>
        
        <div class="formField">
          <label for="urlToImage">Image URL</label>
          <input 
            id="urlToImage" 
            v-model="formData.urlToImage" 
            type="url" 
            placeholder="https://example.com/image.jpg"
          />
        </div>
        
        <div class="formField">
          <label for="tags">Tags</label>
          <div class="tagInput">
            <input 
              id="tags" 
              v-model="tagInput" 
              type="text" 
              placeholder="Add tag (press Enter)"
              @keydown.enter.prevent="addTag"
            />
            <button type="button" @click="addTag" class="addTagBtn">Add</button>
          </div>
          <div v-if="formData.tags.length > 0" class="tagsList">
            <span 
              v-for="(tag, index) in formData.tags" 
              :key="index" 
              class="tagItem"
            >
              {{ tag }}
              <button 
                type="button" 
                @click="removeTag(index)" 
                class="removeTagBtn"
              >&times;</button>
            </span>
          </div>
        </div>
        
        <div class="formField">
          <label for="notes">Notes</label>
          <textarea 
            id="notes" 
            v-model="formData.notes" 
            rows="3"
            placeholder="Your notes about this article..."
          ></textarea>
        </div>
        
        <div class="formRow">
          <div class="formField checkboxField">
            <label>
              <input type="checkbox" v-model="formData.favorite" />
              Mark as Favorite
            </label>
          </div>
          <div class="formField checkboxField">
            <label>
              <input type="checkbox" v-model="formData.readLater" />
              Read Later
            </label>
          </div>
        </div>
        
        <div class="formButtons">
          <button type="button" @click="handleCancel" class="cancelBtn">Cancel</button>
          <button type="submit" class="submitBtn">{{ article ? 'Update' : 'Save' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArticleForm',
  props: {
    article: {
      type: Object,
      default: null
    }
  },
  emits: ['submit', 'cancel'],
  data() {
    return {
      formData: {
        title: '',
        author: '',
        source: '',
        publishedDate: '',
        description: '',
        url: '',
        urlToImage: '',
        category: '',
        tags: [],
        notes: '',
        readLater: false,
        favorite: false
      },
      tagInput: ''
    }
  },
  watch: {
    article: {
      handler(newVal) {
        if (newVal) {
          this.formData = {
            title: newVal.title || '',
            author: newVal.author || '',
            source: newVal.source || '',
            publishedDate: newVal.publishedDate ? new Date(newVal.publishedDate).toISOString().split('T')[0] : '',
            description: newVal.description || '',
            url: newVal.url || '',
            urlToImage: newVal.urlToImage || '',
            category: newVal.category || '',
            tags: [...(newVal.tags || [])],
            notes: newVal.notes || '',
            readLater: newVal.readLater || false,
            favorite: newVal.favorite || false
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    addTag() {
      if (this.tagInput.trim() && !this.formData.tags.includes(this.tagInput.trim())) {
        this.formData.tags.push(this.tagInput.trim())
        this.tagInput = ''
      }
    },
    removeTag(index) {
      this.formData.tags.splice(index, 1)
    },
    handleSubmit() {
      const submitData = {
        ...this.formData,
        publishedDate: new Date(this.formData.publishedDate).toISOString()
      }
      this.$emit('submit', submitData)
    },
    handleCancel() {
      this.$emit('cancel')
    }
  }
}
</script>
