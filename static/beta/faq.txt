1. What's new?
    * Legendary & covenant changes from the August 19th build 9.0.1.35598 are included.
    * Some conduits are included. See question below.

2. What about conduits?
    * All sims include the covenant specific conduits (except for Kyrian) and the Fury of the Skies conduit at base rank.
    * The other potency conduits at current tuning contribute less than 1% and are not worth simming.
    * The Kyrian conduit can desync Kindred Spirits from other CDs so is not worth simming.

3. What about soulbinds?
    * Soulbinds are not yet fully implemented in SimC.

4. How does SimC handle Convoke the Spirits (Night Fae)?
    * SimC assumes it will cast 2 healing spells, 1 Starfall if it isn't up, 1 Moonfire if you have a target without it, then balance out the remaining between Starsurge, Wrath, and Moonfire on any further un-dotted targets.

5. How does SimC handle Kindred Spirits (Kyrian)?
    * SimC assumes that you are bonding with someone who does the exact same damage as you. The additional damage done by you AND your partner are attributed to you.

6. Are the sims updated for _____ ?
    * At the top of the HTML report, in the SimulationCraft banner, you will find the git build code.
    * Goto http://github.com/simulationcraft/simc/commits/<enter git build code here> to see all the changes to SimC that have been incorporated into the sim.

7. What are the base stats used in the sims?
    * The base profile can be found in `sandbag.txt`

8. What is the APL used in the sims?
    * The APL can be found in `balance.txt`

9. How can I run my own beta sims?
    * Instructions on creating the command line version and how to use it can be found in `how to build.txt`
    * A copy of the command line program can be found as `simc_(date).rar` but this can often be outdated.

10. How do I sim a covenant?
    * Add the line covenant=covenant_name

11. How do I sim a conduit?
    * Add the line soulbind=conduit_name:rank/conduit2_name:rank/...

12. How do I sim a legendary?
    * Legendary effects are added to gear as a bonus_id. Add the line for a tabard with the legendary effect from `leg_x_cov.txt`

13. I found a bug! Something in the sims doesn't line up with what's in game!
    * Submit an issue report with the `Bugs/Improvements/Questions` link.

14. I found improvements to the APL that leads to higher DPS!
    * Submit an issue report with the `Bugs/Improvements/Questions` link.

15. What about _____ ?
    * Submit an issue report with the `Bugs/Improvements/Questions` link.
