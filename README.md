# WatchTower

## To run the frontend 
- navigate to ../frontend directory in your machine and type `npm start`

## To start frontend development
- download `ES7 React/Redux/GraphQL/React-Native snippets` in your VS code.
- create .js file and type `rcfe`.

## Backend intro video
- `https://www.youtube.com/watch?v=cJveiktaOSQ&t=486s&ab_channel=PedroTech`

## Backend Structure

```
/backend/               # Main project directory
├── backend/           # Project configuration directory
│   ├── settings.py    # Project settings
│   ├── urls.py       # Main URL configuration
│   ├── wsgi.py       # WSGI configuration
│   └── asgi.py       # ASGI configuration
│
├── api/              # API application
│   ├── views.py      # API endpoint logic
│   ├── urls.py       # API route definitions
│   └── serializers.py # Data serialization
│
└── watchtower/       # Main application
    ├── models.py     # Database models
    ├── admin.py      # Admin interface config
    ├── views.py      # View logic
    └── migrations/   # Database migrations
```

- To preview api endpoints configure your .env file, enter `/backend` and run `python manage.py runserver`.
