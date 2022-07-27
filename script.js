const LoginWithEmailAddress = () => {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let titleId = document.getElementById("titleId").value
  let raw = JSON.stringify({
    "TitleId": titleId,
    "Email": document.getElementById("email").value,
    "Password": document.getElementById("password").value
  });

  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({
      "TitleId": titleId,
      "Email": document.getElementById("email").value,
      "Password": document.getElementById("password").value,
    }),
    redirect: 'follow'
  };

  let url = "https://" + titleId + ".playfabapi.com/Client/LoginWithEmailAddress"
  fetch(url, requestOptions)
    .then(response => response.text())
    .then(result => document.getElementById("loginData").innerHTML = result)
    .then(alert("Logged in successful!"))
    .catch(error => console.log('error', error));

}

const GetSessionTicket = () => {
  let sessionTicket = JSON.parse(document.getElementById("loginData").value).data.SessionTicket;
  console.log(sessionTicket);
  return sessionTicket;
}

const GetPlayFabId = () => {
  let playFabId = JSON.parse(document.getElementById("loginData").value).data.PlayFabId;
  console.log(playFabId);
  return playFabId;
}

const GetMatchResult = () => {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({
    "MatchId": document.getElementById("matchIdToGet").value,
    "PlayFabId": GetPlayFabId(),
    "SessionTicket": GetSessionTicket()
  });

  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  document.getElementById("playFabId").setAttribute('value', GetPlayFabId());

  fetch("https://blooming-plains-80499.herokuapp.com/v1/api/match/byId", requestOptions)
    .then(response => response.text())
    .then(result => document.getElementById("matchData").innerHTML = result)
    .catch(error => console.log('error', error));
}

const RecordMatchResult = () => {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({
    "MatchId": document.getElementById("matchIdToAdd").value,
    "PlayFabId": document.getElementById("playFabId").value,
    "Score": document.getElementById("score").value,
    "End": document.getElementById("end").value
   });

  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://blooming-plains-80499.herokuapp.com/v1/api/match/", requestOptions)
    .then(response => response.text())
    .then(result => alert({ message: 'match recorded'}))
    .catch(error => console.log('error', error));
}

const GetPlayerStatistics = () => {
  let myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  let raw = JSON.stringify({
    "PlayFabId": document.getElementById("playFabId").value
   });

  let requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://blooming-plains-80499.herokuapp.com/v1/api/player/byId", requestOptions)
    .then(response => response.text())
    .then(result => document.getElementById("playerStatistics").innerHTML = result)
    .catch(error => console.log('error', error));
}
