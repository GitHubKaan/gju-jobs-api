-- DELETE ALL OLD TABLES
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

SET search_path TO public;

-- []==============================[ STUDENT ]==============================[]
-- USERS STUDENT
CREATE TABLE IF NOT EXISTS users_student (
    uuid UUID PRIMARY KEY UNIQUE NOT NULL, -- User UUID
    auth_uuid UUID UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT, -- Encrypted
    given_name TEXT NOT NULL, -- Encrypted
    surname TEXT NOT NULL, -- Encrypted
    birthdate TEXT NOT NULL, -- Encrypted
    degree TEXT, -- Encrypted
    cooldown TIMESTAMP,
    auth_code TEXT, -- Hashed
    auth_code_created TIMESTAMP,
    auth_code_attempt SMALLINT NOT NULL DEFAULT 0,
    created TIMESTAMP DEFAULT NOW()
);

-- USER_STUDENT TAGS
CREATE TABLE IF NOT EXISTS users_student_tags (
    uuid UUID PRIMARY KEY UNIQUE NOT NULL ,
    user_uuid UUID NOT NULL,
    tag_id INT NOT NULL,
    created TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_uuid) REFERENCES users_student(uuid) ON DELETE CASCADE
);

-- USER_STUDENT JOB PREFERENCES
CREATE TABLE IF NOT EXISTS users_student_job_preferences (
    uuid UUID PRIMARY KEY UNIQUE NOT NULL ,
    user_uuid UUID NOT NULL,
    preference_id INT NOT NULL,
    created TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_uuid) REFERENCES users_student(uuid) ON DELETE CASCADE
);

-- USER_STUDENT LANGUAGES
CREATE TABLE IF NOT EXISTS users_student_languages (
    uuid UUID PRIMARY KEY UNIQUE NOT NULL ,
    user_uuid UUID NOT NULL,
    language_id INT NOT NULL,
    created TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_uuid) REFERENCES users_student(uuid) ON DELETE CASCADE
);

-- []==============================[ COMPANY ]==============================[]
-- USERS COMPANY
CREATE TABLE IF NOT EXISTS users_company (
    uuid UUID PRIMARY KEY UNIQUE NOT NULL, -- User UUID
    auth_uuid UUID UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT, -- Encrypted
    company TEXT NOT NULL, -- Encrypted
    description TEXT, -- Encrypted
    given_name TEXT NOT NULL, -- Encrypted
    surname TEXT NOT NULL, -- Encrypted
    street TEXT NOT NULL, -- Encrypted
    street_number TEXT NOT NULL, -- Encrypted
    zip_code TEXT NOT NULL, -- Encrypted
    city TEXT NOT NULL, -- Encrypted
    country TEXT NOT NULL, -- Encrypted
    cooldown TIMESTAMP,
    auth_code TEXT, -- Hashed
    auth_code_created TIMESTAMP,
    auth_code_attempt SMALLINT NOT NULL DEFAULT 0,
    created TIMESTAMP DEFAULT NOW()
);

-- []==============================[ STUFF ]==============================[]
-- TOKEN BLACKLIST
CREATE TABLE IF NOT EXISTS token_blacklist (
    token TEXT PRIMARY KEY UNIQUE NOT NULL, -- Hashed
    added TIMESTAMP DEFAULT NOW(),
    expires TIMESTAMP NOT NULL
);

-- INTERNAL ERRORS
CREATE TABLE IF NOT EXISTS internal_errors (
    uuid UUID PRIMARY KEY UNIQUE NOT NULL, -- Error UUID
    backend BOOLEAN NOT NULL DEFAULT TRUE, -- Error from backend or frontend?
    error VARCHAR(10000) NOT NULL, -- Overhead added for ease if use
    created TIMESTAMP DEFAULT NOW()
);

-- UPLOADS
CREATE TABLE IF NOT EXISTS uploads (
    uuid UUID PRIMARY KEY UNIQUE NOT NULL, -- Upload UUID
    user_uuid UUID NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    created TIMESTAMP DEFAULT NOW()
    -- FOREIGN KEY (user_uuid) REFERENCES users(uuid) ON DELETE CASCADE
);