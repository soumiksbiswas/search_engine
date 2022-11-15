# Codesearch Search Engine
I have created a search engine-"Codesearch" comprising DSA Problems. 

## Technologies
Project is created with:
* HTML5
* CSS
* JavaScript
* Node.js
* Python 3
* Beautiful Soup 4
* EJS

## Basic details
I have performed web scraping on Leetcode problem set using Beautiful Soup 4 and filtered the search results for the query entered by the user using TF-IDF (Term Frequency= Inverse Document Frequency) algorithm. I have also removed the stop words from the documents as well as the query string. I have also performed Lemmatization on the words to convert different forms of the words into their root form. I have used EJS as the template engine.

## Features
- If the query does not match with any problem present in our database, it will display the necessary error message to the user.
- Five search results are displayed as the title of the problems.
- Clicking on the title will display the problem and again clicking on the title will hide the problem.

## Link
Click on this link to check out this project deployed on Heroku:
[Codesearch](https://codesearch-app.herokuapp.com/)

## Created by
[@soumiksbiswas](soumiksbiswas@gmail.com)
