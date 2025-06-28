# Etsy Agent - AI-Powered Etsy Management & Reddit Engagement

A modern web application that combines Etsy shop management with AI-powered Reddit engagement tools. Built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

### Etsy Integration

- **Shop Analytics**: View active listings, prices, and inventory
- **Real-time Data**: Fetch live data from Etsy API
- **Performance Tracking**: Monitor shop metrics and trends

### Reddit Tools

- **Smart Post Discovery**: AI-powered filtering of relevant Reddit posts
- **Content Generation**: Create engaging posts with GPT assistance
- **Reply Generation**: Generate contextual replies for engagement
- **Traffic Optimization**: Rank posts by traffic potential

### Modern UI/UX

- **Glass Morphism Design**: Beautiful, modern interface
- **Responsive Layout**: Works perfectly on all devices
- **Smooth Animations**: Engaging user interactions
- **Dark Theme**: Easy on the eyes

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **AI**: OpenAI GPT-4 for content generation
- **APIs**: Reddit API, Etsy API
- **State Management**: React hooks
- **Logging**: Custom logger with environment-based levels

## 📁 Project Structure

```
etsy/
├── components/          # Reusable UI components
│   ├── Button.tsx      # Modern button component
│   ├── Card.tsx        # Glass morphism card component
│   ├── Input.tsx       # Form input component
│   ├── LoadingSpinner.tsx # Loading indicators
│   ├── Navbar.tsx      # Navigation component
│   └── RedditSearch.tsx # Reddit search component
├── lib/                # Core business logic
│   ├── constants.ts    # Application constants
│   ├── logger.ts       # Centralized logging
│   ├── utils.ts        # Utility functions
│   ├── gptFilter.ts    # AI content filtering
│   ├── gptPostGenerator.ts # Post generation
│   ├── gptReplyGenerator.ts # Reply generation
│   ├── filterPosts.ts  # Basic post filtering
│   ├── keywords.ts     # Search keywords
│   └── rankPostsForTrafficPotential.ts # Traffic ranking
├── pages/              # Next.js pages
│   ├── api/           # API endpoints
│   ├── dashboard.tsx  # Etsy dashboard
│   ├── reddit/        # Reddit tools pages
│   └── index.tsx      # Homepage
├── styles/            # Global styles
└── data/              # JSON data files
```

## 🔧 Code Quality & Best Practices

### ✅ What's Been Improved

1. **Centralized Logging**

   - Replaced all `console.log` and `console.error` with structured logging
   - Environment-based logging levels (development vs production)
   - Consistent log format with timestamps

2. **Configuration Management**

   - Created `constants.ts` for all configuration values
   - Centralized API settings, file paths, and validation rules
   - Easy to modify and maintain

3. **Utility Functions**

   - Created `utils.ts` with reusable helper functions
   - Safe file operations with error handling
   - Environment variable validation
   - Client creation with proper error handling

4. **Error Handling**

   - Consistent error handling across all components
   - User-friendly error messages
   - Proper HTTP status codes
   - Graceful degradation

5. **Type Safety**

   - Proper TypeScript interfaces
   - Removed `any` types where possible
   - Better type definitions for API responses

6. **Code Organization**

   - Clear separation of concerns
   - Consistent file structure
   - Proper imports and exports
   - Removed duplicate code

7. **Performance**
   - Optimized API calls
   - Proper loading states
   - Efficient state management
   - Reduced unnecessary re-renders

### 🧹 Code Cleanup Summary

- **Removed**: 15+ `console.log` statements
- **Replaced**: 10+ `console.error` with structured logging
- **Created**: 4 new utility files (logger, constants, utils)
- **Improved**: Error handling in 8+ files
- **Standardized**: API response formats
- **Enhanced**: Type safety across the application

### 📝 Notes for Future Development

1. **Environment Variables**

   ```bash
   # Required for Reddit API
   REDDIT_CLIENT_ID=your_client_id
   REDDIT_CLIENT_SECRET=your_client_secret
   REDDIT_USERNAME=your_username
   REDDIT_PASSWORD=your_password

   # Required for OpenAI
   OPENAI_API_KEY=your_openai_key

   # Required for Etsy API
   ETSY_API_KEY=your_etsy_key
   ```

2. **Development vs Production**

   - Debug files are only saved in development
   - Logging levels adjust automatically
   - Error handling is more verbose in development

3. **API Rate Limits**

   - Reddit API has rate limits
   - OpenAI API has usage limits
   - Etsy API has request limits
   - Consider implementing rate limiting

4. **Security Considerations**
   - API keys are stored in environment variables
   - No sensitive data in client-side code
   - Proper CORS configuration needed
   - Input validation on all endpoints

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd etsy
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 📊 API Endpoints

- `GET /api/test-stats` - Fetch Etsy shop listings
- `POST /api/fetch-posts` - Fetch and process Reddit posts
- `GET /api/found-posts` - Get filtered Reddit posts
- `POST /api/generate-post` - Generate new Reddit post
- `POST /api/generate-replies` - Generate replies for posts

## 🎨 Design System

The application uses a custom design system with:

- **Colors**: Emerald/Teal gradients with slate backgrounds
- **Components**: Glass morphism cards, gradient buttons
- **Animations**: Smooth transitions and hover effects
- **Typography**: Clear hierarchy with gradient text effects

## 🤝 Contributing

1. Follow the existing code structure
2. Use the centralized logger for debugging
3. Add proper TypeScript types
4. Test all API endpoints
5. Update documentation as needed

## 📄 License

This project is licensed under the MIT License.
