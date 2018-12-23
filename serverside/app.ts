
import * as express from 'express';
import * as fetch from 'node-fetch'
import * as path from 'path';

//const url = window.location.href;

const app = express();

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '/views'));

app.get('/serverside/pokemons', function (req, res) {
    fetch('https://pokeapi.co/api/v2/pokemon/').then(response => {
        response.json().then(pokelist => {
            const list = generatePokemonList(pokelist)
            res.render('index', {
                pokemons: list
            });
        });
    });
});

app.get('/serverside/pokemon/:id', function (req, res) {
    const id = req.params.id;
    console.log(id);
    fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`).then(response => {
        response.json().then(pokemon => {
            res.render('pokemon', {
                pokemonName: capitalizeFirstLetter(pokemon.name),
                pokemonImgURL: pokemon.sprites.front_default,
                pokemonWeight: pokemon.weight / 10,
                abilities: pokemon.abilities
            });
        });
    });

});

app.listen(8080, () => console.log('API is listening on port 8080'));

function getID(url: string): string {
    const regex = /\/(\d+)\//gm;

    let m: RegExpExecArray;
    let id: string;

    while ((m = regex.exec(url)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }


        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            if (groupIndex === 1) {
                id = match;
            }
            //console.log(`Found match, group ${groupIndex}: ${match}`);
        });
    }

    return id;
}

function generatePokemonList(pokeList): Array<Object> {
    let ar = Array();
    for (const pokemon of pokeList.results) {
        ar.push({ name: pokemon.name, id: getID(pokemon.url) });
    }
    return ar;
}

function capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}