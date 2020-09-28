//guardar en el cache dinamico
function actualizaCacheDinamico(dynamicCache,req,res){
    if( res.ok ){
        console.log('dentro if');

        //data a almacenar en el cache
        return caches.open(dynamicCache).then( cache => {
            cache.put(req,res.clone());
            return res.clone();
        });
    }else{
        //fallo el cache y fallo la red
        return res; //va a ser un 404, o un error de que no cons el registro por ej
    }
}