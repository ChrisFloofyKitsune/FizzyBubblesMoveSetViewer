var pokemonList = null;
var moveDex = null;
var abilityDex = null;
var pokemonToTypeList = null;
var typeEffectivenessData = null;
var pokemonExternalLinks = null;

var pokemon = null;
var currentForm = null;

var expanded = false;
var superExpanded = false;
var showTypeWeaknessess = false;

$(document).ready(function () {

    var jsonLoads = [];
    console.log("Loading Pokemon List");
    jsonLoads.push($.getJSON("js/pokemonMoveList-min.json", function (data) {
        console.log("Loaded Pokemon List");
        pokemonList = data.Pokemon;
    }));

    console.log("Loading Move Dex");
    $.getJSON("js/moveDex-min.json", function (data) {
        console.log("Loaded Move Dex");
        moveDex = data;
    });

    console.log("Loading Ability Dex");
    jsonLoads.push($.getJSON("js/abilityDex-min.json", function (data) {
        console.log("Loaded Ability Dex");
        abilityDex = data;
    }));

    console.log("Loading Pokemon To Type List");
    jsonLoads.push($.getJSON("js/pokemonToTypeList-min.json", function (data) {
        console.log("Loaded Pokemon To Type List");
        pokemonToTypeList = data;
    }));

    console.log("Loading Type Effectiveness Data");
    jsonLoads.push($.getJSON("js/typeEffectiveness-min.json", function (data) {
        console.log("Loaded Type Effectiveness Data");
        typeEffectivenessData = data;
    }));

    console.log("Loading Pokemon External Links");
    jsonLoads.push($.getJSON("js/pokemonExternalLinks-min.json", function (data) {
        console.log("Loaded Pokemon External Links");
        pokemonExternalLinks = data;
    }));

    $.when(...jsonLoads).then(function () {
        console.log("All Data Loaded! Booting up FizzyDex...");

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

        $("#expandTableCheckbox").attr("disabled", false);
        $("#expandTableCheckbox").change(function () {
            $("#superExpandTableCheckbox").attr("disabled", !this.checked);
            expanded = this.checked;
            RefreshTables();
        });

        $("#superExpandTableCheckbox").change(function () {
            superExpanded = this.checked;
            RefreshTables();
        });

        $("#showTypeWeaknessesCheckbox").attr("disabled", false);
        $(".table-type-weaknesses").attr("hidden", true);
        $("#showTypeWeaknessesCheckbox").change(function () {
            showTypeWeaknessess = this.checked;
            $(".table-type-weaknesses").attr("hidden", !this.checked);
            RefreshTables();
        });

        window.onhashchange = function () {
            LoadURLHash();
            pokemonSelect.val(pokemon.DexNum);
            pokemonSelect.selectpicker("refresh");
            UpdateFormSelect(currentForm);
            RefreshTables(currentForm);
        }

        UpdateFormSelect(currentForm);
        RefreshTables(currentForm);
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
                pokemon = pokemonList[num - 1] || pokemon;

                match = document.location.hash.match(/Form=(.*?)(?:&|$)/);
                var form = (match == null) ? null : decodeURIComponent(match[1]);
                //console.log(form);
                if (form != null) {
                    if (pokemon.DefaultForm.toUpperCase() === form.toUpperCase())
                        currentForm = pokemon.DefaultForm;
                    else
                        currentForm = pokemon.AltForms
                            .find(f => f.toUpperCase() === form.toUpperCase()) || pokemon.DefaultForm;
                }
                else
                    currentForm = pokemon.DefaultForm;
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

    $("#pokemonImage").attr("src", `https://www.upnetwork.net/fb/sprites/pk${imgText}.gif`);
    $("#pokemonImageShiny").attr("src", `https://www.upnetwork.net/fb/sprites/sh${imgText}.gif`);
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

    $("#pokemonExternalLink").attr("href", pokemonExternalLinks.find(l => l.DexNum == pokemon.DexNum).Link);

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

    CreateTypeList();

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
                <td>${a.EffectDetail || ""}</td>
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

function CreateTypeList() {
    var typeList = $("#pokemonTypeList");
    typeList.empty();

    var typeEntries = pokemonToTypeList.find(item => item.DexNum == pokemon.DexNum).Forms;
    if (pokemon.AltForms.length > 0 && typeEntries.length > 1) {
        if (currentForm == pokemon.DefaultForm)
            typeEntries = typeEntries.filter(item => !pokemon.AltForms.some(altForm => item.Form.includes(altForm)));
        else
            typeEntries = typeEntries.filter(item => item.Form.includes(currentForm));
    }
    //console.log(typeEntries);
    typeEntries.forEach(f => {
        typeList.append(`<h6>${(typeEntries.length > 1) ? `${f.Form} Form ` : ""}Type: <img src=img/${f.PrimaryType.toLowerCase()}.png>${(f.SecondaryType) ? `<img src="img/${f.SecondaryType.toLowerCase()}.png"` : ""}</h6>`);
        if (showTypeWeaknessess)
            typeList.append(CreateTypeEffectivenessChart(f.PrimaryType, f.SecondaryType || null));
    });
}

function CreateTypeEffectivenessChart(primaryType, secondaryType) {
    var table = $(
        `<div class="table-responsive table-type-weaknesses">
            <table class="table table-sm table-dark table-striped table-bordered">
            <thead>
                <tr>
                    <th><img src="img/unknown90.png"></th>
                    <th><img src="img/unknown90.png"></th>
                    <th><img src="img/unknown90.png"></th>
                    <th><img src="img/unknown90.png"></th>
                    <th><img src="img/unknown90.png"></th>
                    <th><img src="img/unknown90.png"></th>
                    <th><img src="img/unknown90.png"></th>
                    <th><img src="img/unknown90.png"></th>
                    <th><img src="img/unknown90.png"></th>
                    <th><img src="img/unknown90.png"></th>
                    <th><img src="img/unknown90.png"></th>
                    <th><img src="img/unknown90.png"></th>
                    <th><img src="img/unknown90.png"></th>
                    <th><img src="img/unknown90.png"></th>
                    <th><img src="img/unknown90.png"></th>
                    <th><img src="img/unknown90.png"></th>
                    <th><img src="img/unknown90.png"></th>
                    <th><img src="img/unknown90.png"></th>
                </tr>
                </thead>
                <tbody>
                    <td>x?</td>
                    <td>x?</td>
                    <td>x?</td>
                    <td>x?</td>
                    <td>x?</td>
                    <td>x?</td>
                    <td>x?</td>
                    <td>x?</td>
                    <td>x?</td>
                    <td>x?</td>
                    <td>x?</td>
                    <td>x?</td>
                    <td>x?</td>
                    <td>x?</td>
                    <td>x?</td>
                    <td>x?</td>
                    <td>x?</td>
                    <td>x?</td>
                </tbody>
            </table>
        </div>`
    );

    //console.log(primaryType);
    //onsole.log(secondaryType);

    table.find("th img").each(function (index, e) {
        $(e).attr("src", "img/" + typeEffectivenessData.Types[index].toLowerCase() + "90.png");
    });
    table.find("td").each(function (index, e) {
        let currType = typeEffectivenessData.Types[index];
        let typeVal = (typeEffectivenessData[primaryType][currType] || 1) * (secondaryType ? (typeEffectivenessData[secondaryType][currType] || 1) : 1);
        let element = $(e);
        if (typeVal != 1) {
            element.addClass("font-weight-bold");
            
            if (typeVal == 0)
                e.style.backgroundColor = "black";
            else if (typeVal == 0.25)
                element.addClass("bg-danger");
            else if (typeVal == 0.5)
                element.addClass("bg-warning");
            else if (typeVal == 2)
                element.addClass("bg-success")
            else if (typeVal == 4)
                element.addClass("bg-primary")
        }

        element.text("×" + (typeVal == 0.5 ? "½" : (typeVal == 0.25 ? "¼" : typeVal)));
    });

    return table;
}