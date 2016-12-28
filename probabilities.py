import random

d10 = [0, 3, 10, 1000, "d10"]
d6 = [1, 4, 6, 6, "d6"]
d3 = [0, 2, 3, 1000, "d3"]
d2 = [0, 1, 2, 1000, "d2"]

dice_tests = [
    [d6],
    [d6, d6],
    [d10],
    [d6, d6, d6],
    [d6, d10],
    [d6, d6, d6, d6],
    [d6, d6, d10],
    [d10, d10],
    [d6, d6, d6, d6, d6],
    [d6, d6, d6, d10],
    [d6, d10, d10],
    [d6, d6, d6, d6, d6, d6],
    [d6, d6, d10, d10],
    [d10, d10, d10],
    [d6, d10, d10, d10],
    [d10, d10, d10, d10],
]

def roll(dice):
    outcomes = [[i+1] for i in range(dice[0][2])]
    for die in dice[1:]:
        outcomes_size = len(outcomes)
        for out_i in range(outcomes_size):
            for i in range(die[2]):
                outcomes.append(outcomes[out_i] + [i+1])
        for out_i in range(outcomes_size):
            del outcomes[0]

    result = [0, 0, 0]
    for out in outcomes:
        for die_i in range(len(out)):
            dieroll = out[die_i]
            if dieroll <= dice[die_i][0]:
                result[0] += 1
            elif dieroll <= dice[die_i][1]:
                result[1] += 1
            else:
                result[2] += 1

    # print "result"
    # print(result)

    result = [0.0, 0.0, 0.0] #succ, cf, cs
    for out in outcomes:
        successes = 0
        cfs = 0
        css = 0
        for die_i in range(len(out)):
            dieroll = out[die_i]
            if dieroll <= dice[die_i][0]:
                cfs += 1
                # successes -= 1
            if dieroll > dice[die_i][1]:
                successes += 1
            if dieroll >= dice[die_i][3]:
                css += 1
                successes -= 1

        if successes > 0:
            result[0] += 1
        if css >= cfs:
            css -= cfs
            cfs = 0
        if cfs >= css:
            cfs -= css
            css = 0
        if css > 0:# and successes > 0:
            result[1] += 1
        if cfs > 0 and successes == 0:
            result[2] += 1

    print "result %-30s 1/%-4d %6.1f%% %6.1f%% %6.1f%%" % (
        " + ".join([die[4] for die in dice]),
        1 / (1-result[0] / len(outcomes)),
        100 * result[0] / len(outcomes),
        100 * result[1] / len(outcomes),
        100 * result[2] / len(outcomes)
        )

for test in dice_tests:
    roll(test)

# roll([d6, d10, d10, d10])