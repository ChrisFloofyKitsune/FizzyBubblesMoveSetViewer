var pokemonData;

$(document).ready(function()
{

    $.getJSON("js/pokemonMoveList.json", function(data) {
        pokemonData = data;
    });
});