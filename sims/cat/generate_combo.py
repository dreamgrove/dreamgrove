import requests
import time
import argparse
import json
import sys
from itertools import combinations

post_url = 'https://www.raidbots.com/sim'
get_url = 'https://www.raidbots.com/api/job/'
report_url = 'https://www.raidbots.com/simbot/report/'

parser = argparse.ArgumentParser()
parser.add_argument('apikey', type=str, help='raidbots apikey')
parser.add_argument('-t', '--targets', type=int, nargs='?', default=1, const=1, help='set desired sim targets')
parser.add_argument('-d', '--dungeon', default=False, action='store_true')
parser.add_argument('-r', '--raid', type=str, nargs='?', default='mythic', const='mythic', choices=['mythic', 'heroic', 'ptr'])
parser.add_argument('--hoa', default=False, action='store_true')
args = parser.parse_args()
targets = str(max(1, args.targets))

def is_H():
    return args.raid == 'heroic'

def is_M():
    return args.raid == 'mythic'

def is_PTR():
    return args.raid == 'ptr'

def getJSON(url):
    while(True):
        try:
            get = requests.get(url)
            status = get.json()
        except:
            time.sleep(3)
            continue
        return status

profile = apl = dungeon = ""
apl_txt = 'feral.txt'

if is_PTR():
    profile_txt = 'sandcat_ptr.txt'
    apl_txt = 'feral_ptr.txt'
elif is_H():
    profile_txt = 'sandcat_h.txt'
else:
    profile_txt = 'sandcat.txt'

with open(profile_txt, 'r') as fp:
    profile = fp.read()
with open(apl_txt, 'r') as fp:
    apl = fp.read()


if args.hoa:
    with open('hoa.txt', 'r') as fp:
        dungeon = fp.read()
else:
    with open('dungeon.txt', 'r') as fp:
        dungeon = fp.read()

talents = [
    ['PRED', 'SBT ', 'LI  '],
    ['SOTF', 'SR  ', 'INC '],
    ['SOB', 'BRS', 'PW '],
    ['MOC', 'BT ', 'FF ']
]

legendaries = {
    'draught': "neck=,id=178927,gem_id=173127,bonus_id=7086/6647/6648/6758/",
    'circle': "finger1=,id=178926,enchant_id=6164,gem_id=173127,bonus_id=7085/6758/6647/6648/6935/",
    'apex': "waist=,id=172320,gem_id=173127,bonus_id=7091/6647/6648/6935/6758/",
    'frenzy': "wrist=,id=172321,enchant_id=6222,gem_id=173127,bonus_id=7109/7194/6647/6648/6758/",
    'cateye': "finger1=,id=178926,enchant_id=6164,gem_id=173127,bonus_id=7089/6758/6647/6648/6935/",
    'symmetry': "neck=,id=178927,gem_id=173127,bonus_id=7090/6647/6648/6758/"
}

def legendaries_suffix():
    if is_H():
        return '1546'
    else:
        return '1588'

conduits = [
    'carnivorous_instinct:',
    'incessant_hunter:',
    'sudden_ambush:',
    'taste_for_blood:'
]

cov_conduit = {
    'kyrian': 'deep_allegiance:',
    'necrolord': 'evolved_swarm:',
    'night_fae': 'conflux_of_elements:',
    'venthyr': 'endless_thirst:'
}

def conduit_suffix():
    if is_H():
        return '9'
    else:
        return '13'

covenants = {
    'kyrian': {
        'pelagos': {
            'base': 'combat_meditation/better_together',
            'add': 'newfound_resolve',
            'trait': []
        },
        'kleia': {
            'base': 'spear_of_the_archon',
            'add': 'light_the_path',
            'trait': ['pointed_courage']
        },
        'mikanikos': {
            'base': 'brons_call_to_action/soulglow_spectrometer',
            'add': 'effusive_anima_accelerator',
            'trait': ['hammer_of_genesis']
        }
    },
    'necrolord': {
        'marileth': {
            'base': 'volatile_solvent',
            'add': 'kevins_oozeling',
            'trait': ['plagueys_preemptive_strike']
        },
        'emeni': {
            'base': 'lead_by_example',
            'add': 'pustule_eruption',
            'trait': ['gnashing_chompers']
        },
        'heirmir': {
            'base': 'forgeborne_reveries/carvers_eye',
            'add': 'mnemonic_equipment',
            'trait': ['heirmirs_arsenal_marrowed_gemstone']
        }
    },
    'night_fae': {
        'niya': {
            'base': 'grove_invigoration',
            'add': 'bonded_hearts',
            'trait': ['niyas_tools_burrs']
        },
        'dreamweaver': {
            'base': 'field_of_blossoms',
            'add': 'dream_delver',
            'trait': ['social_butterfly']
        },
        'korayn': {
            'base': 'wild_hunt_tactics',
            'add': 'wild_hunt_strategem',
            'trait': ['first_strike']
        }
    },
    'venthyr': {
        'nadjia': {
            'base': 'thrill_seeker',
            'add': 'fatal_flaw',
            'trait': ['exacting_preparation', 'dauntless_duelist']
        },
        'theotar': {
            'base': 'soothing_shade',
            'add': 'party_favors',
            'trait': ['refined_palate', 'wasteland_propriety']
        },
        'draven': {
            'base': '',
            'add': 'battlefield_presence',
            'trait': ['built_for_war']
        }
    }
}

if args.dungeon or args.hoa:
    target_str = dungeon
else:
    target_str = 'desired_targets=' + targets

if args.dungeon or args.hoa:
    stages = [1.2, 0.5, 0.2]
else:
    stages = [1.0, 0.3, 0.1]

buffer = []
for cov, soulbinds in covenants.items():
    cov_str = 'covenant=' + cov

    for leg, leg_str in legendaries.items():
        leg_str += legendaries_suffix()

        for soul, traits in soulbinds.items():
            sets_list = []
            name_str = 'name=' + '-'.join([cov, leg, soul])

            soulbind_master = ['born_of_the_wilds:13']
            if traits['base']:
                soulbind_master.append(traits['base'])
            if traits['add']:
                soulbind_master.append(traits['add'])

            conduits_master = conduits.copy()
            conduits_master.append(cov_conduit[cov])
            conduits_master = [c + conduit_suffix() for c in conduits_master]

            for t in traits['trait']:
                conduits_master.append(t)

            for combo in combinations(conduits_master, 3):
                cond1, cond2, cond3 = combo
                if all(set(traits['trait']) & set(subcombo) for subcombo in combinations([cond1, cond2, cond3], 2)):
                    continue

                soulbind_list = soulbind_master.copy()
                soulbind_list.append(cond1)
                soulbind_list.append(cond2)
                soulbind_list.append(cond3)
                soulbind_str = 'soulbind=' + '/'.join(soulbind_list)

                for t15, talent15 in enumerate(talents[0], 1):
                    for t40, talent40 in enumerate(talents[1], 1):
                        for t45, talent45 in enumerate(talents[2], 1):
                            for t50, talent50 in enumerate(talents[3], 1):
                                talent = str(t15) + '013' + str(t40) + str(t45) + str(t50)
                                talent_str = 'talents=' + talent

                                profile_name = '\"' + '-'.join([cond1, cond2, cond3, talent]) + '\"'
                                sets_list.append('profileset.' + profile_name + '=' + talent_str)
                                sets_list.append('profileset.' + profile_name + '+=' + soulbind_str)

            sets_str = '\n'.join(sets_list)

            simc = '\n'.join([profile, apl, leg_str, cov_str, name_str, target_str, sets_str])

            payload = {'type': 'advanced', 'apiKey': args.apikey, 'simcVersion': 'nightly','smartStages': stages, 'advancedInput': simc}

            while True:
                time.sleep(3)
                try:
                    post = requests.post(post_url, json=payload)
                except:
                    continue
                if post.status_code == 400:
                    sys.exit('Input Error. Return code {}'.format(post.status_code))
                if post.status_code == 401:
                    sys.exit('Invalid API key. Return code {}'.format(post.status_code))
                if post.status_code >= 500:
                    print('something went horribly wrong (or not). Return code {}'.format(post.status_code))
                    continue
                if post.status_code == 429:
                    print('Rate limited. Return code {}'.format(post.status_code))
                    continue
                if post.status_code == 200:
                    reply = post.json()
                    simID = reply['simId']
                    sim_url = report_url + simID
                    print(sim_url)
                    break
                print('Unknown status code. Return code {}'.format(post.status_code))
                continue

            counter = 0

            while True:
                time.sleep(3)
                status = getJSON(get_url + simID)

                if ('message' in status and status['message'] == 'No job found') or ('job' not in status):
                    counter += 1
                    if counter >= 3:
                        sys.exit("The sim got lost :( {}".format(simID))
                    continue

                if status['job']['state'] == 'complete':
                    results = getJSON(sim_url + '/data.json')
                    if 'error'in results:
                        sys.exit('Sim failed with error {}'.format(results['error']['type']))
                    if 'hasFullJson' in results['simbot'] and results['simbot']['hasFullJson']:
                        results = getJSON(sim_url + '/data.full.json')
                    break

            cov_key, leg_key, soul_key = results['sim']['players'][0]['name'].split('-')

            for actor in results['sim']['profilesets']['results']:
                cond1_key, cond2_key, cond3_key, tal_key = actor['name'].split('-')
                dps_key = actor['mean']

                buffer.append({'cov': cov_key, 'leg': leg_key, 'soul': soul_key, 'cond1': cond1_key, 'cond2': cond2_key, 'cond3': cond3_key, 'tal': tal_key, 'dps': dps_key})

json_name = 'combo_'
if is_H():
    json_name += 'h_'
elif is_PTR():
    json_name += 'ptr_'

if args.dungeon:
    json_name += 'd'
elif args.hoa:
    json_name += 'hoa'
else:
    json_name += targets

with open(json_name + '.json', 'w') as fp:
    fp.write(json.dumps(buffer).replace('},', '},\n'))
