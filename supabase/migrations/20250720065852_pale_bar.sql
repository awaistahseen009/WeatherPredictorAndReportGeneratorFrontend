/*
  # Create authentication and weather data tables

  1. New Tables
    - `users` - User authentication data with Auth.js compatibility
      - `id` (uuid, primary key)
      - `name` (text, optional)
      - `email` (text, unique, required)
      - `emailVerified` (timestamp, optional)
      - `image` (text, optional)
      - `password` (text, optional for OAuth users)
      - `created_at` (timestamp, default now)
    
    - `accounts` - OAuth account data for Auth.js
      - `id` (uuid, primary key)
      - `userId` (uuid, foreign key)
      - Provider and OAuth specific fields
    
    - `sessions` - User session management
      - `id` (uuid, primary key)
      - `sessionToken` (text, unique)
      - `userId` (uuid, foreign key)
      - `expires` (timestamp)
    
    - `verificationTokens` - Email verification tokens
      - `identifier` (text)
      - `token` (text, unique)
      - `expires` (timestamp)
    
    - `airflow_weather_data` - Weather API responses
      - `id` (serial, primary key)
      - `city` (text, required)
      - `request_timestamp` (timestamp, default now)
      - `response_json` (jsonb, stores API response)
      - `user_id` (uuid, foreign key to users)

  2. Security
    - All tables properly indexed for performance
    - Foreign key constraints for data integrity
    - Unique constraints on email and session tokens
*/

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text,
  email text NOT NULL UNIQUE,
  "emailVerified" timestamp,
  image text,
  password text,
  created_at timestamp DEFAULT now()
);

-- Accounts table for OAuth
CREATE TABLE IF NOT EXISTS accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type text NOT NULL,
  provider text NOT NULL,
  "providerAccountId" text NOT NULL,
  refresh_token text,
  access_token text,
  expires_at timestamp,
  token_type text,
  scope text,
  id_token text,
  session_state text,
  UNIQUE(provider, "providerAccountId")
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "sessionToken" text NOT NULL UNIQUE,
  "userId" uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires timestamp NOT NULL
);

-- Verification tokens table
CREATE TABLE IF NOT EXISTS "verificationTokens" (
  identifier text NOT NULL,
  token text NOT NULL UNIQUE,
  expires timestamp NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- Weather data table
CREATE TABLE IF NOT EXISTS airflow_weather_data (
  id serial PRIMARY KEY,
  city text NOT NULL,
  request_timestamp timestamp DEFAULT now(),
  response_json jsonb NOT NULL,
  user_id uuid REFERENCES users(id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON accounts("userId");
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions("userId");
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions("sessionToken");
CREATE INDEX IF NOT EXISTS idx_weather_data_user_id ON airflow_weather_data(user_id);
CREATE INDEX IF NOT EXISTS idx_weather_data_city ON airflow_weather_data(city);
CREATE INDEX IF NOT EXISTS idx_weather_data_timestamp ON airflow_weather_data(request_timestamp);