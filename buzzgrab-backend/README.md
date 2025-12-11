
# BuzzGrab — Full Stack Application  
### Backend: Node.js | Frontend: Next.js

---

## 📝 Authors

**© ToXSL Technologies Pvt. Ltd.**  
Website: https://www.toxsl.com  

**Author:** Shiv Charan Panjeta  
Email: shiv@toxsl.com  

**All Rights Reserved.**  
This document contains proprietary and confidential information belonging to ToXSL Technologies Pvt. Ltd. and its partners.  
Unauthorized copying, sharing, or reproduction of this file in any form is strictly prohibited.

---

# 📁 Project Structure


## Installation
```bash
    buzzgrab-backend
    ├── docs
    └── installation.md
```

Install node modules with npm, open terminal in buzzgrab-backend directory

```bash
  npm install 
```
    
## Environment Variables

You can rename env.default to .env

## Run Locally

Clone the project

```bash
  git clone PROJECT_URL
```

Go to the project directory

```bash
  cd buzzgrab-backend
```

Install dependencies

```bash
  npm install -f
```
Create .env by remaning default.env


> If there are any issues in connecting to backend you can directly paste your backend URL in Config file
```bash 
 buzzgrab-backend
    ├── src
    ├── globals
    └── Config.js
```

Start the server

For Backend

```bash
  npm run start
```
For Frontend

```bash
  npm run dev
```

## Deployment

To deploy this project run


## RUN PROJECT with DOCKER
 
```bash 
git clone PROJECT_URL
```

Rename `env.default` to `.env`

```bash
 npm install -f
```

### Follow these commands for RUN with docker

#### Build the docker images with no cache

```bash 
sudo docker-compose build --no-cache
```

### To install production ready containers

```bash
sudo docker-compose up -d --remove-orphans
```
Or
```bash
sudo docker-compose up
```
(for check run time logs)

Output : localhost : PORT_NUMBER

Note - for URL route > we need to add > nginx.conf file