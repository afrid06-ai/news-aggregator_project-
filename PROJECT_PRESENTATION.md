# News Aggregator & Portfolio Project
## 20-Minute Presentation Guide

---

## 1. PROJECT OVERVIEW (2 minutes)

### What is This Project?
A **full-stack web application** that combines:
- **News Aggregator**: A platform to discover, save, and organize news articles from around the world
- **Personal Portfolio**: A professional portfolio website showcasing skills and projects

### Key Highlights
- **Full-stack application** with separate frontend and backend
- **RESTful API** for managing news articles
- **External API integration** (NewsAPI) for fetching live news
- **Database storage** for saving and organizing articles
- **Cloud deployment** on AWS EC2 and Netlify
- **Responsive design** for all devices

### Problem Statement
- Information overload: Too many news sources to track
- Need for personal organization: Save articles for later reading
- Lack of centralized news management system
- Need for a professional online presence

### Solution
A unified platform that:
- Aggregates news from multiple sources
- Allows users to save, categorize, and organize articles
- Provides search and filtering capabilities
- Showcases professional portfolio

---

## 2. FEATURES & FUNCTIONALITY (3 minutes)

### News Aggregator Features

#### 1. **Browse Live News**
- Fetch top headlines from NewsAPI
- Filter by categories: Technology, Business, Sports, Science, Health, Entertainment
- Real-time news updates
- Search functionality across all news sources

#### 2. **Save Articles**
- Save articles to personal database
- Add custom notes and tags
- Mark as "Read Later" or "Favorite"
- Organize by categories

#### 3. **Article Management**
- Edit saved articles
- Delete articles
- Search through saved articles
- View article statistics

#### 4. **Dual Search Modes**
- **Database Mode**: Search through saved articles
- **NewsAPI Mode**: Search live news from external API

### Portfolio Features
- Professional introduction
- Education background
- Skills showcase
- Projects portfolio
- Contact information
- Responsive design

---

## 3. SYSTEM ARCHITECTURE (2 minutes)

### Architecture Diagram
```
┌─────────────────┐
│   Netlify       │
│   (Frontend)    │
│   Vue.js App    │
└────────┬────────┘
         │ HTTPS
         │ /api/*
         ▼
┌─────────────────┐
│   AWS EC2        │
│   (Backend)      │
│   Express.js     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌────────┐  ┌──────────┐
│ MongoDB│  │ NewsAPI  │
│ Atlas  │  │ External │
└────────┘  └──────────┘
```

### Technology Stack

#### Frontend
- **Vue.js 3**: Progressive JavaScript framework
- **CSS3**: Custom styling
- **Netlify**: Static site hosting

#### Backend
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **PM2**: Process manager

#### External Services
- **NewsAPI**: News aggregation service
- **MongoDB Atlas**: Cloud database
- **AWS EC2**: Cloud server hosting
- **Netlify**: Frontend hosting

---

## 4. BACKEND DEVELOPMENT - DETAILED EXPLANATION (8 minutes)

### 4.1 Backend Setup & Configuration

#### Project Structure
```
Afrid_shaik_node/
├── server.js          # Main server file
├── package.json       # Dependencies
├── seed.js           # Database seeding
├── public/           # Static files (portfolio)
└── ecosystem.config.js # PM2 configuration
```

#### Dependencies
```json
{
  "express": "^4.18.2",    // Web framework
  "mongoose": "^7.5.0",   // MongoDB ODM
  "cors": "^2.8.5"        // Cross-origin resource sharing
}
```

### 4.2 Server Initialization

#### Express App Setup
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
```

**Key Points:**
- Express creates the web server
- CORS enables cross-origin requests (frontend ↔ backend)
- Path module handles file paths

#### Middleware Configuration
```javascript
app.use(cors({
  origin: '*',  // Allow all origins (for production, specify domains)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());  // Parse JSON request bodies
app.use(express.static(path.join(__dirname, 'public')));  // Serve static files
```

**Why Each Middleware:**
- **CORS**: Allows frontend (Netlify) to communicate with backend (EC2)
- **express.json()**: Parses incoming JSON data
- **express.static()**: Serves portfolio HTML/CSS files

### 4.3 Database Connection

#### MongoDB Atlas Connection
```javascript
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://...';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('Server will continue running, but database operations may fail');
});
```

**Key Points:**
- **MongoDB Atlas**: Cloud-hosted database (no local installation needed)
- **Environment Variables**: Secure credential storage
- **Error Handling**: Server continues even if DB connection fails
- **Connection Options**: Modern MongoDB driver settings

**Why MongoDB?**
- NoSQL: Flexible schema for articles
- Cloud-hosted: No server setup needed
- Scalable: Handles growing data
- Free tier available

### 4.4 Data Model (Schema Design)

#### Article Schema
```javascript
const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, default: 'Unknown' },
  source: { type: String, required: true },
  publishedDate: { type: Date, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  urlToImage: { type: String, default: '' },
  category: { type: String, required: true },
  tags: [String],  // Array of strings
  notes: { type: String, default: '' },
  readLater: { type: Boolean, default: false },
  favorite: { type: Boolean, default: false }
}, { timestamps: true });  // Auto-adds createdAt and updatedAt

const Article = mongoose.model('Article', articleSchema);
```

**Schema Design Decisions:**
- **Required Fields**: title, source, publishedDate, description, url, category
- **Optional Fields**: author, urlToImage, tags, notes
- **Boolean Flags**: readLater, favorite for organization
- **Timestamps**: Automatic creation/update tracking
- **Array Support**: Multiple tags per article

### 4.5 API Endpoints - Detailed Breakdown

#### 4.5.1 GET /api - Fetch All Saved Articles
```javascript
app.get('/api', async (req, res) => {
  try {
    const articles = await Article.find()
      .sort({ publishedDate: -1 });  // Newest first
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Functionality:**
- Retrieves all articles from database
- Sorted by publication date (newest first)
- Returns JSON array
- Error handling with 500 status

**Use Case:** Frontend loads all saved articles on page load

---

#### 4.5.2 GET /api/:id - Get Single Article
```javascript
app.get('/api/:id', async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Functionality:**
- Retrieves single article by MongoDB ID
- 404 error if article doesn't exist
- Returns single article object

**Use Case:** View/edit specific article details

---

#### 4.5.3 POST /api - Save New Article
```javascript
app.post('/api', async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();
    res.status(201).json(article);  // 201 = Created
  } catch (error) {
    res.status(400).json({ error: error.message });  // 400 = Bad Request
  }
});
```

**Functionality:**
- Creates new article from request body
- Validates against schema
- Saves to database
- Returns created article with 201 status

**Use Case:** User saves article from NewsAPI or manually adds article

**Request Body Example:**
```json
{
  "title": "AI Revolution in Healthcare",
  "author": "John Doe",
  "source": "Tech News",
  "publishedDate": "2024-12-06",
  "description": "AI is transforming healthcare...",
  "url": "https://example.com/article",
  "category": "technology",
  "tags": ["AI", "Healthcare"]
}
```

---

#### 4.5.4 PUT /api/:id - Update Article
```javascript
app.put('/api/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

**Functionality:**
- Updates existing article
- `new: true` returns updated document
- `runValidators: true` validates updated data
- 404 if article not found

**Use Case:** Edit article notes, tags, or favorite status

---

#### 4.5.5 DELETE /api/:id - Delete Article
```javascript
app.delete('/api/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    res.json({ message: 'Article deleted successfully', article });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Functionality:**
- Permanently deletes article from database
- Returns deleted article in response
- 404 if article doesn't exist

**Use Case:** Remove unwanted articles

---

#### 4.5.6 GET /api/search/:query - Search Saved Articles
```javascript
app.get('/api/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const articles = await Article.find({
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } }
      ]
    });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Functionality:**
- Searches across multiple fields (title, description, category, author)
- Uses MongoDB regex for pattern matching
- `$options: 'i'` makes search case-insensitive
- `$or` operator searches any field

**Use Case:** Search through saved articles in database mode

**MongoDB Query Operators:**
- `$regex`: Pattern matching
- `$or`: Logical OR condition
- `$options: 'i'`: Case-insensitive search

---

#### 4.5.7 GET /api/news/headlines - Fetch Top Headlines
```javascript
app.get('/api/news/headlines', async (req, res) => {
  try {
    const { category = 'general', country = 'us', pageSize = 20 } = req.query;
    
    const url = `${NEWS_API_BASE}/top-headlines?country=${country}&category=${category}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Functionality:**
- Proxies request to NewsAPI
- Query parameters: category, country, pageSize
- Default values if not provided
- Error handling for API failures

**Why Proxy?**
- Hides API key from frontend
- Centralized API management
- Can add caching/rate limiting later

**Request Example:**
```
GET /api/news/headlines?category=technology&country=us&pageSize=20
```

---

#### 4.5.8 GET /api/news/search - Search Live News
```javascript
app.get('/api/news/search', async (req, res) => {
  try {
    const { q, category, language = 'en', sortBy = 'publishedAt', pageSize = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    let url = `${NEWS_API_BASE}/everything?q=${encodeURIComponent(q)}&language=${language}&sortBy=${sortBy}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;
    
    if (category) {
      url += `&category=${category}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Functionality:**
- Searches all news articles via NewsAPI
- Validates required query parameter
- URL encoding for special characters
- Optional category filtering

**Request Example:**
```
GET /api/news/search?q=artificial%20intelligence&category=technology&pageSize=20
```

---

#### 4.5.9 GET /api/news/category/:category - Category-Specific News
```javascript
app.get('/api/news/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { pageSize = 20 } = req.query;
    
    const url = `${NEWS_API_BASE}/top-headlines?category=${category}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`NewsAPI error: ${response.status}`);
    }
    
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Functionality:**
- Fetches news by specific category
- Category from URL parameter
- PageSize from query parameter

**Use Case:** Filter news by technology, sports, business, etc.

---

#### 4.5.10 GET / - Serve Portfolio
```javascript
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

**Functionality:**
- Serves static HTML file
- Portfolio accessible at root URL
- Uses path.join for cross-platform compatibility

---

### 4.6 Server Configuration

#### Port Binding
```javascript
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server listening on 0.0.0.0:${PORT}`);
});
```

**Key Points:**
- **Environment Variable**: PORT from hosting platform (EC2, Heroku, etc.)
- **Default Port**: 3000 for local development
- **0.0.0.0 Binding**: Listens on all network interfaces (required for cloud deployment)
- **Why 0.0.0.0?**: Allows external connections (not just localhost)

**Common Mistake:**
- `app.listen(PORT)` - Only listens on localhost (127.0.0.1)
- Won't accept external connections on cloud platforms

---

### 4.7 Error Handling Strategy

#### Try-Catch Blocks
Every endpoint uses try-catch for error handling:
```javascript
try {
  // Database operation
} catch (error) {
  res.status(500).json({ error: error.message });
}
```

#### HTTP Status Codes
- **200**: Success
- **201**: Created (POST)
- **400**: Bad Request (validation errors)
- **404**: Not Found
- **500**: Internal Server Error

#### Error Response Format
```json
{
  "error": "Error message here"
}
```

---

### 4.8 Security Considerations

#### CORS Configuration
```javascript
app.use(cors({
  origin: '*',  // In production, specify exact domains
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Security Notes:**
- `origin: '*'` allows all domains (OK for public API)
- In production, specify exact frontend domains
- Prevents unauthorized cross-origin requests

#### Environment Variables
- API keys stored in environment variables
- Not committed to Git
- Secure credential management

#### Input Validation
- Mongoose schema validation
- Required fields enforced
- Type checking

---

## 5. FRONTEND DEVELOPMENT (3 minutes)

### 5.1 Vue.js Architecture

#### Component Structure
```
src/
├── App.vue           # Main component
├── components/
│   ├── ArticleCard.vue
│   ├── ArticleList.vue
│   ├── ArticleForm.vue
│   ├── SearchBar.vue
│   └── ArticleStats.vue
└── styles.css        # Global styles
```

#### Key Components

**App.vue:**
- Main application logic
- State management
- API communication
- Category filtering

**ArticleCard.vue:**
- Displays individual article
- Save/Edit/Delete actions
- Responsive card design

**ArticleList.vue:**
- Renders list of articles
- Grid layout
- Empty state handling

**SearchBar.vue:**
- Search input
- Mode toggle (Database/NewsAPI)
- Search functionality

### 5.2 API Integration

#### API URL Configuration
```javascript
apiUrl: '/api'  // Relative path for Netlify proxy
```

**Why Relative Path?**
- Works with Netlify redirects
- Avoids CORS issues
- HTTPS to HTTPS communication

#### Fetch API Usage
```javascript
const response = await fetch(`${this.apiUrl}/news/headlines?category=${category}`);
const data = await response.json();
```

### 5.3 State Management

#### Reactive Data
```javascript
data() {
  return {
    articles: [],
    selectedCategory: null,
    searchQuery: '',
    loading: false,
    error: null
  }
}
```

#### Methods
- `fetchArticles()`: Load saved articles
- `fetchHeadlines()`: Get news from NewsAPI
- `saveArticle()`: Save to database
- `deleteArticle()`: Remove article
- `searchArticles()`: Search functionality

---

## 6. DEPLOYMENT (2 minutes)

### 6.1 Backend Deployment (AWS EC2)

#### Setup Process
1. **Launch EC2 Instance**
   - Amazon Linux 2023
   - t2.micro (free tier)
   - Security group: Ports 22, 80, 443, 3000

2. **Server Configuration**
   - Install Node.js 18
   - Install PM2 (process manager)
   - Install Git

3. **Application Deployment**
   - Clone repository
   - Install dependencies
   - Set environment variables
   - Start with PM2

4. **PM2 Configuration**
   - Auto-restart on failure
   - Auto-start on server reboot
   - Process monitoring

#### Environment Variables
```bash
MONGODB_URI=mongodb+srv://...
NEWS_API_KEY=...
PORT=3000
NODE_ENV=production
```

### 6.2 Frontend Deployment (Netlify)

#### Build Process
```bash
npm run build  # Creates dist/ folder
```

#### Deployment
- Drag & drop `dist` folder
- Or connect to GitHub for auto-deploy

#### Netlify Configuration
- `_redirects` file for API proxying
- SPA routing configuration
- HTTPS enabled automatically

### 6.3 Database Setup (MongoDB Atlas)

#### Configuration
- Cloud-hosted MongoDB
- Network access rules (IP whitelist)
- Connection string in environment variables

---

## 7. CHALLENGES & SOLUTIONS (2 minutes)

### Challenge 1: Mixed Content (HTTPS → HTTP)
**Problem:** Netlify (HTTPS) couldn't access EC2 (HTTP)

**Solution:**
- Netlify redirects to proxy API calls
- Relative API paths (`/api` instead of full URL)
- All traffic through HTTPS

### Challenge 2: CORS Errors
**Problem:** Browser blocked cross-origin requests

**Solution:**
- Configured CORS middleware
- Allowed all origins (for public API)
- Proper headers configuration

### Challenge 3: Port Binding
**Problem:** Server not accessible externally on EC2

**Solution:**
- Changed from `localhost` to `0.0.0.0`
- Updated security group rules
- Opened port 3000

### Challenge 4: MongoDB Connection
**Problem:** Database connection timeout

**Solution:**
- Added EC2 IP to MongoDB Atlas whitelist
- Non-blocking connection (server starts even if DB fails)
- Proper error handling

### Challenge 5: Process Management
**Problem:** App stops when SSH session ends

**Solution:**
- PM2 process manager
- Auto-restart on failure
- Auto-start on boot

---

## 8. TECHNOLOGIES & TOOLS (1 minute)

### Backend Technologies
- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **MongoDB**: Database
- **Mongoose**: ODM
- **PM2**: Process manager
- **NewsAPI**: External API

### Frontend Technologies
- **Vue.js 3**: Framework
- **CSS3**: Styling
- **Fetch API**: HTTP requests

### Deployment & DevOps
- **AWS EC2**: Cloud server
- **Netlify**: Frontend hosting
- **MongoDB Atlas**: Cloud database
- **Git**: Version control
- **PM2**: Process management

### Development Tools
- **VS Code**: Code editor
- **Git**: Version control
- **npm**: Package manager
- **Postman/curl**: API testing

---

## 9. FUTURE ENHANCEMENTS (1 minute)

### Potential Improvements
1. **User Authentication**
   - Login/signup
   - User-specific articles
   - Multi-user support

2. **Advanced Features**
   - Article sharing
   - Export to PDF
   - Email newsletters
   - Reading time estimation

3. **Performance**
   - Caching layer (Redis)
   - Image optimization
   - Lazy loading
   - Pagination

4. **UI/UX**
   - Dark mode
   - Better mobile experience
   - Animations
   - Progressive Web App (PWA)

5. **Analytics**
   - User behavior tracking
   - Popular articles
   - Reading statistics

---

## 10. DEMONSTRATION POINTS (2 minutes)

### Live Demo Flow
1. **Show Portfolio**
   - Navigate to root URL
   - Show sections: About, Education, Projects

2. **Show News Aggregator**
   - Navigate to `/news`
   - Browse headlines by category
   - Search for articles

3. **Save Article**
   - Click "Save Article"
   - Show in saved articles list
   - Edit article (add notes/tags)

4. **Search Functionality**
   - Toggle between Database/NewsAPI mode
   - Search saved articles
   - Search live news

5. **Article Management**
   - Mark as favorite
   - Delete article
   - View statistics

---

## PRESENTATION TIPS

### Time Allocation
- **Overview**: 2 min
- **Features**: 3 min
- **Architecture**: 2 min
- **Backend Details**: 8 min ⭐ (Main focus)
- **Frontend**: 3 min
- **Deployment**: 2 min
- **Challenges**: 2 min
- **Technologies**: 1 min
- **Future**: 1 min
- **Demo**: 2 min
- **Q&A**: Reserve time

### Key Points to Emphasize
1. **RESTful API design** - Standard HTTP methods
2. **Database schema design** - Thoughtful data modeling
3. **Error handling** - Robust error management
4. **Security** - CORS, environment variables
5. **Deployment** - Production-ready setup
6. **External API integration** - NewsAPI usage
7. **Full-stack architecture** - Separation of concerns

### Visual Aids
- Architecture diagram
- API endpoint list
- Database schema diagram
- Deployment flow
- Screenshots of application

### Practice Points
- Explain each API endpoint clearly
- Show code examples
- Discuss design decisions
- Explain why certain technologies were chosen
- Demonstrate live application

---

## CONCLUSION

This project demonstrates:
- **Full-stack development** skills
- **RESTful API** design and implementation
- **Database** design and management
- **External API** integration
- **Cloud deployment** and DevOps
- **Problem-solving** abilities

**Thank you for your attention!**

---

## APPENDIX: API ENDPOINTS REFERENCE

### Database Operations
- `GET /api` - Get all saved articles
- `GET /api/:id` - Get single article
- `POST /api` - Save new article
- `PUT /api/:id` - Update article
- `DELETE /api/:id` - Delete article
- `GET /api/search/:query` - Search saved articles

### NewsAPI Integration
- `GET /api/news/headlines` - Top headlines
- `GET /api/news/search` - Search live news
- `GET /api/news/category/:category` - Category news

### Static Files
- `GET /` - Portfolio page

---

**Good luck with your presentation! 🚀**

