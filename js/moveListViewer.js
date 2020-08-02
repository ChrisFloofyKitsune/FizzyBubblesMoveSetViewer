var pokemonData;

$(document).ready(function()
{
    $.getJSON("js/pokemonMoveList.json", function(data) {
        pokemonData = data;

        var pokemonSelect = $("#pokemonSelect");
        pokemonData.forEach(pokemon => {
           pokemonSelect.append(new Option(pokemon.Name, pokemon.DexNum)); 
        });
    });
});