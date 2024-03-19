const express = require('express');
const router = express.Router();
const path = require('path');
const User = require('../models/user');
const Asset = require('../models/asset');
//const Trade = require('../models/trades');

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
      if (loguser.id === '65f0dcf998ec2d9cd878bd39' || loguser.id === '65f0e0ee98ec2d9cd878bd3b') {
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

// Adds asset to the DB 
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
  });

  try {   
      // Save the Asset to the database
      await asset.save();
      console.log('Asset added successfully'); 
      // Send a response back to the client-side to handle the confirmation
      res.send({ assetAdded: true });
    
    if (loguser) {

      // Retrieve user's role based on email and ID
      if (loguser.id === '65f0dcf998ec2d9cd878bd39' || loguser.id === '65f0e0ee98ec2d9cd878bd3b') {
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

// Sends all the assets from DB to allassets page
router.get('/allAssets', async (req, res) => {
  try {
    // Retrieve all assets from the database
    const assets = await Asset.find({}, { _id: 0, __v: 0 }).sort({ Value: -1 });
    res.json(assets);
  } catch (error) {
    console.error('Error retrieving assets:', error);
    res.status(500).json({ error: 'Failed to retrieve assets' });
  }
});

// Sends all the assets to the manage asset page
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

// Deletes assets from DB
router.delete('/assets/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Asset.findByIdAndDelete(id);
    res.sendStatus(204); // No content
  } catch (error) {
    console.error('Error deleting asset:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Updates asset in the DB
router.patch('/assets/:id', async (req, res) => {
try {
    const { id } = req.params;
    const updates = req.body;
    const asset = await Asset.findByIdAndUpdate(id, updates, { new: true });
    if (!asset) {
      return res.status(404).json({ error: 'Asset not found' });
    }
    const trades = await Trade.find({ AssetName: asset.AssetName });
    for (let i = 0; i < trades.length; i++) {
      const trade = trades[i];
      trade.Value = asset.Price;
      await trade.save();
    }
    res.json(asset);

  } catch (error) {
    console.error('Error updating asset:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//  ------------------ TRADES ---------------------

// Adds trade to DB or updates
router.post('/addTrade', async (req, res) => {
  try {
    // Extract the trade data from the request body
    const { AssetID, Category, Value, Email } = req.body;

    // Check if a trade with the same asset and username exists
    const existingTrade = await Trade.findOne({ AssetName, Email });
    const theUser = await User.findOne({ Email })
    const theAsset = await Asset.findOne({ AssetName })

    if (existingTrade && theUser) {
      // If a trade exists, update its properties
      existingTrade.Amount += Amount;
      existingTrade.Value = (theAsset.Price);
      existingTrade.LastDate = new Date();

      // Save the updated trade and Balance of User
      const updatedTrade = await existingTrade.save();
      await theUser.save()

      res.status(200).json(updatedTrade);
    } else {
      // If no trade exists, create a new trade object with the current date
      const newTrade = new Trade({
        AssetName,
        Amount,
        Value,
        UserName,
        LastDate: new Date() // Set the Date field to the current date and time
      });
      const theSameEmail = await User.findOne({ Email })
      theSameEmail.Balance -= Value;
      // Save the new trade to the database
      const savedTrade = await newTrade.save();
      await theSameEmail.save()

      res.status(200).json(savedTrade);
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding/updating the trade.' });
  }
});

// Deletes trade from DB or updates
router.post('/reduceTrade', async (req, res) => {
  try {
    // Extract the trade data from the request body
    const { AssetName, Amount, Value, UserName } = req.body;

    // Find the trade with the given asset and username
    const existingTrade = await Trade.findOne({ AssetName, UserName });
    const theUser = await User.findOne({ Email })
    const theAsset = await Asset.findOne({ AssetName })

    if (existingTrade) {
      if (Amount < existingTrade.Amount) {
        // If the new amount is less than the current amount, update the trade
        existingTrade.Amount -= Amount;
        existingTrade.Value = (existingTrade.Amount * theAsset.Price);
        existingTrade.LastDate = new Date();
        theUser.Balance += Value;

        // Save the updated trade
        const updatedTrade = await existingTrade.save();
        await theUser.save();

        res.status(200).json(updatedTrade);
      }
      else if (Amount === existingTrade.Amount) {

        theUser.Balance += Value;
        await theUser.save();
        existingTrade.deleteOne();
        res.status(200).json({ message: 'Trade deleted successfully.' });
      } else {
        // If the new amount is greater than the current amount, it is not a possible action
        res.status(400).json({ error: 'Invalid action. The requested amount is greater than the current amount.' });
      }
    } else {
      res.status(404).json({ error: 'Trade not found.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while reducing/deleting the trade.' });
  }
});

// Gets candidate keys of user and asset and returns the amaount field of the relevante trade
router.post('/getOwnedAmount', async (req, res) => {
  try {
    const { AssetName, Email } = req.body;

    // Find the trade with the specified asset name and user name
    const trade = await Trade.findOne({ AssetName, UserName });

    if (trade) {
      // Return the owned amount for the asset
      res.status(200).json({ amount: trade.Amount });
    } else {
      // If no trade exists for the asset and user, return 0 as the owned amount
      res.status(200).json({ amount: 0 });
    }
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while retrieving the owned amount.' });
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

// Sends all the trades from DB to allTrades page
router.get('/alltrades', async (req, res) => {
  try {
    // Retrieve all trades from the database
    const trades = await Trade.find({}, { _id: 0, __v: 0 }).sort({ Value: -1 });
    res.json(trades);
  } catch (error) {
    console.error('Error retrieving trades:', error);
    res.status(500).json({ error: 'Failed to retrieve trades' });
  }
});

// Sends all the amaounts of assets that a user has to the trade page
router.get('/user/asset', async (req, res) => {
  const email = req.query.email;
  try {
    // Find all trades for the specified user
    const trades = await Trade.find({ Email: email });

    // Create an object to store the asset amounts
    const AssetAmounts = {};

    // Iterate over the trades and calculate the total amount for each asset
    for (const trade of trades) {
      const AssetName = trade.AssetName;
      const amount = trade.Amount;

      // Update the asset amount in the object
      assetAmounts[assetName] = (assetAmounts[assetName] || 0) + amount;
    }
    res.json(assetAmounts);
  } catch (error) {
    console.error('Error fetching asset amounts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;