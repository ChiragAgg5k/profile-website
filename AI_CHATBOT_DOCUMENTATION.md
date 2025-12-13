# AI Portfolio Assistant Chatbot

This feature adds an intelligent AI-powered chatbot to the portfolio website, similar to the one implemented in [Rahul's Portfolio](https://rahul4112.me).

## Features

✨ **Real-time AI Conversations**: Powered by Groq's LLaMA 3.2 3B Instant model
🎨 **Beautiful UI**: Floating chat button with smooth animations
📱 **Responsive Design**: Works seamlessly on mobile and desktop
💬 **Context-Aware**: Trained on portfolio data including skills, projects, education, and experience
🚀 **Fast Responses**: Lightning-fast responses using Groq API

## What's Added

### 1. API Route (`src/app/api/chat/route.ts`)

- Handles POST requests from the chatbot UI
- Uses Groq SDK with LLaMA 3.2 3B Instant model
- Contains comprehensive portfolio context about Chirag Aggarwal
- Includes error handling and validation

### 2. Chatbot Component (`src/components/ai-chatbot.tsx`)

- Floating chat button in bottom-right corner
- Expandable chat window with messages
- Real-time message streaming
- Loading states and error handling
- Keyboard shortcuts (Enter to send)

### 3. Layout Integration (`src/app/layout.tsx`)

- Chatbot component added to the root layout
- Available on all pages of the website

### 4. Environment Configuration

- Added `GROQ_API_KEY` to `.env.local`
- Updated `.env.example` with new variable

## Installation & Setup

### Prerequisites

- Node.js 18+ or Bun
- Next.js 15+
- Groq API Key

### Steps

1. **Install Dependencies**

```bash
npm install groq-sdk
# or
bun add groq-sdk
```

2. **Configure Environment Variables**

Create or update `.env.local`:

```env
GROQ_API_KEY=your_groq_api_key_here
```

> **Note**: Get your free Groq API key from [console.groq.com](https://console.groq.com)

3. **Start Development Server**

```bash
npm run dev
# or
bun dev
```

4. **Test the Chatbot**

- Open `http://localhost:3000`
- Click the floating chat button in the bottom-right corner
- Ask questions about Chirag's skills, projects, or experience

## Usage

The chatbot can answer questions about:

- **Skills & Technologies**: Next.js, TypeScript, Node.js, Python, Docker, Kubernetes, etc.
- **Work Experience**:
  - Appwrite (Platform Engineer)
  - Skillarena (Backend Developer)
  - Clearmind AI (Fullstack Developer)
- **Projects**:
  - Prabhawatt (Solar energy management)
  - Cal Buddy (AI calendar assistant)
  - BU News (Android app)
  - Asclepius (Desktop app)
- **Education**: Bennett University, CGPA 9.71
- **Achievements**: Hackathons, Summer Immersion in Vietnam, GitHub Constellation
- **Contact Information**: Email, phone, social links

## Example Questions

Try asking:

- "What are Chirag's main skills?"
- "Tell me about his work experience at Appwrite"
- "What projects has he built?"
- "What is his educational background?"
- "How can I contact Chirag?"

## Technical Details

### Model Configuration

- **Model**: `llama-3.2-3b-preview` (LLaMA 3.2 3B Instant)
- **Temperature**: 0.7 (balanced between creativity and accuracy)
- **Max Tokens**: 1024
- **Provider**: Groq API

### API Endpoint

- **URL**: `/api/chat`
- **Method**: POST
- **Request Body**: `{ message: string }`
- **Response**: `{ response: string }` or `{ error: string }`

### Component Structure

```text
src/
├── app/
│   └── api/
│       └── chat/
│           └── route.ts          # API route handler
└── components/
    └── ai-chatbot.tsx            # Chatbot UI component
```

## Customization

### Updating Portfolio Context

To update the chatbot's knowledge, edit the `PORTFOLIO_CONTEXT` constant in `src/app/api/chat/route.ts`:

```typescript
const PORTFOLIO_CONTEXT = `
You are Chirag's AI Portfolio Assistant...
// Add or modify information here
`;
```

### Styling

The chatbot uses Tailwind CSS and can be customized in `src/components/ai-chatbot.tsx`. Key classes:

- `bg-primary`: Button and header background
- `bg-muted`: Message bubbles
- `rounded-lg`: Border radius
- `shadow-2xl`: Shadow effects

### Model Selection

To change the AI model, update the model name in `src/app/api/chat/route.ts`:

```typescript
model: "llama-3.2-3b-preview",  // Change to another Groq model
```

Available Groq models:

- `llama-3.2-1b-preview` (faster, less accurate)
- `llama-3.2-3b-preview` (balanced)
- `llama-3.3-70b-versatile` (slower, more accurate)
- `mixtral-8x7b-32768` (alternative)

## Troubleshooting

### API Key Not Working

- Verify the API key is correctly set in `.env.local`
- Restart the development server after adding the key
- Check Groq API dashboard for usage limits

### Chatbot Not Appearing

- Clear browser cache
- Check browser console for errors
- Ensure the component is imported in `layout.tsx`

### Slow Responses

- The model might be rate-limited
- Consider upgrading to a paid Groq plan
- Check your internet connection

## Production Deployment

Before deploying to production:

1. **Set Environment Variables**
   - Add `GROQ_API_KEY` to your hosting platform (Vercel, Netlify, etc.)

2. **Build the Application**

```bash
npm run build
# or
bun run build
```

3. **Test Production Build**

```bash
npm run serve
```

## Security Considerations

- ✅ API key is stored in environment variables (not in code)
- ✅ API route validates incoming requests
- ✅ Rate limiting handled by Groq API
- ✅ User input is sanitized before processing
- ⚠️ Consider adding rate limiting on your API route for production
- ⚠️ Monitor API usage to prevent abuse

## Credits

- **Original Implementation**: [Rahul's Portfolio](https://rahul4112.me)
- **GitHub Repository**: [Rahul4112002/Rahul-Portfolio](https://github.com/Rahul4112002/Rahul-Portfolio)
- **AI Model**: Groq LLaMA 3.2 3B Instant
- **UI Framework**: Next.js 15 + Tailwind CSS

## Contributing

To contribute improvements to this feature:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This feature is part of the portfolio website and follows the same license as the main project.

---

**Note**: This is an open-source contribution to Chirag's portfolio website, implementing the AI chatbot feature from Rahul's portfolio as requested.
