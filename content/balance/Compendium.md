---
date: "2023-05-09"
authors: ["Chicken, Jundarer, Dsune (Oi)"]
published: true
patch: "10.2.6"
title: Balance Druid 10.2.6 Compendium
showOnFrontpage: true
description: "Everything you need to know about Balance Druid"
showInRecent: true
sidebarTitle: "Quicklinks"
sidebarContents: |
  **[1. News](#news)**

  **[2. Rotation](#rotation)**
  <br>[Precasting](#precast)
  <br>[Single Target priority](#st)
  <br>[AoE priority](#aoe)
  <br>[Eclipses and Fillers](#fillers)
  <br>[How to Use Warrior of Elune](#woe)
  <br>[How to use Owlkin Frenzy procs](#owlkin-frenzy)

  **[3. Talents](#talents)**
  <br>[Raid](#raid)
  <br>[Mythic+](#mythic+)

  **[4.Consumables](#consumables)**
  <br>[Potions](#potions)
  <br>[Food](#food)
  <br>[Phials](#phials)
  <br>[Runes](#runes)

  **[5. Gearing](#gearing)**
  <br>[Stats](#stats)
  <br>[Enchants](#enchants)
  <br>[Embellishments](#embellishments)
  <br>[Trinkets](#trinkets)

  **[6. Miscellaneous](#misc)**
  <br>[FAQ](#faq)
  <br>[Do our dots snapshot?](#snapshot)
  <br>[What is Astral damage?](#astral-damage)
  <br>[Macros](#macros)
  <br>[Useful WeakAura(s)](#wa)
  <br>[Cancelaura Macros](#cancel)

  **[7. Sims](#sims)**
---

[Changelog](https://github.com/dreamgrove/dreamgrove/commits/master/content/balance)

If you're a visual learner there is also a [video explanation of the compendium](https://www.youtube.com/watch?v=BzDBvOrlvjA). It was made during 10.2 but most of the concepts still apply.

<div id="news">

# [1. News:](#news)

</div>

## Season 4 News

### Tier Set

#### {{< spell 394412 "2-piece" >}}:

> {{< spell 78674 "Starsurge" >}} and {{< spell 191034 "Starfall" >}} increase the damage of your next {{< spell 190984 "Wrath" >}} or {{< spell 194153 "Starfire" >}} by 30%, stacking up to 3 times

This is roughly a 4% DPS increase from having no tier.

You can treat this buff either as a passive or try stacking it to 3 before using a generator, as per usual pooling for movement and getting starlord up has higher prio.

#### {{< spell 394414 "4-piece" >}}:

> When you enter {{< spell 79577 "Eclipse" >}}, your next {{< spell 78674 "Starsurge" >}} or {{< spell 191034 "Starfall" >}} cost 15 less Astral Power and deals 40% increased damage.

This is roughly a 4.5% DPS increase from having no tier.

The buff gives you a reduced cost on your next spender every time you enter {{< spell 79577 "Eclipse" >}}. Buff is also applied when activating {{< spell 393960 "Pulsar" >}} or pressing {{< spell 194223 "CA" >}}/{{< spell 102560 "Incarnation" >}}

Total DPS from set: ~8.6%

Tier sim (current ilvl ~489): https://www.raidbots.com/simbot/report/4Es5i2x5SJuHYpAc2yiMAb

**Due to our new tier set being weaker than the S3 one, wearing 2+2p or replacing the old one with 4p from Normal will, most likely, result in a DPS loss. Make sure to sim your character before swapping any set items**

### Antique Bronze Bullion

Season 4 brings back the Dinar system from Season 4 in Shadowlands, now under the name Antique Bronze Bullion. You will acquire this currency gradually from playing the game and it will allow you to buy "special" items from any of the 3 Dragonflight raids.

Before making any decisions on what you should spend this currency on, you should always sim your character using Droptimizer or Top Gear functions on [Raidbots](https://raidbots.com)

Here are items you should potentially spend the Antique Bronze Bullion on

- [Vakash, the Shadowed Inferno](https://www.wowhead.com/item=207788/vakash-the-shadowed-inferno)
- [Neltharion's Call to Suffering](https://www.wowhead.com/ptr-2/item=204211/neltharions-call-to-suffering)
- [Whispering Incarnate Icon](https://www.wowhead.com/item=194301/whispering-incarnate-icon)
- [Dreambinder, Loom of the Great Cycle](https://www.wowhead.com/item=208616/dreambinder-loom-of-the-great-cycle)
- [Seal of Filial Duty](https://www.wowhead.com/item=195526/seal-of-filial-duty)
- [Voice of the Silent Star](https://www.wowhead.com/item=204465/voice-of-the-silent-star)
- [Icewrath's Channeling Conduit](https://www.wowhead.com/item=195484/icewraths-channeling-conduit)

Feedback post for season 4 and War Within: https://eu.forums.blizzard.com/en/wow/t/feedback-and-wishlist-on-balance-druid-for-season-4-and-war-within/501907

<br><div id="rotation">

# [2.Rotation:](#rotation)

</div>

<div id="precast">

## [Precasting](#precast)

</div>

**Precasting:**

- Cast {{< spell 190984 "Wrath" >}} twice.
- Cast {{< spell 202347 "Stellar Flare" >}}.
- Cast {{< spell 194153 "Starfire" >}} if {{< spell 202347 "Stellar Flare" >}} is not talented.

You can precast from max range 4 seconds before a boss is pulled.

**What is a priority list?**

When reading the priority lists below, you should not think of these as steps to be followed in a specific order. At any given point in combat, you should cast the first ability on the list that you are able to cast, provided the conditions for its use are met.

<br><div id="st">

## [Single Target priority](#st)

</div>

**Select which talents you have talented to filter the priority list:**

{{< checkbox id="Warrior of Elune" spell=202425 checked=true radio="Warrior of Elune" >}}Warrior of Elune{{< /checkbox >}}
{{< checkbox id="Force of Nature" spell=205636 radio="Warrior of Elune" >}}Force of Nature{{< /checkbox >}}</br>
{{< checkbox id="Stellar Flare" spell=202347 >}}Stellar Flare{{< /checkbox >}}</br>
{{< checkbox id="Astral Communion" spell=400636 >}}Astral Communion{{< /checkbox >}}</br>
{{< checkbox id="New Moon" spell=274281 checked=true radio="New Moon">}}New Moon{{< /checkbox >}}
{{< checkbox id="Fury of Elune" spell=202770 radio="New Moon">}}Fury of Elune{{< /checkbox >}}</br>
{{< checkbox id="Cancelaura" spell=202345 >}}Cancelaura Starlord{{< /checkbox >}}</br>
{{< checkbox id="Wild Mushroom" spell=88747 >}}Wild Mushroom{{< /checkbox >}}</br>
{{< checkbox id="Starweaver" spell=393940 >}}Starweaver{{< /checkbox >}}</br>
{{< checkbox id="Convoke the Spirits" spell=391528 >}}Convoke the Spirits{{< /checkbox >}}</br>

**Note: While not explicitly mentioned in the priority list, if you find yourself outside of eclipse and are about to cap astral power, it's better to spend it to prevent further capping before entering eclipse.**

- Keep up {{< spell 8921 "Moonfire" >}} and {{< spell 93402 "Sunfire" >}}, refresh within pandemic (30% of base duration shown in the tooltip).
- {{<cbtext id="Stellar Flare" >}}Keep up {{< spell 202347 "Stellar Flare" >}} and refresh within pandemic (30% of base duration shown in the tooltip) if you will not overcap on AP.{{</cbtext>}}
- Use {{< spell 194223 "Celestial Alignment" >}} /{{< spell 102560 "Incarnation" >}} if you're not in {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} already.
- {{<cbtext id="Convoke the Spirits">}}Use {{< spell 391528 "Convoke the Spirits" >}} when below 40 AP, {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} will last for more than 4 seconds or your next {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}} window is more than 30s away and your Eclipse will last for more than 4s.{{</cbtext>}}
- Use {{< spell 190984 "Wrath" >}} to enter Lunar Eclipse if one of the following conditions is true:
  - You have 520 or more stacks of {{< spell 393961 "Pulsar" >}}
  - The cooldown of {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} is less than 5 seconds.
- {{<cbtext id="Warrior of Elune">}}Use {{< spell 202425 "Warrior of Elune" >}} if your eclipse has less than 7 seconds left and you will enter Solar Eclipse next.{{</cbtext>}}
- Use {{< spell 194153 "Starfire" >}} to enter Solar Eclipse.
- {{<cbtext id="Astral Communion">}}Use {{< spell 400636 "Astral Communion" >}} if you will not overcap on AP.{{</cbtext>}}
- {{<cbtext id="Force of Nature">}}Use {{< spell 205636 "Force of Nature" >}} if you will not overcap on AP.{{</cbtext>}}
- {{<cbtext id="Fury of Elune">}}Use {{< spell 211545 "Fury of Elune" >}} if you are in {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}}, will proc {{< spell 393961 "Pulsar" >}} with your next GCD or are at less than 280 {{< spell 393961 "Pulsar" >}} stacks.{{</cbtext>}}
- {{<cbtext id="Cancelaura">}}Use your macro to cancel {{< spell 202345 "Starlord" >}} as referenced [here](#cancel) if conditions apply. Note that this is back to being an insignificant gain.{{</cbtext>}}
- {{<cbtext id="Starweaver">}}Use {{< spell 191034 "Starfall" >}} if you have a {{< spell 393942 "Starweaver's Warp" >}} proc.{{</cbtext>}}
- Use {{< spell 78674 "Starsurge" >}} if {{< spell 202345 "Starlord" >}} has less than 3 stacks or if you have more than 2 stacks of {{< spell 394048 "BoAT" >}}.
- {{<cbtext id="New Moon">}}Use {{< spell 274281 "New-" >}},{{< spell 274282 "Half-" >}} and {{< spell 274283 "Full Moon" >}} if all of the following conditions are met:{{</cbtext>}}
  {{<cbtext id="New Moon">}}
  - You will not overcap on AP.
  - You can finish the cast before your current eclipse ends.
  - You are in {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}} or you're about to cap on charges and {{< spell 393961 "Pulsar" >}} has 520 or fewer stacks and the cooldown of {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}} is longer than 10 seconds.
    {{</cbtext>}}
- {{<cbtext id="Cancelaura">}}Use your macro to cancel {{< spell 202345 "Starlord" >}} as referenced [here](#cancel) if conditions apply. Note that this is back to being an insignificant gain.{{</cbtext>}}
- Use {{< spell 78674 "Starsurge" >}} if one of the following conditions is met:
  - You would overcap AP with the next cast.
  - {{<cbtext id="Starweaver">}}You have a {{< spell 393944 "Starweaver's Weft" >}} proc.{{</cbtext>}}
  - Solar or Lunar Eclipse will end in the next 4 seconds and you have more than 70 AP.
- {{<cbtext id="Wild Mushroom">}}Use {{< spell 88747 "Wild Mushroom" >}} as a movement GCD.{{</cbtext>}}
- Use {{< spell 190984 "Wrath" >}} regardless of which Eclipse you are in.

<br><div id="aoe">

## [AoE priority](#aoe)

</div>

**Select which talents you have talented to filter the priority list:**

{{< checkbox id="Warrior of Elune-AoE" spell=202425 radio="Force of Nature" >}}Warrior of Elune{{< /checkbox >}}
{{< checkbox id="Force of Nature-AoE" spell=205636 radio="Force of Nature" >}}Force of Nature{{< /checkbox >}}<br>
{{< checkbox id="Stellar Flare-AoE" spell=202347 >}}Stellar Flare{{< /checkbox >}}<br>
{{< checkbox id="Astral Communion-AoE" spell=400636 >}}Astral Communion{{< /checkbox >}}<br>
{{< checkbox id="New Moon-AoE" spell=274281 checked=true radio="Fury Of Elune" >}}New Moon{{< /checkbox >}}
{{< checkbox id="Fury of Elune-AoE" spell=202770 radio="Fury Of Elune" >}}Fury of Elune{{< /checkbox >}}<br>
{{< checkbox id="Cancelaura-AoE" spell=202345 >}}Cancelaura Starlord{{< /checkbox >}}<br>
{{< checkbox id="Wild Mushroom-AoE" spell=88747 >}}Wild Mushroom{{< /checkbox >}}<br>
{{< checkbox id="Starweaver-AoE" spell=393940 >}}Starweaver{{< /checkbox >}}<br>
{{< checkbox id="Convoke the Spirits-AoE" spell=391528 >}}Convoke the Spirits{{< /checkbox >}}<br>

<br>**Special Note: when NOT using the talents {{< spell 327541 "Aetherial Kindling" >}} or {{< spell 393940 "Starweaver" >}}, use Starsurge as a spender on 2 targets still.**
<br>**AoE priority list(2+ targets):**

- Use {{< spell 93402 "Sunfire" >}} if the target will live for at least 5.5 seconds. Subtract 0.5 seconds for each additional target beyond the first. Wait until all targets are gathered.
- Use {{< spell 8921 "Moonfire" >}} if the targets will live for 6 or more seconds and you will not overcap on AP.
- {{<cbtext id="Stellar Flare-AoE">}} Use {{< spell 202347 "Stellar Flare" >}} if all of the following conditions is met:{{</cbtext>}}
  {{<cbtext id="Stellar Flare-AoE">}}
  - The target will live for at least 8s+1s per target that {{< spell 194153 "Starfire" >}} can hit
  - You will not overcap on AP.
  - You're about to use {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}}
  - Your fighting less than 11 targets -1 per talent in Umbral Intensity or Astral Smolder.
    {{</cbtext>}}
- {{<cbtext id="Cancelaura-AoE">}}Use your macro to cancel {{< spell 202345 "Starlord" >}} as referenced [here](#cancel) if conditions apply. Note that this is back to being an insignificant gain.{{</cbtext>}}
- Use {{< spell 191034 "Starfall" >}} if you would overcap Astral Power with your next cast.
- Use {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}} if you are not in {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}} already.
- {{<cbtext id="Warrior of Elune-AoE">}}Use {{< spell 202425 "Warrior of Elune" >}} if available.{{</cbtext>}}
- Use {{< spell 194153 "Starfire" >}} to enter Solar Eclipse if you are fighting 2 targets.
- Use {{< spell 190984 "Wrath" >}} to enter Lunar Eclipse if you are fighting 3+ targets.
- {{<cbtext id="Wild Mushroom-AoE">}}Use {{< spell 88747 "Wild Mushroom" >}} if you will not overcap on AP and {{< spell 393956 "Waning Twilight" >}} is not up on your targets.{{</cbtext>}}
- {{<cbtext id="Fury of Elune-AoE">}}Use {{< spell 211545 "Fury of Elune" >}} if you are in {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}}, will proc {{< spell 393961 "Pulsar" >}} with your next GCD or are at less than 280 {{< spell 393961 "Pulsar" >}} stacks.{{</cbtext>}}
- {{<cbtext id="Cancelaura-AoE">}}Use your macro to cancel {{< spell 202345 "Starlord" >}} as referenced [here](#cancel) if conditions apply. Note that this is back to being an insignificant gain.{{</cbtext>}}
- Use {{< spell 191034 "Starfall" >}} if one of the following conditions is met:
  {{<cbtext id="Starweaver-AoE">}}
  - You have a {{< spell 393942 "Starweaver's Warp" >}} proc.
    {{</cbtext>}}
  - {{< spell 202345 "Starlord" >}} is below 3 stacks.
- {{<cbtext id="New Moon-AoE">}}Use {{< spell 274283 "Full Moon" >}} if all of the following conditions are met:{{</cbtext>}}
  {{<cbtext id="New Moon-AoE">}}
  - You will not overcap on AP.
  - You can finish the cast before your current eclipse ends.
  - You are in CA/Inc or you're about to cap on charges and Pulsar has 520 or fewer stacks and the cooldown of {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}} is longer than 10 seconds.
    {{</cbtext>}}
- {{<cbtext id="Starweaver-AoE">}}Use {{< spell 78674 "Starsurge" >}} if you have a {{< spell 393944 "Starweaver's Weft" >}} proc and you are fighting less than 3 targets.{{</cbtext>}}
- {{<cbtext id="Stellar Flare-AoE">}} Use {{< spell 202347 "Stellar Flare" >}} if all of the following conditions are met:{{</cbtext>}}
  {{<cbtext id="Stellar Flare-AoE">}}
  - The target will live for at least 8s+1s per target that {{< spell 194153 "Starfire" >}} can hit
  - You will not overcap on AP.
  - Your fighting less than 11 targets -1 per talent in Umbral Intensity or Astral Smolder.
    {{</cbtext>}}
- {{<cbtext id="Astral Communion-AoE">}}Use {{< spell 400636 "Astral Communion" >}} if you will not overcap on AP.{{</cbtext>}}
- {{<cbtext id="Convoke the Spirits-AoE">}}Use {{< spell 391528 "Convoke the Spirits" >}} if you are fighting less than 3 targets, otherwise only use {{< spell 391528 "Convoke" >}} for movement in AoE.{{</cbtext>}}
- {{<cbtext id="New Moon-AoE">}}Use {{< spell 274281 "New Moon" >}} if you will not overcap on AP.{{</cbtext>}}
- {{<cbtext id="New Moon-AoE">}}Use {{< spell 274282 "Half Moon" >}} if you will not overcap on AP and you can finish the cast before your current eclipse ends.{{</cbtext>}}
- {{<cbtext id="Force of Nature-AoE">}}Use {{< spell 205636 "Force of Nature" >}} if you will not overcap on AP.{{</cbtext>}}
- {{<cbtext id="Starweaver-AoE">}}Use {{< spell 78674 "Starsurge" >}} if you have a {{< spell 393944 "Starweaver's Weft" >}} proc and {{< spell 194153 "Starfire" >}} will hit less than 17 targets.{{</cbtext>}}
- {{< spell 194153 "Starfire" >}} if any of the below conditions are true:
  - You are in Lunar Eclipse.
  - You are in {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} and {{< spell 194153 "Starfire" >}} will hit 4 or more targets.
- Use {{< spell 194153 "Wrath" >}} if any of the below conditions are true:
  - You are in Solar Eclipse.
  - You are in {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} and {{< spell 194153 "Starfire" >}} will hit 3 or fewer targets.

<br><div id="fillers">

## [Eclipses and Fillers](#fillers)

 </div>

- On 1-2 targets, enter Solar Eclipse and cast {{< spell 190984 "Wrath" >}}.
- On 3 or more targets, enter Lunar Eclipse and cast {{< spell 194153 "Starfire" >}}.
- On 1-3 targets inside {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} cast {{< spell 190984 "Wrath" >}}
- On 4 or more targets inside {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} cast {{< spell 194153 "Starfire" >}}.

<br><div id="woe">

## [How to Use Warrior of Elune](#woe)

 </div>
 
{{< spell 202425 "Warrior of Elune" >}} is an off-gcd ability, making your next 3 {{< spell 194153 "Starfires" >}} instant for 25 seconds. The ability has a 45s cooldown that starts once you've pressed it.

{{< spell 202425 "Warrior of Elune" >}} can be used 7 seconds before an eclipse ends, this way you will have just enough time to spend your third charge before the buff runs out and the CD will start earlier, which can net you more uses throughout the fight.

Use the charges to enter Solar Eclipse or as a movement GCD in {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}} /{{< spell 48518 "Lunar Eclipse" >}}. Using a Warrior of Elune Starfire in single target during {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}} is NOT a damage increase if you do not need to move.

If Warrior of Elune is falling off during {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}} and you still have a charge to spend, you can {{< spell 194153 "Starfire" >}} at 2+ targets.

Warrior of Elune can also be used during {{< spell 194223 "CA" >}} /{{< spell 102560 "Inc" >}} /{{< spell 48518 "Lunar Eclipse" >}} when there are adds up, this will net you a lot of Astral Power which can be useful to target down a specific add or to provide more boss damage by utilizing the AP on Starsurges.

<br><div id="owlkin-frenzy">

## [How to use Owlkin Frenzy procs](#owlkin-frenzy)

</div>

Use {{< spell 157228 "Owlkin Frenzy" >}} procs to enter Solar Eclipse, inside Lunar Eclipse or inside {{< spell 194223 "CA" >}}/{{< spell 102560 "Inc" >}} if Starfire will hit 3 or more targets.
<br>Keep in mind that {{< spell 202425 "Warrior of Elune" >}} charges are consumed before {{< spell 157228 "Owlkin Frenzy" >}} procs.

<br><div id="talents">

# [3. Talents:](#talents)

</div>
<div style="text-align: center;">
<div id="raid">
	
## [Raid](#raid)

</div>

### Single Target

<iframe src="https://www.raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJJigkQQSikIFolIJSSJRTcgQol0SSERDgCAE?bgcolor=000000&width=700&level=70&mini=&hideHeader=true&locale=en_US" width="710" height="450" frameborder="0" style="border: none; border-radius: 15px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);"></iframe>

### Single Target with Short Burst

<iframe src="https://www.raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJJigkQQSikIFolIJSSJRTcgQkWSLJRQDgCAE?bgcolor=000000&width=700&level=70&mini=&hideHeader=true&locale=en_US" width="710" height="450" frameborder="0" style="border: none; border-radius: 15px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);"></iframe>

### Single Target with spread add spawn

<iframe src="https://www.raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJJigkQQSikIFolIJJJlkQcgQol0iER0AoAAB?bgcolor=000000&width=700&level=70&mini=&hideHeader=true&locale=en_US" width="710" height="450" frameborder="0" style="border: none; border-radius: 15px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);"></iframe>

### Single Target with damage amp

<iframe src="https://www.raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJJigkQQSikIFolIJSSLRTyBChSSLJERDgCAE?bgcolor=000000&width=700&level=70&mini=&hideHeader=true&locale=en_US" width="710" height="450" frameborder="0" style="border: none; border-radius: 15px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);"></iframe>

### Two Target Starweaver

<iframe src="https://www.raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJJigkQQSIJHIFolIRSSJJkkQol0iQSUAoBAB?bgcolor=000000&width=700&level=70&mini=&hideHeader=true&locale=en_US" width="710" height="450" frameborder="0" style="border: none; border-radius: 15px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);"></iframe>

### Council of Dreams

<iframe src="https://www.raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJJigkQQSikIFolIRSUSCJJEaJtkEJRDgGAE?bgcolor=000000&width=700&level=70&mini=&hideHeader=true&locale=en_US" width="710" height="450" frameborder="0" style="border: none; border-radius: 15px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);"></iframe>

### The Primal Council

<iframe src="https://www.raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJJigkQQSIJHIFolIRSSJJEJHgoJlIRCNAKAQA?bgcolor=000000&width=700&level=70&mini=&hideHeader=true&locale=en_US" width="710" height="450" frameborder="0" style="border: none; border-radius: 15px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);"></iframe>

</div>

<br>
<div style="text-align: center;">
<div id="mythic+">

## [Mythic+](#mythic+)

The following are dungeon talent builds that will always serve you well but mind that there can be some variations based on your group comp or affixes. {{< spell 274281 "New Moon" >}} and {{< spell 211545 "Fury of Elune" >}} can be used interchangeably.

</div>

### Balanced build

<iframe src="https://www.raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJJigkQQSikcgUgWiDkkkUSCJJgm0iEJ0AoAAB?bgcolor=000000&width=700&level=70&mini=&hideHeader=true&locale=en_US" width="710" height="450" frameborder="0" style="border: none; border-radius: 15px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);"></iframe>

### Weaver build

<iframe src="https://www.raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJJigkQQSikcgUgWiDkkkUSCJJgm0iEJUAoAAB?bgcolor=000000&width=700&level=70&mini=&hideHeader=true&locale=en_US" width="710" height="450" frameborder="0" style="border: none; border-radius: 15px; box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);"></iframe>
</div>

{{< spell 274281 "New Moon" >}} provides more single target damage and is easy to pair with pulsar.
<br>{{< spell 211545 "FoE" >}} does slightly more AoE but is more difficult to align with {{< spell 393961 "Pulsar" >}}, making it annoying to play.

The below picture showcases which talents are "mandatory" and which talents you can opt-in to:

{{< figure src="/balance/talent-tree-mythic+.png" >}}

<b>Secondary builds:</b>

[Class tree with Hibernate for Incorporeal](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJJJCSCBJJSiUgWiDkkkUSCJHIEaSJCJRDgCAE?bgcolor=000000)
<br>[If you really need both Hibernate and Remove Corruption](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCQkkkISSAkESiUgWiDkkkUSCJHIEaSJCJRDgCAE?bgcolor=000000)

- {{<spell 377842 "Ursine Vigor">}}, {{<spell 377847 "Well-Honed Instincts">}} and {{<spell 288826 "Improved Stampeding Roar">}} are the major competing talents. {{<spell 377842 "Ursine Vigor">}} should be taken if you need it to survive certain abilities. {{<spell 377847 "Well-Honed Instincts">}} is always on 1 point but a 2nd can be taken if you rarely/never use Bear Form. {{<spell 288826 "Improved Stampeding Roar">}} is extremely useful in indoor dungeons and in spiteful weeks.
- {{<spell 2782 "Remove Corruption">}} should be taken in Afflicted weeks.
- {{<spell 33786 "Cyclone">}} has basically no use other than stopping Bursting and can be replaced with anything else(which also won't have any use).
- {{<spell 2637 "Hibernate">}} can be used for the Incorporeal affix.
- For lower keys, you can put 1 point into {{<spell 131768 "Feline Swiftness">}} like [this](https://raidbots.com/simbot/render/talents/BYGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgCAJiIIJSQSikIFHgWiDEJJlkQSChmUiEJRDgCAE?bgcolor=000000). This skips {{<spell 377842 "Ursine Vigor">}} and {{<spell 132469 "Typhoon">}}. You can also drop any of the other bottom talents you don't need to get a 2nd point in {{<spell 131768 "Feline Swiftness">}} to get around even quicker for farming keys.
- All other talents in the druid tree are more or less set.

<br><div id="consumables">

# [4.Consumables:](#consumables)

</div>

<div id="potions">

## [Potions](#Potions)

</div>

https://www.wowhead.com/item=191383/elemental-potion-of-ultimate-power
<br> Use this for every situation. Potion of Elemental Power is only minorly worse if you want to save gold.

<br><div id="food">

## [Food](#food)

</div>

https://www.wowhead.com/item=197794/grand-banquet-of-the-kaluak: Intellect buff
<br>https://www.wowhead.com/item=204072/deviously-deviled-eggs: Same buff as Banquet but with a cheaper individual price.
<br>https://www.wowhead.com/item=197784/sizzling-seafood-medley: Provides Haste + Mastery which can be more dps than the Intellect food.
<br>https://www.wowhead.com/item=197786/thousandbone-tongueslicer: Provides Crit + Mastery which can be more dps than the Intellect food.

<br>The secondary food can be better as you acquire more gear, they provide more total stats than the main stat one. Sim your character to see what is best for you.

<br><div id="phials">

## [Phials](#Phials)

</div>

**ST & AoE**

Damage wise, with 100% uptime on all of the Phials and not counting in the downsides their hierarchy is as follows on ST:

- https://www.wowhead.com/item=191329/iced-phial-of-corrupting-rage: Default phial unless the fight has too high damage intake or you are at risk of dying. Do not use this in progress fights unless you really need the damage.
- https://www.wowhead.com/item=191341/phial-of-tepid-versatility: Has the same value as Corrupting Rage at 60% uptime. Can be worth to play if the damage intake is high.
- https://www.wowhead.com/item=191359/phial-of-elemental-chaos: : Generally similar dps throughput as Tepid Versatility, but less defensive benefits.

<br><div id="runes">

## [Runes](#Runes)

</div>

Our main rune is https://www.wowhead.com/item=204973/hissing-rune: Mastery rune<br>
In some cases either https://www.wowhead.com/item=194820/howling-rune or https://www.wowhead.com/item=194823/buzzing-rune might sim slightly better.

<br><div id="gearing">

# [5.Gearing:](#gearing)

</div>

<div id="stats">
 
## [Stat Priority:](#stats)

</div>

Sim yourself using [Raidbots Top Gear](https://www.raidbots.com/simbot/topgear). **Do not follow any stat priorities.**

<br><div id="enchants">

## [Enchants](#enchants)

</div>

Weapon - [Sophic Devotion](https://www.wowhead.com/item=200054/enchant-weapon-sophic-devotion?crafting-quality=6)/[Wafting Devotion](https://www.wowhead.com/beta/item=200058/enchant-weapon-wafting-devotion)
<br>Sim between these two options to determine which one is best for your character.
<br>Chest - [Waking Stats](https://www.wowhead.com/item=200030/enchant-chest-waking-stats?crafting-quality=6) Intellect
<br>Cloak - [Graceful Avoidance](https://www.wowhead.com/item=200031/enchant-cloak-graceful-avoidance) Avoidance + Reduced fall damage
<br>Legs - [Lambent Armor Kit](https://www.wowhead.com/item=204702/lambent-armor-kit?crafting-quality=6)/[Frozen Spellthread](https://www.wowhead.com/item=194013/frozen-spellthread?crafting-quality=6)
<br>Sim between these two options to determine which one is best for your character.
<br>Wrist - [Devotion of Avoidance](https://www.wowhead.com/item=200021/enchant-bracer-devotion-of-avoidance?crafting-quality=6) Avoidance
<br>Boots - [Watchers Loam](https://www.wowhead.com/item=200020/enchant-boots-watchers-loam) Stamina
<br>Ring - [Devotion of Mastery](https://www.wowhead.com/item=200039/enchant-ring-devotion-of-mastery?crafting-quality=6) You should always sim your own character to determine what enchant to use in this slot.

<br><div id="embellishments">

## [Embellishments](#embellishments)

</div>

### For embellishments there are a couple of options this season:

- https://www.wowhead.com/item=193452/toxic-thorn-footwraps with https://www.wowhead.com/item=193555/toxified-armor-patch.
  - Provides great single target damage and has an early spike since only the boots needs to be crafted at 525 for the effect to scale to that itemlevel.
  - Locks you in to boots as your crafted items with predfefined stats.
- https://www.wowhead.com/item=204710/shadowflame-tempered-armor-patch
  - Good single target damage.
  - Deals a small amount of self-damage.
  - Can be added to any crafted leather slot.
- https://www.wowhead.com/item=208189/verdant-conduit
  - Performs slightly worse in single target.
  - Performs well in aoe.
  - Can be added to any crafted leather slot.
- https://www.wowhead.com/item=193001/elemental-lariat
  - Requires a lot of gems.
  - Performs well in AoE and Single Target.
  - Locks you in to a crafted neck but you can choose the stats on it freely.
- https://www.wowhead.com/item=193946/blue-silken-lining
  - Performs the best of all embellishments both in AoE and Single Target.
  - Requires you to be above 90% health for it to be active.
  - Can be applied on any crafted item.

### Which embellishments should you choose?

This is entirely up to you, below are some guidelines to make your choice more informed.

- https://www.wowhead.com/item=193946/blue-silken-lining provides the most amount of DPS given that you have the uptime for it(usually more than 40%). Can be swapped at any point by recrafting and adding/removing the embellishment.
- https://www.wowhead.com/item=193452/toxic-thorn-footwraps is a single target focused embellishment with an early power spike. Locks yourself with crafted boots with predfefined stats.
- https://www.wowhead.com/item=204710/shadowflame-tempered-armor-patch and https://www.wowhead.com/item=208189/verdant-conduit are good for the flexibility, you can change these around at any point depending on what fits the content you're doing.
- https://www.wowhead.com/item=193001/elemental-lariat performs well in both Single Target and AoE, but requires a lot of gems and locks yourself with a crafted neck as the embellishment can't be removed from it.

### What slot should i craft in?

This will depend on your current gear situtation, below are some guidelines:

- Bracers are often used as they have the lowest stat budget and can have a socket. This will be good later on when your other pieces can be upgraded to 525 itemlevel.
- Cloaks are another slot with the lowest stat budget, but they can't be socketed.
- Belts have a higher stat budget, but they can have a socket.
- A Ring, if you've chosen to craft https://www.wowhead.com/item=193946/blue-silken-lining, is another good slot. It also comes with a socket.

<br><div id="trinkets">

## [Trinkets](#trinkets)

</div>

Please use Top Gear or Droptimizer on [Raidbots](https://raidbots.com) in order to decide what trinkets to use/farm, but the following list should give you a good idea of some of the trinkets you will want to look out for. The list is in roughly power-level order assuming the highest item level versions of the trinkets.

[Umbreiskul's Fractured Heart](https://www.wowhead.com/item=193639/umbrelskuls-fractured-heart) is simming better than a lot of other options at lower ilvl. It may be worth getting this trinket early on in the season, but it loses value on higher ilvls. 

- [Neltharion's Call to Suffering](https://www.wowhead.com/ptr-2/item=204211/neltharions-call-to-suffering)
- [Irideus Fragment](https://www.wowhead.com/ptr-2/item=193743/irideus-fragment)
- [Whispering Incarnate Icon](https://www.wowhead.com/item=194301/whispering-incarnate-icon)
- [Spoils of Neltharus](https://www.wowhead.com/item=193773/spoils-of-neltharus)
- [Tome of Unstable Power](https://www.wowhead.com/item=193628/tome-of-unstable-power)
- [Mirror of Fractured Tomorrows](https://www.wowhead.com/ptr-2/item=207581/mirror-of-fractured-tomorrows?bonus=4795&class=11&ilvl=525&spec=102)
- [Belor'Relos, the Suncaller](https://www.wowhead.com/ptr-2/item=207172/belorrelos-the-suncaller)
- [Ominous Chromatic Essence](https://www.wowhead.com/ptr-2/item=203729/ominous-chromatic-essence)

<br><div id="misc">

# [6. Miscellaneous:](#misc)

</div>

<div id="faq">

## [FAQ](#faq)

</div>

### I've read the priority list and I think my rotation looks correct but I'm still doing very low damage. What could be the reason?

Log one of your fights and check it with [warcraftlogs](https://articles.warcraftlogs.com/help/how-to-navigate-through-logs) and [wowanalyzer](https://wowanalyzer.com/). The main thing to check is if you're always casting: the timeline should have no downtime and, as close to zero as possible, cancelled casts. Another common issue is incorrectly planning your movement and wasting casts on dots: you should always have enough AP to cover some distance just by using spenders.

### How do I sim for AoE?

Balance Druid's gear mostly doesn't change from ST to AoE so simming "5m 1t patchwerk" is usually fine even for AoE situations. Other sims like "5t 40s" are unrealistic scenarios that will provide skewed and wrong sims in most cases and hence shouldn't be used. If you want to do an accurate M+ sim consider using the [MDT Sim WeakAura](https://wago.io/Yya4XBbl-) and remember that ST fights are still a big part of Mythic+.

### I'm doing really low damage in Mythic+, what am I doing wrong?

If you double-checked your rotation and still feel like you're underperforming you could just be playing low keys, together with classes that have very bursty damage profiles. When playing a Balance Druid, mobs need to live long enough for you to actually start doing damage, which is something that doesn't really happen in keys lower than 20+ and especially on Tyrannical. Consider focusing a bit more on ST or trying another spec, but take into account the fact that DPS isn't everything in a key.

### I've seen a lot of people running build X instead of Y in Mythic+, is X better?

This season there are many viable builds and in the end, once the necessary talents are taken, it just comes down to personal preference. One notable example is the choice between {{< spell 202770 "Fury Of Elune" >}} and {{< spell 274281 "New Moon" >}}: the former performs slightly better in AoE scenarios, while the latter is slightly better in ST, so people will usually pick the one they're most comfortable with. Feel free to use any of the builds mentioned in the Talents section.

### How do I track our tierset?

You can use the [following WeakAura](https://wago.io/BoomkinTierSet)

### How can I proc {{< spell 393956 "Waning Twilight" >}} without mushrooms or flare?

With {{< spell 394058 "Astral Smolder" >}}

### Why are some top players running different embellishments from the ones mentioned in the Compendium

The DPS gain provided by the embellishments can vary significantly because of many external factors such as gear, type of content and group composition. Some of the top players might also happen to use niche embellishments for the same reasons. If you don't have any specific requirements then your best option is to just sim your character and choose the embellishments that provide the highest DPS upgrade.

<div id="snapshot">

## [Do our dots snapshot?](#snapshot)

</div>

No, all of our periodic damage (like {{< spell 8921 "Moonfire" >}}, {{< spell 93402 "Sunfire" >}}, {{< spell 202347 "Stellar Flare" >}}) do NOT snapshot, everything is dynamic. That means any dots gain/lose the damage bonus upon entering/leaving the Eclipse that buffs them and whenever any other stat/damage increases are applied/expire.

<div id="astral-damage">
 
## [What is Astral damage?](#astral-damage)

</div>

Astral damage is both Arcane and Nature damage. Effects that buff Nature spells also applies to Astral spells, and effects that buff Arcane spells likewise also applies to Astral spells. For example, Solar Eclipse multiplies the damage of all Nature & Astral spells by 1.15x, and Lunar Eclipse multiplies the damage of all Arcane & Astral spells by 1.15x. If you have both eclipses, Astral spells get 1.15 \* 1.15 = 1.3225x multiplier, while Nature & Arcane spells get 1.15x.

Mind that class buffs only affect class spells so if a trinket does nature or arcane damage they are not affected by our buffs to these spell schools.

<br><div id="macros">

## [Macros](#macros)

</div>

**Orbital Strike macro:**

```
#showtooltip
/cast [@cursor] Celestial Alignment
```

</div>

**Trinket macro:**

If you are using an on-use trinket that should go along with your cooldowns, use the following macro (/13 for top trinket slot, and /14 for bottom trinket slot)

```
#showtooltip
/use 13
/use 14
/cast [@cursor] Celestial Alignment
```

<br><div id="wa">

## [Useful WeakAura(s)](#wa)

</div>

### **Balance WeakAura Packs**

The following links lead to various balance druid WeakAura packs. These contain everything that's recommended to track to play at a high level. None of these are particular better or more useful than others, and which one you should use is up to your personal preference.

- [Shrom's Ultimate AP Bar](https://wago.io/GzpP7i8ic)
- [Genesis DF Balance Druid](https://wago.io/1HX3XwarK)
- [Oi Balance pack](https://wago.io/OiBalance)

### **Casts until you can cast Starfire**

[Starfire Alerter](https://wago.io/rrtAyRQjF)
See the description of the WA for more details. This is not a required WA but will make it easier to not get into situations where you are wasting a Starfire cast inside Solar Eclipse.

<br><div id="cancel">

## [Cancelaura Macros](#cancel)

</div>

### **Cancelling Pulsar**

**As of 10.1.5 and forward this no longer represents a relevant gain with the change to Radiant Moonlight increasing the cooldown of Fury of Elune by 5 seconds.**

### **Cancelling Starlord**

**With baseline changes and new set in 10.2, cancelling your Starlord aura is back to being insignificant [(~0.2%)](#sims).**

If you want to engage in this entirely optional method without incurring a dps loss, you should aim to cancel Starlord at any point in an Eclipse window where the buff is currently at less than two seconds, and you are about to use {{< spell 78674 "Starsurge" >}} to prevent overcapping.

```
#showtooltip
/cancelaura Starlord
```

<br><div id="sims">

# [7. Sims:](#sims)

</div>
<div style="display:none">
[Embells 1T](https://www.dreamgrove.gg/balance/sims/embells_1T_10.2.html)
<br>[Embells 6T](https://www.dreamgrove.gg/balance/sims/embells_6T_10.2.html)

[Phials 1T](https://www.dreamgrove.gg/balance/sims/phials_1T_10.2.html)
<br>[Phials 6T](https://www.dreamgrove.gg/balance/sims/phials_6T_10.2.html)

[Runes 1T](https://www.dreamgrove.gg/balance/sims/runes_1T_10.2.html)
<br>[Runes 6T](https://www.dreamgrove.gg/balance/sims/runes_6T_10.2.html)

[Racials 1T](https://www.dreamgrove.gg/balance/sims/races_1T_10.2.html)
<br>[Racials 6T](https://www.dreamgrove.gg/balance/sims/races_6T_10.2.html)

[Tierset 1T](https://www.dreamgrove.gg/balance/sims/tier_1T_10.2.html)
<br>[Tierset 6T](https://www.dreamgrove.gg/balance/sims/tier_6T_10.2.html)

[Prestacking Pulsar](https://www.dreamgrove.gg/balance/sims/prestack_pulsar_1T_10.2.html)
<br>[Proc Pulsar before Incarn on pull](https://www.dreamgrove.gg/balance/sims/proc_pulsar_1T_10.2.html)

[Cancelling Starlord 1T](https://www.dreamgrove.gg/balance/sims/cancelaura_starlord_1T_10.2.html)
<br>[Cancelling Starlord 6T](https://www.dreamgrove.gg/balance/sims/cancelaura_starlord_6T_10.2.html)

[Item strings for simming](https://www.dreamgrove.gg/balance/sims/items.txt)
<br>[Sample T31 Profile](https://www.dreamgrove.gg/balance/sims/T31_profile.txt)

</div>

[Current APL](https://www.dreamgrove.gg/sims/owl/balance.txt)

<script>const whTooltips = {colorLinks: true, iconizeLinks: true, renameLinks: true, iconSize: 'small'};</script>
<script src="https://wow.zamimg.com/js/tooltips.js"></script>
