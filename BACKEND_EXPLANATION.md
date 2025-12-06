# Backend Development - Detailed Explanation

## Quick Reference Guide for Presentation

---

## 1. BACKEND ARCHITECTURE OVERVIEW

### What is the Backend?
The backend is a **RESTful API server** built with Node.js and Express.js that:
- Manages article data in MongoDB
- Integrates with NewsAPI for live news
- Serves the portfolio website
- Handles all business logic

### Core Components
1. **Express Server** - HTTP server
2. **MongoDB Database** - Data storage
3. **API Endpoints** - RESTful routes
4. **External API Integration** - NewsAPI

---

## 2. SERVER SETUP & CONFIGURATION

### Step-by-Step Explanation

#### 1. Import Dependencies
```javascript
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
```

**Why each?**
- **express**: Creates web server, handles HTTP requests
- **mongoose**: Connects to MongoDB, provides data modeling
- **cors**: Allows frontend to make requests (cross-origin)
- **path**: Handles file paths (for serving portfolio)

#### 2. Initialize Express App
```javascript
const app = express();
```
Creates the application instance that will handle all routes.

#### 3. Configure Middleware
```javascript
app.use(cors({...}));        // Enable CORS
app.use(express.json());     // Parse JSON bodies
app.use(express.static(...)); // Serve static files
```

**Middleware Order Matters:**
- CORS first (handles preflight requests)
- JSON parser second (parses request bodies)
- Static files last (serves portfolio)

---

## 3. DATABASE CONNECTION

### MongoDB Atlas Connection

```javascript
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
```

**Connection Options Explained:**
- **useNewUrlParser**: Uses new MongoDB connection string parser
- **useUnifiedTopology**: Uses new server discovery and monitoring engine

**Why MongoDB Atlas?**
- Cloud-hosted (no local setup)
- Free tier available
- Automatic backups
- Scalable
- Global distribution

**Connection String Format:**
```
mongodb+srv://username:password@cluster.mongodb.net/database
```

**Error Handling:**
```javascript
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('Server will continue running, but database operations may fail');
});
```
Server doesn't crash if DB connection fails - graceful degradation.

---

## 4. DATA MODEL (SCHEMA)

### Article Schema Breakdown

```javascript
const articleSchema = new mongoose.Schema({
  // Required Fields
  title: { type: String, required: true },
  source: { type: String, required: true },
  publishedDate: { type: Date, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  category: { type: String, required: true },
  
  // Optional Fields with Defaults
  author: { type: String, default: 'Unknown' },
  urlToImage: { type: String, default: '' },
  notes: { type: String, default: '' },
  
  // Array Field
  tags: [String],
  
  // Boolean Flags
  readLater: { type: Boolean, default: false },
  favorite: { type: Boolean, default: false }
}, { timestamps: true });
```

**Schema Design Decisions:**

1. **Required Fields**: Core article data that must exist
2. **Default Values**: Provide fallbacks for missing data
3. **Array Support**: Multiple tags per article
4. **Boolean Flags**: Quick organization features
5. **Timestamps**: Auto-tracks creation/update times

**Why This Structure?**
- Flexible: Can add fields later
- Validated: Required fields enforced
- Organized: Tags and flags for user organization
- Tracked: Timestamps for sorting/filtering

---

## 5. API ENDPOINTS - DETAILED BREAKDOWN

### RESTful API Principles

**REST = Representational State Transfer**
- Uses standard HTTP methods
- Stateless (each request independent)
- Resource-based URLs
- JSON data format

### Endpoint Categories

#### Category 1: CRUD Operations (Database)

##### GET /api - Read All
```javascript
app.get('/api', async (req, res) => {
  const articles = await Article.find().sort({ publishedDate: -1 });
  res.json(articles);
});
```

**What Happens:**
1. Receives GET request
2. Queries MongoDB for all articles
3. Sorts by date (newest first)
4. Returns JSON array

**MongoDB Query:**
- `Article.find()` - Get all documents
- `.sort({ publishedDate: -1 })` - Sort descending

**Response:**
```json
[
  {
    "_id": "...",
    "title": "Article Title",
    "author": "John Doe",
    ...
  }
]
```

---

##### GET /api/:id - Read One
```javascript
app.get('/api/:id', async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    return res.status(404).json({ error: 'Article not found' });
  }
  res.json(article);
});
```

**URL Parameters:**
- `:id` is a route parameter
- Accessed via `req.params.id`
- Example: `/api/507f1f77bcf86cd799439011`

**Error Handling:**
- Checks if article exists
- Returns 404 if not found
- Proper HTTP status codes

---

##### POST /api - Create
```javascript
app.post('/api', async (req, res) => {
  const article = new Article(req.body);
  await article.save();
  res.status(201).json(article);
});
```

**Request Flow:**
1. Client sends POST with JSON body
2. Server creates new Article instance
3. Mongoose validates against schema
4. Saves to database
5. Returns created article

**Request Body:**
```json
{
  "title": "New Article",
  "source": "Tech News",
  "publishedDate": "2024-12-06",
  "description": "Article description",
  "url": "https://example.com",
  "category": "technology"
}
```

**Validation:**
- Required fields checked automatically
- Type validation
- Returns 400 if validation fails

---

##### PUT /api/:id - Update
```javascript
app.put('/api/:id', async (req, res) => {
  const article = await Article.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  res.json(article);
});
```

**Update Options:**
- `new: true` - Returns updated document (not old one)
- `runValidators: true` - Validates updated data

**Use Cases:**
- Edit article notes
- Change favorite status
- Update tags
- Modify category

---

##### DELETE /api/:id - Delete
```javascript
app.delete('/api/:id', async (req, res) => {
  const article = await Article.findByIdAndDelete(req.params.id);
  res.json({ message: 'Article deleted successfully', article });
});
```

**Permanent Deletion:**
- Removes from database
- Cannot be undone
- Returns deleted article for confirmation

---

#### Category 2: Search Operations

##### GET /api/search/:query - Search Database
```javascript
app.get('/api/search/:query', async (req, res) => {
  const articles = await Article.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { category: { $regex: query, $options: 'i' } },
      { author: { $regex: query, $options: 'i' } }
    ]
  });
  res.json(articles);
});
```

**MongoDB Operators Explained:**

**$or**: Logical OR - matches if ANY condition is true
```javascript
$or: [
  { field1: condition1 },
  { field2: condition2 }
]
```

**$regex**: Pattern matching (like SQL LIKE)
```javascript
{ title: { $regex: query, $options: 'i' } }
```
- `query` is the search term
- `$options: 'i'` makes it case-insensitive

**Search Fields:**
- Title
- Description
- Category
- Author

**Example:**
- Search: "technology"
- Matches: Articles with "technology" in title, description, category, or author

---

#### Category 3: External API Integration

##### GET /api/news/headlines - NewsAPI Headlines
```javascript
app.get('/api/news/headlines', async (req, res) => {
  const { category = 'general', country = 'us', pageSize = 20 } = req.query;
  
  const url = `${NEWS_API_BASE}/top-headlines?country=${country}&category=${category}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;
  
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
});
```

**Query Parameters:**
- `req.query` contains URL query string
- Example: `/api/news/headlines?category=technology&country=us`
- Default values if not provided

**Why Proxy?**
1. **Security**: Hides API key from frontend
2. **Control**: Can add caching, rate limiting
3. **Consistency**: Single API endpoint
4. **Error Handling**: Centralized error management

**Request Flow:**
1. Client → Backend: `/api/news/headlines?category=tech`
2. Backend → NewsAPI: `https://newsapi.org/v2/top-headlines?...&apiKey=...`
3. NewsAPI → Backend: JSON response
4. Backend → Client: JSON response

---

##### GET /api/news/search - Search NewsAPI
```javascript
app.get('/api/news/search', async (req, res) => {
  const { q, category, language = 'en', sortBy = 'publishedAt', pageSize = 20 } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Search query is required' });
  }
  
  let url = `${NEWS_API_BASE}/everything?q=${encodeURIComponent(q)}&...`;
  
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
});
```

**Input Validation:**
- Checks if `q` (query) parameter exists
- Returns 400 (Bad Request) if missing
- Prevents invalid API calls

**URL Encoding:**
- `encodeURIComponent(q)` - Encodes special characters
- Example: "AI & ML" → "AI%20%26%20ML"

**Conditional Parameters:**
```javascript
if (category) {
  url += `&category=${category}`;
}
```
Only adds category if provided.

---

##### GET /api/news/category/:category - Category News
```javascript
app.get('/api/news/category/:category', async (req, res) => {
  const { category } = req.params;
  const { pageSize = 20 } = req.query;
  
  const url = `${NEWS_API_BASE}/top-headlines?category=${category}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;
  
  const response = await fetch(url);
  const data = await response.json();
  res.json(data);
});
```

**Route Parameters vs Query Parameters:**
- `:category` - Route parameter (part of URL path)
- `?pageSize=20` - Query parameter (after `?`)

**Example:**
- URL: `/api/news/category/technology?pageSize=10`
- `req.params.category` = "technology"
- `req.query.pageSize` = "10"

---

## 6. ERROR HANDLING

### Try-Catch Pattern
```javascript
try {
  // Database operation
  const articles = await Article.find();
  res.json(articles);
} catch (error) {
  res.status(500).json({ error: error.message });
}
```

**Why Try-Catch?**
- Prevents server crashes
- Provides meaningful error messages
- Proper HTTP status codes

### HTTP Status Codes
- **200 OK**: Success
- **201 Created**: Resource created (POST)
- **400 Bad Request**: Invalid input
- **404 Not Found**: Resource doesn't exist
- **500 Internal Server Error**: Server error

### Error Response Format
```json
{
  "error": "Error message here"
}
```

Consistent format for frontend error handling.

---

## 7. SECURITY CONSIDERATIONS

### CORS Configuration
```javascript
app.use(cors({
  origin: '*',  // Allows all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**CORS Explained:**
- **Cross-Origin Resource Sharing**
- Allows frontend (different domain) to access API
- `origin: '*'` - Allows all domains (OK for public API)
- In production: Specify exact frontend domains

**Why Needed?**
- Frontend: `https://your-site.netlify.app`
- Backend: `http://13.59.253.82:3000`
- Different origins → CORS required

### Environment Variables
```javascript
const MONGODB_URI = process.env.MONGODB_URI || 'default';
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'default';
```

**Security Benefits:**
- API keys not in code
- Different configs for dev/production
- Not committed to Git

---

## 8. SERVER CONFIGURATION

### Port Binding
```javascript
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Why `0.0.0.0`?**
- `0.0.0.0` = Listen on all network interfaces
- Allows external connections
- Required for cloud deployment

**Common Mistake:**
```javascript
app.listen(PORT);  // Only listens on localhost
// Won't accept external connections!
```

---

## 9. STATIC FILE SERVING

### Portfolio Route
```javascript
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

**Static Files:**
- Serves files from `public/` directory
- CSS, images, HTML
- Accessible at root URL

**path.join():**
- Cross-platform path handling
- Works on Windows, Mac, Linux

---

## 10. KEY CONCEPTS FOR PRESENTATION

### RESTful API Design
- **GET**: Retrieve data
- **POST**: Create new resource
- **PUT**: Update existing resource
- **DELETE**: Remove resource

### Async/Await
- All database operations are asynchronous
- `await` waits for operation to complete
- Prevents blocking the server

### MongoDB Operations
- **find()**: Get multiple documents
- **findById()**: Get single document
- **save()**: Create new document
- **findByIdAndUpdate()**: Update document
- **findByIdAndDelete()**: Remove document

### Error Handling Strategy
- Try-catch on all async operations
- Proper HTTP status codes
- Meaningful error messages
- Server doesn't crash on errors

---

## PRESENTATION TIPS

### When Explaining Backend:

1. **Start with Architecture**
   - Show the big picture
   - Explain separation of concerns

2. **Explain Each Endpoint**
   - What it does
   - How it works
   - Why it's needed

3. **Show Code Examples**
   - Highlight key parts
   - Explain syntax
   - Discuss design decisions

4. **Demonstrate Flow**
   - Request → Processing → Response
   - Database operations
   - External API calls

5. **Discuss Challenges**
   - CORS issues
   - Error handling
   - Security considerations

### Key Points to Emphasize:
- ✅ RESTful API design
- ✅ Proper error handling
- ✅ Security (CORS, env variables)
- ✅ Database schema design
- ✅ External API integration
- ✅ Production-ready deployment

---

**Good luck with your presentation! 🚀**

