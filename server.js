var express = require('express')
var Sequelize = require('sequelize')
var nodeadmin = require('nodeadmin')
var app=express();
app.use('/admin', express.static('admin'));

//connect to mysql database
var sequelize = new Sequelize('spotify', 'root', '', {
    dialect:'mysql',
    host:'localhost'
})

sequelize.authenticate().then(function(){
    console.log('Success')
})

//define a new Model
var Categories = sequelize.define('categories', {
    name: Sequelize.STRING,
    description: Sequelize.STRING
})

var Artists = sequelize.define('artists', {
  name: Sequelize.STRING,
  description: Sequelize.STRING,
  image: Sequelize.STRING
})



var Songs = sequelize.define('songs', {
  categoriesId: Sequelize.INTEGER,
  artistId: Sequelize.INTEGER,
  name: Sequelize.STRING,
  fileName: Sequelize.STRING,
  playtime: Sequelize.INTEGER
})

var Users = sequelize.define('users',{
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  email:Sequelize.STRING,
  image:Sequelize.STRING
})

var Playlists = sequelize.define('playlists', {
  userId: Sequelize.INTEGER,
  name: Sequelize.STRING,
  description: Sequelize.STRING
})

var Playlist_Songs = sequelize.define('playlist_songs', {
  playlistId: Sequelize.INTEGER,
  songId: Sequelize.INTEGER,
  name: Sequelize.STRING,
  description: Sequelize.STRING
})



Songs.belongsTo(Categories, {foreignKey: "categoriesId", targetKey: "id"})
Songs.belongsTo(Artists, {foreignKey: "artistId", targetKey: "id"})
Playlists.belongsTo(Users, {foreignKey: "userId", targetKey: "id"})    
Playlist_Songs.belongsTo(Playlists, {foreignKey: "playlistId", targetKey: "id"})
Playlist_Songs.belongsTo(Songs, {foreignKey: "songId", targetKey: "id"})


app.use(express.static('public'))
app.use('/public', express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended : true}))


app.get('/categories', function(request, response) {
    Categories.findAll().then(function(categories){
        response.status(200).send(categories)
    })
})


app.get('/categories/:id', function(request, response) {
    Categories.findOne({where: {id:request.params.id}}).then(function(category) {
        if(category) {
            response.status(200).send(category)
        } else {
            response.status(404).send()
        }
    })
})


app.post('/categories', function(request, response) {
    Categories.create(request.body).then(function(category) {
        response.status(201).send(category)
    })
})


app.put('/categories/:id', function(request, response) {
    Categories.findById(request.params.id).then(function(category) {
        if(category) {
            category.update(request.body).then(function(category){
                response.status(201).send(category)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})



app.delete('/categories/:id', function(request, response) {
    Categories.findById(request.params.id).then(function(category) {
        if(category) {
            category.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})


app.get('/categories', function(request, response) {
    Artists.findAll().then(function(artists){
        response.status(200).send(artists)
    })
})


app.get('/artists/:id', function(request, response) {
    Artists.findOne({where: {id:request.params.id}}).then(function(artist) {
        if(artist) {
            response.status(200).send(artist)
        } else {
            response.status(404).send()
        }
    })
})


app.post('/artists', function(request, response) {
    Artists.create(request.body).then(function(artist) {
        response.status(201).send(artist)
    })
})


app.put('/artists/:id', function(request, response) {
    Artists.findById(request.params.id).then(function(artist) {
        if(artist) {
            artist.update(request.body).then(function(artist){
                response.status(201).send(artist)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})


app.delete('/artists/:id', function(request, response) {
    Categories.findById(request.params.id).then(function(artist) {
        if(artist) {
            artist.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})


app.get('/songs', function(request, response) {
    Songs.findAll().then(
         function(songs) {
               response.status(200).send(songs)
        }
    )
})


app.get('/songs/:id', function(request, response) {
    Songs.findOne({where: {id:request.params.id}}).then(function(song) {
        if(song) {
            response.status(200).send(song)
        } else {
            response.status(404).send()
        }
    })
})


app.post('/songs', function(request, response) {
    Songs.create(request.body).then(function(song) {
        response.status(201).send(song)
    })
})


app.put('/songs/:id', function(request, response) {
    Songs.findById(request.params.id).then(function(song) {
        if(song) {
            song.update(request.body).then(function(song){
                response.status(201).send(song)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})


app.delete('/songs/:id', function(request, response) {
    Categories.findById(request.params.id).then(function(song) {
        if(song) {
            song.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})


app.get('/users', function(request, response) {
    Users.findAll().then(function(users){
        response.status(200).send(users)
    })
        
})


app.get('/users/:id', function(request, response) {
    Users.findOne({where: {id:request.params.id}}).then(function(user) {
        if(user) {
            response.status(200).send(user)
        } else {
            response.status(404).send()
        }
    })
})



app.post('/users', function(request, response) {
    Users.create(request.body).then(function(user) {
        response.status(201).send(user)
    })
})


app.put('/users/:id', function(request, response) {
    Users.findById(request.params.id).then(function(user) {
        if(user) {
            user.update(request.body).then(function(user){
                response.status(201).send(user)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})



app.delete('/users/:id', function(request, response) {
    Users.findById(request.params.id).then(function(user) {
        if(user) {
            user.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})


app.get('/playlists', function(request, response) {
    Playlists.findAll().then(function(playlists){
        response.status(200).send(playlists)
    })
        
})


app.get('/playlists/:id', function(request, response) {
    Playlists.findOne({where: {id:request.params.id}}).then(function(playlist) {
        if(playlist) {
            response.status(200).send(playlist)
        } else {
            response.status(404).send()
        }
    })
})


app.post('/playlists', function(request, response) {
    Playlists.create(request.body).then(function(playlist) {
        response.status(201).send(playlist)
    })
})


app.put('/playlists/:id', function(request, response) {
    Playlists.findById(request.params.id).then(function(playlist) {
        if(playlist) {
            playlist.update(request.body).then(function(playlist){
                response.status(201).send(playlist)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})



app.delete('/playlists/:id', function(request, response) {
    Playlists.findById(request.params.id).then(function(playlist) {
        if(playlist) {
            playlist.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})



app.get('/playlist_songs', function(request, response) {
    Playlist_Songs.findAll().then(function(playlist_songs){
        response.status(200).send(playlist_songs)
    })
        
})


app.get('/playlist_songs/:id', function(request, response) {
    Playlist_Songs.findOne({where: {id:request.params.id}}).then(function(playlist_song) {
        if(playlist_song) {
            response.status(200).send(playlist_song)
        } else {
            response.status(404).send()
        }
    })
})


app.post('/playlist_songs', function(request, response) {
    Playlist_Songs.create(request.body).then(function(playlist_song) {
        response.status(201).send(playlist_song)
    })
})


app.put('/playlist_songs/:id', function(request, response) {
    Playlist_Songs.findById(request.params.id).then(function(playlist_song) {
        if(playlist_song) {
            playlist_song.update(request.body).then(function(playlist_song){
                response.status(201).send(playlist_song)
            }).catch(function(error) {
                response.status(200).send(error)
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})


app.delete('/playlist_songs/:id', function(request, response) {
    Playlist_Songs.findById(request.params.id).then(function(playlist_song) {
        if(playlist_song) {
            playlist_song.destroy().then(function(){
                response.status(204).send()
            })
        } else {
            response.status(404).send('Not found')
        }
    })
})


app.listen(8001)

