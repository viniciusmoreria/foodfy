<h1 align="center">
    <img alt="Foodfy" title="#Foodfy" src="public/images/static/main-logo.png" width="100px" />
</h1>

<h4 align="center"> 
	LaunchBase Bootcamp 🚀
</h4>
<p align="center">
 
 <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/viniciusmoreeira/foodfy?color=%2304D361">
  
 <img alt="Repository size" src="https://img.shields.io/github/repo-size/viniciusmoreeira/foodfy">

  <a href="https://github.com/viniciusmoreeira/foodfy/commits/master">
    <img alt="GitHub last commit" src="https://img.shields.io/github/last-commit/viniciusmoreeira/foodfy">
  </a>
  
  <img alt="License" src="https://img.shields.io/badge/license-MIT-brightgreen">
</p>

<div align="center">
  <img src="https://i.imgur.com/KqGxECCg.png"/>
</div>

## Goal

The objective of this challenge is to help fixate the content presented throughout the bootcamp. Where we should create a recipe site from zero with several features, as shown below.

## Features

- [x] Dynamic pages and content powered by Nunjucks.
- [x] Database powered by Postgresql.
- [x] Being able to add new recipes, update and delete them.
- [x] Search recipes.
- [x] Pagination.
- [x] Upload images to database using Multer.
- [x] Image Gallery with Lightbox feature.
- [x] Complete login system, with administrators and regular users.
- [x] Routes are safe thanks to Validators.
- [x] Nodemailer to reset and recover passwords.
- [x] Users, Chefs and Recipes seeds available thanks to Faker.js. 
- [x] Feedback animations powered by Lottie.

## Technologies

This project was developed with the following technologies:

- [Node.js](https://nodejs.org/en/) 
- [PostgreSQL](https://www.postgresql.org/)
- [Nunjucks](https://mozilla.github.io/nunjucks/)
- [Faker.js](https://github.com/marak/Faker.js/)
- [Lottie](https://github.com/airbnb/lottie-web)
  

## Getting Started

  You need the following tools installed in order to run this project:
  [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git), [Node.js + NPM](https://nodejs.org/en/), [PostgreSQL](https://www.postgresql.org/download/), and [Postbird](https://www.electronjs.org/apps/postbird).


1. Fork this repository and clone it into the current directory

   ```bash
   git clone https://github.com/viniciusmoreeira/foodfy.git
   ```


2. Install dependencies

   ```bash
   npm install
   ```


3. Set up the database

   ```bash
   psql -U <username> -c "CREATE DATABASE foodfy"
   psql -U <username> -d foodfy -f foodfy.sql
   ```

   You can manually import the foodfy.sql to Postbird, remember to create a new database with the name Foodfy.

   ```bash
   Important!
   You have to alter the db.js, located in src/config to match your PostgreSQL settings.    
   You also have to alter the mailer.js, located in src/lib to match your Mailtrap settings.  
   ```

4. Populate it with Faker.js
   ```bash
   node seed.js
   ```
   ```bash
   Important!
   Every Faker user password is "pass" and every single one of them have administrator status.   
   ```


5. Fire up the server and watch files

   ```bash
   npm start
   ```


## License

This project is under the MIT license. See the [LICENSE](LICENSE) for details.

