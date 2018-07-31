---
title: "Guardian Druid Azerite Traits: Analysis"
date: '2018-07-26'
authors: ['Faide']
description: "Azerite powers are a new system in Battle for Azeroth, similar to the Netherlight Crucible from Legion. Here is a detailed analysis of the azerite traits available to Guardians in Battle for Azeroth."
patch: 8.0.1
---

Azerite powers are a new system in Battle for Azeroth, similar to the Netherlight Crucible from Legion. They provide various bonuses and augment your skills in ways similar to tier set bonuses or legendaries, but at a slightly lower power level.

Let's take a look at the traits available to Guardians. I'm going to focus today on only the subset of traits specific to the Guardian spec (and traits shared between Guardian and Feral), as they are the most relevant to this post. Keep in mind that this is a small subset of all available traits, and some are likely to be stronger than the Guardian specific traits in either offense or defense. 

You are always guaranteed at least one Guardian specific trait on any azerite piece (in some cases it's possible to have two, if Wild Fleshrending is present).

Because some of the effects on the traits scale with item level, I will be assuming an item level of 370 (Heroic Uldir) for all trait values.

 - focus mainly on single ranks, since majority of value is in non-scaling effects
 - focus only on tier 3 traits: guardian traits and general traits that directly compete 
 - 

# Druid Traits

The following traits are available only to Druids. Most of these are Guardian specific, but some are shared between Feral and Balance as well. You are guaranteed at least one Guardian specific trait and one generic trait on every azerite piece, although it is possible to have more if one of the shared traits is present for another spec.

## Craggy Bark

{{< spell 276157 "Craggy Bark" >}} - {{< spell 22812 "Barkskin" >}} reduces melee attacks against you by X damage.

At 370, the value of the reduction is 362 damage per melee. If we assume a standardized enemy swing timer of 2 seconds per melee, with a {{< spell 22812 "Barkskin" >}} duration of 12 seconds you will reduce 6 melees per use, per enemy. That's a total reduction of 2172 (give or take a few points due to rounding) damage per Barkskin, per target. This effect occurrs after mitigation.

Frankly, this trait is pretty terrible. Not only is it only active during Barkskin when you already have a 10% damage reduction going, but the amount that it reduces is not especially meaningful *and* it only works on melee attacks. Unless this trait is buffed, I'd recommend avoiding it where possible. 

## Gory Regeneration

{{< spell 279536 "Gory Regeneration" >}} - {{< spell 33917 "Mangle" >}} increases the duration of an active {{< spell 22842 "Frenzied Regeneration" >}} by 1 second. Additionally, Frenzied Regeneration heals for X more per second.

At 370 the extra heal is valued at 524 extra healing per second, for a total of 2096 additional healing per cast. This extra healing is present regardless of whether the FR is empowered by Mangle or not. Additionally, the extension occurs *per target hit*, meaning that if you have {{< spell 102558 "Incarnation: Guardian of Ursoc" >}} and you can hit 3 targets with Mangle, you will get 3 seconds of extension per cast. That in addition to the cooldown of Mangle being reduced means you can sustain an FR for a very long time while Incarnation is active.

This trait basically lives or dies by whether or not you're talented into Incarnation. If you aren't, Mangle's cooldown is so long that you will get at most 1 second of extension (you can get 2 in theory if you have around 88% haste, which may be possible with lust/berserking and a lot of haste rating). If you are, this trait becomes an incredibly powerful boost to your self-healing capabilities. 

That being said, while this trait looks very good (under certain circumstances) on paper, I'm not convinced it has the same value in practice. For one, the HPS of Frenzied Regeneration is still quite low, at 6% HP per tick, baseline. The extension component of Gory Regeneration does not improve the HPS output at all, it merely prolongs its duration. This would be fine in isolation, but in reality you don't have infinite health and you will have external healing. Extending FR increases the chance that it will cause overhealing, either for you or for your healers, which eliminates the benefit of receiving more healing altogether. 


## Guardian's Wrath

{{< spell 279541 "Guardian's Wrath" >}} - {{< spell 6807 "Maul" >}} deals X additional damage and reduces the cost of your next {{< spell 192081 "Ironfur" >}} by 15 Rage, stacking up to 3 times.

At 370, value of the additional damage is 1048. 

This is a great trait all around. Not only is it a significant boost to Maul's damage, but it affords you some flexibility in your Rage management. Particularly in situations with tank swaps, this allows you to safely spend Rage on Maul and still be able to have an Ironfur up for when you taunt back. Offensively, this is one of the strongest Guardian specific traits out there.

## Layered Mane

{{< spell 279552 "Layered Mane" >}} - {{< spell 192081 "Ironfur" >}} increases your Agility by X, and casting Ironfur has a chance to grant 2 applications.

At 370 you gain 175 extra agility, per {{< spell 192081 "Ironfur" >}} stack. This means that the more Ironfur you have, the stronger each individual stack becomes (since Ironfur dynamically benefits from your Agility).

This looks to be the strongest Guardian-specific defensive trait available. It effectively increases your average  stacks over an encounter by 10%, while also making each stack slightly stronger through its bonus Agility. It's difficult to pin down an exact value for this trait, since the value of an additional Ironfur differs depending on how many stacks you already have rolling; going from 0 to 2 stacks is far more valuable than going from 2 to 4 stacks, for example. It is however always beneficial to have an additional stack at any point, unless it puts you over the armor cap (and even then, every point of armor up to the cap has value).

Not only is it incredibly strong defensively, but the bonus Agility grants an offensive bonus as well. I'd consider this a must-have trait for just about all purposes.

## Masterful Instincts

{{< spell 273344 "Masterful Instincts" >}} - After {{< spell 61336 "Survival Instincts" >}} fades, you gain X Mastery and Y Armor for 10 seconds.

At 370, you gain 173 Mastery and 693 Armor.

Another victim of terrible tuning. The design of this trait isn't terrible, as it's essentially extending your {{< spell 61336 "Survival Instincts" >}} beyond its normal duration which could be useful in many situations. The amount of stats you gain is completely pitiful for how rarely you'll have the buff up, however.

## Twisted Claws

{{< spell 275906 "Twisted Claws" >}} - The direct damage of {{< spell 77758 "Thrash" >}} has a 50% chance to grant you X Agility for 12 seconds, stacking up to 5 times.

At 370, you gain 89 Agility per stack, for a gain of 445 Agility at 5 stacks. Notably, you have a chance to proc a stack for every target hit by {{< spell 77758 "Thrash" >}}, meaning you are significantly more likely to maintain your stacks on multitarget.

Notably, this trait improves dramatically with Haste. Because Haste lowers the cooldown of Thrash, the more Haste you have the more chances throughout a fight you have to apply a stack of Twisted Claws. While Haste won't improve your chances of maintaining an already existing buff until you have quite high amounts of it (you need at least 50% Haste to be able to fit another Thrash into the buff duration), it will reduce the time you spend at 0 stacks, raising your average stacks over an encounter.

Here are some charts showing the relative uptimes of various stack counts, and average stack counts, at varying levels of Haste.

![Twisted Claws Stack Uptimes](/guardian/images/twisted-claws-uptimes.png)

![Twisted Claws Average Stacks](/guardian/images/twisted-claws-stacks.png)

The sharp increases in uptimes/stack counts correspond to haste amounts at which you can fit extra global cooldowns into the buff duration, and exist because occasionally you will delay {{< spell 77758 "Thrash" >}} by one or two casts to prioritize a {{< spell 210706 "Gore" >}} proc or to dump Rage on Maul. The major spike at 50% Haste denotes the aforementioned boundary where you can fit a third Thrash cast into a single buff.

###TODO: put some mathematics here

This trait looks to be very strong both offensively and defensively, provided you can maintain reasonably good uptimes at high stacks. On one target this may prove difficult; at normal haste levels, you will get two chances to refresh the buff if you are casting Thrash on cooldown (which you should be doing anyway).

## Ursoc's Endurance

{{< spell 280161 "Ursoc's Endurance ">}} Gain an absorb for X damage over 8 seconds when you use Barkskin or Survival Instincts.

At 370, the value of the absorb is 3015. 

As with {{< spell 276157 "Craggy Bark" >}}, this trait suffers from overlapping with your already strong defensive cooldowns. The absorb is better than it may first appear due to the fact that absorbs are consumed after damage reduction. That is to say, if you use Survival Instincts, while it is active the absorb has essentially double the value since the damage is first reduced by 50%. The major downside is that it only has value during your defensives, when your risk of dying is already considerably lowered.

## Wild Fleshrending

{{< spell 279527 "Wild Fleshrending" >}} causes {{< spell 5221 "Shred" >}} to deal X additional damage and {{< spell 213771 "Swipe" >}} to deal Y additional damage to targets affected by your {{< spell 77758 "Thrash" >}}.

At 370, {{< spell 5221 "Shred" >}} deals 698 extra damage, and {{< spell 213771 "Swipe" >}} deals 262 extra damage.

Obviously the Shred portion of this trait has no value unless you are catweaving. The extra Swipe damage is a moderate damage boost, although if you are catweaving you will be casting far fewer Swipes than you would be staying in Bear Form. This trait has the potential to be quite strong in multitarget/dungeon scenarios where you are casting Swipe a lot and hitting many targets.

*Note that this trait is primarily a Feral trait that happens to be available to Guardians, and when I attempted to test it the trait was not working at all for either spec. I don't know for sure whether the trait is intended to be selectable by Guardians, or if it is meant to deal as much damage as it does. When the trait is fixed I will update this section with further testing.*

# General Tanking Traits

These traits are available for all tanks, 

## Ablative Shielding

## Bulwark of the Masses

## Crystalline Carapace

## Gemhide

## Impassive Visage

## Resounding Protection

## Winds of War
