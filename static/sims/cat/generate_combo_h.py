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

profile = dungeon = ""
with open('sandcat_h.txt', 'r') as fp:
    profile = fp.read()
with open('dungeon.txt', 'r') as fp:
    dungeon = fp.read()

talents = [
    ['PRED', 'SBT ', 'LI  '],
    ['SOTF', 'SR  ', 'INC '],
    ['SOB', 'BRS', 'PW '],
    ['MOC', 'BT ', 'FF ']
]
legendaries = {
    'draught':'chest=,id=172314,bonus_id=7086/6716/7193/6648/6647/1522,gems=16crit,enchant=eternal_skirmish',
    'circle':'finger2=,id=178926,bonus_id=7085/6716/7193/6648/6647/1522,gems=16crit,enchant=tenet_of_critical_strike',
    'symmetry':'hands=,id=172316,bonus_id=6716/7090/6647/6648/1517/1522',
    'apex':'waist=,id=172320,bonus_id=6716/7091/6647/6648/1517/1522,gems=16crit',
    'frenzy':'waist=,id=172320,bonus_id=6716/7109/6647/6648/1517/1522,gems=16crit',
    'cat-eye':'finger2=,id=178926,bonus_id=7089/6717/7194/6647/6648/1522,gems=16crit,enchant=tenet_of_critical_strike'
}
conduits = [
    'carnivorous_instinct:6',
    'incessant_hunter:6',
    'sudden_ambush:6',
    'taste_for_blood:6'
]
cov_conduit = {
    'kyrian':'deep_allegiance:6',
    'necrolord':'evolved_swarm:6',
    'night_fae':'conflux_of_elements:6',
    'venthyr':'endless_thirst:6'
}
covenants = {
    'kyrian':{
        'pelagos':{
            'slots':1,
            'base':'combat_meditation',
            'trait':[]
        },
        'kleia':{
            'slots':1,
            'base':'',
            'trait':[]
        }
    },
    'necrolord':{
        'marileth':{
            'slots':1,
            'base':'',
            'trait':['plagueys_preemptive_strike']
        },
        'emeni':{
            'slots':1,
            'base':'lead_by_example',
            'trait':[]
        }
    },
    'night_fae':{
        'niya':{
            'slots':1,
            'base':'grove_invigoration',
            'trait':[]
        },
        'dreamweaver':{
            'slots':2,
            'base':'field_of_blossoms',
            'trait':['social_butterfly']
        }
    },
    'venthyr':{
        'nadjia':{
            'slots':1,
            'base':'thrill_seeker',
            'trait':[]
        },
        'theotar':{
            'slots':1,
            'base':'soothing_shade',
            'trait':[]
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

            for combo in combinations(conduits_master, traits['slots']):
                cond1, *cond2 = combo

                soulbind_list = soulbind_master.copy()
                soulbind_list.append(cond1)

                if cond2:
                    cond2 = cond2[0]
                    soulbind_list.append(cond2)
                else:
                    cond2 = 'none'

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

        simc = '\n'.join([profile, leg_str, cov_str, name_str, target_str, sets_str])

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

json_name = 'combo_h_'
if args.dungeon:
    json_name += 'd'
else:
    json_name += targets

with open(json_name + '.json', 'w') as fp:
    fp.write(json.dumps(buffer).replace('},', '},\n'))
