'use strict';

// ------------------------------------------------------------------
// APP INITIALIZATION
// ------------------------------------------------------------------

const { App } = require('jovo-framework');
const { Alexa } = require('jovo-platform-alexa');
const { GoogleAssistant } = require('jovo-platform-googleassistant');
const { JovoDebugger } = require('jovo-plugin-debugger');
const { MySQL } = require('jovo-db-mysql');
// const {DynamoDb} = require('jovo-db-dynamodb');
// const { FileDb } = require('jovo-db-filedb');

const Player = require('./player');

const app = new App();

app.use(
    new Alexa(),
    new GoogleAssistant(),
    new JovoDebugger(),
    new MySQL() 
    // new DynamoDb(),
);


// ------------------------------------------------------------------
// APP LOGIC
// ------------------------------------------------------------------

app.setHandler({
    
    LAUNCH() {
        if (this.$user.isNew()) {
            this.ask('Bienvenido al podcast de la mano peluda de Grupo Fórmula. Si deseas comenzar la reproducción puedes decir Alexa, Comienza el podcast. Si deseas cerrar la skill puedes decir,Alexa cancela');
            }else{
            this.ask('Bienvenido a la mano peluda de Grupo Formula.¿Te gustaria escuchar el podcast mas reciente o seguir escuchando en donde te quedaste?.Si necesitas información de la skill puedes decirme Alexa, ayuda')
        }
        
    //    return this.toIntent('HomePlayIntent');
    },
    async PlayIntent(){
        let episode;
        let currentIndex;
       
            episode = await Player.getFirstEpisode();
            currentIndex = await Player.getEpisodeIndex(episode);
            this.$user.$data.currentIndex = currentIndex;
            this.$alexaSkill.$audioPlayer
            .setTitle(`${episode.title}`)
            .setSubtitle('Grupo Radio Fórmula')
            .addArtwork('https://www.radioformula.com.mx/wp-content/uploads/2019/05/88a5ec43-c149-4b2b-8056-a5f263600c42.jpg')
            .addBackgroundImage('https://www.radioformula.com.mx/wp-content/uploads/2018/08/cover_GF_1200x630.jpg')
            .setOffsetInMilliseconds(0)
            .play(episode.enclosure[0].$.url, `${currentIndex}`)
            .tell(`reproduciendo, ${episode.title}`);
       
    },
    async FirstPodcast() {
        let episode = await Player.getFirstEpisode();
        let currentIndex =  await Player.getEpisodeIndex(episode);
        this.$user.$data.currentIndex = currentIndex;
        this.$alexaSkill.$audioPlayer.setOffsetInMilliseconds(0)
        .setTitle(`${episode.title}`)
        .setSubtitle('Grupo Radio Fórmula')
        .addArtwork('https://www.radioformula.com.mx/wp-content/uploads/2019/05/88a5ec43-c149-4b2b-8056-a5f263600c42.jpg')
        .addBackgroundImage('https://www.radioformula.com.mx/wp-content/uploads/2018/08/cover_GF_1200x630.jpg')
        .play(episode.enclosure[0].$.url, `${currentIndex}`)
        .tell(`reproduciendo, ${episode.title}`);
    },
    async PlayPodcastLast() {
        let episode;
        let currentIndex;
        currentIndex = this.$user.$data.currentIndex;
        episode = await Player.getEpisode(currentIndex);
        this.$user.$data.currentIndex = currentIndex;
        this.$alexaSkill.$audioPlayer.setOffsetInMilliseconds(0)
        .setTitle(`${episode.title}`)
        .setSubtitle('Grupo Radio Fórmula')
        .addArtwork('https://www.radioformula.com.mx/wp-content/uploads/2019/05/88a5ec43-c149-4b2b-8056-a5f263600c42.jpg')
        .addBackgroundImage('https://www.radioformula.com.mx/wp-content/uploads/2018/08/cover_GF_1200x630.jpg')
        .play(episode.enclosure[0].$.url, `${currentIndex}`)
        .tell(`reproduciendo, ${episode.title}`);

    },
    PauseIntent(){
        this.$alexaSkill.$audioPlayer.stop();

        //Guardar sesion en la base de datos
        this.$user.$data.offset = this.$alexaSkill.$audioPlayer.getOffsetInMilliseconds();
        this.tell('Pausa')
    },
   async ResumeIntent(){
        let offset = this.$user.$data.offset;
        let currentIndex = this.$user.$data.currentIndex;
        let episode = await Player.getEpisode(currentIndex);

        this.$alexaSkill.$audioPlayer
        .setTitle(`${episode.title}`)
        .setSubtitle('Grupo Radio Fórmula')
        .addArtwork('https://www.radioformula.com.mx/wp-content/uploads/2019/05/88a5ec43-c149-4b2b-8056-a5f263600c42.jpg')
        .addBackgroundImage('https://www.radioformula.com.mx/wp-content/uploads/2018/08/cover_GF_1200x630.jpg')
        .setOffsetInMilliseconds(offset)
        .play(episode.enclosure[0].$.url, `${currentIndex}`)
        .tell('continúa!');
    },
    async NextIntent() {
    let currentIndex = this.$user.$data.currentIndex;
    let nextEpisode = await Player.getNextEpisode(currentIndex);
    if (!nextEpisode) {
        return this.tell('Ya estás en el episodio más antiguo.');
    }
    currentIndex = await Player.getEpisodeIndex(nextEpisode);
    this.$user.$data.currentIndex = currentIndex;
   
        this.$alexaSkill.$audioPlayer
            .setTitle(`${nextEpisode.title}`)
            .setSubtitle('Grupo Radio Fórmula')
            .addArtwork('https://www.radioformula.com.mx/wp-content/uploads/2019/05/88a5ec43-c149-4b2b-8056-a5f263600c42.jpg')
            .addBackgroundImage('https://www.radioformula.com.mx/wp-content/uploads/2018/08/cover_GF_1200x630.jpg')
            .setOffsetInMilliseconds(0)
            .play(nextEpisode.enclosure[0].$.url, `${currentIndex}`)
            .tell(`reproduciendo, ${nextEpisode.title}`);

    },

    async PreviousIntent() {

    let currentIndex = this.$user.$data.currentIndex;
    let previousEpisode = await Player.getPreviousEpisode(currentIndex);
    if (!previousEpisode) {
        return this.tell('Este es el podcast más reciente. Tienes que esperar hasta que se publique un nuevo episodio.');
    }
    currentIndex = await Player.getEpisodeIndex(previousEpisode);
    this.$user.$data.currentIndex = currentIndex;
        this.$alexaSkill.$audioPlayer
            .setTitle(`${previousEpisode.title}`)
            .setSubtitle('Grupo Radio Fórmula')
            .addArtwork('https://www.radioformula.com.mx/wp-content/uploads/2019/05/88a5ec43-c149-4b2b-8056-a5f263600c42.jpg')
            .addBackgroundImage('https://www.radioformula.com.mx/wp-content/uploads/2018/08/cover_GF_1200x630.jpg')
            .setOffsetInMilliseconds(0)
            .play(previousEpisode.enclosure[0].$.url, `${currentIndex}`)
            .tell(`reproduciendo, ${previousEpisode.title}`);

    },
    HelpIntent() {
        this.ask('Esta habilidad reproduce una lista de transmisión de audio cuando se inicia. Puedes escuchar el podcast más reciente diciendo Alexa, reproduce el primer podcast, o puedes decir Alexa reproducir mi ultimo podcast.');
    },
    'AMAZON.CancelIntent'() {
        if (this.$alexaSkill.$audioPlayer){
            this.$alexaSkill.$audioPlayer.stop();
        }
        
        this.tell('Muy bien, ¡hasta la próxima!');
    },
    ON_ERROR() {
        console.log(`Error: ${JSON.stringify(this.$alexaSkill.getError())}`);
        console.log(`Request: ${JSON.stringify(this.$request)}`);
    
        this.tell('Hubo un error. Intentalo nuevamente');
    },
    AUDIOPLAYER: {
        'AlexaSkill.PlaybackStarted'() {//Enviado despues de comenzar a transmitir el archivo de audio 
        },

       async 'AlexaSkill.PlaybackNearlyFinished'() { //enviado cuando el archivo de audio esta casi terminado
            let currentIndex = this.$user.$data.currentIndex;
            let episode = await Player.getNextEpisode(currentIndex);
            let nextIndex = await Player.getEpisodeIndex(episode);
            if (episode) {
            this.$alexaSkill.$audioPlayer
            .setTitle(`${episode.title}`)
            .setSubtitle('Grupo Radio Fórmula')
            .addArtwork('https://www.radioformula.com.mx/wp-content/uploads/2019/05/88a5ec43-c149-4b2b-8056-a5f263600c42.jpg')
            .addBackgroundImage('https://www.radioformula.com.mx/wp-content/uploads/2018/08/cover_GF_1200x630.jpg')
            .setExpectedPreviousToken(`${currentIndex}`)
            .enqueue(episode.enclosure[0].$.url, `${nextIndex}`);
         }
        },

        'AlexaSkill.PlaybackFinished'() {//Enviado despues de que finalice la transmicion
            let currentIndex = this.$user.$data.currentIndex;
            if (currentIndex >= 0) {
            this.$user.$data.currentIndex = currentIndex + 1;
             }
        },

        'AlexaSkill.PlaybackStopped'() {//Se envia si el usuario detiene manualmente la tranmicion de audio
            this.$user.$data.offset = this.$alexaSkill.$audioPlayer.getOffsetInMilliseconds();
        },

        'AlexaSkill.PlaybackFailed'() {//Se envia despues de que Alexa encuentra un error al intentar reproducir el archivo de audio

        }
    },
    PLAYBACKCONTROLLER: {
        async 'PlayCommandIssued'() {
        let offset = this.$user.$data.offset;
        let currentIndex = this.$user.$data.currentIndex;
        let episode = await Player.getEpisode(currentIndex);

        this.$alexaSkill.$audioPlayer
        .setTitle(`${episode.title}`)
        .setSubtitle('Grupo Radio Fórmula')
        .addArtwork('https://www.radioformula.com.mx/wp-content/uploads/2019/05/88a5ec43-c149-4b2b-8056-a5f263600c42.jpg')
        .addBackgroundImage('https://www.radioformula.com.mx/wp-content/uploads/2018/08/cover_GF_1200x630.jpg')
        .setOffsetInMilliseconds(offset)
        .play(episode.enclosure[0].$.url, `${currentIndex}`)
        },
    
       async 'NextCommandIssued'() {
            let currentIndex = this.$user.$data.currentIndex;
            let nextEpisode = await Player.getNextEpisode(currentIndex);
            if (!nextEpisode) {
                return this.tell('Ya estás en el episodio más antiguo.');
            }
            currentIndex = await Player.getEpisodeIndex(nextEpisode);
            console.log(currentIndex);
            this.$user.$data.currentIndex = currentIndex;
           
                this.$alexaSkill.$audioPlayer
                    .setTitle(`${nextEpisode.title}`)
                    .setSubtitle('Grupo Radio Fórmula')
                    .addArtwork('https://www.radioformula.com.mx/wp-content/uploads/2019/05/88a5ec43-c149-4b2b-8056-a5f263600c42.jpg')
                    .addBackgroundImage('https://www.radioformula.com.mx/wp-content/uploads/2018/08/cover_GF_1200x630.jpg')
                    .setOffsetInMilliseconds(0)
                    .play(nextEpisode.enclosure[0].$.url, `${currentIndex}`)
        },
    
        async 'PreviousCommandIssued'() {
            let currentIndex = this.$user.$data.currentIndex;
            let previousEpisode = await Player.getPreviousEpisode(currentIndex);
            if (!previousEpisode) {
                return this.tell('Este es el podcast más reciente. Tienes que esperar hasta que se publique un nuevo episodio.');
            }
            currentIndex = await Player.getEpisodeIndex(previousEpisode);
                this.$user.$data.currentIndex = currentIndex;
                this.$alexaSkill.$audioPlayer
                    .setTitle(`${previousEpisode.title}`)
                    .setSubtitle('Grupo Radio Fórmula')
                    .addArtwork('https://www.radioformula.com.mx/wp-content/uploads/2019/05/88a5ec43-c149-4b2b-8056-a5f263600c42.jpg')
                    .addBackgroundImage('https://www.radioformula.com.mx/wp-content/uploads/2018/08/cover_GF_1200x630.jpg')
                    .setOffsetInMilliseconds(0)
                    .play(previousEpisode.enclosure[0].$.url, `${currentIndex}`)
        },
    
        'PauseCommandIssued'() {
            this.$alexaSkill.$audioPlayer.stop();

            //Guardar sesion en la base de datos
            this.$user.$data.offset = this.$alexaSkill.$audioPlayer.getOffsetInMilliseconds();
            this.tell('Pausa')
        }
    },
});

module.exports.app = app;

//  app.config.handlers.PlayIntent();