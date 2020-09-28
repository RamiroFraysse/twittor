//imports
importScripts('js/sw-utils.js');

const STATIC_CACHE    = 'static-v2';
const DYNAMIC_CACHE   = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

//Corazon de la aplicacion, debe ser cargado lo mas rapido
//posible
const APP_SHELL = [
    '/PWA/06-twittor/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

//Todo lo que no se va a modificar jamas y no hice yo
const APP_SHELL_INMUTABLE = [
    //librerias de google fuentes
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',

    //libreria de terceros
    'css/animate.css',
    'js/libs/jquery.js'
]

//INSTALACION
self.addEventListener('install', e => {
    const cacheStatic = caches.open( STATIC_CACHE ).then(cache => {
        cache.addAll( APP_SHELL );

    });
    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache => {
        cache.addAll( APP_SHELL_INMUTABLE );
    });

    //Tengo dos promesas, espero por ellas.
    e.waitUntil(Promise.all([cacheStatic,cacheInmutable]));

});


//ACTIVACIÓN, SE BORRAN LOS CACHES OBSOLETOS
self.addEventListener('activate', e => {
    //Tengo que verificar si la version que se encuentra en el 
    //sw, es la misma que la que se encuentra activo no tengo 
    //que hacer nada, sino borro el cache estatico

    const respuesta = caches.keys().then( keys => {
        keys.forEach( key => {
            if(key!== STATIC_CACHE && key.includes('static'))
                return caches.delete(key);
        });
    });
    e.waitUntil(respuesta);

});



//ESTRATEGIA DE CACHE WITH NEWTORK FALLBACK
self.addEventListener( 'fetch' , e => {
    const respuesta = caches.match(e.request).then(res=>{
        if(res) 
            return res;
        else{
            return fetch(e.request).then( newRes=>{
                return actualizaCacheDinamico( DYNAMIC_CACHE,e.request,newRes );
            });
        }
        console.log(e.request.url);
    });
    e.respondWith( respuesta );
});