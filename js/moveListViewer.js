var pokemonData;

$(document).ready(function()
{
    $.getJSON("js/pokemonMoveList.json", function(data) {
        pokemonData = data;

        var pokemonSelect = $("#pokemonSelect");
        pokemonData.Pokemon.forEach(pokemon => {
           pokemonSelect.append(new Option(pokemon.Name + " #" + pokemon.DexNum, pokemon.DexNum)); 
        });
        pokemonSelect.change(OnSelectPokemon);
    });
});

function OnSelectPokemon()
{
    var pokemon = pokemonData.Pokemon.find(pokemon => pokemon.DexNum == this.value);

    var formSelect = $("#pokmonFormSelect");
    formSelect.empty();
    formSelect.append(new Option(pokemon.DefaultForm, pokemon.DefaultForm));
    if (pokemon.AltForms.length == 0)
    {
        formSelect.prop("disabled", true);
    }
    else
    {
        pokemon.AltForms.forEach(form => {
            formSelect.append(new Option(form, form));
        })
        formSelect.prop("disabled", false)
    }
}