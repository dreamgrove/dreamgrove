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
parser.add_argument('-c', '--catweave', default=False, action='store_true')
parser.add_argument('-r', '--raid', type=str, nargs='?', default='mythic', const='mythic', choices=['mythic', 'heroic', 'ptr'])
args = parser.parse_args()
targets = str(max(1, args.targets))

def is_H():
    return args.raid == 'heroic'

def is_M():
    return args.raid == 'mythic'

def is_PTR():
    return args.raid == 'ptr'

profile_base = ven_profile = apl = ""

if is_PTR():
    profile_txt = 'sandbear_ptr.txt'
    ven_profile_txt = 'sandbear_ptr_ven.txt'
elif is_H():
    profile_txt = 'sandbear_h.txt'
    ven_profile_txt = 'sandbear_h_ven.txt'
else:
    profile_txt = 'sandbear_base.txt'
    ven_profile_txt = 'sandbear_ven.txt'

with open(profile_txt, 'r') as fp:
    profile_base = fp.read()
with open(ven_profile_txt, 'r') as fp:
    profile_ven = fp.read()
with open('guardian.txt', 'r') as fp:
    apl = fp.read()

talents = [
    ['BRA', 'BF ', 'FUR'],
    ['SOTF', 'GG  ', 'INC '],
    ['EW ', 'SURV', 'GOE'],
    ['RT ', 'TC ', 'PUL']
]

legendaries = {
    'UFR': 'legs=,id=172318,bonus_id=6716/7094/6649/6650/',
    'DoDF': 'neck=shadowghast_necklace,id=178927,gem_id=173129,bonus_id=7086/6647/6650/6758/',
    'luffa': 'back=grimveiled_cape,id=173242,bonus_id=7092/6647/6650/6758/',
    'circle': 'finger1=shadowghast_ring,id=178926,gem_id=173129,enchant_id=6164,bonus_id=7085/6647/6650/6758/',
    'legacy': 'waist=umbrahide_waistguard,id=172320,gem_id=173129,bonus_id=7095/6647/6650/6758/',
    'covenant': {
        'night_fae': 'legs=umbrahide_leggings,id=172318,bonus_id=7571/6647/6650/6758/',
        'venthyr': 'waist=umbrahide_waistguard,id=172320,gem_id=173129,bonus_id=7474/6647/6650/6758/',
        'necrolord': 'wrist=umbrahide_armguards,id=172321,gem_id=173129,bonus_id=7472/6647/6650/6758/',
        'kyrian': 'neck=shadowghast_necklace,id=178927,gem_id=173129,bonus_id=7477/6647/6650/6758/'
    }
}

def legendaries_suffix():
    if is_H():
        return '1546'
    else:
        return '1559'

conduits = [
    'savage_combatant:',
    'unchecked_aggression:'
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
        return '11'

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
            'base': '',
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

if args.dungeon:
    target_str = 'fight_style=DungeonSlice'
else:
    target_str = 'desired_targets=' + targets

if args.dungeon:
    stages = [1.2, 0.5, 0.2]
else:
    stages = [1.0, 0.3, 0.1]

buffer = []
for leg, leg_str in legendaries.items():
    # split for covenant legis
    if leg == 'covenant':
        leg_str = leg_str[cov]

    leg_str += legendaries_suffix()

    for cov, soulbinds in covenants.items():

        cov_str = 'covenant=' + cov

        profile = profile_base
        if cov == 'venthyr':
            profile = profile_ven

        if args.catweave:
            profile += '\ndruid.catweave_bear=1'

        for soul, traits in soulbinds.items():
            sets_list = []
            name_str = 'name=' + '-'.join([cov, leg, soul])

            soulbind_master = []
            if traits['base']:
                soulbind_master.append(traits['base'])
            if not is_H() and traits['add']:
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
                                talent = str(t15) + ('023' if args.catweave else '013') + str(t40) + str(t45) + str(t50)
                                talent_str = 'talents=' + talent

                                profile_name = '\"' + '-'.join([cond1, cond2, cond3, talent]) +'\"'
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

            while True:
                time.sleep(3)
                try:
                    get = requests.get(get_url + simID)
                    status = get.json()
                except:
                    continue

                if 'message' in status and status['message'] == 'No job found':
                    sys.exit("The sim got lost :(")

                if status['job']['state'] == 'complete':
                    data = requests.get(sim_url + '/data.json')
                    results = data.json()
                    if 'error'in results:
                        sys.exit('Sim failed with error {}'.format(results['error']['type']))
                    if 'hasFullJson' in results['simbot'] and results['simbot']['hasFullJson']:
                        data = requests.get(sim_url + '/data.full.json')
                        results = data.json()
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
elif args.catweave:
    json_name += 'c'
else:
    json_name += targets

with open(json_name + '.json', 'w') as fp:
    fp.write(json.dumps(buffer).replace('},', '},\n'))
