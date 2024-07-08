---
title: "Guardian Druid Azerite Traits: Analysis"
date: '2018-08-06'
authors: ['Faide']
description: "Azerite powers are a new system in Battle for Azeroth, similar to the Netherlight Crucible from Legion. Here is a detailed analysis of the azerite traits available to Guardians in Battle for Azeroth."
showtoc: true
patch: "8.1"
---

Azerite powers are a new system in Battle for Azeroth, similar to the Netherlight Crucible from Legion. They provide various bonuses and augment your skills in ways similar to tier set bonuses or legendaries, but at a slightly lower power level.

Let's take a look at the traits available to Guardians. First, I'll cover the set of traits specific to Guardian (or traits from other Druid specs that Guardian can select) on the outer ring (Tier 3), and then some of the more general tanking-related traits that are available on the middle and inner rings (Tier 2 and Tier 1, respectively). Because many traits scale with item level, I will be assuming an item level of 370 (Heroic Uldir) for all trait values, except for the Engineering traits which are only available up to 340.

I'll only be focusing on the value of single traits for now (that is, going from having none of a trait to having one of that trait), since much of the value comes from the effects that don't scale with the number of instances of that trait that are present. As a result, **stacking more than one of a particular trait will have reduced value and usually be worse than taking the first instance of another trait**. As a general rule: values that are denoted by the variables X or Y scale with item level and trait stacking.

# Frequently Asked Questions

## Do azerite traits stack?

Sort of. Only parts of the traits stack, while other parts do not. In general: stat buff values and damage numbers do stack, while proc chances, durations, percentages, and resource modifiers do not.

For example: if you have more than one {{< spell 279552 "Layered Mane" >}} trait, the Agility buff component will stack, but the chance to proc will remain 10% no matter how many traits you have.

## Are generic outer ring traits worth using?

Defensively speaking, the generic traits that grant primary stat are not terrible usually, but they will typically be worse than the Guardian specific traits. The remaining generic traits (the ones that grant secondaries or deal damage) are not worth taking. Use your best judgement when deciding whether or not to take a generic trait for defensive value.

Offensively, many generic traits are very strong for DPS and will typically be stronger than Guardian specific traits (the exceptions being {{< spell 275906 "Twisted Claws" >}}, {{< spell 273367 "Power of the Moon" >}}, and {{< spell 279527 "Wild Fleshrending" >}}, which are very competitive). You should always sim your trait options to determine which are the strongest for your character's DPS. To get a general idea of what DPS traits you should aim for, check out [Bloodmallet](https://bloodmallet.com/index.html#druid_guardian?data_view=azerite_traits&type=itemlevel&fight_style=patchwerk).

## How many item levels is a trait worth?

Defensively, if you have one of the strong outer ring traits ({{< spell 279552 "Layered Mane" >}} or {{< spell 275906 "Twisted Claws" >}}), they are worth more than any realistic item level upgrade.

Offensively, you should sim your options to determine what is strongest for your character specifically.

# Outer Ring 

The following traits are available only to Druids. Most of these are Guardian specific, but some are shared between Feral and Balance as well. You are guaranteed at least one Guardian specific trait and one generic trait on every azerite piece, although it is possible to have more if one of the shared traits is present for another spec.

## Burst of Savagery

- {{< spell 289314 "Burst of Savagery" >}} - Consuming {{< spell 210706 "Gore" >}} grants you X Mastery for 5 seconds and has a 15% chance to trigger Gore again.

At 385, you gain 470 Mastery.

This is a new trait in 8.1 that replaces {{< spell 276157 "Craggy Bark" >}}. Personally, I think the design of this trait is kinda cool; I'm a big fan of giving players the choice to alter/enhance their rotation with interesting traits. 

Unfortunately I can't recommend {{< spell 289314 "Burst of Savagery" >}}. In its current state, it is not competitive with our top tier traits. 

Let's assume you have 20% Haste. Every 1.25 seconds you're casting a GCD spell; that is, either {{< spell 77758 "Thrash" >}}, {{< spell 6807 "Maul" >}},  {{< spell 213771 "Swipe" >}}, {{< spell 8921 "Moonfire" >}}, or {{< spell 33917 "Mangle" >}}. Four of those five spells are eligible to proc {{< spell 210706 "Gore" >}}, so let's be generous and say 12% (80% * 15%) of the GCDs you cast will be Gore procs (in Reality this will be lower since we have to account for Mangle resets due to procs). This roughly equates to a Gore proc every 10 seconds. Again, being generous we can assume that you always spend these procs right away (in reality due to reaction times, cooldown priorities, etc this will be more like 12-15 seconds), resulting in a secondary Gore proc every 70 seconds. Even in these ideal circumstances, {{< spell 289314 "Burst of Savagery" >}} will only grant you an additional Gore proc every minute.

The Mastery bonus is actually pretty nice, all things considered; if we follow the numbers I just outlined you can expect roughly 50% uptime on the buff in the best case. It's just not enough on its own to make the trait worth taking.

## Gory Regeneration

- {{< spell 279536 "Gory Regeneration" >}} - {{< spell 33917 "Mangle" >}} increases the duration of an active {{< spell 22842 "Frenzied Regeneration" >}} by 1 second. Additionally, Frenzied Regeneration heals for X more per second.

At 385 the extra heal is valued at 2091 extra healing per second, for a total of 8364 additional healing per cast. This extra healing is present regardless of whether the {{< spell 22842 "Frenzied Regeneration" >}} is empowered by {{< spell 33917 "Mangle" >}} or not. Additionally, the extension occurs *per target hit*, meaning that if you have {{< spell 102558 "Incarnation: Guardian of Ursoc" >}} and you can hit 3 targets with Mangle, you will get 3 seconds of extension. You can extend a single Frenzied Regeneration by up to 3 seconds, regardless of number of targets hit; subsequent Mangles will not further extend the duration.

If you have {{< spell 102558 "Incarnation: Guardian of Ursoc" >}}, you can add an extra 3 seconds to your {{< spell 22842 "Frenzied Regeneration" >}} at most, which is 75% increased healing from at most 2 FRs in a span of 30 seconds, every 3 minutes. Outside of that, it's a pseudo {{< spell 155578 "Guardian of Elune" >}} (the Frenzied Regeneration portion), without the flexibility to pool the buff for a later cast or spend it on empowering {{< spell 192081 "Ironfur" >}} instead.

While this trait might look okay on paper, I'm not convinced it has the same value in practice. For one, the HPS of {{< spell 22842 "Frenzied Regeneration" >}} is still quite low, at 6% HP per tick baseline (with the bonus healing from the trait it is probably closer to 7%). The extension component of Gory Regeneration does not improve the HPS output of Frenzied Regen while it's ticking, it only increases the number of seconds it ticks for. This would be fine in isolation, but in reality you don't have infinite health and you will have external healing. Extending FR increases the chance that it will cause overhealing, either for you or for your healers, which eliminates the benefit of receiving more healing altogether. 

## Guardian's Wrath

- {{< spell 279541 "Guardian's Wrath" >}} - {{< spell 6807 "Maul" >}} deals X additional damage and reduces the cost of your next {{< spell 192081 "Ironfur" >}} by 15 Rage, stacking up to 3 times.

At 385, Maul deals 1205 additional damage. 

![Guardian's Wrath bonus damage](/guardian/images/guardians-wrath-damage.png)

In order to evaluate this trait, let's consider its offensive value. Assuming you are casting {{< spell 192081 "Ironfur" >}} at least enough to consume every stack that you generate, you can consider {{< spell 6807 "Maul" >}} to effectively cost 30 Rage per cast. The Rage you would have spent on Ironfur is now refunded to you, allowing you to cast more Mauls over the course of a fight. This is in effect a 33.3% gain in Mauls which, in addition to the additional damage, significantly improves your DPS output when you are using a combination of Ironfur and Maul. Of course, if you never cast Ironfur (or if you waste stacks by not casting it enough), you will get less value out of the trait.

Defensively, this trait is not very strong. Obviously while not tanking, you can bank a free {{< spell 192081 "Ironfur" >}} for instant mitigation when you taunt back, which allows you to spend more Rage on {{< spell 6807 "Maul" >}} during times when you aren't actively tanking. But from a pure survivability perspective, if you were concerned only about your defensive capacity you would spend Rage exclusively on Ironfur and this trait would provide no value. It's the hybrid nature of the trait that gives it its value.

This is a solid trait all around. Not only is it a decent boost to {{< spell 6807 "Maul" >}}'s damage, but it affords you some flexibility in your Rage management. Particularly in situations with tank swaps, this allows you to safely spend Rage on Maul and still be able to have an {{< spell 192081 "Ironfur" >}} up for when you taunt back. Offensively, this is one of the strongest Guardian specific traits out there.

*As an aside, I really like the design of Guardian's Wrath personally and I wish there were more traits like this in general. It creates an interesting interaction between our spenders and goes beyond the typical "heal for X/gain an absorb/gain a stat" design, and while it doesn't really affect the gameplay in super meaningful ways, it does incentivize using both offensive and defensive skills in tandem.*

## Layered Mane

- {{< spell 279552 "Layered Mane" >}} - {{< spell 192081 "Ironfur" >}} increases your Agility by X, and casting Ironfur has a chance to grant 2 applications.

At 385 you gain 141 extra agility, per {{< spell 192081 "Ironfur" >}} stack. This means that the more Ironfur you have, the stronger each individual stack becomes (since Ironfur dynamically benefits from your Agility).

![Layered Mane bonus Agility and Armor](/guardian/images/layered-mane-stats.png)

This looks to be the strongest Guardian-specific defensive trait available. It effectively increases your average {{< spell 192081 "Ironfur" >}} stacks over an encounter by 10%, while also making each stack slightly stronger through its bonus Agility. It's difficult to pin down an exact value for this trait, since the value of an additional {{< spell 192081 "Ironfur" >}} differs depending on how many stacks you already have rolling; going from 0 to 2 stacks is far more valuable than going from 2 to 4 stacks, for example. It is however always beneficial to have an additional stack at any point, unless it puts you over the armor cap (and even then, every point of armor up to the cap has value).

Not only is it incredibly strong defensively, but the bonus Agility grants an offensive bonus as well. I'd consider this a must-have trait for just about all purposes.

## Masterful Instincts

- {{< spell 273344 "Masterful Instincts" >}} - After {{< spell 61336 "Survival Instincts" >}} fades, you gain X Mastery and Y Armor for 30 seconds.

At 385, you gain 1168 Mastery and 687 Armor.

![Masterful Instincts bonus Mastery and Armor](/guardian/images/masterful-instincts-stats.png)

The design of this trait isn't terrible, as it's essentially extending your {{< spell 61336 "Survival Instincts" >}} beyond its normal duration which could be useful in many situations. However, the amount of stats gained is still quite low; on average, you will gain around 70 Mastery and 68 Armor, assuming you are using a Survival Instincts charge once every 4 minutes (and bearing in mind that you will probably use them more frequently since fights don't normally last long enough to worry about the full recharge time). 

## Twisted Claws

- {{< spell 275906 "Twisted Claws" >}} - The direct damage of {{< spell 77758 "Thrash" >}} has a 50% chance to grant you X Agility for 12 seconds, stacking up to 5 times.

At 385, you gain 102 Agility per stack, for a gain of 510 Agility at 5 stacks. Notably, you have a chance to proc a stack for every target hit by {{< spell 77758 "Thrash" >}}, meaning you are significantly more likely to maintain your stacks in multi-target scenarios.

![Twisted Claws bonus Agility and Armor](/guardian/images/twisted-claws-stats.png)

This trait improves dramatically with Haste. Because Haste lowers the cooldown of {{< spell 77758 "Thrash" >}}, the more Haste you have the more chances throughout a fight you have to apply a stack of Twisted Claws. 

![Twisted Claws Stack Uptimes](/guardian/images/twisted-claws-stacks.png)

The sharp increases in uptimes/stack counts correspond to haste amounts at which you can fit extra global cooldowns into the buff duration, and exist because occasionally you will delay {{< spell 77758 "Thrash" >}} by one or two casts to prioritize a {{< spell 210706 "Gore" >}} proc or to dump Rage on Maul. The major spike at 50% Haste indicates the point at which you can fit a third Thrash cast into a single buff, when it has a 4 second cooldown.

This trait looks to be very strong both offensively and defensively, provided you can maintain reasonably good uptimes at high stacks. On one target this may prove difficult; at normal haste levels, you will get two chances to refresh the buff if you are casting {{< spell 77758 "Thrash" >}} on cooldown (which you should more or less be doing anyway).

## Wild Fleshrending

- {{< spell 279527 "Wild Fleshrending" >}} - {{< spell 5221 "Shred" >}} to deal X additional damage and {{< spell 213771 "Swipe" >}} to deal Y additional damage to targets affected by your {{< spell 77758 "Thrash" >}}.

At 385, {{< spell 5221 "Shred" >}} deals 1416 extra damage and {{< spell 213771 "Swipe" >}} deals 459 extra damage.

This is a Feral trait that is also selectable as Guardian, and does work with {{< spell 77754 "Thrash" >}} in Bear Form. If you are not catweaving, It is about equal for DPS benefit with {{< spell 275906 "Twisted Claws" >}}; where Twisted Claws is very slightly better below 5 targets and Wild Fleshrending is very slightly better above 5 targets. If you are catweaving, Wild Fleshrending wins out on 1 target, and is the best DPS trait.

Unlike Twisted Claws, it does not provide any defensive benefit, which makes Twisted Claws better in almost every circumstance if you have the option, but this is a solid choice for DPS.

## Power of the Moon

- {{< spell 273367 "Power of the Moon" >}} - Moonfire deals X additional periodic damage, and has a 5% chance to grant you {{< spell 164547 "Lunar Empowerment" >}}.

At 385, Moonfire deals 163 additional damage per tick. The Lunar Empowerment chance does not work for Guardians.

This is a Balance trait that is not selectable as Guardian, however it will work if you have selected it from Balance spec and switched into Guardian spec after selecting it. This trait was changed in 8.1 to grant periodic damage instead of direct damage, meaning it no longer scales with {{< spell 203964 "Galactic Guardian" >}} and is therefore not recommended.

## Waking Dream

- {{< spell 278958 "Waking Dream" >}} - {{< spell 145108 "Ysera's Gift" >}} now heals every 4 seconds, and heals for an additional X for each of your active {{< spell 774 "Rejuvenation" >}}s.

At 385, {{< spell 145108 "Ysera's Gift" >}} heals for 359 more per {{< spell 774 "Rejuvenation" >}}.

This is a Restoration trait that is not selectable as Guardian, however it will work if you have selected it from Restoration spec and switched into Guardian spec after selecting it. The effect is only active if you have {{< spell 197492 "Restoration Affinity" >}} talented. If you do, this is a 20% increase to the healing from {{< spell 145108 "Ysera's Gift" >}}, which is not amazing but it is worth noting. If you are tanking it's unlikely you will have any {{< spell 774 "Rejuvenation" >}}s out so this part of the effect is mostly negligible. 

Overall this trait is a boost to your healing if you have {{< spell 197492 "Restoration Affinity" >}}, but it is much worse than the strong defensive traits available to Guardians.

## Archive of the Titans

- {{< spell 280555 "Archive of the Titans" >}} - Every 5 seconds, increase your primary stat by X, increasing up to 20 times. This data decays while out of combat. Also enables {{< spell 280573 "Reorigination Array" >}} within Uldir.

At 385, you gain 14 primary stat per stack.

This trait is fairly powerful by itself, but additionally it enables {{< spell 280573 "Reorigination Array" >}}. 

Reorigination Array is a persistent buff that increases in power the more bosses you kill in Uldir. It grants you more of your highest secondary stat (which hopefully is a stat you are stacking because you prefer it), and each week it will increase in value as you kill bosses. Reorigination Array looks to be extremely potent as the weeks go by, so you will definitely want at least one trait which enables this effect.

Notably, {{< spell 280705 "Laser Matrix" >}} also enables {{< spell 280573 "Reorigination Array" >}}. {{< spell 280555 "Archive of the Titans" >}} is the more tank-relevant trait of the two, but you could use either trait in order to gain the effect.

---

# Middle Ring

These traits are available for all classes, and populate the middle ring of Azerite gear. They primarily consist of throughput traits; for tanks, these are stat procs, absorbs, and heals that trigger under certain circumstances. These traits are not exclusive with outer ring or inner ring traits. This ring is sometimes not present on lower level gear.

Note that this is not an exhaustive list of all available middle ring traits, but for the sake of brevity I will only talk about the ones that you might consider taking for survivability purposes. If a trait is not listed here, it is likely because it either provides little or no defensive benefit, or is too unreliable to be considered for tanking. 

Broadly speaking, the defensive options on this row are quite weak. Unless you have a serious need for a small amount of Armor or Dodge, you should consider opting for a damage-oriented trait instead of one of these options. 

## Ablative Shielding

- {{< spell 271544 "Ablative Shielding" >}} - Falling below 40% health grants you X Armor for 10 seconds. Taking further Physical damage reduces the Armor granted. May only occur every 30 seconds.

At 385, you gain 1250 Armor. 

Every time you take Physical damage, the amount of Armor you gain from the buff is reduced by 10% of the original amount. It is a fairly large Armor proc, but it has no value above 40% health, and it isn't a reliable death save like some of the other "when you drop below X% health" effects. Armor only reduces damage, unlike absorbs or cheat deaths which negate damage entirely. 

## Azerite Veins

- {{< spell 267683 "Azerite Veins" >}} - Taking damage has a chance to heal you for X every 3 seconds for 18 seconds or until you are fully healed.

At 385, you are healed for 7800 every 3 seconds (reduced by Haste), for a maximum potential of 46800. The RPPM is 1.  Assuming you always get the full value of the heal, this trait averages ~670 healing per second. It's also one of the few generic traits that scales with Haste (Haste adds ticks to the duration).

There are some drawbacks to the trait: the fact that it has a very low RPPM makes it unreliable in terms of providing defensive value, and the fact that the effect is cancelled when you reach full health devalues it further, because in cases where you are topped off briefly at the beginning of a proc, and then brought low again you will get next to no value out of the proc. The trade-off is that when it does proc, it's an extremely potent heal.

## Blood Siphon/Lifespeed/On My Way

- {{< spell 264108 "Blood Siphon" >}} - Increases your Mastery by X and your Leech by Y.
- {{< spell 267665 "Lifespeed" >}} - Increases your Haste by X and your Avoidance by Y.
- {{< spell 267879 "On My Way" >}} - Increases your Versatility by X and your Speed by Y.

At 370, the amount of secondary you gain is 139, and the amount of tertiary you gain is 70.

I've grouped these traits together because they all provide the same sort of benefit &mdash; a flat secondary and tertiary stat gain. These are by no means the best traits, but they do provide a consistent, non-gimmicky boost to your stats and aren't terrible. Of the three, {{< spell 264108 "Blood Siphon" >}} is the strongest, as both Mastery and Leech are strong stats for survivability. 

## Crystalline Carapace

- {{< spell 271536 "Crystalline Carapace" >}} - When dealt damage greater than 10% of your maximum health, gain X Armor and deal Y damage to attackers.

At 385, you gain 143 Armor and deal 107 damage.

This trait has nearly 100% uptime while tanking. The armor bonus is nothing special, but it is very consistent and reliable. This trait is very similar to {{< spell 268596 "Gemhide" >}} in function, except Crystalline Carapace deals damage instead of also granting Avoidance. 

## Shimmering Haven

- {{< spell 271557 "Shimmering Haven" >}} - Taking damage has a chance to create an upwelling of Azerite beneath your feet, increasing your Health by X and your Armor by Y while you stand within it, for 10 seconds.

At 385, you gain 15459 health and 438 armor.

This trait has roughly 1 RPPM, making it very unreliable at less than 20% uptime. Additionally, this trait forces you to stand in one location and not move in order to benefit from it. This might have been fine if you could control when it procced and therefore decide when to stay still, but since you have no control over when it procs you cannot guarantee you won't have to move while the buff is up.

## Winds of War

- {{< spell 267671 "Winds of War" >}} - Taking damage grants X Dodge for 3 seconds, stacking up to 5 times.

At 385 you gain 39 Dodge rating per stack, for a total of 195 Dodge rating at max stacks.

While Dodge is very inconsistent as a damage-reducing mechanic and should not be relied on as a survivability tool, it does reduce your overall damage taken over the course of a fight. Assuming you're at an average of 370 item level and have an equal distribution of secondaries (3732 Agility and 704 Crit rating from gear), adding 195 Dodge rating will improve your chance to dodge by 1.71%.

---

# Inner Ring

These traits populate the inner ring of Azerite Gear. Like the middle ring, they consist mostly of general defensive benefits. They don't compete with traits on the outer and middle rings.

As with the middle ring section, this list is not exhaustive. If a trait is not listed here, it is because it either provides little or no defensive benefit, or is too unreliable to be considered for tanking. 

## Bulwark of the Masses

- {{< spell 268595 "Bulwark of the Masses" >}} - When you are surrounded by 4 or more enemies, gain a shield that absorbs X damage. Cannot occur more than once every 15 seconds.

At 385, the size of the absorb is 14040. 

This trait results in around 936 healing per second average, assuming the full absorb is consumed every 15 seconds. It's very strong if you can reliably trigger the effect, for example in dungeons when pulling large packs of trash.

## Gemhide

- {{< spell 268596 "Gemhide" >}} - When dealt damage greater than 10% of your maximum health, gain X Armor and Y Avoidance.

At 385, this trait grants 243 Armor and 243 Avoidance.

As mentioned above, this trait is very similar to {{< spell 271536 "Crystalline Carapace" >}} &mdash; both are high-uptime Armor buffs that have very reliable ways to proc them when needed. Defensively, Gemhide is strictly better. Not only does it grant more Armor at all item levels, but instead of dealing damage as a secondary effect like Crystalline Carapace, it also grants Avoidance, which works on not only raid-wide damage, but also on cleaving tank damage as well (any attack with an AoE component will be reduced by Avoidance). Keep in mind that Gemhide and Crystalline Carapace do not directly compete on the same row.

## Impassive Visage

- {{< spell 268437 "Impassive Visage" >}} - When you take damage, heal for X. Cannot occur more than once every 6 seconds.

At 385, the value of this heal is 4501.

You can think of this trait as granting you around 750 healing per second. The nice thing about the way the proc works is that you are only healed when you take damage, effectively guaranteeing that it will not overheal (unless the damage is so insignificant that it deals less than the heal would have done). If you are taking consistent damage that is too low to proc {{< spell 271536 "Crystalline Carapace" >}} or {{< spell 268596 "Gemhide" >}}, this is probably one of the stronger of the generic traits available.

## Resounding Protection

- {{< spell 263962 "Resounding Protection" >}} - Every 30 seconds, gain a shield that absorbs X for 30 seconds.

At 385, the size of the absorb is 12862.

{{< item 132444 "Prydaz, Xavaric's Magnum Opus" >}}-lite. If the full shield is consumed every time, this trait results in ~430 healing per second. The pure throughput is lower than other traits that grant healing like {{< spell 268437 "Impassive Visage" >}}, however absorbs also increase your effective health and reduce your chances of being one-shot. The absorb also provides benefit while you're at or near full health, unlike healing traits which are only effective when they don't overheal.

## Ursoc's Endurance

- {{< spell 280161 "Ursoc's Endurance ">}} - Gain an absorb for X damage over 8 seconds when you use {{< spell 22812 "Barkskin" >}} or {{< spell 61336 "Survival Instincts" >}}.

At 370, the value of the absorb is 21609. 

As with {{< spell 276157 "Craggy Bark" >}}, this trait suffers from overlapping with your already strong defensive cooldowns. The absorb is better than it may first appear due to the fact that absorbs are consumed after damage reduction. That is to say, if you use {{< spell 61336 "Survival Instincts" >}}, while it is active the absorb has essentially double the value since the damage is first reduced by 50%. The major downside is that it only has value during your defensives, when your risk of dying is already considerably lowered. 

---

# Recommendations

With all that being said, here are the traits I'd recommend paying attention to, in no particular order:

## Outer Ring

- {{< spell 279552 "Layered Mane" >}} - Easily our best defensive trait. Extra stacks of Ironfur will almost always be useful, and a buff to every stack of Ironfur is the cherry on top.
- {{< spell 275906 "Twisted Claws" >}} - Free Agility for what is essentially performing the rotation correctly. Holds its own in single target but really shines on 2+ targets.
- {{< spell 280555 "Archive of the Titans" >}} - You should use at least one of these to enable {{< spell 280573 "Reorigination Array" >}}.

## Middle Ring

- {{< spell 267683 "Azerite Veins" >}} - The raw HPS of this trait outweighs the unreliability of it, compared to its contemporaries on this ring.
- {{< spell 271536 "Crystalline Carapace" >}} - A slightly worse (defensively) version of {{< spell 268596 "Gemhide" >}} with a small DPS component.
- {{< spell 264108 "Blood Siphon" >}} /{{< spell 267665 "Lifespeed" >}} /{{< spell 267879 "On My Way" >}} - Free stats are free stats. 

## Inner Ring

- {{< spell 263962 "Resounding Protection" >}} - Absorbs are always good.
- {{< spell 268437 "Impassive Visage" >}} - A healing trait that is almost guaranteed to not overheal.
- {{< spell 268595 "Bulwark of the Masses" >}} - If you can proc the effect, a very powerful absorb.
- {{< spell 268596 "Gemhide" >}} - A reliably high-uptime Armor and Avoidance buff.

