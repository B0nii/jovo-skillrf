// ------------------------------------------------------------------
// APP CONFIGURATION
// ------------------------------------------------------------------

module.exports = {
    logging: true,
 
    intentMap: {
       'PlayPodcastIntent':'PlayIntent',
       'FirstPodcastIntent':'FirstPodcast',
       'PlayPodcastLastIntent':'PlayPodcastLast',
       'AMAZON.PauseIntent':'PauseIntent',
       'AMAZON.ResumeIntent':'ResumeIntent',
       'AMAZON.NextIntent': 'NextIntent',
       'AMAZON.PreviousIntent': 'PreviousIntent',
       'AMAZON.HelpIntent': 'HelpIntent',
       'AMAZON.StopIntent': 'AMAZON.CancelIntent',
       'AMAZON.CancelIntent': 'AMAZON.CancelIntent',

    },
 
    db: {
        //  FileDb: {
        //      pathToFile: '../db/db.json',
        //  },
        MySQL:{
            tableName:'LaManoPeluda',
            connection:{
                host: process.env.MYSQL_ADDR || 'us-cdbr-east-06.cleardb.net',
                port: process.env.MYSQL_PORT || '3306',
                user: process.env.MYSQL_USER || 'b652ed8eb676bf',
                password: process.env.MYSQL_PASSWORD || '53802885',
                database: process.env.MYSQL_DATABASE || 'heroku_b4334d446aa75d1'
            }
        }
        // DynamoDb: {
        //     tableName: 'la-mano-peluda',
        // },
     },
 };
 