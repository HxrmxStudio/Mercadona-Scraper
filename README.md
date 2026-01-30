# 🛒 Mercadona Product Scraper

Extrae todos los productos de Mercadona para actualizar precios en tu sistema.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/mercadona-scraper)

## Features

- **Extracción completa** - Obtiene todos los productos de todas las categorías
- **Filtro por categoría** - Extrae solo las categorías que necesites
- **Disponibilidad regional** - Usa código postal para verificar disponibilidad
- **Exportación CSV** - Descarga los datos en formato CSV para Excel
- **Interfaz moderna** - UI responsive y fácil de usar

## Quick Start

### Option 1: Deploy to Vercel (Recommended)

1. Click the "Deploy with Vercel" button above
2. Connect your GitHub account
3. Click Deploy
4. Done! Access your app at `https://your-app.vercel.app`

### Option 2: Run Locally

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/mercadona-scraper.git
cd mercadona-scraper

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
mercadona-scraper/
├── api/                      # Vercel Serverless Functions
│   └── mercadona/
│       └── index.js          # API proxy to avoid CORS
│
├── public/                   # Static files
│   ├── index.html            # Main HTML
│   ├── css/
│   │   └── styles.css        # Styles
│   └── js/
│       ├── main.js           # App entry point
│       ├── api.js            # API service
│       ├── state.js          # State management
│       ├── ui.js             # DOM manipulation
│       └── export.js         # CSV export
│
├── package.json
├── vercel.json               # Vercel configuration
└── README.md
```

## Scripts

```bash
npm run dev        # Start development server
npm run lint       # Run ESLint
npm run lint:fix   # Fix linting errors
npm run typecheck  # Run TypeScript type checking
```

## How It Works

1. **User enters postal code** - Used for regional availability
2. **Clicks "Iniciar Extracción"** - Starts the scraping process
3. **API calls are proxied** - Through Vercel serverless function to avoid CORS
4. **Products are displayed** - In real-time as they're extracted
5. **Export to CSV** - Download all products for use in other systems

## API Proxy

The app uses a serverless function (`/api/mercadona/*`) to proxy requests to Mercadona's API. This avoids CORS issues and doesn't rely on third-party CORS proxies.

## Tech Stack

- **Frontend**: Vanilla JavaScript (ES Modules)
- **Backend**: Vercel Serverless Functions
- **Styling**: CSS3 with modern features
- **Type Checking**: TypeScript (JSDoc annotations)
- **Linting**: ESLint

## License

MIT
