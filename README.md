# Realtor Clone Project

This project is a realtor clone application that allows users to browse and search for properties, view property details, and use authentication to sign in or sign up. The application utilizes Firebase services for authentication, database, and storage, and it integrates with the OpenCage API to view maps and locations.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Technologies](#technologies)
- [Contributing](#contributing)
- [License](#license)

## Features

- User authentication: Users can sign in or sign up using google OAuth provided by firebase to access personalized features.
- Property Listings: Browse and search for available properties with details.
- Property Details: View detailed information about each property, including images and location on the map.
- Firebase Integration: Utilizes Firebase for authentication, database, and storage services.
- OpenCage API: Uses the OpenCage API to display maps and location information.

## Getting Started

### Prerequisites

- Node.js: Make sure you have Node.js installed on your machine. You can download it from the official website: [Node.js](https://nodejs.org/).

### Installation

1. Clone the repository:

```
git clone https://github.com/your-username/realtor-clone.git
```

2. Navigate to the project directory:

```
cd realtor-clone
```

3. Install dependencies:

```
npm install
```

## Usage

1. Set up Firebase: Create a Firebase project and set up authentication, database, and storage services. Update the Firebase configuration in the project to connect to your Firebase project.

2. Obtain OpenCage API Key: Sign up for an API key from OpenCage API and update the API key in the project to access map data.

3. Start the development server:

```
npm start
```

4. Open your web browser and go to `http://localhost:3000` to access the application.

## Technologies

- React: Frontend library for building user interfaces.
- Firebase: Backend-as-a-Service (BaaS) for authentication, database, and storage services.
- OpenCage API: Geocoding API for maps and location information.

## Contributing

Contributions are welcome! If you find any issues or have suggestions for improvements, please open an issue or create a pull request.

## License

This project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute it as per the terms of the license.
