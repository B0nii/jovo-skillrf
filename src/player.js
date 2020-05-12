const https = require('https');

const fun1 = function () {
	return new Promise((resolve, reject) => {
      const request = https.get(`https://peaceful-inlet-91575.herokuapp.com/la-mano-peluda`, response => {
          response.setEncoding('utf8');
         
          let returnData = '';
          if (response.statusCode < 200 || response.statusCode >= 300) {
              return reject(new Error(`${response.statusCode}: ${response.req.getHeader('host')} ${response.req.path}`));
          }
         
          response.on('data', chunk => {
              returnData += chunk;
          });
         
          response.on('end', () => {
              returnData = JSON.parse(returnData);
              resolve(returnData);
          });
         
          response.on('error', error => {
              reject(error);
          });
      });
      request.end();
  });
}

// async function getAudio(){
//     const response = await fun1();
//     return response;

//     console.log(response)
// }

// getAudio();

module.exports = {
    getLatestEpisode: async  function() {
         const response = await fun1();
        //   return episodesJSON[0];
        return response[response.length - 1];
    },

    getFirstEpisode: async function() {
         const response = await fun1();
         return response[0];
        //  return response[response.length - 1];
        //  return episodesJSON[episodesJSON.length - 1];
    },

    getNextEpisode: async function(index) {
        const response = await fun1();
        return response[index + 1];
    },

    getPreviousEpisode: async function(index) {
        const response = await fun1();
        return response[index - 1];
    },

    getEpisode:async function(index) {
        const response = await fun1();
        return response[index];
    },

    getEpisodeIndex: async function(episode) {
        
        const response = await fun1();
        return response.findIndex(obj => obj.title[0]==episode.title[0]);
         
   
    }

    
}