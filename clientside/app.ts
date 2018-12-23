const url = window.location.href;


if (url.indexOf("\/pokemon.html") !== -1) {
    displayPokemonInfo();
} else {
    displayPokemonList();
}

function displayPokemonInfo() {
    const id = getParameterByName('id', url);
    const pokemonInfo = document.getElementById('pokemonInfo');

    (function () {
        fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`).then(response => {
            response.json().then(pokemon => {
                let html = '';
                html += `<h1>${capitalizeFirstLetter(pokemon.name)}</h1>`
                html += `<p><img src="${pokemon.sprites.front_default}"/></p>`
                html += `<p>Weight: ${pokemon.weight / 10} kg</p>`
                html += `<p>Abilites: </p>`
                html += `${generateAbilityList(pokemon)}`
                pokemonInfo.innerHTML = html;
            });
        });
    })();
}

function generateAbilityList(pokemon): string {
    let html = '<ul>';
    const abilites = pokemon.abilities
    abilites.forEach(function (element) {
        html += `<li>${element.ability.name}</li>`;
    });

    html += '</ul>';
    return html;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function displayPokemonList() {
    console.log("pokemonList")
    const pokemonList = document.getElementById('pokemons');

    (function () {
        fetch('https://pokeapi.co/api/v2/pokemon/').then(response => {
            response.json().then(pokelist => {
                let html = '<ul class="list-group">';
                for (const pokemon of pokelist.results) {

                    const id = getID(pokemon.url);
                    html += '<li class = "list-group-item">';
                    //console.log(pokemon.url);
                    html += `<p class="float-left">${capitalizeFirstLetter(pokemon.name)} </p>`;
                    html += generateDetailButton(id);
                    html += '</li>';
                }
                html +="</ul>";
                pokemonList.innerHTML = html;
            });
        });
    })();
}

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

function generateDetailButton(id): string {
    let html = '';
    html += `<button type="button" class="btn btn-info float-right" onClick="showDetails(${id})">`;
    html += 'Details';
    html += '</button>';
    return html;
}

function showDetails(id: string) {
    const win = window.open(`/clientside/pokemon.html?id=${id}`, '_blank');
    win.focus();
}

function goBack(){
    const win = window.open(`/clientside/`, '_self');
    win.focus();
}

function capitalizeFirstLetter(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}