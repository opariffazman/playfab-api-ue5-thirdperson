const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const secretKey = 'NSEFPFYSQEJA9GARTKQ68BODIY4HRD9B9TWOXBACRJUHIIBZIZ'
const titleId = 'DA7D0'

const app = express();
const port = 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.listen(port, () => console.log(`listening on http://localhost:${port}`));

// GetMatchResult ==================================================
// Invoked by Player -> Passes SessionTicket as X-Authorization
// http://localhost:8080/v1/api/match/byId
app.post('/v1/api/match/byId', (req, res) => {
  const matchId = req.body.MatchId;
  const playFabId = req.body.PlayFabId;
  const sessionTicket = req.body.SessionTicket;
  GetUserData(matchId, playFabId, sessionTicket).then(data => {
    res.send(data);
  });
});

// PlayFab API Calls for GetUserData
// https://${titleId}.playfabapi.com/Client/GetUserData
const PlayFabGetUserData = (matchId, playFabId, xauth) => {
  let requestOptions = {
    method: 'POST',
    url: `https://${titleId}.playfabapi.com/Client/GetUserData`,
    headers: {
      'X-Authorization': xauth,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "PlayFabId": playFabId,
      "Keys": [
        matchId
      ]
    })

  };

  return new Promise((resolve) => {
    request(requestOptions, function (error, response) {
      if (error) throw new Error(error);
      resolve(JSON.parse(response.body));
    });
  })
}

// async function to return match result in JSON response
async function GetUserData(matchId, playFabId, xauth) {
  let response = await PlayFabGetUserData(matchId, playFabId, xauth);
  console.log(response.data);
  return response.data;
}

// RecordMatchResult ==================================================
// Invoked by Client (Game) -> Passes API Secret Key
// http://localhost:8080/v1/api/match/
app.post('/v1/api/match/', (req, res) => {
  const matchId = req.body.MatchId;
  const playFabId = req.body.PlayFabId;
  const score = req.body.Score;
  const end = req.body.End;
  SetUserData(matchId, playFabId, score, end).then(data => {
    res.send(data);
  });
});

// PlayFab API Calls for UpdateUserData
// https://${titleId}.playfabapi.com/Server/UpdateUserData
const PlayFabSetUserData = (matchId, playFabId, score, end) => {
  let propertyName = matchId;
  let requestOptions = {
    method: 'POST',
    url: `https://${titleId}.playfabapi.com/Server/UpdateUserData`,
    headers: {
      'X-SecretKey': secretKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      PlayFabId: playFabId,
      Data: {
        [propertyName]: `[{\"matchId\":\"${matchId}\",\"score\":${score},\"end\":${end}}]`
      }
    })
  };

  return new Promise((resolve) => {
    request(requestOptions, function (error, response) {
      if (error) throw new Error(error);
      resolve(JSON.parse(response.body));
    });
  })
}

// async function to return response in JSON
async function SetUserData(matchId, xauth, score, end) {
  let response = await PlayFabSetUserData(matchId, xauth, score, end);
  console.log(response.data);
  return response.data;
}

// GetPlayerStatistics ==================================================
// Invoked by Client (Game) -> Passes API Secret Key
// http://localhost:8080/v1/api/player/byId
app.post('/v1/api/player/byId', (req, res) => {
  const playFabId = req.body.PlayFabId;
  GetPlayerStatistics(playFabId).then(data => {
    res.send(data);
  });
});

// PlayFab API Calls for GetPlayerStatistics
// https://${titleId}.playfabapi.com/Server/GetPlayerStatistics
const PlayFabGetPlayerStatistics = (playFabId) => {
  let requestOptions = {
    'method': 'POST',
    'url': `https://${titleId}.playfabapi.com/Server/GetPlayerStatistics`,
    'headers': {
      'X-SecretKey': secretKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "PlayFabId": playFabId,
      "StatisticName": "HighestJumpInMatch"
    })

  };

  return new Promise((resolve) => {
    request(requestOptions, function (error, response) {
      if (error) throw new Error(error);
      resolve(JSON.parse(response.body));
    });
  })

}

// async function to return response in JSON
async function GetPlayerStatistics(playFabId) {
  let response = await PlayFabGetPlayerStatistics(playFabId);
  console.log(JSON.stringify(response.data.Statistics));
  return response.data.Statistics;
}

// UpdatePlayerStatistics ==================================================
// Invoked by Client (Game) -> Passes API Secret Key
// http://localhost:8080/v1/api/player/
app.post('/v1/api/player/', (req, res) => {
  const playFabId = req.body.PlayFabId;
  const score = req.body.Score;
  UpdatePlayerStatistics(playFabId, score).then(data => {
    res.send(data);
  });
});

// PlayFab API Calls for UpdatePlayerStatistics
// https://${titleId}.playfabapi.com/Server/UpdatePlayerStatistics
const PlayFabUpdatePlayerStatistics = (playFabId, score) => {
  let requestOptions = {
    method: 'POST',
    url: `https://${titleId}.playfabapi.com/Server/UpdatePlayerStatistics`,
    headers: {
      'X-SecretKey': secretKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "PlayFabId": playFabId,
      "Statistics": [
        {
          "StatisticName": "HighestJumpInMatch",
          "Value": score
        }
      ]
    })
  };

  return new Promise((resolve) => {
    request(requestOptions, function (error, response) {
      if (error) throw new Error(error);
      resolve(JSON.parse(response.body));
    });
  })
}

// async function to return response in JSON
async function UpdatePlayerStatistics(playFabId, score) {
  let response = await PlayFabUpdatePlayerStatistics(playFabId, score);
  console.log(response);
  return response.data;
}
