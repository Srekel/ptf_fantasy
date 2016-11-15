"use strict";

var attributes = [
    "Strength",
    "Agility",
    "Wisdom",
    "Charisma"
];

var stats = [
    "Level",
    "Money",
    "Health",
    "Fate Points"
];

var races = {
    Human: [3, 3, 3, 3, 15, "Gets Fate Point on 2 sixes"],
    Dwarf: [4, 2, 3, 2, 20, "+1 start perk"],
    Elf: [2, 4, 4, 4, 10, "-1D6 for enemies"],
    Halfling: [2, 4, 3, 4, 10, "+1D6 for non-combat Agility rolls"],
    Orc: [4, 4, 2, 2, 20, "+1D6 when flanked"],
};
var race_indices = {
    Strength: 0,
    Agility: 1,
    Wisdom: 2,
    Charisma: 3,
    Health: 4,
}

var perks = [
    ["Berzerker", "+1DPS for both character and enemies.", ["combat"]],
    ["Fast on Feet", "+1 Agility.", ["combat", "thief"]],
];

var weapons = [
    ["Sword & Shield", [
        ["Attack", "AD6 * Strength", ""],
        ["Block", "AD6 * Strength", "Once per turn"],
    ]],
    ["Two-handed Axe", [
        ["Attack", "AD6 * Strength", ""],
        ["Block", "AD6 * Strength", "Can't both block and attack"],
    ]],
];

var default_character = {
    id: null,
    character_name: "Unnamed",
    player_name: "Player",
    attributes: {
        Strength: 0,
        Agility: 0,
        Wisdom: 0,
        Charisma: 0
    },
    // attribute_modifiers: {
    //     Strength: 0,
    //     Agility: 0,
    //     Wisdom: 0,
    //     Charisma: 0
    // },
    stats: {
        Level: 1,
        Money: 0,
        "Fate Points": 0,
        Health: 0,
    },
    race: "Human",
    perks: {
    },
    weapons: {
    }
};

function character_create() {
    var character = JSON.parse(JSON.stringify(default_character));
    character_update_attributes(character);
    return character;
}

function character_from_json(json_object) {
    var character = character_create();
    for(var thing in character) {
       if (!character.hasOwnProperty(thing)) {
            continue;
        }

        if (json_object[thing]) {
            character[thing] = json_object[thing];
        }
    };
    
    return character;
}

function character_update_attributes(character) {
    var race = races[character.race];
    attributes.forEach(function(attribute) {
        character.attributes[attribute] = race[race_indices[attribute]];
    });

    character.stats.Health = race[race_indices.Health];
}
