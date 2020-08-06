var pokemonList = null;
var moveDex = null;
var abilityDex = null;

var pokemon = null;
var currentForm = null;

var expanded = false;
var superExpanded = false;

$(document).ready(function () {

    console.log("Loading Pokemon List");
    $.getJSON("js/pokemonMoveList.json", function (data) {
        console.log("Loaded Pokemon List");

        pokemonList = data.Pokemon;
        pokemon = pokemonList[0];
        currentForm = pokemon.DefaultForm;

        LoadURLHash();

        var pokemonSelect = $("#pokemonSelect");
        pokemonList.forEach(p => {
            pokemonSelect.append(new Option(p.Name + " #" + p.DexNum, p.DexNum));
        });
        pokemonSelect.selectpicker("refresh");
        pokemonSelect.val(pokemon.DexNum);
        pokemonSelect.change(OnSelectPokemon);
        pokemonSelect.selectpicker("refresh");

        $("#pokemonFormSelect").change(OnSelectForm);

        $("#expandTableCheckbox").change(function () {
            $("#superExpandTableCheckbox").attr("disabled", !this.checked);
            expanded = this.checked;
            RefreshTables();
        });

        $("#superExpandTableCheckbox").change(function () {
            superExpanded = this.checked;
            RefreshTables();
        });

        window.onhashchange = function() {
            LoadURLHash();
            pokemonSelect.val(pokemon.DexNum);
            pokemonSelect.selectpicker("refresh");
            UpdateFormSelect(currentForm);
            RefreshTables(currentForm);
        }

        UpdateFormSelect(currentForm);
        RefreshTables(currentForm);
    });

    console.log("Loading Move Dex");
    $.getJSON("js/moveDex.json", function (data) {
        console.log("Loaded Move Dex");
        moveDex = data;
    });

    console.log("Loading Ability Dex");
    $.getJSON("js/abilityDex.json", function (data) {
        console.log("Loaded Ability Dex");
        abilityDex = data;
    });
});

const specialCaseHumpies = [
    {
        dexNum: 784,
        form: "Normal",
        result: "784o"
    },
    {
        dexNum: 474,
        form: "Normal",
        result: "137z"
    },
    {
        dexNum: 25,
        form: "Belle",
        result: "025belle"
    },
    {
        dexNum: 25,
        form: "Libre",
        result: "025libre"
    },
    {
        dexNum: 25,
        form: "Rock Star",
        result: "025rock"
    },
    {
        dexNum: 25,
        form: "Ph. D",
        result: "025phd"
    },
    {
        dexNum: 25,
        form: "Pop Star",
        result: "025pop"
    },
    {
        dexNum: 479,
        form: "Fan",
        result: "479fan"
    },
    {
        dexNum: 479,
        form: "Frost",
        result: "479frost"
    },
    {
        dexNum: 479,
        form: "Heat",
        result: "479heat"
    },
    {
        dexNum: 479,
        form: "Mow",
        result: "479mow"
    },
    {
        dexNum: 479,
        form: "Wash",
        result: "479wash"
    },
    {
        dexNum: 892,
        form: "Rapid Strike Style",
        result: "892"
    },
    {
        dexNum: 29,
        form: "Normal",
        result: "032f"
    },
    {
        dexNum: 32,
        form: "Normal",
        result: "029m"
    }
];

function LoadURLHash() {
    if (document.location.hash) {
        var match = document.location.hash.match(/DexNum=(.*?)(?:&|$)/);
        if (match != null) {
            //console.log(match);
            var num = parseInt(match[1]);
            if (num != NaN) {
                pokemon = pokemonList[num - 1] ?? pokemon;

                match = document.location.hash.match(/Form=(.*?)(?:&|$)/);
                var form = (match == null) ? null : match[1];
                if (form != null && (pokemon.DefaultForm == form || pokemon.AltForms.includes(form)))
                    currentForm = form;
            }
        }
    }
}

function FetchHumpyLink() {
    if (pokemon == null)
        return "";

    let imgText = pokemon.DexNum.toString().padStart(3, "0");

    //console.log(form + " " + pokemon.DefaultForm);

    let specialCase = specialCaseHumpies.find(p => p.dexNum == pokemon.DexNum && p.form == currentForm);
    if (specialCase != null)
        imgText = specialCase.result;
    else if (currentForm != pokemon.DefaultForm)
        imgText += currentForm.charAt(0).toLowerCase();

    //console.log(imgText);

    $("#pokemonImage").attr("src", `http://www.upnetwork.net/fb/sprites/pk${imgText}.gif`);
    $("#pokemonImageShiny").attr("src", `http://www.upnetwork.net/fb/sprites/sh${imgText}.gif`);
}

const normalLevelUpHeader =
    `<tr>
        <th>Move</th>
        <th>Level</th>
    </tr>`;

const normalHeader =
    `<tr>
        <th>Move</th>
    </tr>`;

const expandedLevelUpHeader =
    `<tr>
        <th>Move</th>
        <th>Level</th>
        <th>Type</th>
        <th>Category</th>
        <th>Power</th>
        <th style="min-width:24rem">Effect</th>
        <th>Priority</th>
        <th>Makes Contact?</th>
        <th>Serebii Link</th>
    </tr>`;

const expandedHeader =
    `<tr>
        <th>Move</th>
        <th>Type</th>
        <th>Category</th>
        <th>Power</th>
        <th style="min-width:24rem">Effect</th>
        <th>Priority</th>
        <th>Makes Contact?</th>
        <th>Serebii Link</th>
    </tr>`;

const superExpandedLevelUpHeader =
    `<tr>
        <th>Move</th>
        <th>Level</th>
        <th>Type</th>
        <th>Category</th>
        <th>Power</th>
        <th style="min-width:24rem">Effect</th>
        <th style="min-width:12rem">Secondary Effect</th>
        <th>Effect Rate</th>
        <th style="min-width:8rem">Target</th>
        <th>Priority</th>
        <th>Crit Rate</th>
        <th>Makes Contact?</th>
        <th>Serebii Link</th>
    </tr>`;

const superExpandedHeader =
    `<tr>
        <th>Move</th>
        <th>Type</th>
        <th>Category</th>
        <th>Power</th>
        <th style="min-width:24rem">Effect</th>
        <th style="min-width:12rem">Secondary Effect</th>
        <th>Effect Rate</th>
        <th style="min-width:8rem">Target</th>
        <th>Priority</th>
        <th>Crit Rate</th>
        <th>Makes Contact?</th>
        <th>Serebii Link</th>
    </tr>`;

function OnSelectPokemon() {
    pokemon = pokemonList.find(p => p.DexNum == this.value);

    UpdateFormSelect(pokemon.DefaultForm);

    RefreshTables(pokemon.DefaultForm);
}

function UpdateFormSelect(selectedForm) {
    var formSelect = $("#pokemonFormSelect");
    formSelect.empty();
    formSelect.append(new Option(pokemon.DefaultForm, pokemon.DefaultForm));
    if (pokemon.AltForms.length == 0) {
        formSelect.prop("disabled", true);
    }
    else {
        pokemon.AltForms.forEach(form => {
            formSelect.append(new Option(form, form));
        });
        formSelect.prop("disabled", false);
    }
    formSelect.selectpicker("refresh");

    formSelect.val(selectedForm);
    formSelect.selectpicker("refresh");
}

function OnSelectForm() {
    RefreshTables(this.value);
}

function RefreshTables(form = null) {

    if (pokemon == null)
        return;

    if (form != null)
        currentForm = form;

    document.location.hash = (`Name=${pokemon.Name}&DexNum=${pokemon.DexNum}` + ((currentForm != "Normal") ? `&Form=${currentForm}` : ""));

    if (!expanded) {
        $("#levelUpMoveHeader").html(normalLevelUpHeader);
        $("#eggMoveHeader").html(normalHeader);
        $("#tutorMoveHeader").html(normalHeader);
        $("#machineMoveHeader").html(normalHeader);
    }
    else if (superExpanded) {
        $("#levelUpMoveHeader").html(superExpandedLevelUpHeader);
        $("#eggMoveHeader").html(superExpandedHeader);
        $("#tutorMoveHeader").html(superExpandedHeader);
        $("#machineMoveHeader").html(superExpandedHeader);
    }
    else {
        $("#levelUpMoveHeader").html(expandedLevelUpHeader);
        $("#eggMoveHeader").html(expandedHeader);
        $("#tutorMoveHeader").html(expandedHeader);
        $("#machineMoveHeader").html(expandedHeader);
    }

    var abilityTable = $("#abilityTable");
    var levelUpMoveTable = $("#levelUpMoveTable");
    var eggMoveTable = $("#eggMoveTable");
    var tutorMoveTable = $("#tutorMoveTable");
    var machineMoveTable = $("#machineMoveTable");

    abilityTable.empty();
    levelUpMoveTable.empty();
    eggMoveTable.empty();
    tutorMoveTable.empty();
    machineMoveTable.empty();

    $("#pokemonName").text(pokemon.Name);
    FetchHumpyLink();

    {
        let abilities = abilityDex.filter(a => a.Pokemon.some(p => p.DexNum == pokemon.DexNum));
        if (abilities.some(a => a.Pokemon.some(p => p.DexNum == pokemon.DexNum && p.Form != undefined))) {
            abilities = abilities.filter(a => a.Pokemon
                .some(p => p.DexNum == pokemon.DexNum && ((p.Form == undefined && currentForm == pokemon.DefaultForm) || p.Form == currentForm)));
        }

        abilities.forEach(a => {
            var newHTML =
                `<tr>
                <td>${a.Name}</td>
                <td>${a.GameText}</td>
                <td>${a.EffectDetail ?? ""}</td>
                <td><a href="${a.Link}" target="_blank"><i class="fas fa-external-link-alt"></i></a></td>
            </tr>`
            abilityTable.append(newHTML);
        });
    }


    if (pokemon.DefaultForm == currentForm || pokemon.AltForms.includes(currentForm)) {
        CreateMoveTable(levelUpMoveTable, pokemon.LevelUpMoveLists.find(list => list.Form == currentForm).LevelUpMoves, true);
        CreateMoveTable(eggMoveTable, pokemon.EggMoves.filter(m => m.Forms.includes(currentForm)));
        CreateMoveTable(tutorMoveTable, pokemon.TutorMoves.filter(m => m.Forms.includes(currentForm)));
        CreateMoveTable(machineMoveTable, pokemon.MachineMoves.filter(m => m.Forms.includes(currentForm)));
    }
}

function CreateMoveTable(table, moves, isLevelUpTable = false) {
    if (!expanded || moveDex == null) {
        if (isLevelUpTable) {
            moves.forEach(move => {
                table.append(`<tr><td>${move.Name}</td><td>${move.Level}</td></tr>`);
            });
        }
        else {
            moves.forEach(move => {
                table.append(`<tr><td>${move.Name}</td></tr>`)
            });
        }
    }
    else {
        moves.forEach(move => {

            var moveInfo = moveDex.find(mi => mi.Name == move.Name);

            //console.log(move.Name);
            //console.log(moveInfo);

            var newHTML = "<tr>";

            newHTML += `<td class="font-weight-bold">${move.Name}</td>`;
            if (isLevelUpTable)
                newHTML += `<td>${move.Level}</td>`;
            newHTML += `<td><img src="${moveInfo.TypeImageLink}"></td>`;
            newHTML += `<td><img src="${moveInfo.CategoryImageLink}"></td>`;
            newHTML += `<td>${moveInfo.BasePower}</td>`;
            newHTML += `<td>${moveInfo.BattleEffect}</td>`;
            if (superExpanded)
                newHTML += `<td>${moveInfo.SecondaryEffect}</td>`;
            if (superExpanded)
                newHTML += `<td>${moveInfo.EffectRate}</td>`;
            if (superExpanded)
                newHTML += `<td>${moveInfo.Target}</td>`;
            newHTML += `<td>${moveInfo.SpeedPriority}</td>`;
            if (superExpanded)
                newHTML += `<td>${moveInfo.CriticalHitRate}</td>`;
            newHTML += `<td>${moveInfo.MakesPhysicalContact}</td>`;
            newHTML += `<td><a href="${moveInfo.Link}" target="_blank"><i class="fas fa-external-link-alt"></i></a></td>`;

            newHTML += "</tr>";
            table.append(newHTML);
        });
    }
}