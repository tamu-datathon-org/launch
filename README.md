# launch

TAMU Datathon's smart application system

## Installation
1. Open folder in Visual Studio Code.
    - Highly recommend getting [this vscode extention](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
2. Make sure you have Node JS installed and npm. You can test it with:

    ```bash
    $ node --version
    v10.20.1

    $ npm --version
    6.14.4
    ```

3. Install all the npm dependencies for this project:

    ```bash
    $ npm install
    ```

4. Copy the `sample.env` file into `.env` and change the appropriate variables

5. Run the application:
    ```bash
    $ npm start # for production mode
    $ npm run dev # for dev mode, need to run this to go through galaxy proxy
    ```
