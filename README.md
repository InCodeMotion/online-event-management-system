# EventConnect

**Find Your Crowd. Feel the Moment.**

EventConnect is a college software engineering project for discovering events, booking tickets, and presenting QR entry passes.

## Run the website

Requirements: Node.js and Bun.

```sh
git clone <repository-url>
cd <repository-folder>
bun install
bun run dev
```

The current website preview uses sample events and browser storage for its demo sign-in and bookings. It does not yet connect to the Java service.

## Java backend

The separate `eventconnect-backend.zip` source package contains the Java 21, Spring Boot, JDBC, and MySQL backend, including setup instructions and tests. Unzip it beside this README and follow its `README.md` to run the service locally.
