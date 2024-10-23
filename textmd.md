apiKey: "AIzaSyAmy-JRvg_mdDWezaszf5Zb-1-rxfuerqY",
  authDomain: "my-web-project-db.firebaseapp.com",
  projectId: "my-web-project-db",
  storageBucket: "my-web-project-db.appspot.com",
  messagingSenderId: "230206900497",
  appId: "1:230206900497:web:10cd36e5eb148409f9e4b0",
  measurementId: "G-XR7YEX44H4"

winget install Schniz.fnm
fnm env --use-on-cd | Out-String | Invoke-Expression
fnm use --install-if-missing 20

npm install -g react-scripts
npm i react react-dom

npm i redux-persist