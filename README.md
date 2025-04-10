# ClickTrust – Digital Asset Trading System

ClickTrust is a full-stack information system designed to manage the trading of **digital assets**.  
Built as my final project during my Computer Science degree, this system aims to automate and streamline processes related to buying, selling, and managing assets such as event tickets, service subscriptions, digital products, and more.

ClickTrust combines powerful backend logic with a modern, responsive user interface to ensure users can manage digital assets efficiently and securely – without requiring physical interaction.

---

## Project Objectives

- **Automation of Trading Workflows**  
  Implement inventory management, order processing, and asset verification through automated logic to reduce manual intervention.

- **User-Centered Interface**  
  A clean, intuitive UI allows users to easily navigate the platform, execute trades, and manage assets with clarity.

- **Data Privacy & Security**  
  Integration of authentication mechanisms and role-based access control to ensure user data is protected at all times.

- **Digital Asset Marketplace**  
  Users can register assets, browse listings, and execute secure transactions in a transparent, reliable environment.

---

## Tech Stack

<table align="center">
  <tr>
    <td align="center" width="100">
      <img src="https://skillicons.dev/icons?i=html" width="48" height="48"/><br>HTML5
    </td>
    <td align="center" width="100">
      <img src="https://skillicons.dev/icons?i=css" width="48" height="48"/><br>CSS3
    </td>
    <td align="center" width="100">
      <img src="https://techstack-generator.vercel.app/js-icon.svg" width="48" height="48"/><br>JavaScript
    </td>
    <td align="center" width="100">
      <img src="https://skillicons.dev/icons?i=nodejs" width="48" height="48"/><br>Node.js
    </td>
    <td align="center" width="100">
      <img src="https://skillicons.dev/icons?i=mongodb" width="48" height="48"/><br>MongoDB
    </td>
  </tr>
</table>

---

## Features

- User registration and authentication (login system)
- Secure digital asset registration and management
- Order placement and automated processing
- Admin dashboard for asset and user management
- RESTful API integration (Node.js + Express)
- Persistent storage using MongoDB
- Responsive front-end design (HTML/CSS/JS)

---

## Project Structure

```
ClickTrust/
├── backend/           # Node.js + Express server
│   └── routes/
│   └── models/
│   └── controllers/
├── frontend/          # Static frontend (HTML/CSS/JS)
│   └── pages/
│   └── assets/
├── database/          # MongoDB scripts and data samples
└── README.md
```

---

## Getting Started

To run this project locally:

```bash
git clone https://github.com/adiredri/ClickTrust.git
cd ClickTrust
npm install
npm start
```

Make sure MongoDB is running locally or update the connection string in the environment variables.
