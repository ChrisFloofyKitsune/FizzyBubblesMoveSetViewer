import TypeData from './typeData.json';

////////////////////////////////
//// JSON LOADING FUNCTIONS ////
////////////////////////////////

//#region JsonFuncs

function LoadJSON(filepath) {
    //TEST FOR BROSWER
    if (typeof window !== 'undefined' && typeof window.document !== 'undefined') {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.overrideMimeType("application/json");
            xhr.onload = function () {
                if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 300)
                    resolve(JSON.parse(xhr.responseText));
                else
                    reject(Error(xhr.statusText));
            }

            xhr.open("GET", filepath, true);
            xhr.send();
        });
    }

    //TEST FOR NODE
    if (typeof process !== 'undefined') {
        return new Promise((resolve, reject) => {
            require('fs').readFile(filepath, 'utf8', (err, data) => {
                if (err)
                    reject(err);
                else
                    resolve(JSON.parse(data));
            });
        });
    }

    return Promise.reject(Error("Unsupported platform!"));
}

//Fill in gaps in data assuming that if it's not listed, it's multiplier is just 1.
for (let prop in TypeData.Weaknesses) {
    let typeWeaknessEntry = TypeData.Weaknesses[prop];
    for (var typeEntry of TypeData.Types) {
        if (typeWeaknessEntry[typeEntry] === undefined)
            typeWeaknessEntry[typeEntry] = 1;
    }
}

const Data = {
    PokemonList: null,
    PokemonMoveList: null,
    MoveDex: null,
    AbilityDex: null,
    TypeData,
    DefaultZMoves: {
        Normal: "Breakneck Blitz",
        Fire: "Inferno Overdrive",
        Water: "Hydro Vortex",
        Electric: "Gigavolt Havoc",
        Grass: "Bloom Doom",
        Ice: "Subzero Slammer",
        Fighting: "All-Out Pummeling",
        Poison: "Acid Downpour",
        Ground: "Tectonic Rage",
        Flying: "Supersonic Skystrike",
        Psychic: "Shattered Psyche",
        Bug: "Savage Spin-Out",
        Rock: "Continental Crush",
        Ghost: "Never-Ending Nightmare",
        Dragon: "Devastating Drake",
        Dark: "Black Hole Eclipse",
        Steel: "Corkscrew Crash",
        Fairy: "Twinkle Tackle",
    },
    SpeciesZMoveBaseMoves: {
        "Catastropika": "Volt Tackle",
        "10,000,000 Volt Thunderbolt": "Thunderbolt",
        "Stoked Sparksurfer": "Thunderbolt",
        "Extreme Evoboost": "Last Resort",
        "Pulverizing Pancake": "Giga Impact",
        "Genesis Supernova": "Psychic",
        "Sinister Arrow Raid": "Spirit Shackle",
        "Malicious Moonsault": "Darkest Lariat",
        "Oceanic Operetta": "Sparkling Aria",
        "Splintered Stormshards": "Stone Edge",
        "Let's Snuggle Forever": "Play Rough",
        "Clangorous Soulblaze": "Clanging Scales",
        "Guardian of Alola": "Nature's Madness",
        "Searing Sunraze Smash": "Sunsteel Strike",
        "Menacing Moonraze Maelstrom": "Moongeist Beam",
        "Light That Burns the Sky": "Photon Geyser",
        "Soul-Stealing 7-Star Strike": "Spectral Thief",
    },
    DefaultMaxMoves: {
        Normal: "Max Strike",
        Fire: "Max Flare",
        Water: "Max Geyser",
        Electric: "Max Lightning",
        Grass: "Max Overgrowth",
        Ice: "Max Hailstorm",
        Fighting: "Max Knuckle",
        Poison: "Max Ooze",
        Ground: "Max Quake",
        Flying: "Max Airstream",
        Psychic: "Max Mindstorm",
        Bug: "Max Flutterby",
        Rock: "Max Rockfall",
        Ghost: "Max Phantasm",
        Dragon: "Max Wyrmwind",
        Dark: "Max Darkness",
        Steel: "Max Steelspike",
        Fairy: "Max Starfall",
        Status: "Max Guard"
    },
    SpeciesGMaxMovesTypes: {
        "G-Max Vine Lash": "Grass",
        "G-Max Wildfire": "Fire",
        "G-Max Cannonade": "Water",
        "G-Max Befuddle": "Bug",
        "G-Max Volt Crash": "Electric",
        "G-Max Gold Rush": "Normal",
        "G-Max Chi Strike": "Fighting",
        "G-Max Terror": "Ghost",
        "G-Max Foam Burst": "Water",
        "G-Max Resonance": "Ice",
        "G-Max Cuddle": "Normal",
        "G-Max Replenish": "Normal",
        "G-Max Malodor": "Poison",
        "G-Max Meltdown": "Steel",
        "G-Max Drum Solo": "Grass",
        "G-Max Fireball": "Fire",
        "G-Max Hydrosnipe": "Water",
        "G-Max Wind Rage": "Flying",
        "G-Max Gravitas": "Psychic",
        "G-Max Stonesurge": "Water",
        "G-Max Volcalith": "Rock",
        "G-Max Tartness": "Grass",
        "G-Max Sweetness": "Grass",
        "G-Max Sandblast": "Ground",
        "G-Max Stun Shock": "Electric",
        "G-Max Centiferno": "Fire",
        "G-Max Smite": "Fairy",
        "G-Max Snooze": "Dark",
        "G-Max Finale": "Fairy",
        "G-Max Steelsurge": "Steel",
        "G-Max Depletion": "Dragon",
        "G-Max One Blow": "Dark",
        "G-Max Rapid Flow": "Water",
    },
    DefaultHumpySpriteSource: "https://www.upnetwork.net/fb/sprites/pk",
    DefaultHumpyShinySource: "https://www.upnetwork.net/fb/sprites/sh",
    DefaultArtworkURLSource: "https://www.serebii.net/art/th/"
}

var cachedDefaultMaxMoves = null;

function GetDefaultMaxMoves() {
    if (cachedDefaultMaxMoves)
        return cachedDefaultMaxMoves;

    cachedDefaultMaxMoves = {};
    for (let type in Data.DefaultMaxMoves) {
        cachedDefaultMaxMoves[type] = new Move(Data.DefaultMaxMoves[type]);
    }
    return cachedDefaultMaxMoves;
}

var cachedDefaultZMoves = null;

function GetDefaultZMoves() {
    if (cachedDefaultZMoves)
        return cachedDefaultZMoves;

    cachedDefaultZMoves = {};
    for (let type in Data.DefaultZMoves) {
        cachedDefaultZMoves[type] = new Move(Data.DefaultZMoves[type]);
    }
    return cachedDefaultZMoves;
}

function LoadPokemonListJSON(filepath) {
    return LoadJSON(filepath).then(data => {
        Data.PokemonList = data;
    });
}

function LoadPokemonMoveListJSON(filepath) {
    return LoadJSON(filepath).then(data => {
        Data.PokemonMoveList = data.Pokemon;
    })
}

function LoadMoveDexJSON(filepath) {
    return LoadJSON(filepath).then(data => {
        Data.MoveDex = data;
    })
}

function LoadAbilityDexJSON(filepath) {
    return LoadJSON(filepath).then(data => {
        Data.AbilityDex = data;
    })
}
//#endregion

class TypeWeaknesses {
    Normal = 1;
    Fire = 1;
    Water = 1;
    Electric = 1;
    Grass = 1;
    Ice = 1;
    Fighting = 1;
    Poison = 1;
    Ground = 1;
    Flying = 1;
    Psychic = 1;
    Bug = 1;
    Rock = 1;
    Ghost = 1;
    Dragon = 1;
    Dark = 1;
    Steel = 1;
    Fairy = 1;

    constructor(primaryType, secondaryType = null) {

        if (primaryType === undefined)
            return;

        for (let type of TypeData.Types) {
            this[type] = TypeData.Weaknesses[primaryType][type]
                * ((secondaryType === null || secondaryType === undefined) ? 1 : TypeData.Weaknesses[secondaryType][type]);
        }
    }
}

class Move {
    Name = "";
    Form = null;

    constructor(Name, Form = null) {
        this.Name = Name;
        this.Form = Form;
    }

    GetMoveInfo() {
        if (Data.MoveDex == null) {
            throw Error("Move.GetMoveInfo(): Data.MoveDex is uninitialized! Load it using LoadMoveDexJSON() or set it directly first!");
        }

        if (this.cachedMoveInfo)
            return this.cachedMoveInfo;

        this.cachedMoveInfo = GetMoveInfo(this.Name, this.Form);
        //console.log(this.cachedMoveList);
        return this.cachedMoveInfo;
    }
}

class LevelUpMove extends Move {
    Level = 0;

    constructor(Name, Level, Form = null) {
        super(Name, Form);
        this.Level = Level;
    }
}

class MoveList {
    Form = null;
    LevelUpMoves = [new LevelUpMove("", 0)];
    EggMoves = [new Move("")];
    TutorMoves = [new Move("")];
    MachineMoves = [new Move("")];
    ExtraMove = new Move("");
    SignatureSuperMove = new Move("");

    //FB Specific
    OtherGenerationTutorMoves = [new Move("")];
    OtherGenerationMachineMoves = [new Move("")];

    constructor(Form, dataObject) {
        this.Form = Form;
        this.LevelUpMoves = (dataObject.LevelUpMoves) ? [...dataObject.LevelUpMoves] : [];
        this.EggMoves = (dataObject.EggMoves) ? [...dataObject.EggMoves] : [];
        this.TutorMoves = (dataObject.TutorMoves) ? [...dataObject.TutorMoves] : [];
        this.MachineMoves = (dataObject.MachineMoves) ? [...dataObject.MachineMoves] : [];
        this.ExtraMove = (dataObject.ExtraMove) ? dataObject.ExtraMove : null;
        this.SignatureSuperMove = (dataObject.SignatureSuperMove) ? dataObject.SignatureSuperMove : null;

        this.OtherGenerationTutorMoves = (dataObject.OtherGenerationTutorMoves) ? [...dataObject.OtherGenerationTutorMoves] : [];
        this.OtherGenerationMachineMoves = (dataObject.OtherGenerationMachineMoves) ? [...dataObject.OtherGenerationMachineMoves] : [];
    }

    GetUnfilteredMaxMoves() {
        if (this.cachedUnfilteredMaxMoves)
            return this.cachedUnfilteredMaxMoves;

        let maxMoves = { ...GetDefaultMaxMoves() };
        if (this.SignatureSuperMove && Data.SpeciesGMaxMovesTypes[this.SignatureSuperMove.Name]) {
            maxMoves[Data.SpeciesGMaxMovesTypes[this.SignatureSuperMove.Name]] = this.SignatureSuperMove;
        }

        this.cachedUnfilteredMaxMoves = maxMoves;
        return this.cachedUnfilteredMaxMoves;
    }

    GetUnfilteredZMoves() {
        if (this.cachedUnfilteredZMoves)
            return this.cachedUnfilteredZMoves;

        let zMoves = { ...GetDefaultZMoves() };
        if (this.SignatureSuperMove && Data.SpeciesZMoveBaseMoves[this.SignatureSuperMove.Name]) {
            zMoves[Data.SpeciesZMoveBaseMoves[this.SignatureSuperMove.Name]] = this.SignatureSuperMove;
        }

        this.cachedUnfilteredZMoves = zMoves;
        return this.cachedUnfilteredZMoves;
    }

    GetMaxMoves() {
        if (Data.MoveDex == null) {
            throw Error("MoveList.GetMaxMoves(): Data.MoveDex is uninitialized! Load it using LoadMoveDexJSON() or set it directly first!");
        }

        if (this.cachedMaxMoves)
            return this.cachedMaxMoves;

        let typeList = [];
        [...this.LevelUpMoves, ...this.EggMoves, ...this.TutorMoves, ...this.MachineMoves, this.ExtraMove].forEach(m => {
            if (m == null)
                return;

            let moveInfo = m.GetMoveInfo();
            if (moveInfo.Category === "Status") {
                if (!typeList.includes("Status"))
                    typeList.push("Status")
            } else {
                if (!typeList.includes(moveInfo.Type))
                    typeList.push(moveInfo.Type);
            }
        });

        let result = [];
        let unfilteredMoves = this.GetUnfilteredMaxMoves();
        Object.keys(unfilteredMoves).forEach(k => {
            if (typeList.includes(k) && !result[k])
                result.push(unfilteredMoves[k]);
        });

        this.cachedMaxMoves = result;
        return this.cachedMaxMoves;
    }

    GetZMoves() {
        if (Data.MoveDex == null) {
            throw Error("MoveList.GetZMoves(): Data.MoveDex is uninitialized! Load it using LoadMoveDexJSON() or set it directly first!");
        }

        if (this.cachedZMoves)
            return this.cachedZMoves;

        let typeList = [];
        [...this.LevelUpMoves, ...this.EggMoves, ...this.TutorMoves, ...this.MachineMoves, this.ExtraMove].forEach(m => {
            if (m == null)
                return;

            let moveInfo = m.GetMoveInfo();
            if (moveInfo.Category !== "Status" && !typeList.includes(moveInfo.Type))
                typeList.push(moveInfo.Type);
        });

        let result = [];
        let unfilteredMoves = this.GetUnfilteredZMoves();
        Object.keys(unfilteredMoves).forEach(k => {
            if ((typeList.includes(k) || Data.SpeciesZMoveBaseMoves[unfilteredMoves[k].Name]) && !result[k])
                result.push(unfilteredMoves[k]);
        });

        this.cachedZMoves = result;
        return this.cachedZMoves;
    }
}

class Form {
    Pokemon = null;
    FormName = "";
    PrimaryType = "";
    SecondaryType = "";
    Ability1 = "";
    Ability2 = "";
    HiddenAbility = "";
    MoveSet = "";
    ExtraMove = "";
    SignatureSuperMove = "";
    HumpySpriteURL = "";
    HumpyShinyURL = "";
    ArtworkURL = "";
    IsSuperForm = false;
    TypeWeaknesses = new TypeWeaknesses();

    constructor(Pokemon, dataObject) {
        this.Pokemon = Pokemon;

        if (!dataObject)
            return;

        this.FormName = dataObject.FormName;
        this.PrimaryType = dataObject.PrimaryType;
        this.SecondaryType = (dataObject.SecondaryType) ? dataObject.SecondaryType : null;
        this.Ability1 = dataObject.Ability1;
        this.Ability2 = (dataObject.Ability2) ? dataObject.Ability2 : null;
        this.HiddenAbility = (dataObject.HiddenAbility) ? dataObject.HiddenAbility : null;
        this.MoveSet = (dataObject.MoveSet) ? dataObject.MoveSet : null;
        this.ExtraMove = (dataObject.ExtraMove) ? dataObject.ExtraMove : null;
        this.SignatureSuperMove = (dataObject.SignatureSuperMove) ? dataObject.SignatureSuperMove : null;

        if (dataObject.HumpySpriteURL) {
            this.HumpySpriteURL = dataObject.HumpySpriteURL;
            this.HumpyShinyURL = dataObject.HumpyShinyURL;
            this.ArtworkURL = dataObject.ArtworkURL;
        } else {
            let humpyCode = "";
            let artCode = "";
            if (dataObject.HumpySpriteCode)
                humpyCode = dataObject.HumpySpriteCode;
            else {
                let dexNumText = this.Pokemon.DexNum.toString().padStart(3, "0");
                if (this.FormName === this.Pokemon.DefaultFormName) {
                    humpyCode = dexNumText;
                } else {
                    humpyCode = dexNumText + (this.FormName === "Gigantamax" ? "gx" : this.FormName.charAt(0).toLowerCase());
                }
            }

            if (dataObject.ArtworkCode) {
                artCode = dataObject.ArtworkCode;
            } else {
                let dexNumText = this.Pokemon.DexNum.toString();
                if (this.FormName === this.Pokemon.DefaultFormName) {
                    artCode = dexNumText;
                } else {
                    artCode = dexNumText + "-" + (this.FormName === "Gigantamax" ? "gx" : this.FormName.charAt(0).toLowerCase());
                }
            }

            this.HumpySpriteURL = `${Data.DefaultHumpySpriteSource}${humpyCode}.gif`;
            this.HumpyShinyURL = `${Data.DefaultHumpyShinySource}${humpyCode}.gif`;
            this.ArtworkURL = `${Data.DefaultArtworkURLSource}${artCode}.png`;
        }

        this.IsSuperForm = (dataObject.IsSuperForm) ? true : false;

        if (dataObject.TypeWeaknesses !== undefined)
            this.TypeWeaknesses = dataObject.TypeWeaknesses;
        else {
            this.TypeWeaknesses = new TypeWeaknesses(this.PrimaryType, this.SecondaryType);
        }
    }

    GetMoves() {
        if (Data.PokemonMoveList == null) {
            throw Error("Form.GetMoves(): Data.PokemonMoveList is uninitialized! Load it using LoadPokemonMoveListJSON() or set it directly first!");
        }

        if (this.cachedMoveList)
            return this.cachedMoveList;

        let data = Data.PokemonMoveList.find(p => p.DexNum === this.Pokemon.DexNum);
        //console.log(data.LevelUpMoveLists[0].LevelUpMoves);
        let moveSet = (this.MoveSet != null) ? this.MoveSet : this.Pokemon.GetForm().MoveSet;

        let extraMove = null;
        let superMove = null;

        if (this.ExtraMove)
            extraMove = (new Move(this.ExtraMove, this));
        if (this.SignatureSuperMove)
            superMove = (new Move(this.SignatureSuperMove, this));

        let moveList = new MoveList(this, {
            LevelUpMoves: data.LevelUpMoveLists
                .find(l => data.LevelUpMoveLists.length === 1 || l.Form === moveSet)
                .LevelUpMoves.map(m => new LevelUpMove(m.Name, m.Level, this)),
            EggMoves: (data.EggMoves) ? data.EggMoves.filter(m => data.LevelUpMoveLists.length === 1 || m.Forms.includes(moveSet)).map(m => new Move(m.Name, this)) : [],
            TutorMoves: (data.TutorMoves) ? data.TutorMoves.filter(m => data.LevelUpMoveLists.length === 1 || m.Forms.includes(moveSet)).map(m => new Move(m.Name, this)) : [],
            MachineMoves: (data.MachineMoves) ? data.MachineMoves.filter(m => data.LevelUpMoveLists.length === 1 || m.Forms.includes(moveSet)).map(m => new Move(m.Name, this)) : [],
            ExtraMove: extraMove,
            SignatureSuperMove: superMove,
            OtherGenerationTutorMoves: (data.OtherGenerationTutorMoves) ? data.OtherGenerationTutorMoves.filter(m => data.LevelUpMoveLists.length === 1 || m.Forms.includes(moveSet)).map(m => new Move(m.Name, this)) : [],
            OtherGenerationMachineMoves: (data.OtherGenerationMachineMoves) ? data.OtherGenerationMachineMoves.filter(m => data.LevelUpMoveLists.length === 1 || m.Forms.includes(moveSet)).map(m => new Move(m.Name, this)) : [],
        });

        this.cachedMoveList = moveList;
        return moveList;
    }
}

class EvolutionChain {
    Stage1DexNum = 0;
    Stage1Form = "";
    Stage2Method = "";
    Stage2DexNum = 0;
    Stage2Form = "";
    Stage3Method = "";
    Stage3DexNum = 0;
    Stage3Form = "";

    constructor(dataObject) {
        if (!dataObject)
            return;

        this.Stage1DexNum = dataObject.Stage1DexNum;
        this.Stage1Form = dataObject.Stage1Form;
        this.Stage2Method = dataObject.Stage2Method;
        this.Stage2DexNum = dataObject.Stage2DexNum;
        this.Stage2Form = dataObject.Stage2Form;
        this.Stage3Method = (dataObject.Stage3Method) ? dataObject.Stage3Method : null;
        this.Stage3DexNum = (dataObject.Stage3DexNum) ? dataObject.Stage3DexNum : 0;
        this.Stage3Form = (dataObject.Stage3Form) ? dataObject.Stage3Form : null;
    }
}

class FormChange {
    StartForm = "";
    ChangeMethod = "";
    EndForm = "";

    constructor(dataObject) {
        if (!dataObject)
            return;

        this.StartForm = dataObject.StartForm;
        this.ChangeMethod = dataObject.ChangeMethod;
        this.EndForm = dataObject.EndForm;
    }
}

class Pokemon {
    Name = "";
    DexNum = 0;
    Forms = [new Form()];
    DefaultFormName = "";
    EvolutionChains = [new EvolutionChain()];
    FormChanges = [new FormChange()];
    MoveSetNames = [""];
    GenderRatioM = 0;
    GenderRatioF = 0;
    EggGroups = [""];

    constructor(dataObject) {
        this.Forms = [];
        this.EvolutionChains = [];
        this.FormChanges = [];
        this.MoveSetNames = [];

        if (!dataObject)
            return;

        this.Name = dataObject.Name;
        this.DexNum = dataObject.DexNum;
        this.DefaultFormName = dataObject.DefaultFormName;

        dataObject.Forms.forEach(f => {
            let form = new Form(this, f);
            this.Forms.push(form)
        });

        if (dataObject.EvolutionChains && dataObject.EvolutionChains.length > 0)
            dataObject.EvolutionChains.forEach(ec => this.EvolutionChains.push(new EvolutionChain(ec)));
        else
            this.EvolutionChains = null;

        if (dataObject.FormChanges && dataObject.FormChanges.length > 0)
            dataObject.FormChanges.forEach(ec => this.FormChanges.push(new FormChange(ec)));
        else
            this.FormChanges = null;

        if (dataObject.MoveSetNames)
            this.MoveSetNames.push(...dataObject.MoveSetNames);
        else
            this.Forms.filter(f => f.MoveSet != null).map(f => f.MoveSet).forEach(moveSet => {
                if (!this.MoveSetNames.find(m => m === moveSet))
                    this.MoveSetNames.push(moveSet);
            });

        this.GenderRatioM = (dataObject.GenderRatioM) ? parseFloat(dataObject.GenderRatioM) : 0;
        this.GenderRatioF = (dataObject.GenderRatioF) ? parseFloat(dataObject.GenderRatioF) : 0;
        this.EggGroups = (dataObject.EggGroups) ? dataObject.EggGroups : ["EGG GROUP INFO MISSING"];
    }

    FixFormName(formName = null) {
        if (formName == null)
            return this.DefaultFormName;

        formName = formName.trim();

        let matchingForm = this.Forms.find(f => f.FormName.toUpperCase() === formName.toUpperCase());
        if (matchingForm)
            return matchingForm.FormName;
        else
            return this.DefaultFormName;
    }

    GetForm(formName = null) {
        formName = this.FixFormName(formName);
        return this.Forms.find(f => f.FormName === formName);
    }

    GetPokemonInEvolutionFamily(formName = null) {
        if (formName != null && formName.toUpperCase() === "Any".toUpperCase())
            formName = "Any";
        else
            formName = this.FixFormName(formName);

        if (!this.EvolutionChains)
            return [{ Pokemon: this, Form: (formName === "Any") ? this.DefaultFormName : formName }];

        if (formName == null)
            formName = this.DefaultFormName;

        let evoChains = this.EvolutionChains.filter(ec =>
            (formName === "Any") ||
            (ec.Stage1DexNum === this.DexNum && ec.Stage1Form === formName) ||
            (ec.Stage2DexNum === this.DexNum && ec.Stage2Form === formName) ||
            (ec.Stage3DexNum === this.DexNum && ec.Stage3Form === formName));

        if (evoChains.length === 0)
            return [{ Pokemon: this, Form: (formName === "Any") ? this.DefaultFormName : formName }];

        //Catch any branches that this current pokemon's form is related to.
        let allEvoChains = [...evoChains];

        evoChains.forEach(ec => {
            let moreEvoChains = GetPokemon(ec.Stage1DexNum).EvolutionChains.filter(mec => mec.Stage1DexNum === ec.Stage1DexNum
                && (mec.Stage1Form === ec.Stage1Form || formName === "Any" || ec.Stage1Form === "Any" || mec.Stage1Form === "Any"));
            if (moreEvoChains.length !== 0)
                allEvoChains.push(...moreEvoChains.filter(mec => !allEvoChains.some(aec =>
                    aec.Stage1DexNum === mec.Stage1DexNum && aec.Stage1Form === mec.Stage1Form
                    && aec.Stage2DexNum === mec.Stage2DexNum && aec.Stage2Form === mec.Stage2Form
                    && aec.Stage3DexNum === mec.Stage3DexNum && aec.Stage3Form === mec.Stage3Form)));
        });

        let result = [];

        for (let ec of allEvoChains) {
            //console.log(ec);
            let stage1Mon, stage2Mon;

            if (!result.some(item => item.Pokemon.DexNum === ec.Stage1DexNum && item.Form === ec.Stage1Form)) {
                stage1Mon = { Pokemon: GetPokemon(ec.Stage1DexNum), Form: ec.Stage1Form };
                result.push(stage1Mon);
            }
            else
                stage1Mon = result.find(item => item.Pokemon.DexNum === ec.Stage1DexNum && item.Form === ec.Stage1Form);

            if (!result.some(item => item.Pokemon.DexNum === ec.Stage2DexNum && item.Form === ec.Stage2Form)) {
                stage2Mon = { Pokemon: GetPokemon(ec.Stage2DexNum), Form: ec.Stage2Form, Method: ec.Stage2Method, EvolvesFrom: stage1Mon };
                result.push(stage2Mon);
            }
            else
                stage2Mon = result.find(item => item.Pokemon.DexNum === ec.Stage2DexNum && item.Form === ec.Stage2Form);

            if (ec.Stage3DexNum !== 0 && !result.some(item => item.Pokemon.DexNum === ec.Stage3DexNum && item.Form === ec.Stage3Form))
                result.push({ Pokemon: GetPokemon(ec.Stage3DexNum), Form: ec.Stage3Form, Method: ec.Stage3Method, EvolvesFrom: stage2Mon });
        }

        result = result.filter(item => item.Form !== "Any");

        return result;
    }
}

class AbilityInfo {
    Name = "";
    GameText = "";
    EffectDetail = "";
    OverworldEffect = "";
    Link = "";

    constructor(dataObject) {
        this.Name = dataObject.Name;
        this.GameText = dataObject.GameText;
        this.EffectDetail = (dataObject.EffectDetail ? dataObject.EffectDetail : null);
        this.OverworldEffect = (dataObject.EffectDetail ? dataObject.OverworldEffect : null);
        this.Link = dataObject.Link;
    }
}

class MoveInfo {
    Name = "";
    Type = "";
    Category = "";
    BasePower = 0;
    Accuracy = 0;
    BattleEffect = "";
    SecondaryEffect = "";
    EffectRate = "";
    SpeedPriority = 0;
    CriticalHitRate = "";
    Target = "";
    MakesPhysicalContact = "";
    IsSuperMove = "";
    MaxMove = "";
    MaxMovePower = 0;
    ZMove = "";
    ZMovePowerOrEffect = "";

    constructor(dataObject) {
        this.Name = dataObject.Name;
        this.Type = dataObject.Type;
        this.Category = dataObject.Category;
        this.BasePower = dataObject.BasePower;
        this.Accuracy = dataObject.Accuracy;
        this.BattleEffect = dataObject.BattleEffect;
        this.SecondaryEffect = dataObject.SecondaryEffect;
        this.EffectRate = dataObject.EffectRate;
        this.SpeedPriority = dataObject.SpeedPriority;
        this.CriticalHitRate = dataObject.CriticalHitRate;
        this.Target = dataObject.Target;
        this.MakesPhysicalContact = dataObject.MakesPhysicalContact;

        this.IsSuperMove = dataObject.IsSuperMove;
        this.MaxMove = (dataObject.IsSuperMove === "No") ? Data.DefaultMaxMoves[this.Type] : null;
        this.MaxMovePower = (dataObject.IsSuperMove === "Yes" || this.Category === "Status") ? 0 : dataObject.MaxMovePower;
        this.ZMove = (dataObject.IsSuperMove === "No") ? Data.DefaultZMoves[this.Type] : null;
        this.ZMovePowerOrEffect = (dataObject.IsSuperMove === "No") ? dataObject.ZMovePowerOrEffect : null;
    }
}

var pokemonByDexNumCache = {};
var pokemonByNameCache = {};

function GetPokemon(dexNumOrName) {
    if (Data.PokemonList == null) {
        throw Error("GetPokemon(): Data.PokemonList is uninitialized! Load it using LoadPokemonListJSON() or set it directly first!");
    }

    let dexNum = parseInt(dexNumOrName, 10);
    let pokemonData;

    if (!isNaN(dexNum)) {

        if (dexNum <= 0 || dexNum > Data.PokemonList.length) {
            throw Error(`GetPokemon(): dexNum parameter "${dexNumOrName}" is out of range! valid range is [1-${Data.PokemonList.length}]`);
        }

        if (pokemonByDexNumCache[dexNum]) {
            //console.log(`DexNum Cache Used!! ${dexNum}`);
            return pokemonByDexNumCache[dexNum];
        }

        pokemonData = Data.PokemonList[dexNum - 1];
        dexNum = pokemonData.dexNum;
    }
    else if (typeof dexNumOrName === 'string') {
        dexNumOrName = dexNumOrName.trim();
        pokemonData = Data.PokemonList.find(p => p.Name.toUpperCase() === dexNumOrName.toUpperCase());

        if (pokemonData == null) {
            throw Error(`GetPokemon(): name parameter not found in the pokemon list! ${dexNumOrName}`);
        }

        if (pokemonByNameCache[pokemonData.Name]) {
            //console.log(`Name Cache Used!! ${pokemonData.Name}`)
            return pokemonByNameCache[pokemonData.Name];
        }
    }
    else {
        throw Error("GetPokemon(): parameter is not a number or a string!");
    }

    //If we got to this point, we have a pokemon loaded!
    let result = new Pokemon(pokemonData)

    pokemonByDexNumCache[result.DexNum] = result;
    pokemonByNameCache[result.Name] = result;

    return result;
}

function GetAbilityInfo(abilityName) {
    if (Data.AbilityDex == null) {
        throw Error("GetAbilityInfo(): Data.AbilityDex is uninitialized! Load it using LoadAbilityDexJSON() or set it directly first!");
    }

    abilityName = abilityName.trim();

    let data = Data.AbilityDex.find(a => a.Name.toUpperCase() === abilityName.toUpperCase());
    //console.log(data);
    if (!data)
        throw Error(`GetAbilityInfo(): Could not find an ability with the name "${abilityName}"!`);

    return new AbilityInfo(data);
}

function GetMoveInfo(moveName, form = null) {
    if (Data.MoveDex == null) {
        throw Error("GetMoveInfo(): Data.MoveDex is uninitialized! Load it using LoadMoveDexJSON() or set it directly first!");
    }

    let data = Data.MoveDex.find(m => m.Name.toUpperCase() === moveName.toUpperCase());

    if (!data)
        throw Error(`GetMoveInfo(): Could not find a move with the name "${moveName}"!`);

    let result = new MoveInfo(data);

    if (result.IsSuperMove === "No" && form != null && form instanceof Form && form.SignatureSuperMove) {
        //console.log(form.SignatureSuperMove);
        //GMax or ZMove?
        if (/G-Max/.test(form.SignatureSuperMove) && result.Category !== "Status" && result.Type === Data.SpeciesGMaxMovesTypes[form.SignatureSuperMove]) {
            result.MaxMove = form.SignatureSuperMove;
            let gmaxInfo = GetMoveInfo(form.SignatureSuperMove, form);
            if (gmaxInfo.BasePower !== 1)
                result.MaxMovePower = gmaxInfo.BasePower;
        }
        else if (result.Name === Data.SpeciesZMoveBaseMoves[form.SignatureSuperMove]) {
            result.ZMove = form.SignatureSuperMove;
            let zInfo = GetMoveInfo(form.SignatureSuperMove, form);
            result.ZMovePowerOrEffect = `${zInfo.BasePower}`
        }
    }

    return result;
}

export {
    Data,
    LoadPokemonListJSON,
    LoadPokemonMoveListJSON,
    LoadMoveDexJSON,
    LoadAbilityDexJSON,
    GetPokemon,
    GetAbilityInfo,
    GetMoveInfo,
    Move,
    LevelUpMove,
    MoveList,
    TypeWeaknesses,
    Form,
    EvolutionChain,
    FormChange,
    Pokemon,
    AbilityInfo,
}