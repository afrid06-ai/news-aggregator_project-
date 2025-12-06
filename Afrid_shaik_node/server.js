const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://ashai49_db_user:i0lqsmLgazKi705n@cluster0.lopjrc9.mongodb.net/projectdb?retryWrites=true&w=majority';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.error('MongoDB connection error:', err));

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, default: 'Unknown' },
  source: { type: String, required: true },
  publishedDate: { type: Date, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  urlToImage: { type: String, default: '' },
  category: { type: String, required: true },
  tags: [String],
  notes: { type: String, default: '' },
  readLater: { type: Boolean, default: false },
  favorite: { type: Boolean, default: false }
}, { timestamps: true });

const Article = mongoose.model('Article', articleSchema);

const NEWS_API_KEY = process.env.NEWS_API_KEY || '70b2c376186d499f8a0cd40c5cd474d3';
const NEWS_API_BASE = 'https://newsapi.org/v2';

app.get('/api', async (req, res) => {
  try {
    const articles = await Article.find().sort({ publishedDate: -1 });
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

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

app.post('/api', async (req, res) => {
  try {
    const article = new Article(req.body);
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

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

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`NewsAPI Key: ${NEWS_API_KEY === 'YOUR_NEWS_API_KEY_HERE' ? 'NOT SET - Please set NEWS_API_KEY environment variable' : 'SET'}`);
});
