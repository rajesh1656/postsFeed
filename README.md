# postsFeed
Application is to provide a feed view of a searchable list of items that are fetched from a database


Steps to run this application
1. Import the sql dump(/api/posts_db.sql) into mysql server 
2. create virtualhosting till php code api folder
    i. if its properly configured(for suppose "postsfeed") then it should be accessible in browser with "http://postsfeed/"
    ii. update php url in "src\components\common.js" for "apiUrl" variable
3. Run the react application with below command
    npm start