---
title: "Rotation/Priority List"
date: 2018-08-11
authors: ['Goosy', 'Nick']
published: true
showOnFrontpage: false
weight: 4
patch: "8.1"
---

*Balance doesn’t follow a strict rotation, it’s more of a priority list. This priority list builds upon itself depending on your trait and talent setup.*

### Opener

3 seconds before the pull cast two {{< spell 190984 "Solar Wraths" >}} standing away from the boss. As soon as the timer hits 0 and the boss is pulled apply {{< spell 93402 "Sunfire" >}}, {{< spell 164812 "Moonfire" >}}, and if talented, {{< spell 202347 "Stellar Flare" >}}. At this point spam Solar wrath until you reach at least 40 Astral Power and activate {{< spell 194223 "Celestial Alignment" >}}/{{< spell 102560 "Incarnation: Chosen of Elune" >}}.

1. 2x Solar Wrath
2. Sunfire and Moonfire
3. Stellar Flare
4. Solar Wrath to at least 40 AsP
5. Celestial Alignment / Incarnation
6. Fury of Elune / Force of Nature/ Warrior of Elune

### Nature's Balance Opener

When talented into {{< spell 202430 "Nature’s Balance" >}} you should slightly alter that opener so that you cast {{< spell 78674 "Starsurge" >}} just after pre-casting two wraths at 4 seconds before the pull. This allows you to gain 16 Astral Power from the Solar Wraths instead of having your Astral Power reset to 50 pull. Depending on how far you can stand from the boss before pulling, it is perfectly acceptable to only precast 1 Solar Wrath. This opener should look like this. 

1. 2x Solar Wrath (Only 1 Solar Wrath if close to the boss).
2. Starsurge
3. Sunfire and Moonfire
4. Stellar Flare
5. Solar Wrath to at least 40 AsP
6. Celestial Alignment / Incarnation
7. Fury of Elune / Force of Nature/ Warrior of Elune

### Single Target

1. Maintain 100% uptime on {{< spell 164812 "Moonfire" >}}, {{< spell 93402 "Sunfire" >}}, and Stellar Flare if talented. Make sure you only refresh DoTs when they’re within pandemic range (30% of the original DoT, this is 6.6 seconds for Moonfire, 5.4 seconds for Sunfire, and 7.2 seconds for Stellar Flare.)

2. Avoid capping Astral Power and generate Empowerments by casting {{< spell 78674 "Starsurge" >}}.

3. Spend Solar and Lunar {{< spell 279708 "Empowerments" >}}. It is important you don’t cap Empowerments unless you would otherwise cap Astral Power. If you must waste one of the two, the Solar Empowerment is worth more and so you should waste a Lunar Empowerment.

4. When you have no DoTs to apply and no Empowerments to spend, you should fill with {{< spell 190984 "Solar Wrath" >}}.

### Multi-Target

1. Maintain 100% uptime on {{< spell 164812 "Moonfire" >}} and {{< spell 93402 "Sunfire" >}}. Make sure you only refresh DoTs when they’re within pandemic range.

2. Use Astral Power on {{< spell 191034 "Starfall" >}} if you can hit at least 4 targets with it. With Pulsar this changes to 5 targets.  This further changes to 6 targets with {{< spell 287773 "Arcanic Pulsar" >}} and Starlord. This finally changes to 7 targets with Pulsar and x3 {{< spell 272871 "Streaking Stars" >}}. Otherwise spend your Astral Power on {{< spell 78674 "Starsurge" >}}.

3. Spend any Solar or Lunar Empowerments you gain from casting fillers.

4. When you have no DoTs to apply and no Empowerments to spend, you should fill with {{< spell 190984 "Solar Wrath" >}}. If you’re able to hit at least 2 targets, you should instead fill with {{< spell 194153 "Lunar Strike" >}}.

### Streaking Stars Rotation During Cooldowns

Streaking Stars changes your playstyle slightly during {{< spell 194223 "Celestial Alignment" >}}/{{< spell 102560 "Incarnation: Chosen of Elune" >}}. Basically you should never allow two of the same ability to hit the target in a row. Additionally, every spell that isn't Solar Wrath, Moonfire, or Sunfire, should be followed up with a Solar Wrath, regardless of if empowered. It should be noted that you should cast all of your talented cooldowns directly after Celestial Alignment/Incarnation: Chosen of Elune, such as {{< spell 202425 "Warrior of Elune" "live" >}}, {{< spell 202770 "Fury of Elune" >}}, and {{< spell 205636 "Force of Nature" >}}.

1. Don't repeat the same spell cast twice.

2. Maintain 100% uptime on {{< spell 164812 "Moonfire" >}} and {{< spell 93402 "Sunfire" >}}. Make sure you only refresh DoTs when they’re within pandemic range.

3. If you will not have time to cast another ability during your cooldown window, refresh your lowest duration DoT.

4. Don't cap on Astral Power by casting {{< spell 78674 "Starsurge" >}} or {{< spell 191034 "Starfall" >}}.

5. Don't cap {{< spell 279708 "Empowerments" >}}.

6. If your last spell was not Solar Wrath, Moonfire, or Sunfire, cast Solar Wrath.

7. Spend any Empowerments.

8. If you lack Empowerments, Astral Power for spenders, and DoTs to refresh the pandemic on you should simply alternate between Solar Wrath and Lunar Strike.

### Starlord Opener

Currently {{< spell 202345 "Starlord" >}} does not change your opener and you should follow the ones stated above.

### Starlord Rotation

The rotation when using {{< spell 202345 "Starlord" >}} is the same as the normal rotation with one important rule to maximize the talents power. Basically, you will "cancelaura" the Starlord buff whenever you have less than 8 seconds remaining on the buff and you are about to cast {{< spell 78674 "Starsurge" >}}. Cancelaura meaning to remove the Starlord buff from yourself. The optimal way of doing this is to start pooling Astral Power once you have less than 8 seconds remaining on Starlord until you have 87 Astral Power (this can be done with less Astral Power if needed to Starsurge for movement), at this point you should use your cancelaura macro and then Starsurge. 

If done correctly, you will end most Starlord cycles with nearly capped Astral Power and the ability to quickly restack the new cycle. Ideally you will almost always cancel Starlord at the very end of the buffs duration if at all. 

Keep in mind that maximising Starlord usage is a very small increase, as in less than 1% gain.

The macro to cancelaura Starlord can be found below.

```
/cancelaura starlord
```

If you don't want to use the cancelaura macro, simply pool Astral Power once you have less than 8 seconds on the Starlord buff, and only Starsurge to avoid capping Astral Power.

### Arcanic Pulsar

To maximize your Arcanic Pulsar windows, you should slightly change your playstyle upon getting the 8th stack of this effect and before casting your 9th Starsurge. What this means is you should pool to at least 75 Astral Power before the 9th Starsurge. If your 9th Starsurge happens to be within the last 8 seconds of Starlord, you should cancelaura the Starlord buff (if you're minmaxing with the cancelaura macro). Basically, you're aiming to get 2 Starsurges within the 6 second Pulsar window and then end the Pulsar window with a DoT cast of your lowest duration instant cast DoT if you can't fit another Solar Wrath in.


