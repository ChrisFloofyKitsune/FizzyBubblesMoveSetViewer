var pokemonData = null;
var pokemon = null;

$(document).ready(function()
{
    $.getJSON("js/pokemonMoveList.json", function(data) {
        pokemonData = data;

        var pokemonSelect = $("#pokemonSelect");
        pokemonData.Pokemon.forEach(pokemon => {
           pokemonSelect.append(new Option(pokemon.Name + " #" + pokemon.DexNum, pokemon.DexNum)); 
        });
        pokemonSelect.selectpicker("refresh");
        pokemonSelect.change(OnSelectPokemon);
        $("#pokemonFormSelect").change(OnSelectForm);
    });
});

function OnSelectPokemon()
{
    pokemon = pokemonData.Pokemon.find(pokemon => pokemon.DexNum == this.value);

    var formSelect = $("#pokemonFormSelect");
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
    formSelect.selectpicker("refresh");
}

function OnSelectForm()
{
    var form = this.value;

    var levelUpMoveTable = $("#levelUpMoveTable");
    var eggMoveTable = $("#eggMoveTable");
    var tutorMoveTable = $("#tutorMoveTable");
    var machineMoveTable = $("#machineMoveTable");

    levelUpMoveTable.empty();
    eggMoveTable.empty();
    tutorMoveTable.empty();
    machineMoveTable.empty;

    if (pokemon != null && (pokemon.DefaultForm = form || pokemon.AltForms.includes(form)))
    {
        pokemon.LevelUpMoveLists.find(list => list.Form == form)
            .LevelUpMoves.forEach(move => {
                levelUpMoveTable.append("<tr><td>" + move.Name + "</td><td>" + move.Level + "</td></tr>");
            });

        pokemon.EggMoves.filter(m => m.Forms.includes(form)).forEach(m => {
            eggMoveTable.append("<tr><td>" + m.Name + "</td></tr>")
        });

        pokemon.TutorMoves.filter(m => m.Forms.includes(form)).forEach(m => {
            eggMoveTable.append("<tr><td>" + m.Name + "</td></tr>")
        });

        pokemon.MachineMoves.filter(m => m.Forms.includes(form)).forEach(m => {
            eggMoveTable.append("<tr><td>" + m.Name + "</td></tr>")
        });
    }
}