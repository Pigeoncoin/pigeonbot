const stringSimilarity = require('string-similarity');
const settings = require('./settings');
var data = {}; // we use this as a value store

// setup discord
const Discord = require('discord.js');
const client = new Discord.Client();
client.login(settings.key);

// setup firebase
const firebase = require('firebase')

var config = {
  apiKey: "AIzaSyDSb7CJlXlzJjQPE9IRVRTZpCjeJwAgk54",
  authDomain: "pigeoncoin-api.firebaseapp.com",
  databaseURL: "https://pigeoncoin-api.firebaseio.com",
  projectId: "pigeoncoin-api",
  storageBucket: "pigeoncoin-api.appspot.com",
  messagingSenderId: "16957585674"
};

firebase.initializeApp(config);
const db = firebase.database()
const latestRef = db.ref('latestData')

latestRef.on('value', snap => {
  const latestData = snap.val()
  data = latestData // store to global var
  console.log(data)
})

// const https = require('https');

// function updateData(latestData){
//   const mergeMe = {
//     chain: {
//       blockTime: latestData.chain.blockTime,
//       difficulty: latestData.chain.difficulty,
//       hashrate: latestData.chain.hashrate,
//       height: latestData.chain.height,
//       supply: latestData.chain.supply,
//       // timestamp: latestData.chain.timestamp,
//     },
//     market: {
//       marketCapBtc: latestData.market.marketCapBtc,
//       marketCapUsd: latestData.market.marketCapUsd,
//       priceBtc: latestData.market.priceBtc,
//       priceUsd: latestData.market.priceUsd,
//       // timestamp: latestData.market.timestamp,
//       volumeBtc: latestData.market.volumeBtc,
//       volumeUsd: latestData.market.volumeUsd,
//     },
//     pool: {
//       dailyBlocks: latestData.pool.dailyBlocks,
//       hashrate: latestData.pool.hashrate,
//       lastBlock: latestData.pool.lastBlock,
//       lastBlockTime: latestData.pool.lastBlockTime,
//       miners: latestData.pool.miners,
//       timeToFind: latestData.pool.timeToFind,
//       // timestamp: latestData.pool.timestamp,
//     }
//   }
// }

// main();
//
// setInterval( main , 1000*60*1)
//
// function main(){
//   promiseJSON('https://explorer.pigeoncoin.org:8000')
//     .then(json => {
//     data = json;
//   })
// }



  //////////////////////
  // https functions
  //////////////////////

// function promiseJSON(url) {
//   return new Promise((resolve, reject) => {
//     https.get(url, res => {
//       res.setEncoding("utf8");
//       let body = "";
//
//       res.on("data", data => {
//         // save stream as body
//         body += data;
//       });
//
//       res.on("end", () => {
//         // resolve with the JSON object from the body!
//         resolve(JSON.parse(body));
//       });
//     });
//   });
// }


//////////////////////
// string functions
//////////////////////

function cleanMessage(message){
  let deleteThis = ['!','when','help','who','what','where','how','why']
  let result = message

  for(item in deleteThis){
    result = result.replace(deleteThis[item],'');
  }

  // delete all leading and trailing spaces
  result = result.trim()

  return result;
}


function getReply(cleanedMessage){
  // match a cleaned up message

  const newsChannel = "<#428888110634500097>";
  const faqChannel =  "<#427877188990402571>";

  let dictionary = {

    'stats':        {response: `!price, !volume, !marketcap, !supply, !hashrate, !difficulty, !blocktime, !retarget :chart_with_upwards_trend:`},
    'blockchain':   {response: `${Number(data.hashrate.toPrecision(2))} GH, ${Math.round(data.difficulty)} diff, ${data.blockTime.toFixed(1)} min/block, ${data.retarget} blocks and ${Number((data.retarget * data.blockTime / 60).toPrecision(2))} hours to retarget`},
    'market':       {response: `we're trading at ${data.price * 1e8} satoshis, with ${Number(data.volume.toPrecision(2))} BTC daily volume, and a ${Number(data.marketCap.toPrecision(2))} BTC market cap`},

    'price':        {response: `price is **${data.price * 1e8} satoshis**`},
    'volume':       {response: `volume is **${Number(data.volume.toPrecision(2))} BTC** per day`},
    'marketcap':    {response: `market cap is **${Number(data.marketCap.toPrecision(2))} BTC**`},
    'supply':       {response: `circulating supply is **${Number((data.supply / 1e6).toPrecision(2))}M PGN**`},
    'hashrate':     {response: `network hashrate is **${Number(data.hashrate.toPrecision(2))} GH**.`},
    'difficulty':   {response: `difficulty is **${Math.round(data.difficulty)}** for the next **${Number((data.retarget * data.blockTime / 60).toPrecision(2))} hours**.`},
    'blocktime':    {response: `blocktime is approximately **${data.blockTime.toFixed(1)} minutes**, with a target of 1 minute`},
    'blockheight':  {response: `blockheight is **${data.height.toLocaleString()} blocks**`},
    'retarget':     {response: `difficulty will retarget in **${data.retarget} blocks** and **${Number((data.retarget * data.blockTime / 60).toPrecision(2))} hours**`},

    'pool':         {response: `https://pool.pigeoncoin.org/ *Supports development*\nOther pools can be found in ${faqChannel}`},
    'explorer':     {response: `https://explorer.pigeoncoin.org`},
    'website':      {response: `https://pigeoncoin.org`},
    'exchange':     {response: `we have trading pairs with Ravencoin, Litecoin, and Bitcoin on CryptoBridge! https://crypto-bridge.org/`},
    'roadmap':      {response: `roadmap is in progress! We will announce updates in ${newsChannel}`},
    'whitepaper':   {response: `the X16S (shuffle) mini-whitepaper is here https://pigeoncoin.org/assets/X16S-whitepaper.pdf`},
    'whattomine':   {response: `Pigeoncoin, of course! https://pool.pigeoncoin.org/`},
    'miners':       {response: `https://pigeoncoin.org/mining`},
    'release':      {response: `https://github.com/Pigeoncoin/pigeoncoin/releases`},
    'donate':       {response: 'please donate!\n\nPigeoncoin: `PDiZ89gk5HMqwrcGp6Hs9WdgFALzLbD4HG` \nBitcoin: `1NaVP4cKiWY6MxSDkTCZ2kh5Xm3coA27Qv`'},

    'twitter':      {response: `https://twitter.com/Pigeoncoin`},
    'github':      {response: `https://github.com/Pigeoncoin`},
    'reddit':      {response: `https://www.reddit.com/r/Pigeoncoin/`},
    'telegram':      {response: `https://t.me/Pigeoncoin`},
    'medium':      {response: `https://medium.com/@pigeoncoin`},

    'mobile':       {response: `keep an eye out for the roadmap!  ${newsChannel}`},

    'masternode':   {response: `never.`},

    'coinmarketcap':       {response: `when we have $100k USD daily volume on all exchanges.`},
    'coingecko':       {response: `we're there! https://www.coingecko.com/en/coins/pigeoncoin`},
    'livecoinwatch':       {response: `livecoinwatch listing is in progress!`},
    'whattomine':       {response: `we need to be listed on Abucoins, Bitfinex, Bittrex, Binance, Cryptopia, HitBTC, Poloniex or YoBit first!`},

    'cryptobridge': {response: `we have trading pairs with Ravencoin, Litecoin, and Bitcoin on CryptoBridge! https://crypto-bridge.org/`},
    'cobinhood': {response: `we are speaking with Cobinhood and are expecting a determination around Q3 2018.`},
    'cryptopia': {response: 'when you donate all your Pigeon to `PDiZ89gk5HMqwrcGp6Hs9WdgFALzLbD4HG`'},
    'bittrex': {response: 'when you donate all your Pigeon to `PDiZ89gk5HMqwrcGp6Hs9WdgFALzLbD4HG`'},
    'binance': {response: 'when you donate all your Pigeon to `PDiZ89gk5HMqwrcGp6Hs9WdgFALzLbD4HG`'},
    'coinbase': {response: 'when you donate all your Pigeon and your first born child to `PDiZ89gk5HMqwrcGp6Hs9WdgFALzLbD4HG`'},

    'birthday': {response: `March 21st!`},
    'timestamp': {response: `Reuters 21/Mar/2018 China stays on the sidelines as Venezuela spirals downward.`},
    'maxsupply': {response: `max supply is **21B PGN**`},
    'blockreward': {response: `**5000 PGN** is awarded every minute`},

    'moon': {reaction: '🚀'},
    'lambo': {reaction: `when lambo?! When land!`},
    'surfin': {response: `:surfer:\nhttps://www.youtube.com/watch?time_continue=80&v=gBexh377HbQ`},
    'handsome boy': {files: ['./img/handsome-boy.jpg']},
    'nasdaq': {reaction: '📈'},
    'good bot': {reaction: '👍'},
    'bad bot': {reaction: '👎'},
    'lorem ipsum': {response: `dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`},

    'lunch': {reaction: '430547800363630602'},
    'pigeon soup': {reaction: ['🕊','430547800363630602','🧀','🍜']},

    'stuck transaction': {response: `check this out https://bitzuma.com/posts/how-to-clear-a-stuck-bitcoin-transaction/`}
  }

  const shorthand = [
    {key: 'diff', inherits: 'difficulty'},
    {key: 'diff change', inherits: 'retarget'},
    {key: 'difficulty change', inherits: 'retarget'},
    {key: 'height', inherits: 'blockheight'},

    {key: 'wallet', inherits: 'release'},

    {key: 'ios', inherits: 'mobile'},
    {key: 'android', inherits: 'mobile'},
    {key: 'spv', inherits: 'mobile'},
    {key: 'mobile wallet', inherits: 'mobile'},
    {key: 'spv wallet', inherits: 'mobile'},

    {key: 'airdrop', inherits: 'masternode'},
    {key: 'faucet', inherits: 'masternode'},
    {key: 'securenode', inherits: 'masternode'},

    {key: 'cmc', inherits: 'coinmarketcap'},

    {key: 'cb', inherits: 'cryptobridge'},
    {key: 'gdax', inherits: 'coinbase'},
    {key: 'thanks bot', inherits: 'good bot'}
  ]


  for(item in shorthand){
    const newKey = shorthand[item].key
    const inherits = shorthand[item].inherits

    if(dictionary[inherits]){
        dictionary[newKey] = dictionary[inherits]
    }
  }


  const matches = stringSimilarity.findBestMatch(cleanedMessage, Object.keys(dictionary));

  if(matches.bestMatch.rating > 0.6){
    return Object.assign(dictionary[matches.bestMatch.target],{'rating':matches.bestMatch.rating})
  }
}


  //////////////////////
  // discord
  //////////////////////


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// client.on('message', message => {
//   if( message.content.trim().startsWith('!') ){
//     let replyObject = getReply(cleanMessage(message.content))
//
//     // reply is allowed if the role is hoisted from @everyone
//     // and the message is not in general
//     // reactions are allowed anywhere
//     const spamChannel = 439057355968217088
//     let hoisted = null
//     let privateMessage = null
//
//
//     if(message.member){
//         hoisted = !!message.member.roles.find("hoist", true)
//     }else{
//         privateMessage = true
//     }
//
//     const isAllowed = message.channel.id == spamChannel || hoisted || privateMessage
//
//     if(replyObject){
//       let reaction = replyObject.reaction
//       let response = replyObject.response
//       let images = replyObject.files
//
//       // reactions
//       if(reaction) {
//         if(typeof reaction === 'string') reaction = [reaction]; // convert strings to arrays
//
//         for(emoji in reaction){
//           if(reaction[emoji].length > 10){
//             message.react(message.guild.emojis.get(reaction[emoji]))
//           }
//           else {
//             message.react(reaction[emoji])
//           }
//         }
//       }
//
//       // response
//       if((response || images)){
//           // are they allowed to bot in this channe?
//           if(isAllowed){
//               // reply in channel
//               message.reply(response, {
//                 files: images
//               });
//           }else{
//               // delete message
//               // PM sender
//               message.react('👋')
//                 .then(message.delete(2000))
//
//               message.author.send(response, {
//                 files: images
//               })
//           }
//       }
//     }else{
//         message.react('❓')
//           .then(message.delete(2000))
//     }
//
//   }
// });