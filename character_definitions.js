
var attributes = [
    "Level",
    "Strength",
    "Agility",
    "Wisdom",
    "Charisma",
    "Money",
    "FatePoints",
]

var races = [
    ["Human", 3, 3, 3, 3, 15, "+3 Attribute Points"],
    ["Dwarf", 5, 2, 4, 2, 20, "+1 start perk"],
    ["Elf", 2, 4, 4, 4, 10, "-1D6 for enemies"],
    ["Halfling", 2, 4, 3, 4, 10, "+1D6 for non-combat Agility rolls"],
    ["Orc", 4, 4, 2, 2, 20, "+1D6 when flanked"],
];

var perks = [
    ["Berzerker", "+1DPS for both character and enemies.", ["combat"]],
    ["Fast on Feet", "+1 Agility.", ["combat", "thief"]],
];

var weapons = [
    ["Sword & Shield", [
        ["Attack", "AD6 * Strength damage"],
        ["Block", "AD6 * Strength damage", "Once"],
    ]],
    ["Two-handed Axe", [
        ["Attack", "AD6 * Strength damage"],
    ]],
];