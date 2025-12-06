const mongoose = require('mongoose');

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://ashai49_db_user:i0lqsmLgazKi705n@cluster0.lopjrc9.mongodb.net/projectdb?retryWrites=true&w=majority';

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

const sampleArticles = [
  {
    title: 'AI Revolution: How Machine Learning is Transforming Healthcare',
    author: 'Sarah Johnson',
    source: 'Tech News Daily',
    publishedDate: new Date('2024-12-15'),
    description: 'Machine learning algorithms are revolutionizing medical diagnosis and treatment, with new AI systems achieving 95% accuracy in detecting early-stage diseases.',
    url: 'https://example.com/ai-healthcare',
    urlToImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
    category: 'technology',
    tags: ['AI', 'Healthcare', 'Machine Learning'],
    notes: 'Interesting read about AI in medicine',
    readLater: true,
    favorite: true
  },
  {
    title: 'Climate Summit 2024: Nations Commit to Net Zero by 2050',
    author: 'Michael Chen',
    source: 'Global Environment News',
    publishedDate: new Date('2024-12-14'),
    description: 'World leaders have reached a historic agreement to achieve net-zero carbon emissions by 2050, with major investments in renewable energy.',
    url: 'https://example.com/climate-summit',
    urlToImage: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800',
    category: 'environment',
    tags: ['Climate', 'Environment', 'Politics'],
    notes: '',
    readLater: false,
    favorite: true
  },
  {
    title: 'SpaceX Launches Record-Breaking Mission to Mars',
    author: 'David Martinez',
    source: 'Space Exploration Weekly',
    publishedDate: new Date('2024-12-13'),
    description: 'SpaceX successfully launched its largest mission to Mars, carrying supplies and equipment for the first human colony on the red planet.',
    url: 'https://example.com/spacex-mars',
    urlToImage: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800',
    category: 'science',
    tags: ['Space', 'Mars', 'SpaceX'],
    notes: 'Follow up on this story',
    readLater: true,
    favorite: false
  },
  {
    title: 'Tech Giants Announce New Privacy Regulations',
    author: 'Emily Watson',
    source: 'Digital Privacy Today',
    publishedDate: new Date('2024-12-12'),
    description: 'Major technology companies have agreed to implement stricter privacy controls, giving users more control over their personal data.',
    url: 'https://example.com/privacy-regulations',
    urlToImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800',
    category: 'technology',
    tags: ['Privacy', 'Technology', 'Regulation'],
    notes: '',
    readLater: false,
    favorite: false
  },
  {
    title: 'Olympic Games 2024: Record-Breaking Performances',
    author: 'James Anderson',
    source: 'Sports World',
    publishedDate: new Date('2024-12-11'),
    description: 'Athletes from around the world set new records at the 2024 Olympic Games, with unprecedented achievements in swimming and track events.',
    url: 'https://example.com/olympics-2024',
    urlToImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
    category: 'sports',
    tags: ['Olympics', 'Sports', 'Records'],
    notes: 'Amazing performances!',
    readLater: true,
    favorite: true
  },
  {
    title: 'Global Economy Shows Strong Recovery Signs',
    author: 'Robert Kim',
    source: 'Financial Times',
    publishedDate: new Date('2024-12-10'),
    description: 'Economic indicators point to a robust recovery, with GDP growth exceeding expectations and unemployment rates at historic lows.',
    url: 'https://example.com/economy-recovery',
    urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    category: 'business',
    tags: ['Economy', 'Business', 'Finance'],
    notes: '',
    readLater: false,
    favorite: false
  },
  {
    title: 'New Breakthrough in Quantum Computing',
    author: 'Lisa Park',
    source: 'Science Journal',
    publishedDate: new Date('2024-12-09'),
    description: 'Researchers have achieved a major milestone in quantum computing, solving complex problems 1000x faster than classical computers.',
    url: 'https://example.com/quantum-computing',
    urlToImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
    category: 'science',
    tags: ['Quantum Computing', 'Science', 'Technology'],
    notes: 'Very technical but important',
    readLater: true,
    favorite: true
  },
  {
    title: 'Renewable Energy Reaches 50% of Global Power Generation',
    author: 'Thomas Brown',
    source: 'Energy Today',
    publishedDate: new Date('2024-12-08'),
    description: 'For the first time in history, renewable energy sources account for more than half of global electricity generation.',
    url: 'https://example.com/renewable-energy',
    urlToImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800',
    category: 'environment',
    tags: ['Renewable Energy', 'Environment', 'Sustainability'],
    notes: '',
    readLater: false,
    favorite: false
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    await Article.deleteMany({});
    console.log('Cleared existing articles');

    const inserted = await Article.insertMany(sampleArticles);
    console.log(`Successfully seeded ${inserted.length} articles`);

    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
