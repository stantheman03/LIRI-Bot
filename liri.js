// global varibales for each function
var spotify  = '';
var spotifyAPI = require('node-spotify-api');
var sKeys = require('./keys.js');
var fs = require('fs');
var request = require('request');
var moment = require('moment')

var command = process.argv[2]
var userInput = process.argv[3]

switch (command) {
    case 'spotify-this-song':
        var songName = userInput;
        spotifyThis(songName);
        break;

    case 'concert-this':
        bandName = userInput;
        concertThis(bandName)
        break;


    case 'movie-this':
        movieName = userInput;
        movieThis(movieName);
        break;

    case 'do-what-it-says':
        doIt()
        break;

    default:
        console.log("Enter a valid command")
}


// Functions for spotify
function spotifyThis(songName) {
     spotify = new spotifyAPI({
        id: sKeys.spotifyKeys.client_id,
        secret: sKeys.spotifyKeys.client_secret
    });
    console.log(spotify)
}
if(songName === null){
    songName = 'The Sign Ace of Base'
}
var newSong = songName;

spotify.search({ type: 'track', query: newSong }, function (error, data) {
    if (!error && songName != null) {
        for (var i = 0; i < data.tracks.items.length; i++) {
            var artists = data.tracks.items[i].artists[0].name;
            var name = data.tracks.items[i].name;
            var preview = data.tracks.items[i].preview_url;
            var album = data.tracks.items[i].album.name;
            console.log('-------------------------------')
            console.log('Artists:' + artists)
            console.log('Song Name:' + name)
            console.log('Preview of Song:' + preview)
            console.log('Album:' + album)
            console.log('-------------------------------')
        }
    }
    else {
        console.log("Error:" + error);
    }
})


// for movie part 
function movieThis(movieName) {
    request('http://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&apikey=trilogy', function (error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log('-------------------------------------------------------------------------')
            console.log('Title of the movie ' + JSON.parse(body).Title);
            console.log('Year the movie came out' + JSON.parse(body).Year)
            console.log('IMBD rating of the movie ' + JSON.parse(body).imbdRating);
            console.log('Rotten Tomatoes Ratin of this movie ' + JSON.parse(body).Ratings);
            console.log('Country where the movie was produced ' + JSON.parse(body).Country);
            console.log('Language of the movie ' + JSON.parse(body).Language);
            console.log('Plot of the movie ' + JSON.parse(body).Plot);
            console.log('Actors in the movie' + JSON.parse(body).Actors);
            console.log('-------------------------------------------------------------------------')

        }
        else {
            console.log("Error:" + error);
        }
    });
}

// for bandsinTown
function concertThis(bandName){
    request('https://rest.bandsintown.com/artists/' + bandName + '/events?app_id=codingbootcamp', function(error, response, body){
        if(!error && response.statusCode === 200){
            var result = JSON.parse(body)[0]
            console.log('--------------------------------------------------------')
            console.log('Name of the Venue ' + result.venue.name);
            console.log('Venue location ' + result.venue.city);
            console.log('Date of the event' + moment(result.datetime).format("MM/DD/YYYY"));
            console.log('---------------------------------------------------------')
        }
        else{
            console.log("Error: " + error)
        }
    })
}

//  do it function
function doIt() {
    fs.readFile('random.txt', 'utf8', function (error, data) {
        if (error) {
            console.log('Error:' + error)
        }
        else {
            var thingsToDo = data.split(",")
            command = thingsToDo[0];
            userInput = thingsToDo[1];
            switch (command) {
                case 'spotify-this-song':
                    var songName = userInput;
                    spotifyThis(songName);
                    break;

                case 'movie-this':
                    movieName = userInput;
                    movieThis(movieName);
                    break;

                case 'concert-this':
                    bandName = userInput;
                    concertThis(bandName)
                    break;

                case 'do-what-it-says':
                    doIt()
                    break;

                default:
                    console.log("Enter a valid command")
            }

        }
    })
}

