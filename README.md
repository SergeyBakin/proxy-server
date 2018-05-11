# Proxy-server
Use for development mode between Angular 2+(frontend) and Java(backend)

# Installation Guide
1. Install `node.js >= v4.x.x`
2. Clone project to specific folder
3. `npm install`

# Launch
1. In file `app.js` fill variables `urlServer` - address backend server,
`jsessionid` - sessionId your account after authorization in you backend server
2. On the frontend project in file `index.html` set tag `<base href="localhost:4100">`
3. Run command `node app.js`
