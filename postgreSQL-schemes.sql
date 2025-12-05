SET search_path TO public;

-- USERS
CREATE TABLE IF NOT EXISTS users (
    uuid UUID PRIMARY KEY UNIQUE NOT NULL, -- User UUID
    auth_uuid UUID UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    given_name TEXT NOT NULL, -- Encrypted
    surname TEXT NOT NULL, -- Encrypted
    company TEXT, -- Encrypted; Optional for students
    street TEXT NOT NULL, -- Encrypted
    street_number TEXT NOT NULL, -- Encrypted
    zip_code TEXT NOT NULL, -- Encrypted
    city TEXT NOT NULL, -- Encrypted
    country TEXT NOT NULL, -- Encrypted
    phone TEXT, -- Encrypted
    is_student BOOLEAN DEFAULT FALSE,
    cooldown TIMESTAMP,
    auth_code TEXT, -- Hashed
    auth_code_created TIMESTAMP,
    auth_code_attempt SMALLINT NOT NULL DEFAULT 0,
    created TIMESTAMP DEFAULT NOW()
);

-- USERS_STUDENT
CREATE TABLE users_student (
    uuid UUID PRIMARY KEY UNIQUE NOT NULL ,
    user_uuid UUID NOT NULL,
    CONSTRAINT fk_users_student_users
        FOREIGN KEY (user_uuid)
        REFERENCES users(uuid)
        ON DELETE CASCADE
);

-- USER_STUDENT TAGS
CREATE TABLE users_student_tags (
    uuid UUID PRIMARY KEY UNIQUE NOT NULL ,
    user_uuid UUID NOT NULL,
    tag INT NOT NULL
);

-- USERS_COMPANY
CREATE TABLE users_company (
    uuid UUID PRIMARY KEY UNIQUE NOT NULL ,
    user_uuid UUID NOT NULL,
    CONSTRAINT fk_users_company_users
        FOREIGN KEY (user_uuid)
        REFERENCES users(uuid)
        ON DELETE CASCADE
);

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
    created TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_uuid) REFERENCES users(uuid) ON DELETE CASCADE
);