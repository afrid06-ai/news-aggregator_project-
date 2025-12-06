# Backend Development Process - Step by Step

## How I Built the Backend from Scratch

This guide explains the complete development process, from initial setup to production deployment.

---

## PHASE 1: PLANNING & SETUP (30 minutes)

### Step 1: Define Requirements

**What do we need?**
- API to manage articles (CRUD operations)
- Integration with NewsAPI for live news
- Database to store saved articles
- Serve portfolio website
- Handle CORS for frontend communication

### Step 2: Choose Technologies

**Why Node.js + Express?**
- JavaScript everywhere (frontend + backend)
- Fast development
- Large ecosystem
- Easy to learn

**Why MongoDB?**
- Flexible schema (articles can have different fields)
- NoSQL (easier for this use case)
- Cloud-hosted (MongoDB Atlas)
- Free tier available

**Why Mongoose?**
- Object modeling for MongoDB
- Schema validation
- Easy queries
- Built-in validation

### Step 3: Initialize Project

```bash
# Create project directory
mkdir Afrid_shaik_node
cd Afrid_shaik_node

# Initialize npm project
npm init -y

# Install dependencies
npm install express mongoose cors

# Install dev dependencies (for auto-restart during development)
npm install --save-dev nodemon
```

**What each package does:**
- `express`: Web framework
- `mongoose`: MongoDB object modeling
- `cors`: Cross-origin resource sharing
- `nodemon`: Auto-restarts server on file changes

### Step 4: Project Structure

```
Afrid_shaik_node/
├── server.js          # Main server file
├── package.json       # Dependencies
├── .env              # Environment variables (not in Git)
├── public/           # Static files (portfolio)
│   ├── index.html
│   ├── styles.css
│   └── images/
└── .gitignore        # Files to exclude from Git
```

---

## PHASE 2: BASIC SERVER SETUP (1 hour)

### Step 1: Create Basic Server

**File: `server.js`**

```javascript
// Step 1: Import required modules
const express = require('express');
const app = express();

// Step 2: Basic route to test server
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Step 3: Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Test it:**
```bash
node server.js
# Visit http://localhost:3000
# Should see "Server is running!"
```

### Step 2: Add Middleware

```javascript
const express = require('express');
const cors = require('cors');

const app = express();

// Middleware: Enable CORS (allows frontend to access API)
app.use(cors());

// Middleware: Parse JSON request bodies
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**Why middleware order matters:**
1. CORS first - handles preflight requests
2. JSON parser second - parses request bodies
3. Routes last - handles actual requests

### Step 3: Add Package.json Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

**Usage:**
```bash
npm run dev  # Development (auto-restart)
npm start    # Production
```

---

## PHASE 3: DATABASE SETUP (1 hour)

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (free tier)
4. Get connection string

### Step 2: Connect to Database

```javascript
const mongoose = require('mongoose');

// Connection string (from MongoDB Atlas)
const MONGODB_URI = 'mongodb+srv://username:password@cluster.mongodb.net/database';

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
});
```

**Why these options?**
- `useNewUrlParser`: Uses new connection string parser
- `useUnifiedTopology`: Uses new server discovery engine

### Step 3: Create Schema

**Think about what data you need:**
- Article title
- Author
- Source
- Published date
- Description
- URL
- Image URL
- Category
- Tags (multiple)
- Notes
- Read later flag
- Favorite flag

```javascript
const mongoose = require('mongoose');

// Define the schema (structure of data)
const articleSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true  // Must have a title
  },
  author: { 
    type: String, 
    default: 'Unknown'  // Default if not provided
  },
  source: { 
    type: String, 
    required: true 
  },
  publishedDate: { 
    type: Date, 
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  url: { 
    type: String, 
    required: true 
  },
  urlToImage: { 
    type: String, 
    default: '' 
  },
  category: { 
    type: String, 
    required: true 
  },
  tags: [String],  // Array of strings
  notes: { 
    type: String, 
    default: '' 
  },
  readLater: { 
    type: Boolean, 
    default: false 
  },
  favorite: { 
    type: Boolean, 
    default: false 
  }
}, { 
  timestamps: true  // Auto-adds createdAt and updatedAt
});

// Create model (collection in database)
const Article = mongoose.model('Article', articleSchema);
```

**Schema Design Process:**
1. List all fields you need
2. Decide which are required
3. Set default values
4. Choose data types
5. Add validation rules

---

## PHASE 4: BUILDING API ENDPOINTS (3-4 hours)

### Development Approach: One Endpoint at a Time

**Strategy:**
1. Build endpoint
2. Test with Postman/curl
3. Fix issues
4. Move to next endpoint

### Endpoint 1: GET /api - Get All Articles

**Start Simple:**
```javascript
app.get('/api', (req, res) => {
  res.json({ message: 'API endpoint works!' });
});
```

**Test:**
```bash
curl http://localhost:3000/api
```

**Add Database Query:**
```javascript
app.get('/api', async (req, res) => {
  try {
    const articles = await Article.find();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**Why async/await?**
- Database operations are asynchronous
- `await` waits for operation to complete
- Prevents blocking the server

**Add Sorting:**
```javascript
const articles = await Article.find()
  .sort({ publishedDate: -1 });  // Newest first
```

**Test with Data:**
1. Manually add article to database (via MongoDB Compass)
2. Test endpoint
3. Verify it returns the article

### Endpoint 2: POST /api - Save Article

**Start with Validation:**
```javascript
app.post('/api', async (req, res) => {
  try {
    // Create new article from request body
    const article = new Article(req.body);
    
    // Save to database
    await article.save();
    
    // Return created article
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

**Test with Postman:**
```json
POST http://localhost:3000/api
Content-Type: application/json

{
  "title": "Test Article",
  "source": "Test Source",
  "publishedDate": "2024-12-06",
  "description": "Test description",
  "url": "https://example.com",
  "category": "technology"
}
```

**Common Issues:**
- Missing required fields → 400 error
- Invalid date format → Validation error
- Database connection failed → 500 error

**Fix Issues:**
- Add error handling
- Validate input
- Provide helpful error messages

### Endpoint 3: GET /api/:id - Get Single Article

**Learn Route Parameters:**
```javascript
app.get('/api/:id', async (req, res) => {
  try {
    // req.params.id gets the :id from URL
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

**Test:**
```bash
# Get ID from previous GET /api response
curl http://localhost:3000/api/507f1f77bcf86cd799439011
```

### Endpoint 4: PUT /api/:id - Update Article

**Update Logic:**
```javascript
app.put('/api/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,      // Find by ID
      req.body,           // Update with request body
      { 
        new: true,        // Return updated document
        runValidators: true  // Validate updated data
      }
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

**Test:**
```json
PUT http://localhost:3000/api/507f1f77bcf86cd799439011
Content-Type: application/json

{
  "notes": "Updated notes",
  "favorite": true
}
```

### Endpoint 5: DELETE /api/:id - Delete Article

```javascript
app.delete('/api/:id', async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    
    if (!article) {
      return res.status(404).json({ error: 'Article not found' });
    }
    
    res.json({ 
      message: 'Article deleted successfully', 
      article 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

### Endpoint 6: GET /api/search/:query - Search

**Learn MongoDB Query Operators:**
```javascript
app.get('/api/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    
    // Search in multiple fields
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

**MongoDB Operators:**
- `$or`: Match any condition
- `$regex`: Pattern matching
- `$options: 'i'`: Case-insensitive

---

## PHASE 5: EXTERNAL API INTEGRATION (2 hours)

### Step 1: Get NewsAPI Key

1. Go to https://newsapi.org
2. Sign up for free account
3. Get API key

### Step 2: Create NewsAPI Endpoint

**Start Simple:**
```javascript
const NEWS_API_KEY = 'your-api-key';
const NEWS_API_BASE = 'https://newsapi.org/v2';

app.get('/api/news/headlines', async (req, res) => {
  try {
    // Build URL with query parameters
    const category = req.query.category || 'general';
    const country = req.query.country || 'us';
    const pageSize = req.query.pageSize || 20;
    
    const url = `${NEWS_API_BASE}/top-headlines?country=${country}&category=${category}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;
    
    // Fetch from external API
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

**Test:**
```bash
curl "http://localhost:3000/api/news/headlines?category=technology"
```

**Why Proxy?**
- Hides API key from frontend
- Centralized error handling
- Can add caching later

### Step 3: Add Search Endpoint

```javascript
app.get('/api/news/search', async (req, res) => {
  try {
    const { q, category, pageSize = 20 } = req.query;
    
    // Validate required parameter
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    // Build URL
    let url = `${NEWS_API_BASE}/everything?q=${encodeURIComponent(q)}&pageSize=${pageSize}&apiKey=${NEWS_API_KEY}`;
    
    // Add optional category
    if (category) {
      url += `&category=${category}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**URL Encoding:**
- `encodeURIComponent()` encodes special characters
- "AI & ML" → "AI%20%26%20ML"

---

## PHASE 6: STATIC FILES & PORTFOLIO (30 minutes)

### Step 1: Serve Static Files

```javascript
const path = require('path');

// Serve files from public directory
app.use(express.static(path.join(__dirname, 'public')));
```

### Step 2: Portfolio Route

```javascript
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

**Why path.join()?**
- Cross-platform compatibility
- Works on Windows, Mac, Linux
- Handles path separators correctly

---

## PHASE 7: ERROR HANDLING & SECURITY (1 hour)

### Step 1: Improve Error Handling

**Add to every endpoint:**
```javascript
try {
  // Operation
} catch (error) {
  // Handle error
  res.status(500).json({ error: error.message });
}
```

**Error Types:**
- Validation errors → 400
- Not found → 404
- Server errors → 500

### Step 2: Environment Variables

**Create .env file:**
```
MONGODB_URI=mongodb+srv://...
NEWS_API_KEY=your-key-here
PORT=3000
```

**Use in code:**
```javascript
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI;
const NEWS_API_KEY = process.env.NEWS_API_KEY;
const PORT = process.env.PORT || 3000;
```

**Why?**
- Security: Keys not in code
- Flexibility: Different configs for dev/prod
- Best practice: Never commit secrets

### Step 3: CORS Configuration

```javascript
app.use(cors({
  origin: '*',  // Allow all origins (or specify domains)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

**Why CORS?**
- Frontend and backend on different domains
- Browser security blocks cross-origin requests
- CORS allows specific origins

---

## PHASE 8: PRODUCTION READINESS (1 hour)

### Step 1: Port Binding for Cloud

```javascript
// OLD (only works locally)
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// NEW (works on cloud)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Server listening on 0.0.0.0:${PORT}`);
});
```

**Why 0.0.0.0?**
- Listens on all network interfaces
- Allows external connections
- Required for cloud deployment

### Step 2: Non-Blocking Database Connection

```javascript
// Start server first
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});

// Then connect to database (non-blocking)
mongoose.connect(MONGODB_URI, {...})
  .then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    console.log('Server will continue running, but database operations may fail');
  });
```

**Why?**
- Server starts even if DB connection fails
- Better error handling
- Graceful degradation

### Step 3: Process Manager (PM2)

**For production deployment:**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'news-aggregator',
    script: 'server.js',
    env: {
      MONGODB_URI: '...',
      NEWS_API_KEY: '...',
      PORT: 3000,
      NODE_ENV: 'production'
    }
  }]
};
```

**Benefits:**
- Auto-restart on crash
- Auto-start on server reboot
- Process monitoring
- Log management

---

## DEVELOPMENT WORKFLOW

### Daily Development Process

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Make Changes**
   - Edit `server.js`
   - Nodemon auto-restarts

3. **Test Endpoint**
   ```bash
   # Using curl
   curl http://localhost:3000/api
   
   # Or Postman
   # Or browser (for GET requests)
   ```

4. **Check Logs**
   - Console output
   - Error messages
   - Database connection status

5. **Iterate**
   - Fix errors
   - Add features
   - Test again

### Testing Strategy

**Manual Testing:**
- Use Postman for API testing
- Use curl for quick tests
- Use browser for GET requests

**Test Each Endpoint:**
1. Test with valid data
2. Test with invalid data
3. Test with missing data
4. Test error cases

**Example Test Flow:**
```bash
# 1. Get all articles (should be empty initially)
curl http://localhost:3000/api

# 2. Create article
curl -X POST http://localhost:3000/api \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","source":"Test","publishedDate":"2024-12-06","description":"Test","url":"https://test.com","category":"tech"}'

# 3. Get all articles (should have one now)
curl http://localhost:3000/api

# 4. Get single article (use ID from step 2)
curl http://localhost:3000/api/ARTICLE_ID

# 5. Update article
curl -X PUT http://localhost:3000/api/ARTICLE_ID \
  -H "Content-Type: application/json" \
  -d '{"notes":"Updated notes"}'

# 6. Delete article
curl -X DELETE http://localhost:3000/api/ARTICLE_ID
```

---

## COMMON ISSUES & SOLUTIONS

### Issue 1: "Cannot GET /api"
**Problem:** Route not defined or wrong path
**Solution:** Check route definition, ensure server restarted

### Issue 2: "MongoDB connection timeout"
**Problem:** Network access not configured
**Solution:** Add IP to MongoDB Atlas whitelist

### Issue 3: "CORS error"
**Problem:** CORS not configured
**Solution:** Add `app.use(cors())`

### Issue 4: "Cannot read property of undefined"
**Problem:** Missing request body or wrong field name
**Solution:** Check request body, verify field names

### Issue 5: "Port already in use"
**Problem:** Another process using port 3000
**Solution:** Change PORT or kill existing process

---

## LEARNING RESOURCES

### Concepts to Learn

1. **RESTful APIs**
   - HTTP methods (GET, POST, PUT, DELETE)
   - Status codes
   - Resource-based URLs

2. **MongoDB**
   - Documents and collections
   - Queries and operators
   - Schema design

3. **Express.js**
   - Middleware
   - Routing
   - Request/response handling

4. **Async/Await**
   - Promises
   - Error handling
   - Non-blocking operations

### Practice Exercises

1. **Add New Endpoint**
   - Create endpoint to get articles by category
   - Add pagination
   - Add filtering

2. **Improve Error Handling**
   - Custom error messages
   - Error logging
   - User-friendly errors

3. **Add Validation**
   - Validate email format
   - Validate date format
   - Custom validators

---

## SUMMARY: DEVELOPMENT TIMELINE

**Total Time: ~10-12 hours**

- Planning & Setup: 30 min
- Basic Server: 1 hour
- Database Setup: 1 hour
- API Endpoints: 3-4 hours
- External API: 2 hours
- Static Files: 30 min
- Error Handling: 1 hour
- Production Ready: 1 hour
- Testing & Debugging: 1-2 hours

**Key Takeaways:**
1. Start simple, add complexity gradually
2. Test each endpoint before moving on
3. Handle errors from the beginning
4. Use environment variables for secrets
5. Plan for production from the start

---

**This is how I built the backend step by step! 🚀**

