---
title: "Guardian Druid Azerite Traits: Analysis"
date: '2018-07-26'
authors: ['Faide']
description: "Azerite powers are a new system in Battle for Azeroth, similar to the Netherlight Crucible from Legion. Here is a detailed analysis of the azerite traits available to Guardians in Battle for Azeroth."
showtoc: true
patch: 8.0.1
---

Azerite powers are a new system in Battle for Azeroth, similar to the Netherlight Crucible from Legion. They provide various bonuses and augment your skills in ways similar to tier set bonuses or legendaries, but at a slightly lower power level.

Let's take a look at the traits available to Guardians. First, I'll cover the set of traits specific to Guardian (or traits from other Druid specs that Guardian can select) on the outer ring (Tier 3), and then some of the more general tanking-related traits that are available on the middle and inner rings (Tier 2 and Tier 1, respectively). 

I'll only be focusing on the value of single traits for now (that is, going from having none of a trait to having one of that trait), since much of the value comes from the effects that don't scale with the number of instances of that trait that are present. As a result, stacking more than one of a particular trait will have reduced value and almost always be worse than taking the first instance of another trait. As a general rule: values that are denoted by the variables X or Y scale with item level and trait stacking.

Because many traits scale with item level, I will be assuming an item level of 370 (Heroic Uldir) for all trait values.

# Druid Traits

The following traits are available only to Druids. Most of these are Guardian specific, but some are shared between Feral and Balance as well. You are guaranteed at least one Guardian specific trait and one generic trait on every azerite piece, although it is possible to have more if one of the shared traits is present for another spec.

## Craggy Bark

- {{< spell 276157 "Craggy Bark" >}} - {{< spell 22812 "Barkskin" >}} reduces melee attacks against you by X damage.

At 370, the value of the reduction is 538 damage per melee. If we assume a standardized enemy swing timer of 2 seconds per melee, with a {{< spell 22812 "Barkskin" >}} duration of 12 seconds you will reduce 6 melees per use, per enemy. That's a total reduction of 3230 (give or take a few points due to rounding) damage per Barkskin, per target. If you use Barkskin on cooldown, you will average around 36 damage reduced per second over the course of a fight, but this is atypical since you will often want to save Barkskin for specific mechanics which may not necessarily align with the cooldown. Here is a graph of how delaying Barkskin relates to the average damage reduction of Craggy Bark:

![Craggy Bark DRPS](/guardian/images/craggy-bark-drps.png)

Frankly, this trait is pretty terrible. Not only is it only active during {{< spell 22812 "Barkskin" >}} when you already have a 10% damage reduction going, but the amount that it reduces is not especially meaningful *and* it only works on melee attacks. Unless this trait is buffed, I'd recommend avoiding it where possible. 

## Gory Regeneration

- {{< spell 279536 "Gory Regeneration" >}} - {{< spell 33917 "Mangle" >}} increases the duration of an active {{< spell 22842 "Frenzied Regeneration" >}} by 1 second. Additionally, Frenzied Regeneration heals for X more per second.

At 370 the extra heal is valued at 1573 extra healing per second, for a total of 6292 additional healing per cast. This extra healing is present regardless of whether the {{< spell 22842 "Frenzied Regeneration" >}} is empowered by {{< spell 33917 "Mangle" >}} or not. Additionally, the extension occurs *per target hit*, meaning that if you have {{< spell 102558 "Incarnation: Guardian of Ursoc" >}} and you can hit 3 targets with Mangle, you will get 3 seconds of extension per cast. That in addition to the cooldown of Mangle being reduced means you can sustain an FR for a very long time while Incarnation is active.

![Gory Regeneration healing](/guardian/images/gory-regeneration-healing.png)

The discontinuity in the 1 target plot is the point at which you can sustain a {{< spell 22842 "Frenzied Regeneration" >}} beyond the duration of {{< spell 102558 "Incarnation: Guardian of Ursoc" >}}, after which point the duration (and by extension, the healing) stops increasing at such a dramatic rate.

This trait basically lives or dies by whether or not you're talented into {{< spell 102558 "Incarnation: Guardian of Ursoc" >}}. If you aren't, Mangle's cooldown is so long that you will get at most 1 second of extension (you can get 2 in theory if you have around 88% haste, which may be possible with lust/berserking and a lot of haste rating). If you are, this trait becomes an incredibly powerful boost to your self-healing capabilities. 

That being said, while this trait looks very good on paper (under certain circumstances), I'm not convinced it has the same value in practice. For one, the HPS of {{< spell 22842 "Frenzied Regeneration" >}} is still quite low, at 6% HP per tick baseline (with the bonus healing from the trait it is probably closer to 7%). The extension component of Gory Regeneration does not improve the HPS output at all, it merely prolongs its duration. This would be fine in isolation, but in reality you don't have infinite health and you will have external healing. Extending FR increases the chance that it will cause overhealing, either for you or for your healers, which eliminates the benefit of receiving more healing altogether. 

## Guardian's Wrath

- {{< spell 279541 "Guardian's Wrath" >}} - {{< spell 6807 "Maul" >}} deals X additional damage and reduces the cost of your next {{< spell 192081 "Ironfur" >}} by 15 Rage, stacking up to 3 times.

At 370, Maul deals 1048 additional damage. 

![Guardian's Wrath bonus damage](/guardian/images/guardians-wrath-damage.png)

In order to evaluate this trait, let's consider its offensive value. Assuming you are casting {{< spell 192081 "Ironfur" >}} at least enough to consume every stack that you generate, you can consider {{< spell 6807 "Maul" >}} to effectively cost 30 Rage per cast. The Rage you would have spent on Ironfur is now refunded to you, allowing you to cast more Mauls over the course of a fight. This is effectively a 33.3% gain in Mauls which, in addition to the additional damage, significantly improves your DPS output when you are using a combination of Ironfur and Maul. Of course, if you never cast Ironfur (or if you waste stacks by not casting it enough), you will get less value out of the trait.

Defensively, this trait is not very strong. Obviously while not tanking, you can bank a free {{< spell 192081 "Ironfur" >}} for instant mitigation when you taunt back, which allows you to spend more Rage on {{< spell 6807 "Maul" >}} during times when you aren't actively tanking. But from a pure survivability perspective, if you were concerned only about your defensive capacity you would spend Rage exclusively on Ironfur and this trait would provide no value. It's the hybrid nature of the trait that gives it its value.

This is a great trait all around. Not only is it a significant boost to {{< spell 6807 "Maul" >}}'s damage, but it affords you some flexibility in your Rage management. Particularly in situations with tank swaps, this allows you to safely spend Rage on Maul and still be able to have an {{< spell 192081 "Ironfur" >}} up for when you taunt back. Offensively, this is one of the strongest Guardian specific traits out there.

## Layered Mane

- {{< spell 279552 "Layered Mane" >}} - {{< spell 192081 "Ironfur" >}} increases your Agility by X, and casting Ironfur has a chance to grant 2 applications.

At 370 you gain 122 extra agility, per {{< spell 192081 "Ironfur" >}} stack. This means that the more Ironfur you have, the stronger each individual stack becomes (since Ironfur dynamically benefits from your Agility).

![Layered Mane bonus Agility and Armor](/guardian/images/layered-mane-stats.png)

This looks to be the strongest Guardian-specific defensive trait available. It effectively increases your average {{< spell 192081 "Ironfur" >}} stacks over an encounter by 10%, while also making each stack slightly stronger through its bonus Agility. It's difficult to pin down an exact value for this trait, since the value of an additional {{< spell 192081 "Ironfur" >}} differs depending on how many stacks you already have rolling; going from 0 to 2 stacks is far more valuable than going from 2 to 4 stacks, for example. It is however always beneficial to have an additional stack at any point, unless it puts you over the armor cap (and even then, every point of armor up to the cap has value).

Not only is it incredibly strong defensively, but the bonus Agility grants an offensive bonus as well. I'd consider this a must-have trait for just about all purposes.

## Masterful Instincts

- {{< spell 273344 "Masterful Instincts" >}} - After {{< spell 61336 "Survival Instincts" >}} fades, you gain X Mastery and Y Armor for 10 seconds.

At 370, you gain 285 Mastery and 623 Armor.

![Masterful Instincts bonus Mastery and Armor](/guardian/images/masterful-instincts-stats.png)

Another victim of terrible tuning. The design of this trait isn't terrible, as it's essentially extending your {{< spell 61336 "Survival Instincts" >}} beyond its normal duration which could be useful in many situations. The amount of stats you gain is completely pitiful for how rarely you'll have the buff up, however. Additionally, it provides no benefit outside of SI, a spell you use very few times during a fight.

## Twisted Claws

- {{< spell 275906 "Twisted Claws" >}} - The direct damage of {{< spell 77758 "Thrash" >}} has a 50% chance to grant you X Agility for 12 seconds, stacking up to 5 times.

At 370, you gain 89 Agility per stack, for a gain of 445 Agility at 5 stacks. Notably, you have a chance to proc a stack for every target hit by {{< spell 77758 "Thrash" >}}, meaning you are significantly more likely to maintain your stacks in multi-target scenarios.

![Twisted Claws bonus Agility and Armor](/guardian/images/twisted-claws-stats.png)

Notably, this trait improves dramatically with Haste. Because Haste lowers the cooldown of {{< spell 77758 "Thrash" >}}, the more Haste you have the more chances throughout a fight you have to apply a stack of Twisted Claws. Here are some charts showing the relative uptimes of various stack counts, and average stack counts, at varying levels of Haste.

![Twisted Claws Average Stacks](/guardian/images/twisted-claws-stacks.png)
![Twisted Claws Stack Uptimes](/guardian/images/twisted-claws-average-stack.png)

The sharp increases in uptimes/stack counts correspond to haste amounts at which you can fit extra global cooldowns into the buff duration, and exist because occasionally you will delay {{< spell 77758 "Thrash" >}} by one or two casts to prioritize a {{< spell 210706 "Gore" >}} proc or to dump Rage on Maul. The major spike at 50% Haste indicates the point at which you can fit a third Thrash cast into a single buff, when it has a 4 second cooldown.

This trait looks to be very strong both offensively and defensively, provided you can maintain reasonably good uptimes at high stacks. On one target this may prove difficult; at normal haste levels, you will get two chances to refresh the buff if you are casting {{< spell 77758 "Thrash" >}} on cooldown (which you should be doing anyway).

## Ursoc's Endurance

- {{< spell 280161 "Ursoc's Endurance ">}} Gain an absorb for X damage over 8 seconds when you use {{< spell 22812 "Barkskin" >}} or {{< spell 61336 "Survival Instincts" >}}.

At 370, the value of the absorb is 18700. 

As with {{< spell 276157 "Craggy Bark" >}}, this trait suffers from overlapping with your already strong defensive cooldowns. The absorb is better than it may first appear due to the fact that absorbs are consumed after damage reduction. That is to say, if you use {{< spell 61336 "Survival Instincts" >}}, while it is active the absorb has essentially double the value since the damage is first reduced by 50%. The major downside is that it only has value during your defensives, when your risk of dying is already considerably lowered. However, this trait is on the inner ring and therefore does not compete with the other traits outlined here.

## Wild Fleshrending

- {{< spell 279527 "Wild Fleshrending" >}} causes {{< spell 5221 "Shred" >}} to deal X additional damage and {{< spell 213771 "Swipe" >}} to deal Y additional damage to targets affected by your {{< spell 211141 "Thrash" >}}.

I'm only including this trait for completeness' sake. It is absolutely not worth taking for Guardian, as it only works with Cat Form {{< spell 211141 "Thrash" >}}, and does not work at all on {{< spell 5221 "Shred" >}} if you are in Guardian spec. 



# General Tanking Traits

These traits are available for all classes, and populate the inner rows of Azerite gear. They primarily compete with each other (and {{< spell 280161 "Ursoc's Endurance ">}}), as you can find most of the possible combinations of inner and outer traits on available gear.

Note that this is not an exhaustive list of all available general traits, but for the sake of brevity I will only talk about the ones that you might consider taking for survivability purposes. If a trait is not listed here, it is because it either provides little or no defensive benefit, or is too unreliable to be considered for tanking.

## Ablative Shielding

- {{< spell 271544 "Ablative Shielding" >}} - Falling below 40% health grants you X Armor for 10 seconds. Taking further Physical damage reduces the Armor granted. May only occur every 30 seconds.

At 370, you gain 1086 Armor. 

I wasn't able to test this trait personally, so I don't know exactly how the "taking further Physical damage" portion of this trait works. Regardless, this is a poor trait even without considering that part of it. It has no value above 40% health, and it isn't a reliable death save like some of the other "when you drop below X% health" effects. Armor only reduces damage, unlike absorbs or cheat deaths which negate damage entirely. This is a trait you can safely avoid.

## Azerite Fortification

- {{< spell 268435 "Azerite Fortification" >}} - When stunned, immobilized, or knocked back, you heal for X.

At 370, you heal for 13246.

This is a situational pick. There are several bosses in Uldir that have knockback mechanics (Taloc, Zul) where this trait could potentially be very strong as I don't think it has any internal cooldown. Because this depends so heavily on whether or not you can get CC'd, it's hard to value this trait generally, and I do not recommend it for general purpose survivability.

## Azerite Veins

- {{< spell 267683 "Azerite Veins" >}} - Taking damage has a chance to heal you for X every 3 seconds for 18 seconds or until you are fully healed.

At 370, you are healed for 6750 every 3 seconds (reduced by Haste), for a maximum potential of 40500. The RPPM is 1.  Assuming you always get the full value of the heal, this trait averages ~670 healing per second. I wasn't able to get my hands on one for testing, but it appears to have some sort of Haste scaling as well. 

There are some pretty major drawbacks to the trait: the fact that it has a very low RPPM makes it unreliable in terms of providing defensive value, and the fact that the effect is cancelled when you reach full health devalues it further, because in cases where you are topped off briefly at the beginning of a proc, and then brought low again you will get next to no value out of the proc. 

## Blood Siphon/Lifespeed/On My Way

- {{< spell 264108 "Blood Siphon" >}} - Increases your Mastery by X and your Leech by Y.
- {{< spell 267665 "Lifespeed" >}} - Increases your Haste by X and your Avoidance by Y.
- {{< spell 264108 "On My Way" >}} - Increases your Versatility by X and your Speed by Y.

At 370, the amount of secondary you gain is 121, and the amount of tertiary you gain is 37.

I've grouped these traits together because they all provide the same sort of benefit &mdash; a flat secondary and tertiary stat gain. These are by no means the best traits, but they do provide a consistent, non-gimmicky boost to your stats and aren't terrible. Of the three, {{< spell 264108 "Blood Siphon" >}} is the strongest, as both Mastery and Leech are strong stats for survivability. 

## Bulwark of the Masses

- {{< spell 268595 "Bulwark of the Masses" >}} - When you are surrounded by 4 or more enemies, gain a shield that absorbs X damage. Cannot occur more than once every 15 seconds.

At 370, the size of the absorb is 14842. 

This trait results in around 1k healing per second average, assuming the full absorb is consumed every 15 seconds. It's quite strong (relative to the other absorb-type traits) if you can reliably trigger the effect, for example in dungeons when pulling large packs of trash.

## Crystalline Carapace

- {{< spell 271536 "Crystalline Carapace" >}} - When dealt damage greater than 10% of your maximum health, gain X Armor and deal Y damage to attackers.

At 370, you gain 124 Armor and deal 107 damage.

This trait has nearly 100% uptime while tanking. The armor bonus is nothing special, but it is very consistent and reliable. This trait is very similar to {{< spell 268596 "Gemhide" >}} in function, except Crystalline Carapace deals damage instead of also granting Avoidance. There are a few more differences that I'll outline in the Gemhide description.

## Gemhide

- {{< spell 268596 "Gemhide" >}} - When dealt damage greater than 10% of your maximum health, gain X Armor and Y Avoidance.

At 370, this trait grants 211 Armor and 128 Avoidance.

As mentioned above, this trait is very similar to {{< spell 271536 "Crystalline Carapace" >}} &mdash; both are high-uptime Armor buffs that have very reliable ways to proc them when needed. Defensively, Gemhide is strictly better. Not only does it grant more Armor at all item levels, but instead of dealing damage as a secondary effect like Crystalline Carapace, it also grants Avoidance, which works on not only raid-wide damage, but also on cleaving tank damage as well (any attack with an AoE component).

![Crystalline Carapace vs Gemhide bonus Armor](/guardian/images/crystalline-carapace-vs-gemhide.png)

## Impassive Visage

- {{< spell 268437 "Impassive Visage" >}} - When you take damage, heal for X. Cannot occur more than once every 6 seconds.

At 370, the value of this heal is 3896.

You can think of this trait as granting you around 650 healing per second. The nice thing about the way the proc works is that you are only healed when you take damage, effectively guaranteeing that it will not overheal (unless the damage is so insignificant that it deals less than the heal would have done). If you are taking consistent damage that is too low to proc {{< spell 271536 "Crystalline Carapace" >}} or {{< spell 268596 "Gemhide" >}}, this is probably one of the stronger of the generic traits available.

## Resounding Protection

- {{< spell 263962 "Resounding Protection" >}} - Every 30 seconds, gain an absorb for 30 seconds.

At 370, the size of the absorb is 11131.

{{< item 132444 "Prydaz, Xavaric's Magnum Opus" >}}-lite. If the full shield is consumed every time, this trait results in ~370 healing per second. The pure throughput is lower than other traits that grant healing like {{< spell 268437 "Impassive Visage" >}}, however absorbs also increase your effective health and reduce your chances of being one-shot. The absorb also provides benefit while you're at or near full health, unlike healing traits which are only effective when they don't overheal.

## Winds of War

- {{< spell 267671 "Winds of War" >}} - Taking damage grants X Dodge for 3 seconds, stacking up to 10 times.

At 370 you gain 37 Dodge rating per stack, for a total of 370 Dodge rating at max stacks.

While Dodge is very inconsistent as a damage-reducing mechanic and should not be relied on as a survivability tool, it does reduce your overall damage taken over the course of a fight. Assuming you're at an average of 370 item level and have an equal distribution of secondaries (3732 Agility and 704 Crit rating from gear), adding 370 Dodge rating will improve your chance to dodge by 3.18%.
