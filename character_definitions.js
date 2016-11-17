"use strict";

var attributes = [
    "Strength",
    "Agility",
    "Wisdom",
    "Charisma",
    "Health"
];

var stats = [
    "Level",
    "Money",
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

var perks = {
    Aggressor: {description: "Force one enemy to attack you."},
    Backstabber: {description: "+1 DPS from behind."},
    Berzerker: {description: "+1 DPS for both character and enemies."},
    Defender: {description: "-1 DPS for enemies."},
    "Fast on Feet": {description: "+1 Agility.", modifier: function(character) { character.attributes.Agility += 1;}},
    Fighter: {description: "+1 Strength.", modifier: function(character) { character.attributes.Strength += 1;}},
    Frenzied: {description: "+1 Attack Die."},
    Blocker: {description: "+1 Block Die."},
    Sniper: {description: "+2 DPS with range on unsuspecting enemy."},
    Tank: {description: "+5 Health.", modifier: function(character) { character.attributes.Health += 5;}},
};

var weapons = {
    "Sword & Shield": [
        {action: "Attack", damage: "AD6 * Strength", rule:""},
        {action: "Block", damage: "AD6 * Strength", rule:"Once per turn"}
    ],
    "Two-handed Axe": [
        {action: "Attack", damage: "AD6 * Strength", rule:""},
        {action: "Block", damage: "AD6 * Strength", rule: "Can't both block and attack"}
    ],
};

var default_character = {
    id: null,
    character_name: "Unnamed",
    player_name: "Player",
    attributes: {
        Strength: 0,
        Agility: 0,
        Wisdom: 0,
        Charisma: 0,
        Health: 0,
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

    for( var perk_name in character.perks) {
        var perk_def = perks[perk_name];
        if (character.perks[perk_name] && perk_def.modifier) {
            perk_def.modifier(character);
        }
    }

    character.stats.Health = race[race_indices.Health];
}
