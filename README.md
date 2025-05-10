# BondSphere

BondSphere is a modern social travel platform that connects travelers worldwide, enabling them to find travel companions, share experiences, and plan adventures together.

![BondSphere Preview](project/public/preview.png)

## 🌟 Features

- **Travel Connect**: Create and browse travel listings
- **Community Building**: Join travel communities and connect with like-minded travelers
- **Real-time Chat**: Communicate with potential travel companions
- **Smart Matching**: Find travelers with similar interests and destinations
- **Interactive Interface**: Modern, responsive design with intuitive navigation

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/bondsphere.git
cd bondsphere/project
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

## 🛠️ Built With

- **React** - Frontend framework
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Navigation
- **Lucide Icons** - Icon pack

## 📱 Features in Detail

### Travel Connect
- Create detailed travel listings with destinations, dates, and preferences
- Search and filter travel opportunities
- Join existing travel plans
- Share travel experiences

### Community Features
- Create and join travel communities
- Participate in community discussions
- Share photos and updates
- Organize community events

## 🤝 Contributing

We welcome contributions to BondSphere! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Anima](https://animaapp.com/) - For the initial project setup
- [Unsplash](https://unsplash.com) - For the beautiful images
- [TailwindCSS](https://tailwindcss.com) - For the awesome styling framework
- [Lucide](https://lucide.dev) - For the beautiful icons

## 📧 Contact

For any questions or suggestions, please reach out at:
- Email: Jaswanth2jaswanth@gmail.com

---

Made with ❤️ by Jaswanth Chappidi



# BondSphere Backend

This is the backend API for the BondSphere application, built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Setup

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bondsphere
   JWT_SECRET=your_jwt_secret_key_here
   FRONTEND_URL=http://localhost:5173
   NODE_ENV=development
   ```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user (requires authentication)

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── services/       # Business logic
│   ├── utils/          # Utility functions
│   └── server.js       # Main application file
├── .env               # Environment variables
├── package.json       # Project dependencies
└── README.md         # Project documentation
```

## Features

- User authentication with JWT
- Real-time communication with Socket.IO
- MongoDB database integration
- RESTful API design
- Security middleware (helmet, cors)
- Request validation
- Error handling

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request 
