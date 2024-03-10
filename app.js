const express = require('express');

const hbs = require('hbs');
const path = require('path');
const PunkAPIWrapper = require('punkapi-javascript-wrapper');

const app = express();
const punkAPI = new PunkAPIWrapper();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Register the location for handlebars partials here:

hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Add the route handlers here:

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/beers', (req, res) => {
  punkAPI
    .getBeers()
    .then(beersFromApi => {
      let data = beersFromApi.map((el) => {
        return {
          id: el.id,
          image_url: el.image_url,
          name: el.name,
          description: el.description,
          tagline: el.tagline
        };
      })
      res.render('beers', { data })
    })
    .catch(error => console.log(error));
});

app.get('/beers/:id?', (req, res) => {
  let id = req.params.id;
  punkAPI
    .getBeer(id)
    .then(data => {
      console.log(data);
      res.render('beers', { data })
    })
    .catch(error => console.log(error));
})

app.get('/random-beer', (req, res) => {
  punkAPI
    .getRandom()
    .then(responseFromAPI => {
      let data = responseFromAPI.map((el) => {
        return {
          image_url: el.image_url,
          name: el.name,
          description: el.description,
          tagline: el.tagline,
          food: el.food_pairing,
          brewers: el.brewers_tips
        };
      });
      res.render('random-beer', { data })
    }
    )
    .catch(error => console.log(error));
});

app.listen(3000, () => console.log('🏃‍ on port 3000'));
