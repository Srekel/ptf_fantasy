"use strict";

function clear_table(table) {
    // http://stackoverflow.com/questions/7271490/delete-all-rows-in-an-html-table
    // var tableRows = table.getElementsByTagName('tr');
    // var rowCount = tableRows.length;

    // for (var x=rowCount-1; x>0; x--) {
    //     elmtTable.removeChild(tableRows[x]);
    // }
    var new_tbody = document.createElement('tbody');
    //populate_with_new_rows(new_tbody);
    table.replaceChild(new_tbody, table.tBodies[0])
}

function setup_tables(character) {
    setup_attribute_table("attributes", attributes, character);
    setup_race_table("races", races, character);
    setup_perk_table("perks", perks, character);
    setup_weapon_table("weapons", weapons, character);
}

function setup_attribute_table(table_name, attributes, character) {
    var attribute_table = document.getElementById(table_name);
    // clear_table(race_table);
    var character_attributes = character.attributes;
    attributes.forEach(function(attribute) {
        var cell = document.getElementById(attribute);
        cell.innerHTML = character_attributes[attribute];
        cell.onclick = function() {
            character_attributes[attribute] = character_attributes[attribute] + 1;
            if (character_attributes[attribute] == 10) {
                character_attributes[attribute] = 0;
            }
            setup_tables(character);
        };
    });
}
function setup_race_table(table_name, races, character) {
    var race_table = document.getElementById(table_name);
    clear_table(race_table);

    races.forEach(function(race) {
        var row = race_table.tBodies[0].insertRow(-1);
        row.className = "part";
        row.onclick = function(){
            var cell = this.getElementsByTagName("td")[0];
            var id = cell.innerHTML;
            character.race = id;
            setup_tables(character);
        };

        var namecell = row.insertCell(-1);
        namecell.className = "part_name";
        namecell.innerHTML = race[0];

        var valuecell = row.insertCell(-1);
        valuecell.className = "part_value";
        if (race[0] == character.race) {
            valuecell.className = "part_value_selected";
            valuecell.innerHTML = "X";
        }

        var str_cell = row.insertCell(-1);
        str_cell.className = "part_race_attribute";
        str_cell.innerHTML = race[1];

        var agi_cell = row.insertCell(-1);
        agi_cell.className = "part_race_attribute";
        agi_cell.innerHTML = race[2];

        var wis_cell = row.insertCell(-1);
        wis_cell.className = "part_race_attribute";
        wis_cell.innerHTML = race[3];

        var cha_cell = row.insertCell(-1);
        cha_cell.className = "part_race_attribute";
        cha_cell.innerHTML = race[4];

        var hp_cell = row.insertCell(-1);
        hp_cell.className = "part_race_attribute";
        hp_cell.innerHTML = race[5];

        var bonus_cell = row.insertCell(-1);
        bonus_cell.className = "part_description";
        bonus_cell.innerHTML = race[6];
    });
}

function setup_perk_table(table_name, perks, character) {
    var perks_table = document.getElementById(table_name);
    clear_table(perks_table);

    perks.forEach(function(perk) {
        var row = perks_table.tBodies[0].insertRow(-1);
        row.className = "part";
        row.onclick = function(){
            var cell = this.getElementsByTagName("td")[0];
            var id = cell.innerHTML;
            if (character.perks[id] === null) {
                character.perks[id] = 1;
            }
            else {
                character.perks[id] = null;
            }
            setup_tables(character);
        };

        var namecell = row.insertCell(-1);
        namecell.className = "part_name";
        namecell.innerHTML = perk[0];

        var valuecell = row.insertCell(-1);
        valuecell.className = "part_value";

        var perks = character.perks;
        if (perks[perk[0]]) {
            valuecell.className = "part_value_selected";
            valuecell.innerHTML = perks[perk[0]];
        }

        var descriptioncell = row.insertCell(-1);
        descriptioncell.className = "part_description";
        descriptioncell.innerHTML = perk[1];
    });
}

function setup_weapon_table(table_name, weapons, character) {
    var weapons_table = document.getElementById(table_name);
    clear_table(weapons_table);

    weapons.forEach(function(weapon) {
        var row = weapons_table.tBodies[0].insertRow(-1);
        row.className = "part";

        var actions = weapon[1];
        var namecell = row.insertCell(0);
        namecell.className = "part_name";
        namecell.innerHTML = weapon[0];
        namecell.rowSpan = actions.length;

        var valuecell = row.insertCell(-1);
        valuecell.className = "part_value";
        valuecell.rowSpan = actions.length;

        var weapons = character.weapons;
        if (weapons[weapon[0]]) {
            valuecell.className = "part_value_selected";
            valuecell.innerHTML = weapons[weapon[0]];
        }

        var actioncell = row.insertCell(-1);
        actioncell.className = "part_description";
        actioncell.innerHTML = actions[0][0];
        var checkcell = row.insertCell(-1);
        checkcell.className = "part_description";
        checkcell.innerHTML = actions[0][1];
        var rulecell = row.insertCell(-1);
        rulecell.className = "part_description";
        rulecell.innerHTML = actions[0][2];

        for (var index = 1; index < actions.length; index++) {
            var action = actions[index];
            var action_row = weapons_table.insertRow(-1);
            action_row.className = "part";

            var actioncell = action_row.insertCell(-1);
            actioncell.className = "part_description";
            actioncell.innerHTML = action[0];
            var checkcell = action_row.insertCell(-1);
            checkcell.className = "part_description";
            checkcell.innerHTML = action[1];
            var rulecell = action_row.insertCell(-1);
            rulecell.className = "part_description";
            rulecell.innerHTML = action[2];
        }

        // actions.forEach(function(action) {
        //     var valuecell = row.insertCell(-1);
        //     valuecell.className = "part_value";

        //     var descriptioncell = row.insertCell(-1);
        //     descriptioncell.className = "part_description";
        //     descriptioncell.innerHTML = weapon[1];
        // });
    });
}

var character = {
    char_name: "LOL",
    player_name: "PlayerLOL",
    attributes: {
        Level: 1,
        Money: 123,
        Strength: 1,
        Agility: 1,
        Wisdom: 1,
        Charisma: 1,
        FatePoints: 0,
    },
    race: "Dwarf",
    perks: {
        Berzerker: 1,
    },
    weapons: {
        "Sword & Shield": 1,
    }
}

setup_tables(character);

// var perktable = document.getElementById("combatperks");
// perks.forEach(function(item, index, array) {
//     var row = perktable.insertRow(0);
//     var namecell = row.insertCell(0);
//     namecell.className = "perk_name";
//     namecell.innerHTML = item;

//     var valuecell = row.insertCell(1);
//     valuecell.className = "perk_value";

//     var descriptioncell = row.insertCell(2);
//     descriptioncell.className = "perk_description";
//     descriptioncell.innerHTML = "LOL";
// });

function download(filename, text) {
    var char_str = JSON.stringify(character, null, "  ");
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(char_str));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

    //function loadFile() {
    //    var input, file, fr;
//
    //    if (typeof window.FileReader !== 'function') {
    //        alert("The file API isn't supported on this browser yet.");
    //        return;
    //    }
//
    //    input = document.getElementById('fileinput');
    //    if (!input) {
    //        alert("Um, couldn't find the fileinput element.");
    //    }
    //    else if (!input.files) {
    //        alert("This browser doesn't seem to support the `files` property of file inputs.");
    //    }
    //    else if (!input.files[0]) {
    //        alert("Please select a file before clicking 'Load'");
    //    }
    //    else {
    //        file = input.files[0];
    //        fr = new FileReader();
    //        fr.onload = receivedText;
    //        fr.readAsText(file);
    //    }
//
    //    function receivedText(e) {
    //        lines = e.target.result;
    //        var newArr = JSON.parse(lines);
    //    }
    //}