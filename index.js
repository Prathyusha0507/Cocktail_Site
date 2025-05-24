const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Homepage: List cocktails starting with the letter 'a'
app.get('/', async (req, res) => {
  try {
    const response = await axios.get('https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a'); // fetch cocktails starting with 'a'
    const cocktails = response.data.drinks;
    res.render('home', { cocktails });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Could not load cocktails. Please try again later.' });
  }
});

// Cocktail detail page
app.get('/cocktail/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const response = await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`);
    const drink = response.data.drinks[0];

    // Build ingredients array
    let ingredients = [];
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];
      if (ingredient) {
        ingredients.push(`${measure ? measure : ''} ${ingredient}`.trim());
      }
    }

    // Fake cost
    const cost = (Math.random() * (20 - 5) + 5).toFixed(2);

    res.render('cocktail', { drink, ingredients, cost });
  } catch (error) {
    console.error(error);
    res.render('error', { message: 'Could not load cocktail details.' });
  }
});

app.listen(3000, () => {
  console.log('🍹 Server running at http://localhost:3000');
});
