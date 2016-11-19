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
    Human: [3, 3, 3, 3, 15, "Can exchange a single D6 for a D8 for Action Tests."],
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
    Backstabber: {description: "+1D6 from behind."},
    Berzerker: {description: "+1D6 for both character and enemies."},
    Defender: {description: "-1 DPS for enemies."},
    Mobile: {description: "+1 Agility.", modifier: function(character) { character.attributes.Agility += 1;}},
    "Fast on Feet": {description: "Perform free move action on AD6 > 2."},
    Fighter: {description: "+1 Strength.", modifier: function(character) { character.attributes.Strength += 1;}},
    Frenzied: {description: "+1D6 for Attack."},
    Blocker: {description: "+1D6 for Block."},
    Sniper: {description: "+1D6 when attacking from more than 20 meters."},
    Precise: {description: "+1 DPS when attacking."},
    Tank: {description: "+10 Health.", modifier: function(character) { character.attributes.Health += 10;}},
    Silent: {description: "+1D6 when trying to be silent."},
    Ghost: {description: "+1D6 when trying to not be seen."},
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
    "Double Daggers": [
        {action: "Attack", damage: "AD6 * Agility", rule:"Armor reduces for each success."},
        {action: "Block", damage: "AD6 * Strength", rule: ""}
    ],
};

var armors = {
    "No armor": {rating: 0, rule: "+1 Agility, -1D6 for enemy attacks.", modifier: function(character) {character.attributes.Agility += 1;}},
    "Leather armor": {rating: 2, rule: "+1 Agility.", modifier: function(character) {character.attributes.Agility += 1;}},
    "Plate armor": {rating: 6, rule: ""}
}

var techniques = {
    "The Follow-up": {description: "Perform a free Attack on same enemy with -1D6."},
    "The Omnislash": {description: "Attack hits one more target, both with -1D6."},
    "The Shank": {description: "After an Attack with Daggers, do CS new attacks with -2D6."},
    "The Chain Reaction": {description: "Attack with -1D6. If it kills, take a free move action towards an enemy."},
    "The Piercer": {description: "Attack with -1D6. Armor counts as one level weaker."},
    "The Switcharoo": {description: "Block with -1D6. If no damage is taken, switch places."},
    "The Disarm": {description: "Block with -1D6. If no damage is taken, enemy is disarmed."},
    "The Taunt": {description: "If a block blocks all damage, force one enemy to attack you."},
}

var default_character = {
    id: null,
    character_name: "Srekel",
    player_name: "Anders",
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
    weapons: {
    },
    armor: "No armor",
    perks: {
    },
    techniques: {
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

    character.attributes.Health += character.attributes.Strength * (character.stats.Level - 1);
    var armor_modifier_func = armors[character.armor].modifier;
    if (armor_modifier_func) {
        armor_modifier_func(character);
    }
}
