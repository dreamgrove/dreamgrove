---
title: "Macros"
date: 2018-08-10
authors: ['Goosy', 'Nick']
published: true
showOnFrontpage: false
weight: 10
---

**Innervate Mouseover/Focus Macro:**

```
#showtooltip innervate
/use Innervate [@focus,exists,help][@mouseover,exists,help] Innervate
```

**Celestial Alignment/Incarn Cooldown with Troll Racial:**

```
#showtooltip
/cast [talent:5/1] Celestial Alignment; [talent:5/2] Celestial Alignment; [talent:5/3] Incarnation: Chosen of Elune
/cast Berserking
```

**Starfall Mouseover Macro:**

```
#showtooltip
/cast [@cursor] starfall
```

**Rebirth Mouseover Macro:**

```
#showtooltip
/cast [@mouseover,help,nodead][help,nodead][@player] Rebirth
```

**Tier 15 WoE/Treants:**

```
#showtooltip
/cast [talent: 1/2] Warrior of Elune
/cast [talent: 1/3] Force of Nature
```

**Tier 30 Row Macro:**

```
#showtooltip
/cast [talent:2/1] renewal
/cast [talent:2/2] displacer beast
/cast [talent:2/3] wild charge
```
