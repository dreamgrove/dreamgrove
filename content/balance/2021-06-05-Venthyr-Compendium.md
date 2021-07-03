---
date: '2021-06-05'
authors: ["Jundarer"]
published: true
showOnFrontpage: false
patch: "9.1"
title: Venthyr Compendium
sidebarTitle: "Quicklinks"
sidebarContents:  |
  [Disclaimers](#disclaimers)
  <br>[Single target](#single-target)
  <br>[AoE](#aoe)
  <br>[MinMax](#minmax)
  <br>[Gear](#gear)
---

<div id="disclaimers">

# [Disclaimers:](#disclaimers)
  
</div>

This guide is not telling you to pick Venthyr or that Venthyr is always the superior pick. It is simply made to show everything about how to maximize your potential as a Venthyr Balance Druid if you do decide to switch to Venthyr.
As we are still in the PTR-cycle it is very possible that the next PTR patch will either make Venthyr far worse or make another Covenant far better.

All information in this guide was tested and verfied using simulations and the (current) APL can be found here as long as Venthyr is only relevant for PTR: https://github.com/balance-simc/Balance-SimC/blob/master/balance_ptr.txt.

Everything in this guides assumes you are playing with the new Venthyr legendary Sinful Hysteria as this is the reason that Venthyr has gotten any attention at all.

Going from Night Fae Balance Druid to Venthyr Druid is a big gameplay change on single target and will take some getting used to so don't expect your first runs to be succesful.
</div>

<div id="single-target">

# [Single Target:](#single-target)

</div>

Due to no longer using Balance of All Things there is no longer as compelling of a reason to {{< spell 78674 "Starsurge" >}}at the beginning of an Eclipse and thus you can often save Astral Power for movement without any relevant dps loss. {{< spell 78674 "Starsurge" >}}Empowerment exists but it is a very weak effect.

On single target about 65% of your damage will be during CA/Inc+{{< spell 323546 "Ravenous Frenzy" >}} meaning it is extremely important to be able to cast during that time and that the target will live for the entire duration of your cooldowns. Since the legendary only does anything during our cooldowns you will do about 20% less damage outside cooldowns than you did with NF-BoAT Balance Druid.

**Single target priority list OUTSIDE cooldowns:** 
- Keep up {{< spell 8921 "Moonfire" >}}, {{< spell 93402 "Sunfire" >}} and {{< spell 202347 "Stellar Flare" >}} and refresh within pandemic
- Enter the next Eclipse, preferring Solar Eclipse
- Cast {{< spell 211545 "Fury of Elune" >}} if it will be up again for your next usage in CA/Inc
- Cast {{< spell 78674 "Starsurge" >}} when you would overcap Astral Power before entering the next Eclipse. This usually equates to spending 3 Starsurges at the start like you did with BoAT but can vary. Don't spend if you need to move soon.
- Cast{{< spell 190984 "Wrath" >}} in Solar Eclipse
- Cast {{< spell 194153 "Starfire" >}} in Lunar Eclipse
- Cast dots if have nothing to cast while you are moving

**Single target priority list BEFORE cooldowns:**
- Make sure to have 90+ Astral Power before using cooldowns.
- Make sure {{< spell 211545 "Fury of Elune" >}} will be up at the end.

**Single target priority list INSIDE cooldowns:**
Before the 5s extension buff:
- Use your trinket so that it will be for the rest of your cooldowns. (For example at 13s remaining for IQD or 17s in Bloodlust)
- Use pot at 17s {{< spell 323546 "Ravenous Frenzy" >}} remaining
- Cast {{< spell 211545 "Fury of Elune" >}} if {{< spell 323546 "Ravenous Frenzy" >}} has 4 or less seconds remaining
- Cast {{< spell 78674 "Starsurge" >}} to prevent capping Astral Power
- Keep up {{< spell 8921 "Moonfire" >}}, {{< spell 93402 "Sunfire" >}} and {{< spell 202347 "Stellar Flare" >}}
- Cast {{< spell 190984 "Wrath" >}} to fill

**During the 5s Ravenous Frenzy extension buff:**
- Cast {{< spell 78674 "Starsurge" >}} to spend all your Astral Power
- Cast {{< spell 190984 "Wrath" >}} to fill

With {{< spell 202354 "Stellar Drift" >}} AND {{< spell 114107 "Soul of the Forest" >}} it is only a 1% dps loss to use Starfall on CD including during Frenzy so if there is any movement at all use Starfall when you happen to be doing single target with it talented. With {{< spell 102560 "Incarnation" >}} instead you should be using Starsurges during Frenzy as it is a much bigger loss (1% loss still applies for outside Frenzy). DO NOT just use {{< spell 202354 "Stellar Drift" >}} for a pure single target fight as it is still a ~4% dps loss doing this compared to {{< spell 202347 "Stellar Flare " >}}.

<div id="aoe">

# [AoE:](#aoe)

</div>

2+ target priority OUTSIDE cooldowns:

**Any situation:**
- Keep up {{< spell 93402 "Sunfire" >}} as long as your targets will live for another ~10 seconds (the amount of time is reduced per target hit).
- Keep up {{< spell 191034 "Starfall" >}} at all times or use on cooldown with{{< spell 202354 "Stellar Drift" >}} .
- Enter Solar Eclipse if that is your next Eclipse.
- Before Lunar Eclipse cast {{< spell 8921 "Moonfire" >}} if:
   - All targets can be hit by {{< spell 194153 "Starfire" >}}.
   - There are 5 or less targets (10 or less with {{< spell 281847 "Twin Moons" >}}).
   - All targets will live through the entire Lunar Eclipse.
   - You will not lose {{< spell 191034 "Starfall" >}} uptime.
- Enter Lunar Eclipse if you can.

**During Solar Eclipse:**
  - Use {{< spell 78674 "Starsurge" >}} to prevent overcapping.
  - Keep up {{< spell 8921 "Moonfire" >}} on up to 10 targets (20 with {{< spell 281847 "Twin Moons" >}}) if they will live through the next Eclipse and you won't lose {{< spell 191034 "Starfall" >}} uptime.
  - {{< spell 194153 "Starfire" >}} when 5 targets can be hit by it, increased by 1 target for every 20% mastery you have.
  - Cast {{< spell 190984 "Wrath" >}}.

**During Lunar Eclipse:**
  - Use {{< spell 78674 "Starsurge" >}} to prevent overcapping AsP until 6 targets at which point you should overcap.
  - Refresh {{< spell 8921 "Moonfire" >}} if you are at 4 (8 with {{< spell 281847 "Twin Moons" >}}) targets or below if the targets will live through the next Eclipse.
  - Cast {{< spell 194153 "Starfire" >}}.

**BEFORE cooldowns:**

- If the pack will last more than 35s put {{< spell 8921 "Moonfire" >}} on up to 8 targets (16 with {{< spell 281847 "Twin Moons" >}}). This happens very rarely but is a gain in case it happens.
- Refresh {{< spell 93402 "Sunfire" >}} so you only have to refresh it once during Cooldowns.

**DURING {{< spell 323546 "Ravenous Frenzy" >}}:**
- Refresh {{< spell 93402 "Sunfire" >}} during pandemic.
- Keep {{< spell 191034 "Starfall" >}} up at all times or on cooldown with {{< spell 202354 "Stellar Drift" >}}.
- Refresh {{< spell 8921 "Moonfire" >}} on up to 6 (12 with {{< spell 281847 "Twin Moons" >}}) targets when they will live for another ~20 seconds.
- https://wago.io/mYVIsyQN8 for filler. The recommendation this WeakAura gives is not correct when your targets will die before your cooldowns end or the targets are spread.
- If the filler is {{< spell 190984 "Wrath" >}} or up to 5 targets use {{< spell 78674 "Starsurge" >}} to prevent overcapping.


<div id="minmax">

# [MinMax:](#minmax)
  
</div>

The following are super minor things you can do but are ultimately very insignificant:
- Dotting outside Eclipse without losing dot uptime on single target is a ~0.4% gain when not using Solstice.
- At 150%+ haste using {{< spell 194153 "Starfire" >}} is minorly better than{{< spell 190984 "Wrath" >}} on single target. This will only happen with Power Infusion or very high haste.
- With {{< spell 202354 "Stellar Drift" >}} it is only a very minor loss (1-2%) to {{< spell 191034 "Starfall" >}} during {{< spell 323546 "Ravenous Frenzy" >}} as long as you enter Sinful Hysteria with 90+ AsP.
- Without Incarnation and a low enough {{< spell 340706 "Precise Alignment" >}} it is a minor gain to use {{< spell 323546 "Ravenous Frenzy" >}}  before Celestial Alignment so that CA will be up throughout Frenzy+Hysteria. The exact timing depends on your {{< spell 340706 "Precise Alignment" >}} rank but it should be no more than 2 globals after the Frenzy cast.
- If the fight time allows it wait for Euphoria/Fatal Flaw(Nadija Soulbinds) before using cooldowns. This is relevant for 5-6 min kill times.
- If the fight allows it wait for pot to be up again. This is relevant for 6min fights.

<div id="gear">

# [Gear:](#gear)
  
</div>

**Simming:**

Once everything is on live you will be able to sim as normal and that will, as always, give you the best results. It is to note that for Venthyr sims adjusting the fight duration can have a relevant impact on how strong some items maybe so it can be beneficial to adjust the sim duration to fight the fight you are simming for. Keep in mind that there will be a 20% fight length variance in sims meaning that a 5min sim is actually a 4-6min sim.

**Trinkets:**

Generally you will want an on-use trinket and the strongest passive trinket you can find. The strongest on-use trinkets are {{< item 179350 "Inscrutable Quantum Device" >}}, {{< item 180117 "Empyreal Ordnance" >}} (yes, without double on-use) and {{< item 184842 "Instructor's Divine Bell" >}} (yes, it's still broken even at low ilvl). IQD and Bell can be combined for a minor dps increase in the sub 0.5% area, although if that is better with your ilvl trinket you will have to sim. The raid on-use trinkets are all bad because we are a 3min class.

As a passive trinket you have a plethora of options. For single target your best options are the new trinkets {{< item 186423 "Titanic Ocular Gland" >}} (2nd boss raid), {{< item 186421 "Forbidden Necromantic Tome" >}} (last boss raid), {{< item 186422 "Tome of Monstrous Constructions" >}} (1st boss raid), {{< item 178769 "Infinitely Divisble Ooze" >}}, {{< item 178708 "Unbound Changeling" >}}, {{< item 187447 "Soul Cage Fragment" >}} (World Boss) and a bunch of others. For AoE/M+ the damage proc trinkets fall off meaning you won't want the Tome or Oooze but the other trinkets stay as good. As always just sim what trinkets are best from the ones you have.

**Ideal stats:**

Ideal stats are something that are not realistic to achieve and should thus not be a goal of any kind, this section is purely for interest. Independent of that with Venthyr Balance Druid mastery and haste are far, far more valuable than crit and vers as your sims will show. In fact when you could choose any kind of stats you wouldn't want any crit or vers but again this is not realistic.
