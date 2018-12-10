---
title: On Diminishing Returns
date: '2018-12-10'
authors: ['Faide']
published: false
hasMath: true
patch: "8.1"
---

I've seen a lot of questions surface recently about diminishing returns --- what they are, how they are (or aren't) related to damage reduction, and what stats are (or aren't) affected. Let's talk about it.

Be warned: we're doing a deep dive into the theory of diminishing returns and damage reduction. Here be ~~dragons~~ mathematics.

## What are diminishing returns?

"Diminishing returns" refers to a property of some stats where every point of a stat you add is worth less than the previous point. It's sometimes unhelpfully abbreviated as DR (not to be confused with damage reduction, a concept which is also abbreviated as DR and is often discussed simultaneously with diminishing returns which can be extremely confusing); something I will try to avoid doing in this article.

When talking about diminishing returns in World of Warcraft, we are typically referring to one of two different but related concepts by which the effects of our stats are diminished.

### Diminishing Returns from Marginal Utility

The first is the property of **diminishing marginal utility**, which is the idea that every point of a stat added to a total is less valuable *relative* to the previous point. For example: adding 1 rating when you have 100 rating to begin with is a larger marginal gain than adding 1 rating when you have 200 rating. 

{{< texblock >}}
\begin{aligned}
\frac{100 + 1}{100} = \frac{101}{100} &= 1.01 \ \text{(1\% gain)}  \\[3ex]
\frac{200 + 1}{200} = \frac{201}{200} &= 1.005 \ \text{(0.5\% gain)} 
\end{aligned}
{{< /texblock >}}

![Marginal Gain of Adding 1 Stat](/guardian/images/marginal-gains.png)

Many people understand this intuitively as "stat X gets worse the more you have of it". This is inherent in the way that WoW computes stat ratings, and all stats are affected equally by this phenomenon. 

I won't be exploring diminishing marginal utility in this article; just know that it exists, and that when discussing diminishing returns as it applies to damage reduction, it's often quietly swept under the rug because it is less relevant than the second type of diminishing returns.

### Diminishing Returns from Rating Penalty

A second use of the term diminishing returns refers to ex post facto conversions applied to some values to reduce their effectiveness from what is advertised on the tooltip. Stats such as Armor, Block, Stagger, and Dodge/Parry are all subject to a diminishing returns penalty. This is the definition of "diminishing returns" that players use most often in WoW, especially in discussions involving tanking stats, and will be the primary focus of this article.

Let's take the dodge/parry conversion, for example. For simplicity's sake I will use terms relevant to Guardian, but know that anywhere that "Dodge" is mentioned, it can be replaced with "Parry" (and "Agility" with "Strength") as the formula is the same for both.

Dodge chance gained from gear is subject to a diminishing returns penalty. The full dodge formula is longer (and not all dodge is penalized), but only this part of the equation is relevant to the current discussion.

{{< texblock >}}
effectiveDodge = \frac{dodgeFromGear}{dodgeFromGear * verticalStretch + horizontalShift}
{{< /texblock >}}

- verticalStretch is 0.01 (for Demon Hunters it's 0.02).
- horizontalShift is 1 / 0.97 for Druids (for other tanks, it's 1 / 0.94)

What this results in is a function that limits the effectiveness of stacking stats that grant Dodge (namely, Crit rating), by diminishing the amount of effective Dodge you gain from the Dodge on your gear. 

![Effects of Diminishing Returns on Dodge](/guardian/images/dodge-diminishing-returns.png)

Armor is subject to a similar penalty, except it's baked directly into the conversion from Armor rating to damage reduction (and all Armor is penalized):

{{< texblock >}}
damageReduction = \frac{armorRating}{armorRating + K}
{{< /texblock >}}

where K is a fixed constant that depends on the level your attacker and the type of content you are doing (for example, a Mythic Uldir boss has a K value of 9311.4).

![Damage Reduction from Armor against a Level 123 Attacker](/guardian/images/damage-reduction-from-armor.png)

In fact --- any stat whose conversion formula is of the shape {{< tex "f(x) = \frac{x}{Ax + C}" >}} where A and C are constant, positive numbers --- will be subject to diminishing returns, as it is the nature of this type of equation.

Stats that use this type of formula and are therefore subject to diminishing returns include:

 - Dodge/Parry
 - Armor
 - Block
 - Stagger

Notably, Versatility is *not* subject to any diminishing returns penalties. You gain the same amount of damage reduction from 1 point of Versatility rating at 90% Versatility as you do at 10% Versatility.

## How is diminishing returns related to damage reduction?

A misconception I often hear is that because stats that reduce your damage intake like Armor are subject to diminishing returns, they therefore provide less value when you already have a lot of that stat. This is partially true, but it's only half the story.

Consider for a moment what damage reduction actually implies. Suppose you currently have 0% damage reduction, and you take a hit for 100 damage. You reduce 0 of that incoming damage, and so you take the full 100 damage to the face.  Now, suppose you gain 1% damage reduction, and you take another 100 damage hit. You are now reducing 1% of that damage, and taking 99 damage. Going from 0% to 1% damage reduction has decreased the amount of damage you take by 1%. This might seem painfully obvious, but bear with me for a moment.

Now suppose you currently have 98% damage reduction. A 100 damage hit would be reduced to 2 damage. If you then gained another 1%, that 100 damage hit is now reduced by 99%, and you take 1 damage. Going from taking 2 damage to 1 damage has decreased the amount of damage you take by 50%. 

As such, **gaining 1% damage reduction is 50 times more valuable when you already have 98% damage reduction than it is when you have 0% damage reduction**. Rather than diminishing returns, damage reduction has "increasing returns" --- every percent of damage reduction you gain is more valuable than the last.

To see this more clearly, let's express it in terms of effective health. Effective health (or EHP) refers to the amount of damage required to kill you, taking into account all of your damage reductions. This is very useful for judging exactly how much impact a gain in damage reduction will have on our survivability, as we can now define it in terms of how much additional damage we can take. 

Effective health can be calculated as a function of damage reduction:

{{< texblock >}}
effectiveHealth = \frac{health}{1 - \%damageReduction}
{{< /texblock >}}

For example: if you have 100 health and 50% damage reduction, your effective health is {{< tex "\frac{100}{1 - 0.5} = 200" >}}, meaning that it would take 200 damage to kill you.

As you might imagine, going from 98% damage reduction to 99% damage reduction (in other words, reducing the damage you take by 50%) *doubles* your effective health.

{{< texblock >}}
\begin{array}{cc}
\text{98\% Reduction} & \text{99\% Reduction} \\[3ex]
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

> *When we talk about the theory of effective health, we typically consider base "health" to be 1, in order to simplify the equations.*

![Effective Health vs Damage Reduction](/guardian/images/ehp-damage-reduction.png)

As you can see, at higher levels of base damage reduction, adding additional damage reduction has a significantly higher impact than adding the same amount at a lower level of base damage reduction.

So, why does this matter? 

Recall that the Armor to damage reduction formula is {{< tex "damageReduction = \frac{armor}{armor + K}" >}}, which inherently suffers diminishing returns when expressed in terms of damage reduction. Let's try and express this in terms of effective health by substituting the Armor formula into the EHP formula.

{{< texblock >}}
\begin{aligned}
effectiveHealth &= \frac{1}{1 - damageReduction} \\[2ex]
&= \frac{1}{1 - \big(\frac{armor}{armor + K}\big)} \\[2ex]
&= \frac{1}{\big(\frac{armor + K}{armor + K}\big) - \big(\frac{armor}{armor + K}\big)} \\[2ex]
&= \frac{1}{\big(\frac{K}{armor + K}\big)} \\[3ex]
&= \frac{armor + K}{K}
\end{aligned}
{{< /texblock >}}

With a bit of arithmetic, we arrive at a slightly unintuitive (and maybe surprising) result. Since K is constant, effective health has a *linear* relationship with Armor. That is, **every point of Armor increases effective health by the same amount, regardless of how much Armor you already have**.

![Effective Health vs Armor Rating](/guardian/images/ehp-armor.png)

The same is true for Dodge/Parry, Block, and Stagger --- the proof of which I'll leave as an exercise to the reader.

## What about Versatility?

Finally, let's confirm a theory about Versatility. As I mentioned earlier, every point of Versatility rating provides the same amount of damage reduction regardless of how much Versatility you already have. We also know that every percent of damage reduction provides more effective health than the last, and so Versatility should too.

The formula for converting Versatility rating to percent damage reduction is {{< tex "damageReduction = \frac{versRating}{ratingPerPercent * 2 * 100}" >}}, where ratingPerPercent is 85 at level 120.

{{< texblock >}}
\text{let P} = ratingPerPercent * 2 * 100 \\[3ex]
\begin{aligned}
effectiveHealth &= \frac{1}{1 - damageReduction} \\[2ex]
&= \frac{1}{1 - \big(\frac{versRating }{P}\big)} \\[2ex]
&= \frac{1}{\big(\frac{P}{P}\big) - \big(\frac{versRating}{P}\big)} \\[2ex]
&= \frac{1}{\big(\frac{P - versRating}{P}\big)} \\[2ex]
&= \frac{P}{P - versRating} \\[2ex]
\end{aligned}
{{< /texblock >}}

![Effective Health vs Versatility Rating](/guardian/images/ehp-versatility-rating.png)

Thus, we can see that Versatility has increasing returns with respect to effective health. This is what we mean when we say "Versatility gets better the more you have of it."

## Conclusion

What are we to make of all this? Well, let's review what we know.

1. Stats like Block, Stagger, and Armor, have diminishing returns penalties applied to their conversion from rating to damage reduction. Dodge/Parry also has a diminishing returns penalty to its conversion from rating to Dodge/Parry chance.
2. Damage reduction increases in value the more you have of it. This is because when you have more damage reduction, adding an additional 1% of reduction is reducing a larger amount of the remaining damage. 
3. Expressing damage reduction gains in terms of effective health demonstrates that the diminishing returns penalties applied to some stats cancel out the increasing returns of damage reduction, resulting in linear gains.
4. Versatility is exceptional in that it is not subject to diminishing returns, and as such its damage reduction component will continue to increase in value as you gain more of it.
5. All stats are affected by diminishing marginal utility, which is distinct from the diminishing returns penalty that only affects particular stats.

So when someone claims that "Armor has diminishing returns", they are correct; Armor is subject to a diminishing returns penalty. However: in terms of effective health gain, every point of Armor grants the same amount of effective health as the previous, and the next. In this way, the diminishing returns penalty cancels out the increasing returns of damage reduction, resulting in a linear gain. The same is true of Dodge/Parry, Block, and Stagger.

It is also true that Armor loses value the more you have of it, but *only in the context of diminishing marginal utility*. Every point of Armor you gain is a smaller relative increase than the previous, with respect to how much Armor you already have. The same is true of not only the damage reduction stats but of every stat in the game. We tend to ignore this factor when discussing the effects of diminishing returns from *rating penalties*, because it is not a distinguishing characteristic of the system like the penalties are and serves only to confuse those who are unfamiliar with the topic. 

Hopefully this has helped clarify some of the less intuitive parts of diminishing returns, and enables you to make informed decisions about defensive stats in the future. 
