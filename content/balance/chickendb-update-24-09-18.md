---
date: '2018-09-24'
authors: ["Slippykins", "Iskalla"]
published: true
title: "ChickenDB update #1 -- trait stacks, tooltips and feedback"
showOnFrontpage: true
description: In this ChickenDB update, we go over the main changes in this update, including all-new tooltips, trait stacking and more!
patch: "8.0"
---

One of the best things about running your own theorycrafting project is that you decide where things go and what you want to focus on. All your feedback has been immeasurable and awesome, and we would just like to thank everyone for the time they've given to ChickenDB and for helping it grow. Balance is an extremely lucky spec to have so many caring and thoughtful people playing it, and that's mainly why we created ChickenDB in the first place.

The next sizable update for [ChickenDB](https://www.chickendb.com/) is now live, and includes some quality-of-life improvements, a few UI changes and a big boost to the backend. You may notice ChickenDB run a *lot* faster on some tabs, and this is going to help us once we expand to more insights and results! On that point: we have now broken the **10,000** profiles point! This means all analytics on the **Main** tab is created by over 10,000 unique builds, representing just a bit over 1% of the total builds possible. This could only be accomplished with the big help of Seri and Raidbots, handling all our heavy-duty computation.

### What's Changed?

The main points we will cover in this update are:

- UI changes
- Acronyms, Gearset and Help pages
- Azerite Trait stacks
- Tooltips on Main, Azerite and Gear pages
- Removal of Synergies page


## UI changes

One of the key pieces of feedback we received early on was that our filters didn't work nicely together. Sometimes you could select a combination of filters that resulted in no data (what does single-target with 5 targets even *mean*?), or the filters filtered the filters and suddenly things disappeared (unfortunately the headaches persisted).

So the first thing we changed was how we cut up our data. We've combined the 'fight type' and 'targets' metrics, and just have one 'sim type' selection now. This removes all the above hassles and cleans up the UI, a big win in our eyes.

![filters](https://i.imgur.com/gO5RWxL.png)

We have also added helpful text to each page of ChickenDB, to just give that little bit of guidance if you're feeling lost. We know ChickenDB can be difficult to navigate the first (or tenth) time you visit, so we're fixing that. Additionally, we will be making update posts on Dreamgrove.gg much more often, so everyone's kept in the loop even if you don't check the #balance pins!

Lastly, you'll notice that all of our filters are now synced *across tabs*. If you just want to see the single-target i385 results, all you need to do is set-and-forget, and all of the tabs will update appropriately.

## Acronyms, Gearset and Help pages

We have a bit of a dilemma when it comes to acronyms and profile names -- on the one hand, each of our headline profiles (the ones on the **Main** tab) involves a specific combination of talents, inner and outer traits and so it needs a unique name, but on the other hand those names get way too long if you show the full name (like *WoE/SotF/TM/FoE, hood_of_pestilent_ichor/unstable_flames/high_noon, mantle_of_fastidious_machinations/earthlink/power_of_the_moon, honorbound_outriders_tunic/gutripper/streaking_stars*).

So we settled on acronym soup. One downside of acronym soup is that we lose some clarity around what each build represents, or even which acronym relates to what trait (looking at you, *Lunar Shrapnel Lively Spirit Lunar Strike*).

One solution we've settled on is the introduction of the **Acronyms** page. This page shows what each acronym stands for, as well as where each azerite piece comes from and its associated middle and outer traits. Unfortunately, it's a bit of a hassle swapping from the **Main** page to **Acronyms** constantly, so we're working on some better alternatives (more below in the Tooltips section!). A big thanks again for your feedback on this front.

![We made some buttons](https://i.imgur.com/ILq7wJ3.png)

We also have a page dedicated to the default gearset our profiles use (**Gearset**), as well as a general **Help!** page for some quick advice on navigating ChickenDB. Let us know what you think!

## Azerite Trait stacks

Now that we've started to flesh-out our analysis, we agree there were some things we were a little behind on -- and azerite stacks definitely falls into that category.

![Wow, I can't believe it's not Bloodmallet](https://i.imgur.com/ABoOkyw.png)

So now when you visit the **Azerite** tab, you'll find we've expanded the analysis to show trait stacks now! It really is important to show just how impactful the third trait of some builds really is (*PotM* and *HN*), as well as how strong just the first trait can be (*LM* and *AotT*).

## Tooltips

This is definitely the most exciting change we have in this update. You'll now find *detailed and targeted* tooltips on the **Main**, **Azerite** and **Gear** pages!

![These tooltips are on fire](https://i.imgur.com/vwoFNpT.png)

On the **Main** tab, mousing over any section of a build will show you the breakdown *within* that section, using full names instead of acronyms. We're excited because this addresses two key concerns: one, avoiding acronym soup, and two, showing the relative DPS of the inner and outer traits within a build without cluttering the main chart. This should hopefully remove the need to reference the **Acronyms** page entirely!

The tooltip also shows the Rank of the build (out of just over 10,000 builds), as well as the total DPS and the Azerite pieces used. All the important information you need about a build, right there in the tooltip. Wow!

![Work of art](https://i.imgur.com/boedwuN.png)

On the **Azerite** tab, mousing over a trait will show you what items have the trait, their slot and where the item comes from. If you want to target a specific trait, the tooltip has everything! No more needing to navigate all the way through azerite.info or WoWhead just to find where those *Streaking Stars* traits are hiding. We hope this much-needed quality-of-life upgrade helps you on your journey to Best Chicken OCE.

![ChickenDB dark theme when???](https://i.imgur.com/21Hv5an.png)

On the **Gear** tab, mousing over an item shows *all* the possible inner/outer trait combinations for a piece, compares them, and tells you the best combination. This is great if you don't want to sim yourself, or you just want a quick reference to see how decent that new shiny azerite piece you got is.

## Removal of Synergies page

We have decommissioned the **Synergies** page, as we didn't feel it added any useful information itself. We are still deciding what to replace it with, but we have some ideas in the works!

## Feedback

ChickenDB is a living project. We read, digest and consider all feedback on the site, and the best way to improve is by hearing it from you guys. Let Iskalla (Iskalla#0001) or myself (Slip#0001) know if you have any questions, queries, comments or concerns, we really appreciate it.

We anticipate our next round of updates will be in around a month, which will mainly be our back-end automation (so we can provide insights on a daily/weekly frequency!), as well as the first look into our WarcraftLogs integration piece.


Until next update

Slip & Iska
