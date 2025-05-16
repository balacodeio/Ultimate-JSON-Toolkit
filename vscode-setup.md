# VS Code Environment Setup

## VS Code Environment

Install eslint extension from the "Extensions" tab [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)

## Initial Setup

* Using the VSCode terminal please complete the following steps*

Install eslint globally if you have **not done** so already ```npm install -g eslint```

Initialize this package and update corresponding data as needed by running ```npm init```

Initialize ESLint using ```eslint --init``` Follow the guide in the terminal with the following configurations

* **How would you like to use ESLint?**
  * To check syntax, find problems, and enforce code style
* **What type of modules does your project use?**
  * CommonJS (require/exports)
* **Which framework does your project use?**
  * None of these (you may select react if required)
* **Does your project use TypeScript?**
  * No
* **Where does your code run?**
  * Browser - Only for plugins that run in the browser
  * Node - If the plugin is meant to run in both the browser and server
* **How would you like to define a style for your project?**
  * Use a popular style guide
* **Which style guide do you want to follow?**
  * Standard: <https://github.com/standard/standard>
* **What format do you want your config file to be in?**
  * JavaScript

> If asked to install additional files please **Accept**

</br>

</br>

## Installing other ESLint dependencies & plugins

* Using the vs code terminal please complete the following steps*

* Install ESLint Import Plugin by running ```npm install eslint-plugin-import --save-dev```
* Install ESLint jQuery Plugin by running ```npm install eslint-plugin-jquery --save-dev``` [Docs](https://github.com/dgraham/eslint-plugin-jquery)
* Install ESLint HTML Plugin by running ```npm install eslint-plugin-html --save-dev``` [Docs](https://github.com/BenoitZugmeyer/eslint-plugin-html/)
* Open to edit the ```eslint.config.mjs```

So when completed the overall ```eslint.config.mjs``` file should look like this.  After this initial setup your welcome to add/amend rules as needed and where required

```js
import js from '@eslint/js';
import htmlPlugin from 'eslint-plugin-html';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js', '**/*.html'],
    plugins: {
      html: htmlPlugin,
      "jquery": "eslint-plugin-jquery"
    },
    "env": {
      "browser": true,
      "jquery": true
    },
    rules: {
      'linebreak-style': 0,
      'func-names': 0,
      'space-before-function-paren': ['error', {
        anonymous: 'never',
        named: 'never',
        asyncArrow: 'always'
      }],
      'no-param-reassign': ['error', { props: false }],
      'consistent-return': 0,
      'prefer-const': 'off',
      'semi': ['error', 'always'],
      'quotes': ['error', 'single'],
      'eqeqeq': 'error'
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module'
    }
  }
];


```

> Before proceeding please save all changes and restart VSCode

</br>

</br>

## Adding VSCode Autosave

* Create a directory called *.vscode* by running ```mkdir .vscode```
* Create a file called *settings.json* by running ```echo enter your text here > .vscode/settings.json```
* Copy and past the below code in the new *settings.json*
  
  ```JSON
  {
    "editor.codeActionsOnSave": {"source.fixAll.eslint": true},
    "eslint.validate": ["javascript", "html"]
  }
  ```
