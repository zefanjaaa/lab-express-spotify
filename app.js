require("dotenv").config();
const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const hbs = require("hbs");

// require spotify-web-api-node package here:

const app = express();

app.set("view engine", "hbs");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});
// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then((data) => spotifyApi.setAccessToken(data.body["access_token"]))
  .catch((error) =>
    console.log("Something went wrong when retrieving an access token", error)
  );
// Our routes go here:

//route to homepage
app.get("/", (req, res) => {
  res.render("index", { layout: false });
});

//artist search

app.get("/searchArtist", (req, res) => {
  spotifyApi
    .searchArtists(req.query.searchArtist, { limit: 5 })
    .then((data) => {
      // console.log("The received data from the API: ", data.body);
      res.render("./artist-search-results", {
        artists: data.body.artists.items,
      });
    })
    .catch((err) =>
      console.log("The error while searching artists occurred: ", err)
    );
});

app.get("/albums/:id", (req, res) => {
  spotifyApi
    .getArtistAlbums(req.params.id, { limit: 3 })
    .then((data) => {
      console.log("Artist album", data.body);
      res.render("./albums", {
        albums: data.body.items,
      });
    })
    .catch((error) => console.log("The error is:", error));
});

app.get("/track/:id", (req, res) => {
  spotifyApi
    .getAlbumTracks(req.params.id, { limit: 5 })
    .then((data) => {
      console.log("Album Tracks", data.body);
      res.render("./track", {
        tracks: data.body.items,
      });
    })
    .catch((error) => console.log("The error is:", error));
});
app.listen(3001, () =>
  console.log("My Spotify project running on port 3001 🎧 🥁 🎸 🔊")
);
