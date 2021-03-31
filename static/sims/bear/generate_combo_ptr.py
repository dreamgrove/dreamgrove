import requests
import time
import argparse
import json
from itertools import combinations

post_url = 'https://www.raidbots.com/sim'
get_url = 'https://www.raidbots.com/api/job/'
report_url = 'https://www.raidbots.com/simbot/report/'

parser = argparse.ArgumentParser()
parser.add_argument('apikey', type=str, help='raidbots apikey')
parser.add_argument('-t', '--targets', type=int, nargs='?', default=1, const=1, help='set desired sim targets')
parser.add_argument('-d', '--dungeon', default=False, action='store_true')
args = parser.parse_args()
targets = str(max(1, args.targets))

profile = apl = dungeon = ""
with open('sandbear_ptr.txt', 'r') as fp:
    profile = fp.read()
with open('guardian.txt', 'r') as fp:
    apl = fp.read()
with open('dungeon.txt', 'r') as fp:
    dungeon = fp.read()

talents = [
    ['BRA', 'BF ', 'FUR'],
    ['SOTF', 'GG  ', 'INC '],
    ['EW ', 'SURV', 'GOE'],
    ['RT ', 'TC ', 'PUL']
]
legendaries = {
    'lycaras': 'waist=,id=172320,bonus_id=7110/6716/7194/6649/6650/1487,gems=16vers',
    'circle': 'finger1=,id=178926,bonus_id=7085/6716/7193/6649/6650/1487,gems=16vers,enchant=tenet_of_versatility',
    'UFR': 'legs=,id=172318,bonus_id=6716/1487/7094/6649/6650',
    'luffa': 'chest=,id=172314,bonus_id=7092/6716/6649/6650/1487,enchant=eternal_stats',
    'legacy': 'feet=,id=172315,bonus_id=7095/6716/6649/6650/1487,enchant=eternal_agility',
    'DoDF': 'chest=,id=172314,bonus_id=7086/6716/6649/6650/1487,enchant=eternal_stats'
}
conduits = [
    'savage_combatant:7',
    'unchecked_aggression:7'
]
cov_conduit = {
    'kyrian':'deep_allegiance:7',
    'necrolord':'evolved_swarm:7',
    'night_fae':'conflux_of_elements:7',
    'venthyr':'endless_thirst:7'
}
covenants = {
    'kyrian':{
        'pelagos':{
            'base':'combat_meditation',
            'trait':[]
        },
        'kleia':{
            'base':'',
            'trait':['pointed_courage']
        },
        'mikanikos':{
            'base':'brons_call_to_action',
            'trait':['hammer_of_genesis']
        }
    },
    'necrolord':{
        'marileth':{
            'base':'',
            'trait':['plagueys_preemptive_strike']
        },
        'emeni':{
            'base':'lead_by_example',
            'trait':['gnashing_chompers']
        },
        'heirmir':{
            'base':'forgeborne_reveries',
            'trait':['heirmirs_arsenal_marrowed_gemstone']
        }
    },
    'night_fae':{
        'niya':{
            'base':'grove_invigoration',
            'trait':['niyas_tools_burrs']
        },
        'dreamweaver':{
            'base':'field_of_blossoms',
            'trait':['social_butterfly']
        },
        'korayn':{
            'base':'wild_hunt_tactics',
            'trait':['first_strike']
        }
    },
    'venthyr':{
        'nadjia':{
            'base':'thrill_seeker',
            'trait':['exacting_preparation', 'dauntless_duelist']
        },
        'theotar':{
            'base':'soothing_shade',
            'trait':['refined_palate', 'wasteland_propriety']
        },
        'draven':{
            'base':'',
            'trait':['built_for_war']
        }
    }
}

if args.dungeon:
    target_str = dungeon
else:
    target_str = 'desired_targets=' + targets

buffer = []

for leg, leg_str in legendaries.items():

    for cov, soulbinds in covenants.items():
        cov_str = 'covenant=' + cov

        name_str = 'name=' + '-'.join([cov, leg])
        sets_list = []

        for soul, traits in soulbinds.items():
            soulbind_master = []
            if traits['base']:
                soulbind_master.append(traits['base'])
            conduits_master = conduits.copy()
            conduits_master.append(cov_conduit[cov])
            for t in traits['trait']:
                conduits_master.append(t)

            for combo in combinations(conduits_master, 2):
                cond1, cond2 = combo
                if cond1 in traits['trait'] and cond2 in traits['trait']:
                    continue

                soulbind_list = soulbind_master.copy()
                soulbind_list.append(cond1)
                soulbind_list.append(cond2)
                soulbind_str = 'soulbind=' + '/'.join(soulbind_list)

                for t15, talent15 in enumerate(talents[0], 1):
                    for t40, talent40 in enumerate(talents[1], 1):
                        for t45, talent45 in enumerate(talents[2], 1):
                            for t50, talent50 in enumerate(talents[3], 1):
                                talent = str(t15) + '013' + str(t40) + str(t45) + str(t50)
                                talent_str = 'talents=' + talent

                                profile_name = '\"' + '-'.join([soul, cond1, cond2, talent]) +'\"'
                                sets_list.append('profileset.' + profile_name + '=' + talent_str)
                                sets_list.append('profileset.' + profile_name + '+=' + soulbind_str)

        sets_str = '\n'.join(sets_list)

        simc = '\n'.join([profile, apl, leg_str, cov_str, name_str, target_str, sets_str])

        while True:
            time.sleep(2)
            try:
                post = requests.post(post_url, json={'type': 'advanced', 'apiKey': args.apikey, 'simcVersion': 'nightly', 'advancedInput': simc})
                reply = post.json()
                simID = reply['simId']
                sim_url = report_url + simID
                print(sim_url)
                break
            except:
                continue

        while True:
            time.sleep(5)
            try:
                get = requests.get(get_url + simID)
                status = get.json()
                if status['job']['state'] == 'complete':
                    data = requests.get(sim_url + '/data.json')
                    results = data.json()
                    if results['simbot']['hasFullJson']:
                        data = requests.get(sim_url + '/data.full.json')
                        results = data.json()
                    break
                continue
            except:
                continue

        cov_key, leg_key = results['sim']['players'][0]['name'].split('-')

        for actor in results['sim']['profilesets']['results']:
            soul_key, cond1_key, cond2_key, tal_key = actor['name'].split('-')
            dps_key = actor['mean']

            buffer.append({'cov':cov_key, 'leg':leg_key, 'soul':soul_key, 'cond1':cond1_key, 'cond2':cond2_key, 'tal':tal_key, 'dps':dps_key})

json_name = 'combo_'
if args.dungeon:
    json_name += 'd'
else:
    json_name += targets

with open(json_name + '.json', 'w') as fp:
    fp.write(json.dumps(buffer).replace('},', '},\n'))
