# IngeniumUA Hub - Frontend

This repository contains the frontend Angular project for the IngeniumUA (https://ingeniumua.be) website.

## Development setup

### Prerequisites
- Node v18 or higher
- npm

### Installation
1. Clone the repository
2. Run `npm install` to install the dependencies
3. Copy the `src/environments/environment.ts.example` file to `src/environments/environment.ts` and fill in the necessary values. This file is in a `.gitignore` so it won't (and shouldn't) be commited to the repository.

### Running the project
You can run `npm run watch` to start the development server. The application will be available at `http://localhost:4200/` and it will automatically reload if you change any of the source files.

### Linter
You can run `npm run lint` to lint the project.


## Building

- Staging: `npm run build:staging`
- Production: `npm run build`
