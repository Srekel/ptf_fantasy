"use strict";

var loaded_character = null;
var resolved = false;

function resolve_value(value, character, compact) {
    if (!compact) {
        var d6index = value.indexOf("D6")
        if (d6index != -1) {
            value = value.substr(0, d6index) + " D6";
        }
        return value;
    }

    var tokens = value.split(" ");
    for(var i = 0; i < tokens.length; i++) {
        var token = tokens[i];
        var d6index = token.indexOf("D6");
        if (d6index != -1) {
        //     var total = 0;
        //     for(var comp_i = 0; comp_i < d6index; comp_i++) {
        //         var number = parseInt(token[comp_i])
        //         if (!isNaN(number))
        //             total = total + number;
        //         else if(token[comp_i]  == "S")
        //             total = total + character.attributes.Strength;
        //         else if(token[comp_i]  == "A")
        //             total = total + character.attributes.Agility;
        //         else if(token[comp_i]  == "W")
        //             total = total + character.attributes.Wisdom;
        //         else if(token[comp_i]  == "C")
        //             total = total + character.attributes.Charisma;
        //     }

        //     tokens[i] = String(total) + " D6";
        }
        else if (token == "Strength") {
            tokens[i] = character.attributes.Strength;
        }
        else if (token == "Agility") {
            tokens[i] = character.attributes.Agility;
        }
        else if (token == "Wisdom") {
            tokens[i] = character.attributes.Wisdom;
        }
        else if (token == "Charisma") {
            tokens[i] = character.attributes.Charisma;
        }
    }

    var new_tokens = [];
    var i = 0;
    while (i < tokens.length) {
        var token = tokens[i];
        if (token == "*") {
            new_tokens[new_tokens.length-1] = parseInt(tokens[i-1]) * parseInt(tokens[i+1])
            i = i + 2
        }
        else {
            new_tokens[new_tokens.length] = token;
            i = i + 1
        }
    }
    tokens = new_tokens;

    new_tokens = [];
    i = 0;
    while (i < tokens.length) {
        var token = tokens[i];
        if (token == "+") {
            new_tokens[new_tokens.length-1] = parseInt(new_tokens[new_tokens.length-1]) + parseInt(tokens[i+1])
            i = i + 2
        }
        else {
            new_tokens[new_tokens.length] = token;
            i = i + 1
        }
    }
    tokens = new_tokens;


    // for(var i = 0; i < tokens.length; i++) {
    //     var token = tokens[i];
    //     if (token == "+") {
    //         tokens[i+1] = parseInt(tokens[i-1]) + parseInt(tokens[i+1])
    //         tokens[i-1] = ""
    //         tokens[i] = ""
    //     }
    //     else if (token == "*") {
    //         tokens[i] = parseInt(tokens[i-1]) * parseInt(tokens[i+1])
    //         tokens[i+1] = ""
    //         tokens[i-1] = ""
    //     }
    // }

    return tokens.join(" ");
}
function clear_table(table) {
    var new_tbody = document.createElement('tbody');
    table.replaceChild(new_tbody, table.tBodies[0])
}

function setup_tables(character, compact) {
    compact = !!compact;
    document.getElementById("character_name_compact").innerHTML = character.character_name;
    document.getElementById("player_name_compact").innerHTML = character.player_name;
    document.getElementById("character_name").value = character.character_name;
    document.getElementById("player_name").value = character.player_name;
    document.getElementById("character_name").oninput = function() {
        character.character_name = this.value;
        document.getElementById("character_name_compact").innerHTML = character.character_name;
    };
    document.getElementById("player_name").oninput = function() {
        character.player_name = this.value;
        document.getElementById("player_name_compact").innerHTML = character.player_name;
    };

    setup_attribute_table("stats", stats, character);
    setup_attribute_table("attributes", attributes, character);
    setup_race_table("race", races, character);
    setup_weapon_table("weapons", weapons, character, resolved);
    setup_armor_table("armor", armors, character);
    setup_perk_table("perks", perks, character);
    setup_technique_table("techniques", techniques, character);
}

function setup_attribute_table(table_name, attributes, character) {
    var attribute_table = document.getElementById(table_name);
    // clear_table(race_table);
    var character_attributes = character[table_name];
    attributes.forEach(function(attribute) {
        var cell = document.getElementById(attribute);
        cell.innerHTML = character_attributes[attribute];
        if (table_name == "stats") {
            cell.onclick = function() {
                var value = window.prompt("Enter new " + attribute + " value", character_attributes[attribute])
                if (value != null) {
                    character_attributes[attribute] = parseInt(value);
                    cell.innerHTML = value;
                    character_update_attributes(character);
                    setup_tables(character);
                }
            };
        }
    });
}

function setup_race_table(table_name, races, character) {
    var race_table = document.getElementById(table_name);
    clear_table(race_table);

    for (var racename in races) {
        if (!races.hasOwnProperty(racename)) {
            continue;
        }
        var race = races[racename];

        var row = race_table.tBodies[0].insertRow(-1);
        row.className = "part";

        var namecell = row.insertCell(-1);
        namecell.className = "part_name";
        namecell.innerHTML = racename;

        var valuecell = row.insertCell(-1);
        valuecell.className = "part_value";
        if (racename == character.race) {
            valuecell.className = "part_value_selected";
            valuecell.innerHTML = "X";
            // valuecell.className += " compactable";
        }
        else {
            row.className += " compactable";

            row.onclick = function(){
                var cell = this.getElementsByTagName("td")[0];
                var id = cell.innerHTML;
                character.race = id;
                character_update_attributes(character);
                setup_tables(character);
            };
        }

        var str_cell = row.insertCell(-1);
        str_cell.className = "part_race_attribute compactable";
        str_cell.innerHTML = race[0];

        var agi_cell = row.insertCell(-1);
        agi_cell.className = "part_race_attribute compactable";
        agi_cell.innerHTML = race[1];

        var wis_cell = row.insertCell(-1);
        wis_cell.className = "part_race_attribute compactable";
        wis_cell.innerHTML = race[2];

        var cha_cell = row.insertCell(-1);
        cha_cell.className = "part_race_attribute compactable";
        cha_cell.innerHTML = race[3];

        var hp_cell = row.insertCell(-1);
        hp_cell.className = "part_race_attribute compactable";
        hp_cell.innerHTML = race[4];

        var bonus_cell = row.insertCell(-1);
        bonus_cell.className = "part_description";
        bonus_cell.innerHTML = race[5];
    };
}

function setup_perk_table(table_name, perks, character) {
    var perks_table = document.getElementById(table_name);
    clear_table(perks_table);

    for (var perk_name in perks) {
        var row = perks_table.tBodies[0].insertRow(-1);
        row.className = "part";
        row.onclick = function(){
            var cell = this.getElementsByTagName("td")[0];
            var id = cell.innerHTML;
            if (!character.perks[id]) {
                character.perks[id] = 1;
            }
            else {
                character.perks[id] = null;
            }
            character_update_attributes(character);
            setup_tables(character);
        };

        var namecell = row.insertCell(-1);
        namecell.className = "part_name";
        namecell.innerHTML = perk_name;

        var valuecell = row.insertCell(-1);
        valuecell.className = "part_value";

        var character_perks = character.perks;
        if (character_perks[perk_name]) {
            valuecell.className = "part_value_selected";
            valuecell.innerHTML = character_perks[perk_name];
        }
        else {
            row.className += " compactable";
        }

        var descriptioncell = row.insertCell(-1);
        descriptioncell.className = "part_description";
        descriptioncell.innerHTML = perks[perk_name].description;
    };
}

function setup_weapon_table(table_name, weapons, character, compact) {
    var weapons_table = document.getElementById(table_name);

    if (!compact) {
        clear_table(weapons_table);
        for (var weapon_name in weapons) {
            var row = weapons_table.tBodies[0].insertRow(-1);
            var namecell = row.insertCell(-1);
            var valuecell = row.insertCell(-1);
            var actioncell = row.insertCell(-1);
            var dicecell = row.insertCell(-1);
            var effectcell = row.insertCell(-1);
            var rulecell = row.insertCell(-1);

            var weapon = weapons[weapon_name];
            var actions = weapon;

            for (var index = 1; index < actions.length; index++) {
                var action = actions[index];
                var action_row = weapons_table.tBodies[0].insertRow(-1);
                var actioncell = action_row.insertCell(-1);
                var dicecell = action_row.insertCell(-1);
                var effectcell = action_row.insertCell(-1);
                var rulecell = action_row.insertCell(-1);
            }
        }
    }

    var row_i = -1;
    for (var weapon_name in weapons) {
        row_i = row_i + 1
        var row = weapons_table.tBodies[0].rows[row_i];
        row.className = "part";
        row.onclick = function(weapon_name) {
            if (!character.weapons[weapon_name]) {
                character.weapons[weapon_name] = 1;
            }
            else {
                character.weapons[weapon_name] = null;
            }
            character_update_attributes(character);
            setup_tables(character);
        }.bind(this, weapon_name);

        var weapon = weapons[weapon_name];
        var actions = weapon;

        var namecell = row.cells[0];
        namecell.className = "part_name";
        namecell.innerHTML = weapon_name;
        namecell.rowSpan = actions.length;

        var valuecell = row.cells[1];
        valuecell.className = "part_value";
        valuecell.rowSpan = actions.length;

        var character_weapons = character.weapons;
        if (character_weapons[weapon_name]) {
            valuecell.className = "part_value_selected";
            valuecell.innerHTML = character_weapons[weapon_name];
        }
        else {
            row.className += " compactable";
        }

        var actioncell = row.cells[2];
        actioncell.className = "part_description";
        actioncell.innerHTML = actions[0].action;
        var dicecell = row.cells[3];
        dicecell.className = "part_description rightcol resolveable";
        dicecell.innerHTML = resolve_value(actions[0].dicepool, character, compact);
        var effectcell = row.cells[4];
        effectcell.className = "part_description";
        effectcell.innerHTML = resolve_value(actions[0].effect, character, compact);;
        var rulecell = row.cells[5];
        rulecell.className = "part_description";
        rulecell.innerHTML = actions[0].rule;

        for (var index = 1; index < actions.length; index++) {
            row_i = row_i + 1
            var action = actions[index];
            var action_row = weapons_table.tBodies[0].rows[row_i];
            action_row.className = "part";

            if (!character_weapons[weapon_name]) {
                action_row.className += " compactable";
            }

            var actioncell = action_row.cells[0];
            actioncell.className = "part_description";
            actioncell.innerHTML = action.action;
            var dicecell = action_row.cells[1];
            dicecell.className = "part_description rightcol resolveable";
            dicecell.innerHTML = resolve_value(action.dicepool, character, compact);;
            var effectcell = action_row.cells[2];
            effectcell.className = "part_description";
            effectcell.innerHTML = resolve_value(action.effect, character, compact);;
            var rulecell = action_row.cells[3];
            rulecell.className = "part_description";
            rulecell.innerHTML = action.rule;
        }

    };
}

function setup_armor_table(table_name, armors, character) {
    var armor_table = document.getElementById(table_name);
    clear_table(armor_table);

    for (var armorname in armors) {
        if (!armors.hasOwnProperty(armorname)) {
            continue;
        }
        var armor = armors[armorname];

        var row = armor_table.tBodies[0].insertRow(-1);
        row.className = "part";

        var namecell = row.insertCell(-1);
        namecell.className = "part_name";
        namecell.innerHTML = armorname;

        var valuecell = row.insertCell(-1);
        valuecell.className = "part_value";
        if (armorname == character.armor) {
            valuecell.className = "part_value_selected";
            valuecell.innerHTML = "X";
            // valuecell.className += " compactable";
        }
        else {
            row.className += " compactable";

            row.onclick = function(){
                var cell = this.getElementsByTagName("td")[0];
                var id = cell.innerHTML;
                character.armor = id;
                character_update_attributes(character);
                setup_tables(character);
            };
        }

        var rating_cell = row.insertCell(-1);
        rating_cell.className = "part_description";
        rating_cell.innerHTML = armor.rating;

        var rule_cell = row.insertCell(-1);
        rule_cell.className = "part_description";
        rule_cell.innerHTML = armor.rule;
    };
}

function setup_technique_table(table_name, techniques, character) {
    var techniques_table = document.getElementById(table_name);
    clear_table(techniques_table);

    for (var technique_name in techniques) {
        var row = techniques_table.tBodies[0].insertRow(-1);
        row.className = "part";
        row.onclick = function(){
            var cell = this.getElementsByTagName("td")[0];
            var id = cell.innerHTML;
            if (!character.techniques[id]) {
                character.techniques[id] = 1;
            }
            else {
                character.techniques[id] = null;
            }
            character_update_attributes(character);
            setup_tables(character);
        };

        var namecell = row.insertCell(-1);
        namecell.className = "part_name";
        namecell.innerHTML = technique_name;

        var valuecell = row.insertCell(-1);
        valuecell.className = "part_value";

        var character_techniques = character.techniques;
        if (character_techniques[technique_name]) {
            valuecell.className = "part_value_selected";
            valuecell.innerHTML = character_techniques[technique_name];
        }
        else {
            row.className += " compactable";
        }

        var descriptioncell = row.insertCell(-1);
        descriptioncell.className = "part_description";
        descriptioncell.innerHTML = techniques[technique_name].description;
    };
}

loaded_character = character_create();
loaded_character.perks.Mobile = 1;
loaded_character.weapons["Sword & Shield"] = 1;
loaded_character.techniques["The Agile"] = 1;
character_update_attributes(loaded_character);
setup_tables(loaded_character);

[].forEach.call(document.querySelectorAll('.compact'), function (el) {
    el.style.display = "none";
});


function save_local() {
    if (!loaded_character.character_name || loaded_character.character_name == "") {
        alert("Not a valid character name");
        return;
    }

    var filename = loaded_character.character_name + ".ptf_character";
    var char_str = JSON.stringify(loaded_character, null, "    ");
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(char_str));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function open_local() {
    if (typeof window.FileReader !== 'function') {
        alert("The file API isn't supported on this browser yet.");
        return;
    }

    var input = document.getElementById('fileinput');
    if (!input) {
        alert("Um, couldn't find the fileinput element.");
    }
    else if (!input.files) {
        alert("This browser doesn't seem to support the `files` property of file inputs.");
    }
    else if (!input.files[0]) {
        alert("Please select a file before clicking 'Load'");
    }
    else {
        function receivedText(e) {
            var lines = e.target.result;
            var newArr = JSON.parse(lines);
            document.getElementById("TESTLOL").innerHTML = lines;
            loaded_character = character_from_json(newArr);
            character_update_attributes(loaded_character);
            setup_tables(loaded_character);
        }

        var file = input.files[0];
        var fr = new FileReader();
        fr.onload = receivedText;
        fr.readAsText(file);
    }
}


function animate(element, animation_name, delay) {
    element.style.animationName = animation_name;
    element.style.animationDuration =  "0.75s";
    element.style.animationDelay = delay + "s";
}

var hidefunc = function() {
    this.style.display = "none";
};

function hide_class(class_name) {
    var max_delay = 0;
    var delay = 0;
    var parent = null;
    [].forEach.call(document.querySelectorAll(class_name), function (el) {
        if (el.parentElement !== parent) {
            delay = 0;
            parent = el.parentElement;
        }
        delay = delay + 0.15;
        max_delay = Math.max(delay, max_delay);
        el.style.animationName = "fadeout_and_hide";
        el.style.animationDuration =  "0.5s";
        el.style.animationDelay = delay + "s";
        // animate(el, "fadeout_and_hide", delay);
        el.addEventListener("animationend", hidefunc);
    });
    return max_delay + 0.5;
}

function show_class(class_name) {
    var delay = 0;
    var parent = null;
    [].forEach.call(document.querySelectorAll(class_name), function (el) {
        if (el.parentElement !== parent) {
            delay = 0;
            parent = el.parentElement;
        }
        delay = delay + 0.15;
        el.style.display = "";
        el.style.animationName = "fadein_and_show";
        el.style.animationDuration = 1 + "s";
        el.style.animationDelay = delay + "s";
        el.removeEventListener("animationend", hidefunc);
    });
}

var compact = false;
function compact_view() {
    compact = !compact;
    if (compact) {
        var hide_delay = hide_class(".compactable");
        window.setTimeout(function() {
            show_class(".compact");
        }, hide_delay * 1000);
        document.getElementById("compact").value = "Full view";
    }
    else {
        var hide_delay = hide_class(".compact");
        window.setTimeout(function() {
            show_class(".compactable");
        }, hide_delay * 1000);
        // show_class(".compactable");
        document.getElementById("compact").value = "Compact view";
    }

}

function resolve_view() {
    resolved = !resolved;
    setup_weapon_table("weapons", weapons, loaded_character, resolved);
}

// compact_view();