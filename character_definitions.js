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
    Human: [3, 3, 3, 3, 20, "Can exchange a single D6 for a D8 for Action Tests."],
    Dwarf: [4, 2, 3, 2, 30, "+1 start perk"],
    Elf: [2, 4, 4, 4, 15, "-1D6 for enemies"],
    Halfling: [2, 4, 3, 4, 15, "+1D6 for non-combat Agility rolls"],
    Orc: [4, 4, 2, 2, 25, "+1D6 when flanked"],
    Goblin: [2, 2, 2, 2, 10, ""],
    Ogre: [5, 2, 1, 1, 40, ""],
    Centaur: [3, 3, 3, 3, 25, "Double Strength when charging."],
};
var race_indices = {
    Strength: 0,
    Agility: 1,
    Wisdom: 2,
    Charisma: 3,
    Health: 4,
}

var perks = {
    Archer: {description: "+1D6 with bows."},
    Ambidextrous: {description: "+1D6 when using two items."},
    Backstabber: {description: "+1D6 from behind."},
    Berzerker: {description: "+1D6 for both character and enemies."},
    Blocker: {description: "+1D6 for Block."},
    Bullseye: {description: "+1D6 with bows when shooting an object."},
    Defender: {description: "-2 to enemy attack effect."},
    Dodger: {description: "-1D6 for enemies."},
    "Fast on Feet": {description: "Extra action just for moving."},
    Fighter: {description: "+1 Strength.", modifier: function(character) { character.attributes.Strength += 1;}},
    Frenzied: {description: "+1D6 for Attack. -1D6 to remain silent."},
    Ghost: {description: "+1D6 when trying to not be seen."},
    Initiator: {description: "+1D6 for initiative."},
    Mobile: {description: "+1 Agility.", modifier: function(character) { character.attributes.Agility += 1;}},
    Precise: {description: "+2 to attack effect."},
    "Quick-Shot": {description: "+1 free attack with Short Bow when attacking twice in one turn."},
    Silent: {description: "+1D6 when trying to be silent."},
    Sniper: {description: "+1D6 when attacking from more than 20 meters."},
    Surgical: {description: "Pierce +3."},
    Tank: {description: "+10 Health.", modifier: function(character) { character.attributes.Health += 10;}},
    Technical: {description: "Ignore one -1D6 when using a technique, per action."},
};

var generic_perks = {
    Cliffhanger: {description: "+1D6 when climbing vertically or worse."},
    Climber: {description: "+1D6 when climbing."},
    Cook: {description: "+1D6 for making food."},
    "Guardian Angel": {description: "Get an FP at the start of each mission."},
    Herbalist: {description: "+1D6 for knowledge of herbs and recipies."},
    Historian: {description: "+1D6 when dealing with old stuff."},
    Lookout: {description: "+1D6 when looking for things at some distance."},
    Miner: {description: "+1D6 for stone related stuff."},
    Raceologist: {description: "+1D6 for knowledge of races."},
    Scavenger: {description: "+1D6 when trying to find an object."},
    Woodsman: {description: "+1D6 in woods."},
}

var weapons = {
    "Sword & Shield": [
        {action: "Attack", dicepool: "Agility D6", effect: "10 + Strength + Agility", rule:""},
        {action: "Block", dicepool: "Strength - Damage / 10 D6", effect: "Block all.", rule:"Successive blocks get -1D6."}
    ],
    "Two-handed Axe": [
        {action: "Attack", dicepool: "Strength D6", effect: "2 + 4 * Strength", rule:""},
        {action: "Block", dicepool: "Strength - Damage / 5 D6", effect: "Block all.", rule: "Can't both block and attack."}
    ],
    "Double Daggers": [
        {action: "Attack", dicepool: "Agility D6", effect: "2 * Agility", rule:"Effect is applied twice."},
        {action: "Block", dicepool: "Agility - Damage / 5 D6", effect: "Block all.", rule: ""}
    ],
    "Short Bow": [
        {action: "Attack", dicepool: "Agility D6", effect: "2 + 3 * Agility", rule:"-1D6 for each 5m distance."}
    ],
    "Long Bow": [
        {action: "Attack", dicepool: "Agility D6", effect: "2 + 2 * Strength + Wisdom", rule:"-1D6 for each 15m distance. Pierce +3."}
    ],
    "Crossbow": [
        {action: "Attack", dicepool: "Agility D6", effect: "10 + 2 * Wisdom", rule:"-1D6 for each 15m distance. Pierce +6."},
        {action: "Reload", dicepool: "Strength D6", effect: "", rule:"If successful, reload in one action. Otherwise, two actions."}
    ],
};

var armors = {
    "No armor": {rating: 0, rule: "+1 Agility. -1D6 for enemy attacks.", modifier: function(character) {character.attributes.Agility += 1;}},
    "Leather armor": {rating: 5, rule: "+1 Agility.", modifier: function(character) {character.attributes.Agility += 1;}},
    "Plate armor": {rating: 10, rule: "Sneak roll -1D6. +1D6 for enemy attacks."}
}

var techniques = {
    "The Strong": {description: "Attack with -1D6. Strength +1 when resolving effect."},
    "The Agile": {description: "Attack with -1D6. Agility +1 when resolving effect."},
    "The Wise": {description: "Attack with -1D6. Wisdom +1 when resolving effect."},
    "The Chain Reaction": {description: "Attack with -1D6. If it kills, take a free move action towards an enemy."},
    "The Defensive Offense": {description: "Attack with -1D6. Enemy gets -1D6 when attacking you."},
    "The Follow-up": {description: "Attack with -1D6. Do an additional Attack on same enemy."},
    "The Omnislash": {description: "Attack with -1D6. Resolve effect on one more target."},
    "The Piercer": {description: "Attack with -1D6. Pierce +2."},
    "The Sneak Attack": {description: "Attack with -1D6. +1D6 to remain unnoticed."},
    "The Silent Takedown": {description: "Attack with -1D6. +2D6 to remain unnoticed if it kills."},
    "The Shank": {description: "Attack with Daggers with -2D6. Do two additional attacks."},
    "The Taunt": {description: "Block with -1D6. Force another enemy to attack you."},
    "The Disarm": {description: "Block with -1D6. If successful, enemy is disarmed."},
    "The Switcharoo": {description: "Block with -1D6. If successful, switch places."},
    "The Fast Reload": {description: "Reload with -1D6. If successful, reload instantly."},
}

var social_talents = {
    Lie: {description: "Convince NPC of a falsehood.",
            states: [{req: "Trust", res: "Believe"}, {req: "Like", res: "Believe", modifier: "-1D6"}]},
    Bluff: {description: "Tell NPC you have something you don't have, or will do something you won't do.",
             states: [{req: "Trust", res: "Believe"}, {req: "Like", res: "Believe", modifier: "-1D6"}]},
    Intimidate: {description: "Threaten NPC through body language.",
             states: [{req: "Threatened", res: "Fear"}]},
    Threaten: {description: "Threaten NPC with words.",
             states: [{req: "Threatened", res: "Fear"}, {req: "Fear", res: "Believe"},
                {req: "Threatened", res: "Believe", modifier: "-1D6"}]},
    Blackmail: {description: "Threaten NPC with exposing secret.",
             states: [{req: "Threatened", res: "Fear"}, {req: "Fear", res: "Believe"}]},
    Grab: {description: "Lay hands on NPC. Not necessarily violently.",
             states: [{req: "Threatened", res: "Fear"}, {req: "Uncomfortable", res: "Threatened"}]},
    Choke: {description: "Stranglehold on NPC.",
             states: [{req: "Threatened", res: "Fear"}, {req: "*", res: "Threatened"}]},
    "Friendly Shoulder-Box": {description: "Attempt to be friendly with NPC.",
             states: [{req: "Like", res: "Trust"}]},
    Wink: {description: "Subtly hint something at NPC.",
             states: [{req: "Like", res: "Attracted"}, {req: "Like", res: "Trust"},
                {req: "Uncomfortable", res: "Threatened"}, {req: "Dislike", res: "Threatened"}]},
    "Invade Personal Space": {description: "Stand uncomfortably close to NPC.",
             states: [{req: "*", res: "Uncomfortable"}, {req: "Uncomfortable", res: "Threatened"}]},
    Belittle: {description: "Make NPC feel inferior.",
             states: [{req: "Uncomfortable", res: "Threatened"}, {req: "*", res: "Uncomfortable"}]},
    Interrupt: {description: "Talk over NPC.",
             states: [{req: "Like", res: "Submissive"}, {req: "*", res: "Uncomfortable"}]},
    Swear: {description: "Say something nasty.",
             states: [{req: "Submissive", res: "Respect"}]},
    Insult: {description: "Say something bad about NPC.",
             states: [{req: "Respect", res: "Submissive"}, {req: "Dislike", res: "Threatened"},
                {req: "*", res: "Uncomfortable"}]},
    Ignore: {description: "Pretend not to hear NPC.",
             states: [{req: "Respect", res: "Submissive"}, {req: "Uncomfortable", res: "Dislike"},
                {req: "*", res: "Uncomfortable"}]},
    Ridicule: {description: "Make fun of NPC.",
             states: [{req: "Respect", res: "Submissive"}]},
    Listen: {description: "Listen attentively to NPC.",
             states: [{req: "Dislike", res: "Like"}]},
    Yawn: {description: "Act uninterested in NPC.",
             states: [{req: "Like", res: "Submissive"}, {req: "Uncomfortable", res: "Submissive"}]},
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
    },
    generic_perks: {
    },
    social_talents: {
    },
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
