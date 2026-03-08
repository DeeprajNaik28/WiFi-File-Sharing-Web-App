# WiFi-File-Sharing-Web-App
A simple offline file sharing web application that allows users to transfer files between devices connected to the same WiFi network. The app runs a local server on a laptop and lets phones or other devices upload, view, and download files through a browser.
Built using Node.js and Express.js.

# Features

QR Code Connection – Easily connect phone to the server

Upload Files – Send files from phone or laptop

Download Files – Download files to any connected device

View Files – Open images, PDFs, and other files in browser

Shows Progress Bar

Shows Transfer Speed Indicator

Drag & Drop Upload

Mobile Responsive UI

Works Offline (Same WiFi Network)

# Technologies Used

Node.js

Express.js

HTML

CSS

JavaScript

# How It Works

Start the server on your laptop.

Open the web page or scan the QR code from your phone.

Upload or download files between devices connected to the same WiFi network.

# Run the Project
- in cmd type:

npm install


node server.js

- Then open:

http://localhost:3000

or scan the QR code from your phone.

# Project Structure
wifi-share

│

├── server.js

├── uploads

└── public

     └── index.html
