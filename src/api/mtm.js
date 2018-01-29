import moment from 'moment';
import axios from 'axios';
import Song from '../entities/Song.js';
import SongRank from '../entities/SongRank.js';
import MediaItem from '../entities/MediaItem.js';
import ChartPosition from '../entities/ChartPosition.js';

const BASE_URL = "http://localhost:8888/api";

export default class MusicAPI {

  constructor() { }

  /**
   * Handles errors in request
   */
  static handleError = (error) => {
    var message = "Unreachable server error";
    if (error.response.data.errors[0] != undefined) {
      message = error.response.data.errors[0].details;
    }

    throw new Error(message);
  };

  /**
   * Get songs in the billboard chart in a given date
   */
  static getChart = (date) => {

    let BILLBOARD_URL = "http://localhost:9006/billboard/charts/" + date + "?filter=song";

    return axios.get(BILLBOARD_URL)
      .then(function (res) {

        let result = res.data;
        let chart = [];

        result.forEach((chartItem) => {
          chart.push(new ChartPosition(chartItem['rank'], chartItem['song_id'], chartItem['song_name'], chartItem['display_artist']));
        });

        return chart;
      })
      .catch(function (error) {
        MusicAPI.handleError(error);
      });
  };

  /**
   * Get song information given an id
   */
  static getSongInfo = (id) => {
    // TODO: Implement!

    let BILLBOARD_URL = "http://localhost:9006/billboard/music/song/" + id;
    let SONG = null;
    let TRACK = null;
    let SONG_OBJ = null;

    return axios.get(BILLBOARD_URL)
      .then(function (res) {
        SONG = res.data;
        let spotify_id = SONG['song']['spotify_id'];

        let SPOTIFY_URL = "http://localhost:9007/spotify/v1/tracks/" + spotify_id;

        return axios.get(SPOTIFY_URL)
          .then(function (res) {
            TRACK = res.data;
            let album_id = TRACK['album']['id'];

            let SPOTIFY_URL = "http://localhost:9007/spotify/v1/albums/" + album_id;

            return axios.get(SPOTIFY_URL)
              .then(function (res) {
                let album_result = res.data;
                SONG_OBJ = new Song(id, SONG.song['song_name'], SONG.song['display_artist'], album_result['name'], album_result['release_date'], TRACK['duration_ms'], TRACK['external_urls']['spotify'], TRACK['album']['images'][0]['url']);
                return SONG_OBJ;
              })
              .catch(function (error) {
                MusicAPI.handleError(error);
              });  
          })
          .catch(function (error) {
            MusicAPI.handleError(error);
          }); 
      })
      .catch(function (error) {
        MusicAPI.handleError(error);
      });   
  };

  /**
   * Get historical ranks of a song given an id
   */
  static getSongRankings = (id) => {
    let BILLBOARD_URL = "http://localhost:9006/billboard/music/song/" + id;
    let RANK_OBJ = null;

    return axios.get(BILLBOARD_URL)
      .then(function (res) {
        let song_result = res.data;
        let rankings = [];

        song_result.rankings.forEach((ranking) => {
          rankings.push(new SongRank(ranking.date, ranking.rank));
        });
        return rankings;
      })
      .catch(function (error) {
        MusicAPI.handleError(error);
      });
  };

  /**
   * Get related media of a song given an id.
   */
  static getSongMedia = (id) => {
    let requestUrl = BASE_URL + "/songs/" + id + "/media?n=4";

    return axios.get(requestUrl)
      .then(function (response) {
        let result = response.data.data;

        let media = [];
        
        result.forEach((mediaObj) => {
          media.push(new MediaItem(mediaObj.url, mediaObj.caption, mediaObj.thumbnail));
        });

        return media;
      })
      .catch(function (error) {
        MusicAPI.handleError(error);
      });  
  };
}
