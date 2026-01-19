<img src="images/readme/banner.png" width="100%"/><br>

# GJU Jobs API
Developed by Khanh Le Dang, Dilan Bostanci and Kâan Turan<br>
Project lead: Silvio Peikert and Dr. Jamal Al Qundus

GJU Jobs is a matchmaking platform developed in collaboration with the <a href="https://www.gju.edu.jo">German Jordanian University (GJU)</a> and the <a href="https://www.htw-berlin.de">Berlin University of Applied Sciences (HTW Berlin)</a>. The platform aims to connect GJU students with companies in Germany, facilitating access to internships and early career opportunities. Students can create profiles highlighting their academic background, qualifications, and skills, while companies can publish job postings and actively search for suitable candidates. An intelligent matching system recommends relevant opportunities based on academic profiles, competencies, and career interests.

> [!NOTE]  
> This project is licensed under the MIT License. See the _LICENSE_ file for details.

## Project team
| Name                 | Role | Subteam      | Contact                                   |
|----------------------|------|--------------|-------------------------------------------|
| Waindja Bukam Kamseu | Lead | Coordination | waindja.bukamkamseu@student.htw-berlin.de |
| Pham Hoai Linh       |      | Coordination | hoai.pham@student.htw-berlin.de           |
| Natasza Kopka        |      | Coordination | natasza.kopka@student.htw-berlin.de       |
| Kâan Turan           | Lead | Backend      | kaan.turan@student.htw-berlin.de          |
| Khanh Le Dang        |      | Backend      | khanh.dang@student.htw-berlin.de          |
| Dilan Bostanci       |      | Backend      | dilan.bostanci@student.htw-berlin.de      |
| Houman Safiri        | Lead | Frontend     | houman.safiri@student.htw-berlin.de       |
| Sarra Malek          |      | Frontend     | sarra.malek@student.htw-berlin.de         |
| Gizem Biktü          |      | Frontend     | gizem.biliktue@student.htw-berlin.de      |

## Setup:
To get started, follow the steps below to launch the API. The use of Docker is supported.

1. Create the _.env_, _.env.production_, and _.env.testing_ files inside the root directory using _.env.example_ as a template.
2. Configure the environment files for development, deployment, and testing according to the instructions and information provided within each file. Recommended values are already provided in the _.env.example_ file.
3. Set up PostgreSQL and Redis, then configure the environment files with the required connection details. When setting up PostgreSQL, you can use the _schemas/postgreSQL.schema.sql_ file to initialize the database.
4. Install all dependencies with `npm install`.
5. Run `npm run test` to check if everything is working properly.
6. Start the API in development mode: `npm run dev` or start the API in production mode: `npm run deploy`.
7. Done! :blush:

## General
This API is built using the <a href="https://expressjs.com">Express.js</a> framework. To operate the application, a configured <a href="https://www.postgresql.org">PostgreSQL</a> database, <a href="https://redis.io">Redis</a> instance, and mail server are required. The SSL certificate files must be stored in the root directory under /certificates. All additional third-party libraries and dependencies can be found in /package.json and /package-lock.json. The following section provides an overview of the complete system architecture.

<img src="images/readme/system_architecture.png" width="100%"/><br>

## Environment
The following section lists all environment variables along with a brief description of each. The environment files also include short comments, although most variables are self-explanatory.

| Variable | Description |
|----------|-------------|
| NODE_ENV | Choose between DEV, TESTING or PRODUCTION (e.g. for .env.production file it should be PRODUCTION); When NODE_ENV set to DEV or TESTING, it can be useful to disable features such as RATE_LIMIT, COOLDOWN, and similar restrictions |
| VERSION | Avoid dotted version numbers (e.g., 1.0, 2.1); Use only major versions (e.g., 1, 2); Frontend and backend must use the same "VERSION" number to properly work together |
| DEV_MAIL | Enable mailserver ustage if NODE_ENV = DEV enabled |
| STARTUP_TESTS | External server tests on compilation (does not include Redis) |
| REMOVE_UNNUSED_FOLDERS | Delete all unnused user folders on startup |
| API_HTTPS | Enable/disable HTTPS for API |
| API_WWW | Enable www. subdomain |
| API_HOST | Only the domain name (do not add protocol!) |
| API_PORT | Optional |
| API_PATH | Optional (do not add slashes to the front or back) |
| FRONTEND_HTTPS | Enable/disable HTTPS for frontend |
| FRONTEND_WWW | Enable www. subdomain |
| FRONTEND_HOST | Only the domain name (do not add protocol!) |
| FRONTEND_PORT | Optional |
| FRONTEND_PATH | Optional (do not add slashes to the front or back) |
| SCHEMA_NAME | Database schema name |
| DB_HOST | Database host |
| DB_PORT | Database port |
| DB_USER | Database user |
| DB_PASSWORD | Database password |
| DB_POOL_MAX | Maximum amount of connections (in seconds) |
| DB_POOL_IDLE | Time until inactive connection gets closed (in seconds) |
| DB_POOL_TIMEOUT | Time until timeout (in seconds) |
| MAIL_NAME | E-Mail sender name |
| INCOMING_MAILSERVER | Incoming mail server |
| OUTGOING_MAILSERVER | Outgoing mail server |
| WEBMAIL_SERVER | Webmail server |
| MAIL_SMTP_PORT | SMTP port |
| MAIL_IMAP_PORT | IMAP port |
| MAIL_POP3_PORT | POP3 port |
| MAIL_IMAP_SSL_TSL_PORT | IMAP SSL/TLS port |
| MAIL_POP3_SSL_TSL_PORT | POP3 SSL/TLS port |
| MAIL_PORT_ENCRYPTION | STARTTLS encryption |
| MAIL_PORT_ENCRYPTION_SSL_TSL | password |
| SYSTEM_EMAIL | System email address |
| SYSTEM_EMAIL_PASSWORD | System email password |
| NO_REPLY_EMAIL | No-reply email address |
| NO_REPLY_EMAIL_PASSWORD | No-reply email password |
| SUPPORT_EMAIL | Support email address |
| SUPPORT_EMAIL_PASSWORD | Support email password |
| AUTH_KEY | Must be exactly 64 characters long |
| AUTH_EXP | In seconds (15min) |
| AUTH_CODE_LENGTH | Length of auth code |
| AUTH_MAX_ATTEMPTS | Maximum auth attempts |
| ACCESS_KEY | Must be exactly 64 characters long |
| ACCESS_EXP | In seconds (180d) |
| RECOVERY_KEY | Must be exactly 64 characters long |
| RECOVERY_EXP | In seconds (15min) |
| DELETION_KEY | Must be exactly 64 characters long |
| DELETION_EXP | In seconds (5min) |
| BLACKLIST_CLEANUP_INTERVAL | In seconds (1h) -- should be as long or longer as longest key expiration time |
| ENCRYPTION_KEY | Must be exactly 64 characters long (case-insensitive) |
| HASH_KEY | Must be exactly 64 characters long (case-insensitive) |
| MAX_CONTENT_SIZE | Maximum client JSON content size in KB per request (does not apply to file uploads) |
| RATE_LIMIT | Enable/disable rate limiting |
| HTTP_GLOBAL_WINDOW_MS | In seconds (1min) -- for HTTP-Endpoints only (will work simultaneously with other rate limits below) |
| HTTP_GLOBAL_LIMIT | Global request amount for time-window (HTTP_GLOBAL_WINDOW_MS) |
| SIGNUP_WINDOW_MS | In seconds (1h) |
| SIGNUP_LIMIT | Maximum signup requests per window |
| LOGIN_WINDOW_MS | In seconds (2min) |
| LOGIN_LIMIT | Maximum login requests per window |
| GET_RECOVERY_WINDOW_MS | In seconds (1h) |
| GET_RECOVERY_LIMIT | Maximum recovery requests per window |
| GET_DELETE_WINDOW_MS | In seconds (1h) |
| GET_DELETE_LIMIT | Maximum delete requests per window |
| SUPPORT_WINDOW_MS | In seconds (3h) |
| SUPPORT_LIMIT | Maximum support requests per window |
| SEND_FRONTEND_ERROR_WINDOW_MS | In seconds (12h) |
| SEND_FRONTEND_ERROR_LIMIT | Maximum frontend error submissions per window |
| WS_WINDOW_MS | In seconds (1min) |
| WS_LIMIT | Maximum WebSocket requests per window |
| GLOBAL_TIMEOUT | In seconds |
| UPLOAD_IMAGES_TIMEOUT | In seconds |
| COOLDOWN | In seconds |
| UPLOADS_PATH | Folder path for user folders; Empty field would be inside "/api" directory (e.g. ../../NAS_VOLUME or E:/BIG_STORAGE) |
| IMAGE_TYPES | Split with ","-Symbol (e.g. image/jpeg,image/jpg,[...]) -- svg+xml should not be used, its a security risk |
| IMAGE_NAME_LENGTH | Image name length |
| IMAGE_MAX_INIT_DIM | Maximum amount of initial (horizontal & vertical) pixel user can upload (to prevent decompression bombs) |
| IMAGE_RESIZE_RATE | Horizontal pixel amount |
| IMAGE_COMPRESSION_RATE | Image compression amount (100 = Best) |
| PROFILE_PICTURE_MAX_SIZE | In megabyte |
| IMAGE_UPLOAD_PATH | Path where uploads can be retrieved (is required and do not add slashes to the front or back) |
| USE_CORS | Enable/disable Cross-Origin Resource Sharing |
| ALLOWED_STUDENT_DOMAIN | Allowed student domains to sigup; Do not add a @ symbol |

## Endpoints
Below, all endpoints are presented along with a sequence diagram. A _description_ (string) will always be included in the response body. The **Response** column only displays the successful response (HTTP 200).

### General
| Method | Title                   | Path                 | Headers | Body                                                              | Params | Response Headers | Response Body              |
|--------|-------------------------|----------------------|---------|-------------------------------------------------------------------|--------|------------------|----------------------------|
| POST   | Support Request         | /support             |         | email: string<br>phone: string<br>type: string<br>message: string |        |                  |                            |
| POST   | Frontend Internal Error | /send-frontend-error |         | errorMessage: string                                              |        |                  | Body:<br>errorUUID: string |

### User
#### User Authentication and Authorization<br>
<img src="images/readme/user_auth.png" width="100%"/><br>
#### User Recovery<br>
<img src="images/readme/user_recovery.png" width="100%"/><br>
#### User Deletion<br>
<img src="images/readme/user_deletion.png" width="100%"/>

| Method | Title             | Path                 | Headers              | Body                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | Params | Response Headers     | Response Body                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
|--------|-------------------|----------------------|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------|----------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| POST   | Student Signup    | /user/signup/student |                      | email: string<br>phone: string<br>givenName: string<br>surname: string<br>degree: string \| undefined<br>program: string \| undefined<br>tags: number[] \| undefined<br>jobPreferences: number[] \| undefined<br>languages: number[] \| undefined                                                                                                                                                                                                                                                                                                                                                                                                                                          |        | Authentication Token | expires: string<br>authCode: string                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| POST   | Company Signup    | /user/signup/company |                      | email: string<br>phone: string<br>company: string<br>description: string \| undefined<br>givenName: string<br>surname: string<br>street: string<br>streetNumber: string<br>ZIPCode: number<br>city: string<br>country: string<br>size: string<br>industry: string                                                                                                                                                                                                                                                                                                                                                                                                                          |        |                      | expires: string<br>authCode: string                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| POST   | Login             | /user/login          |                      | isStudent: boolean<br>email: string                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |        | Authentication Token | expires: string<br>authCode: string                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| POST   | Auth              | /user/auth           | Authentication Token | code: string                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |        | Authorization Token  |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| PATCH  | Update            | /user/update         | Authorization Token  | Student:<br>phone: string \| undefined<br>givenName: string \| undefined<br>surname: string \| undefined<br>degree: string \| undefined<br>program: string \| undefined<br>tags: number[] \| undefined<br>jobPreferences: number[] \| undefined<br>languages: number[] \| undefined<br><br>Company:<br>phone: string\| undefined<br>company: string\| undefined<br>description: string\| undefined<br>givenName: string\| undefined<br>surname: string\| undefined<br>street: string\| undefined<br>streetNumber: string\| undefined<br>ZIPCode: number\| undefined<br>city: string\| undefined<br>country: string\| undefined<br>size: string\| undefined<br>industry: string\| undefined |        |                      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| GET    | Retrieve          | /user                | Authorization Token  |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |        |                      | Student:<br>user: {<br>    UUID: string<br>    authUUID: string<br>    email: string<br>    phone: string<br>    givenName: string<br>    surname: string<br>    degree: string \| null<br>    program: string \| null<br>    tags: number[]<br>    jobPreferences: number[]<br>    languages: number[]<br>}<br><br>Company:<br>user: {<br>    UUID: string<br>    authUUID: string<br>    email: string<br>    phone: string<br>    company: string<br>    description: string \| null<br>    givenName: string<br>    surname: string<br>    street: string<br>    streetNumber: string<br>    ZIPCode: number<br>    city: string<br>    country: string<br>    size: string<br>    industry: string<br>} |
| GET    | Get Recovery Link | /user/recovery       |                      | isStudent: boolean<br>email: string                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |        |                      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| POST   | Recovery          | /user/recovery       | Authentication Token |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |        |                      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| GET    | Get Deletion Link | /user/deletion       | Authorization Token  |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |        |                      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| DEL    | Deletion          | /user/deletion       | Authentication Token |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |        |                      |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |

### File
#### User File<br>
<img src="images/readme/user_file.png" width="100%"/>

| Method | Title    | Path   | Headers             | Body         | Params       | Response Headers | Response Body                                                               |
|--------|----------|--------|---------------------|--------------|--------------|------------------|-----------------------------------------------------------------------------|
| POST   | Upload   | /file  | Authorization Token | file: Image  | type: string |                  | UUID: string<br>fileName: string                                            |
| GET    | Retrieve | /files | Authorization Token |              |              |                  | files: {<br>    UUID: string<br>    name: string<br>    type: string<br>}[] |
| GET    | Retrieve | /file  | Authorization Token |              | UUID: string |                  | files: {<br>    name: string<br>    type: string<br>    url: string<br>}    |
| DEL    | Delete   | /file  | Authorization Token | uuid: string |              |                  |                                                                             |

### Images

| Method | Title | Path                           | Headers | Body | Params | Response Headers | Response Body |
|--------|-------|--------------------------------|---------|------|--------|------------------|---------------|
| GET    | Image | /upload/User UUID/Filename     |         |      |        |                  |               |

### Jobs
#### User Jobs<br>
<img src="images/readme/user_jobs.png" width="100%"/>

| Method | Title    | Path         | Headers             | Body                                                                                                                                                                          | Params                                                             | Response Headers | Response Body                                                                                                                                                                                                                                                                                                                 |
|--------|----------|--------------|---------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| POST   | Create   | /jobs/create | Authorization Token | title: string<br>description: string<br>tags: number[] \| undefined<br>position: string<br>exp: number \| undefined                                                           |                                                                    |                  | uuid: string                                                                                                                                                                                                                                                                                                                  |
| PATCH  | Update   | /jobs/update | Authorization Token | jobUUID: string<br>title: string \| undefined<br>description: string \| undefined<br>tags: number[] \| undefined<br>position: string \| undefined<br>exp: number \| undefined |                                                                    |                  |                                                                                                                                                                                                                                                                                                                               |
| DEL    | Delete   | /jobs/delete | Authorization Token | jobUUID: string                                                                                                                                                               |                                                                    |                  |                                                                                                                                                                                                                                                                                                                               |
| GET    | Retrieve | /jobs        |                     |                                                                                                                                                                               | tags: number[]<br>sort: string<br>page: number<br>pageSize: number |                  | companyInfo: {<br>    email: string<br>    company: string<br>    size: string<br>    industry: string<br>    country: string<br>}<br>jobs: {<br>    uuid: string<br>    title: string<br>    description: string<br>    position: string<br>    exp: string \| undefined<br>    created: string<br>    tags: number[]<br>}[] |