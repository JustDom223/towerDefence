# Environment Setup Guide

This README serves as a quick reference for setting up a new project environment from scratch. It will help ensure consistency across all projects and save time.

## 1. Node.js & npm Setup

1. **Install Node.js**: Make sure you have Node.js installed.

    - Use Node Version Manager (nvm) to install the latest version of Node.js:

        ```bash
        nvm install node
        ```

        This will install the latest version of Node.js. If you don't have `nvm` installed, follow the installation instructions [here](https://github.com/nvm-sh/nvm#installing-and-updating).

    - Check version: `node -v` and `npm -v`

2. **Initialize npm**: Run the following command to set up `package.json`:

    ```bash
    npm init -y
    ```

    The `-y` flag accepts all default options. You can edit `package.json` later to customize as needed.

## 2. Install Development Tools

### ESLint and Prettier

1. **Install ESLint and Prettier** as dev dependencies:

    ```bash
    npm install --save-dev eslint prettier
    ```

2. **Configure ESLint**:

    - Run ESLint initialization:
        ```bash
        npx eslint --init
        ```
        Choose your options as appropriate for the project.

3. **Configure Prettier**:

    - Create `.prettierrc` and add the following configuration:
        ```json
        {
            "tabWidth": 4,
            "singleQuote": true
        }
        ```

## 3. Add npm Scripts

In your `package.json`, add useful scripts for development:

```json
"scripts": {
  "lint": "eslint .",
  "format": "prettier --write ."
}
```

-   **lint**: Lints your JavaScript files.
-   **format**: Formats your code using Prettier.

## 4. Git Setup

Since you will be creating the Git repository on GitHub and cloning it to your local machine, there is no need to initialize Git or set up a `.gitignore` manually. The `.gitignore` file will already be part of the repository when you clone it.

## 5. Testing the Setup

To verify everything is working:

1. **Run ESLint**:

    ```bash
    npm run lint
    ```

2. **Run Prettier**:
    ```bash
    npm run format
    ```

## Summary

This setup helps maintain a consistent environment across projects and includes everything needed to get started quickly with modern JavaScript development.

### Files Created During Setup

1. **Files Created Manually**:

    - `.prettierrc`: For Prettier configuration.
    - `.gitignore`: To ignore specific files and directories.

2. **Files Created Automatically**:
    - `package.json`: Created when you run `npm init`.
    - `node_modules/`: Created when you install packages with npm.

Feel free to update this guide as your tools and workflows evolve. It can also be customized per project depending on specific needs.
