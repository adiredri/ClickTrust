const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/user');
const Asset = require('../models/asset');
const Trade = require('../models/trades');

//  ----------------- SIGNUP --------------------

// Adding user to the DB
router.post('/addUser', async (req, res) => {
  const user = new User({
    ID: req.body.ID,
    FirstName: req.body.FirstName,
    LastName: req.body.LastName,
    Email: req.body.Email,
    Password: req.body.Password,
    Phone: req.body.Phone,
    Birthday: req.body.Birthday,
    Gender: req.body.Gender,
  });
  try {
    // Save the user to the database
    await user.save();
    console.log('User added successfully');
    res.redirect('/Welcome');

  } catch (error) {
    if (error.code === 11000 && error.keyPattern && error.keyValue && error.keyValue.Email) { 
      // Duplicate email error
      const errorMessage = 'Email already exists. Please choose a different email.';
      console.error(errorMessage);
      // Display an alert with the error message
      res.send(`<script>alert('${errorMessage}'); window.location.href='/signup'</script>`);
    } else {
      console.error('Error adding user:', error);
      res.send(error);
    }
  }
});

//  ----------------- LOGIN --------------------

// Connects users to the site by classification 
router.post('/login', async (req, res) => {
  const Email = req.body.Email;
  const Password = req.body.Password;
  try {
    // Find the user in the database based on the provided email and password
    const loguser = await User.findOne({ Email: Email, Password: Password });

    if (loguser) {

      // Retrieve user's role based on email and ID
      if (loguser.id === '660360e03bd8ee6951acea72' || loguser.id === '65f0e0ee98ec2d9cd878bd3b') {
        res.redirect('/admin?Email=' + loguser.Email);
      } else {
        // Redirect to the customer index page and pass the first name as a query parameter in the URL
        res.redirect('/customer?Email=' + loguser.Email);
      }
    } else {
      // Display an alert for no such user
      const errorMessage = 'No user found with the provided email and password.';
      console.error(errorMessage);
      res.send(`<script>alert('${errorMessage}'); window.location.href='/LogIn'</script>`);
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.send(error);
  }
});

//  ------------------ ASSETS ---------------------

// --------- Adds asset to the DB -----------

router.post('/addAsset', async (req, res) => {
  const asset = new Asset({
    Category: req.body.Category,
    NameDigitalAsset: req.body.NameDigitalAsset,
    Place: req.body.Place,
    Date: req.body.Date,
    Time: req.body.Time,
    Quantity: req.body.Quantity,
    Price: req.body.Price,
    Email: req.body.Email,
    Available: req.body.Available,
  });

  try {   
    // Check if Quantity is less than 8
    if (req.body.Quantity >= 8) {
      throw new Error('Quantity must be less than 8.');
    }
    // Check if Price is less than 2500
    if (req.body.Price >= 2500) {
      throw new Error('Price must be less than 2500.');
    }
    // Check if Date is later than today
    if (new Date(req.body.Date) >= new Date()) {
      throw new Error('Date must be later than today.');
    }

      // Save the Asset to the database
      await asset.save();
      console.log('Asset added successfully'); 
      // Send a response back to the client-side to handle the confirmation
      res.send(`<script>alert('Asset added successfully.'); window.location.href='/Asset'</script>`);
    
    if (loguser) {

      // Retrieve user's role based on email and ID
      if (loguser.id === '660360e03bd8ee6951acea72' || loguser.id === '65f0e0ee98ec2d9cd878bd3b') {
        res.redirect('/admin?Email=' + loguser.Email);
      } else {
        // Redirect to the customer index page and pass the first name as a query parameter in the URL
        res.redirect('/customer?Email=' + loguser.Email);
      }
    } else {
      // Display an alert for no such user
      const errorMessage = 'No user found with the provided email and password.';
      console.error(errorMessage);
      res.send(`<script>alert('${errorMessage}'); window.location.href='/Asset'</script>`);
    }
    
  } catch (error) {
    const errorMessage = 'An error occurred while adding the asset.';
    console.error(errorMessage);
    res.send(`<script>alert('${errorMessage}'); window.location.href='/Asset'</script>`); }
});

// Sends all the assets 
router.get('/assets', async (req, res) => {
  try {
    // Retrieve all assets from the database
    const assets = await Asset.find({});

    // Send the assets as a JSON response
    res.json(assets);
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Updates asset available = false in the DB when it sold.
router.patch('/assets/:id', async (req, res) => {
  const AssetId = req.params.id;
  try {
    const updatedAsset = await Asset.findOneAndUpdate(
      { _id: AssetId }, // מצא את הנכס לפי ה-ID
      { $set: { Available: false } }, // עדכן את השדה Available לערך false
      { new: true } // החזר את הנכס המעודכן
    );

    if (!updatedAsset) {
      return res.status(404).send("Asset not found");
    }

    res.status(200).send("Asset updated successfully");
  } catch (error) {
    console.error("Error updating the asset:", error);
    res.status(500).send("Error updating the asset");
  }
});

// get email seller from asset
router.get('/assets/:id/email', async (req, res) => {
  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      throw new Error('Asset not found');
    }
    res.json({ Email: asset.Email });
  } catch (error) {
    console.error('Error fetching asset email:', error);
    res.status(500).json({ error: 'Failed to fetch asset email' });
  }
});

// get fname by email from asset

router.get('/get-first-name', async (req, res) => {
  const Email = req.query.Email;
  try {
    const user = await User.findOne({ Email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ FirstName: user.FirstName });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Error fetching first name' });
  }
});

// get all available assets
router.get('/assets/available', async (req, res) => {
  try {
    const assets = await Asset.find({ Available: true });
    if (!assets) {
      throw new Error('No available assets found');
    }
    res.json(assets);
  } catch (error) {
    console.error('Error fetching available assets:', error);
    res.status(500).json({ error: 'Failed to fetch available assets' });
  }
});


//  ------------------ TRADES ---------------------

// ----------- Adds trade to DB ------------

router.post('/addTrade', async (req, res) => {
  const trade = new Trade({
    TransDate: req.body.TransDate,
    TransTime: req.body.TransTime,
    AssetID : req.body.AssetID,
    SellerEmail: req.body.SellerEmail,
    BuyerEmail: req.body.BuyerEmail,
  });

  try {   
      // Save the Trade to the database
      await trade.save();
      console.log('Trade added successfully'); 
      // Send a response back to the client-side to handle the confirmation
      res.status(200).json({ success: true }); // Sending a success response

  } catch (error) {
    console.error('An error occurred while adding the trade:', error);
    res.status(500).json({ success: false, error: 'An error occurred while adding the trade' }); // Sending an error response
  }
});

// --------- SHOW TRADES -----------

router.get('/user-trades', async (req, res) => {
  const userEmail = req.query.Email; // get the email from the query parameters
  try {
    const userTrades = await Trade.aggregate([
      {
        $match: {
          $or: [
            { BuyerEmail: userEmail },
            { SellerEmail: userEmail }
          ]
        }
      },
      {
        $lookup:
          {
            from: "assets",
            localField: "AssetID",
            foreignField: "_id",
            as: "asset_info"
          }
      }
    ]);
    if (!userTrades || userTrades.length === 0) { // Check if userTrades is empty
      throw new Error('No trades found for this user');
    }
    res.json(userTrades);
  } catch (error) {
    console.error('Error fetching user trades:', error);
    res.status(500).json({ error: 'Failed to fetch user trades' });
  }
});


//  ----------------- Sends ------------------

// Sends to customer home page
router.get('/customer', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'indexCustomer.html'));
});

// Sends to admin home page
router.get('/admin', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'indexAdmin.html'));
});

// Sends to index login home page
router.get('/index', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'index.html'));
});

// Sends to login page
router.get('/loginPage', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'LogIn.html'));
});

// Sends to add asset page
router.get('/Asset', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'AddProduct.html'));
});

// Sends to signup page
router.get('/signup', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'signup.html'));
});

// Sends to welcome page
router.get('/welcome', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'Welcome.html'));
});

// Sends to trade page
router.get('/allAssets', async (req, res) => {
  res.sendFile(path.join(__dirname, '../../views', 'indexCustomer.html'));
});

// Sends to about page
router.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'About.html'));
});

// Sends to portfolio page
router.get('/portfolio', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'Profile.html'));
});

// Sends to ManageAssets page
router.get('/ManageAssets', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'ManageAssets.html'));
});

// Sends to trades page
router.get('/trades', function (req, res) {
  res.sendFile(path.join(__dirname, '../../views', 'History.html'));
});



module.exports = router;