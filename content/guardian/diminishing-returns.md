---
title: On Diminishing Returns
date: '2018-08-26'
authors: ['Faide']
published: false
hasMath: true
patch: 8.0.1
---

I've seen a lot of questions surface recently about diminishing returns --- what it is, how it is (or isn't) related to damage reduction, and what stats are and aren't affected. Let's break it down.

Be warned: we're doing a deep dive into the theory of diminishing returns and damage reduction, there will be math.

## What is diminishing returns?

Diminishing returns refers to a property of some stats where the more of a stat you add, the smaller the benefit you gain from each added point will be. Diminishing returns is sometimes unhelpfully abbreviated DR (not to be confused with damage reduction, a concept which is also abbreviated DR and is often discussed simultaneously with diminishing returns which can be extremely confusing), something I will try and avoid doing in this article.

When talking about diminishing returns in World of Warcraft, we are typically referring to one of several different but related concepts by which the effects of our stats are diminished.

### Diminishing Returns as Marginal Utility

The first is the property of **diminishing marginal utility**, which is the idea that every point of a stat added is less valuable than the previous. For example: adding 72 Crit rating (the equivalent of 1% Crit) when you have 0 rating is a larger marginal gain (going from 0% Crit to 1% Crit) than adding 72 Crit rating when you have 7056 rating (going from 98% Crit to 99% Crit). 

{{< texblock >}}
\begin{aligned}
\frac{1.01}{1.00} &> \frac{1.99}{1.98} \\ \\
1.01 &> 1.005
\end{aligned}
{{< /texblock >}}

Many people understand this intuitively as "stat X gets worse the more you have of it". When we talk about stats having diminishing returns in this manner, we are typically referring to diminishing marginal utility. Diminished marginal utility is inherent in 

### Diminishing Returns as Penalties

A second use of the term diminishing returns refers to ex post facto conversions applied to some mechanics to reduce their effectiveness from what is advertised on the tooltip. Things such as CC durations, taunt effectiveness, and dodge/parry rating to percent conversions are all examples of game mechanics which incur a diminishing returns penalty. This is the classic definition of "diminishing returns" that players use most often in WoW.

Particularly relevant to tanks is the dodge/parry conversion. For simplicity's sake I will use terms relevant to Guardian, but know that anywhere that "Dodge" is mentioned, it can be replaced with "Parry" (and "Agility" with "Strength") as the formula is the same for both.

Dodge chance gained from gear is subject to a diminishing returns penalty. The full dodge formula is longer (and not all dodge is penalized), but only this part of the equation is relevant to the current discussion.

{{< texblock >}}
effectiveDodge = \frac{dodgeFromGear}{dodgeFromGear * verticalStretch + horizontalShift}
{{< /texblock >}}

- verticalStretch is 0.01 (for Demon Hunters it's 0.02).
- horizontalShift is 1 / 0.97 for Druids (for other tanks, it's 1 / 0.94)

What this results in is a function that limits the effectiveness of stacking stats that grant Dodge (namely, Crit rating), by diminishing the amount of effective Dodge you gain from the Dodge on your gear. 

![Effects of Diminishing Returns on Dodge](/guardian/images/dodge-diminishing-returns.png)

Armor is subject to a similar penalty, except it's baked directly into the conversion from Armor rating to damage reduction:

{{< texblock >}}
damageReduction = \frac{armorRating}{armorRating + K}
{{< /texblock >}}

where K is 6300 for a level 123 attacker (the level of raid bosses).

![Damage Reduction from Armor against a Level 123 Attacker](/guardian/images/damage-reduction-from-armor.png)


## How is diminishing returns related to damage reduction?

A misconception I often hear is that stats that reduce your damage taken like Armor are subject to diminishing returns and therefore provide less value when you already have a lot of Armor. This is partially true, but it's only half the story.

Let's consider for a moment what damage reduction actually implies. Suppose you currently have 0% damage reduction from Versatility, and you take a hit for 100 damage. You reduce 0 of that incoming damage, and so you take the full 100 to the face.  Now, suppose you gain enough Versatility rating to have 1% damage reduction, and you take another 100 damage hit. You are now reducing 1% of that damage, and taking 99 damage. Going from 0% to 1% damage reduction has decreased the amount of damage you take by 1%. This might seem painfully obvious, but bear with me for a moment.

Now suppose you currently have 98% damage reduction from Versatility. A 100 damage hit would be reduced to 2 damage. If you then gained another 1% in rating, that 100 damage hit is now reduced by 99%, and you take 1 damage. Going from taking 2 damage to 1 damage is decreasing the amount of damage you take by 50%. As such, **gaining 1% Versatility is 50 times more valuable when you already have 98% Versatility than it is when you have 0% Versatility**.

Because Versatility is not subject to any diminishing returns penalties, we say the damage reduction from Versatility has "increasing returns", and this is what we mean when we say that "versatility gets better the more you have of it."

To see this more clearly, let's express it in terms of effective health. Effective health (or EHP) refers to the amount of damage required to kill you, taking into account all of your damage reductions. This is very useful for judging exactly how much impact a gain in damage reduction will have on our survivability, as we can now express it in terms of how much damage we can take. 

Effective health can be calculated as a function of damage reduction:

{{< texblock >}}
effectiveHealth = \frac{health}{1 - \%damageReduction}
{{< /texblock >}}

For example: if you have 100 health and 50% damage reduction, your effective health is {{< tex "\frac{100}{1 - 0.5} = 200" >}}, meaning that it would take 200 damage to kill you.

As you might imagine, going from 98% damage reduction to 99% damage reduction (in other words, reducing the damage you take by 50%) *doubles* your effective health.

{{< texblock >}}
\begin{array}{cc}
\text{98\%} & \text{99\%} \\[3ex]
\begin{aligned}
EHP &= \frac{health}{1 - 0.98} \\[2ex]
&= \frac{1}{0.02} \\[2ex]
&= 50
\end{aligned} &
\begin{aligned}
EHP &= \frac{health}{1 - 0.99} \\[2ex]
&= \frac{1}{0.01} \\[2ex]
&= 100
\end{aligned}
\end{array}
{{< /texblock >}}

*When we talk about the theory of effective health, we typically consider base "health" to be 1, in order to simplify the equations.*

![Effective Health vs Damage Reduction](/guardian/images/ehp-damage-reduction.png)

As you can see, at higher levels of base damage reduction, adding additional damage reduction has a significantly higher impact than adding the same amount at a lower level of base damage reduction.

So, why does this matter?

Recall 

---

- how diminishing returns interacts with damage reduction
 - percent damage reduction has inverse scaling (better the more you have of it)
 - some stats when converted to %dr have diminishing returns applied to prevent them
   from being stronger per point 
 - these two effects cancel out and we are left with linear scaling (represented as ehp), but still subject to diminishing marginal utility
 - notably, versatility does not have diminishing returns applied, so it does get stronger the more you have of it
