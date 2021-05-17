# Manager

Task List App with offline functionality build mainly with Typescript, ReactJS, Sass and Firebase.

## Run locally 

To use this app in localhost clone this repo to your computer. Keep in mind that you will need your own Firebase project so you can provide your own credentials for Firestore. 
Once you have clone this repo and your Firebase project, provide your credentials in a .env file or reference them directly within the file `src/firebase/config.ts`. Once this is done, run the `npm start` command.

## Functionality 

With this app you can:
  - Create task lists;
  - Mark lists as "Done" (having "Done" and "To Do" lists in separate links);
  - Add a description to your tasks;
  - Share these lists with another user to collaborate in real-time (each list has a unique URL);
  - See if the last update on a task was made by another user;
  - Add sub-tasks to lists;
  - Specify cost/price for a task or a subtask;
  - Edit lists even when you lose internet connection has these will sync up with BE when connection is regain;
  - There are “special” categories that have custom style and some required fields:
    - "Work" has a required field "deadline";
    - "Food" has required fields of "carbohydrate", "fat", "protein" (each specified in grams);
