# Mini-Token-Exchange

Mini-Token-Exchange is a simplified cryptocurrency exchange backend built with Node.js, TypeScript, Express, TypeORM, and PostgreSQL. It supports basic order operations such as create, execute, cancel, and filter orders. The project follows a clean architecture with domain, application, and infrastructure layers.


## Setup Instructions

#### 1. Clone the repository:

```bash
git clone https://github.com/yaldamahmoodi/Mini-Token-Exchange.git
```
#### 2. Install dependencies:
````
npm install
````
#### 3.Configure environment variables by creating a .env file in the root:

DB_HOST=localhost
DB_PORT=5432
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=mini_token_exchange
PORT=3000

#### 4.Run the application in development mode:
````
npm run dev
````

#### 5.To run tests:

````
npm test
````
The server will start on http://localhost:3000.

## Architecture Summary

- Domain Layer: Contains core business logic, entities, and domain errors.
- Application Layer: Use cases that orchestrate business logic with infrastructure.
- Infrastructure Layer: Database repositories, data sources, and external services (like MockBroker).
- Presentation Layer: Express controllers handling HTTP requests and DTO validation with zod.
- Routing: RESTful API endpoints under /orders for creating, executing, canceling, and querying orders.
- Event Handling: Simple publish-subscribe simulation using MockBroker.
- Testing: Includes unit tests for use cases and integration tests for end-to-end API verification.

## Design Trade-Offs

- synchronize: true in TypeORM is used for local development convenience but should be disabled in production to avoid accidental schema changes.
- MockBroker simulates event publishing but does not provide real message queue persistence, chosen for simplicity and faster testing.
- Input validation uses zod for type-safe and runtime checks, ensuring stable API behavior.
- Rate limiting and advanced security measures are not implemented to focus on core functional requirements; these should be added for production readiness.
- The architecture prioritizes clean separation of concerns (Domain, Application, Infrastructure), modularity, and SOLID principles, allowing easy extension of features like adding more entities or services.

