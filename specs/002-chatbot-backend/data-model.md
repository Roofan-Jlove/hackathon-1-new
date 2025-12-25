# Data Model: Backend User Profile

This document defines the database schema for storing user information in the Neon Serverless Postgres database.

## `users` Table

This table stores profile information for registered users. Authentication details (like passwords) are managed by `better-auth.com` and are not stored in this table.

-   **`id`**: `UUID`, Primary Key. The unique identifier for the user. This should correspond to the user ID provided by `better-auth.com`.
-   **`email`**: `VARCHAR(255)`, Unique, Not Null. The user's email address.
-   **`created_at`**: `TIMESTAMP WITH TIME ZONE`, Not Null, Default `now()`.
-   **`software_background`**: `JSONB`. A JSON object to store the user's self-reported software background.
    -   *Example*: `{"python": "intermediate", "ros2": "beginner", "cpp": "none"}`
-   **`hardware_background`**: `JSONB`. A JSON object to store the user's self-reported hardware background.
    -   *Example*: `{"jetson": "none", "rtx_gpu": "experienced"}`

### Example SQL `CREATE TABLE` Statement:

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    software_background JSONB,
    hardware_background JSONB
);
```
