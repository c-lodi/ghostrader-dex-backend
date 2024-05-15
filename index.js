const express = require("express");
const Moralis = require("moralis").default;
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const port = 3001;

app.use(cors());
app.use(express.json());

// app.get("/tokenList")

app.get("/tokenPrice", async (req, res) => {
  // return res.status(200).json(usdPrices);

  const { query } = req;

  const responseOne = await Moralis.EvmApi.token.getTokenPrice({
    address: query.addressOne
  })

  const responseTwo = await Moralis.EvmApi.token.getTokenPrice({
    address: query.addressTwo
  })

  console.log(responseOne.raw, responseTwo.raw)

  const usdPrices = {
    tokenOne: responseOne.raw.usdPrice,
    tokenTwo: responseTwo.raw.usdPrice,
    ratio: responseOne.raw.usdPrice / responseTwo.raw.usdPrice
  }

  return res.status(200).json(usdPrices);

});



//fetch-dex-endpoint
app.get('/allowance', async (req, res) => {


  const { tokenAddress, walletAddress } = req.query;
  const url = "https://api.1inch.dev/swap/v6.0/1/approve/allowance";

  const config = {
    headers: {
      "Authorization": `Bearer ${process.env.API_KEY}`
    },
    params: {
      "tokenAddress": tokenAddress,
      "walletAddress": walletAddress
    }
  };

  try {
    const response = await axios.get(url, config);
    console.log(response.data);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
  }

});



//approveTransaction

app.get('/approveTransaction', async (req, res) => {


  const { tokenAddress, walletAddress } = req.query;
  const url = "https://api.1inch.dev/swap/v6.0/1/approve/transaction";

  const config = {
    headers: {
      "Authorization": `Bearer ${process.env.API_KEY}`
    },
    params: {
      "tokenAddress": tokenAddress

    }
  };

  try {
    const response = await axios.get(url, config);
    console.log(response.data);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
  }

});


//make-swap

app.get('/makeSwap', async (req, res) => {

  const { src, dst, amount, from, slippage } = req.query;
  const url = "https://api.1inch.dev/swap/v6.0/{chain}/swap";

  const config = {
    headers: {
      "Authorization": `Bearer ${process.env.API_KEY}`
    },
    params: {
      "src": src,
      "dst": dst,
      "amount": amount,
      "from": from,
      "slippage": slippage
    }
  };

  try {
    const response = await axios.get(url, config);
    console.log(response.data);
    return res.status(200).json(response.data);
  } catch (error) {
    console.error(error);
  }

});

Moralis.start({
  apiKey: process.env.MORALIS_KEY,
}).then(() => {
  app.listen(port, () => {
    console.log(`Listening for API Calls`);
  });
});
