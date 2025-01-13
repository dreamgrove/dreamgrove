import argparse
import os

parser = argparse.ArgumentParser()
parser.add_argument('--spec', choices=['owl', 'cat', 'bear', 'tree'])
parser.add_argument('--ptr', default=False, action='store_true')
parser.add_argument('simcpath', type=str, help='path to SimC root (include \\simc)')
args = parser.parse_args()

spec_map = {
    'owl':  ['owl',  'balance.txt',     'balance_apl.inc',           'balance_ptr.txt',     'balance_apl_ptr.inc'           ],
    'cat':  ['cat',  'feral.txt',       'feral_apl.inc',             'feral_ptr.txt',       'feral_apl_ptr.inc'             ],
    'bear': ['bear', 'guardian.txt',    'guardian_apl.inc',          'guardian_ptr.txt',    'guardian_apl_ptr.inc'          ],
    'tree': ['tree', 'restoration.txt', 'restoration_druid_apl.inc', 'restoration_ptr.txt', 'restoration_druid_apl_ptr.inc' ],
}

spec_data = spec_map.get(args.spec)
if args.ptr:
    txt_file = os.path.join(spec_data[0], spec_data[3])
    inc_file = spec_data[4]
else:
    txt_file = os.path.join(spec_data[0], spec_data[1])
    inc_file = spec_data[2]

apl_lists = {}

with open(txt_file, 'r') as apl_file:
    temp_comment = ""
    for line in apl_file:
        if line.startswith('#'):
            temp_comment = line.strip('# \n')
        if line.startswith('actions'):
            apl = 'default'

            split_ = line.split('=', 1)
            pref = split_[0].rstrip('+')
            suf = split_[1].lstrip('/').rstrip('\n')

            if suf == 'flask' or suf == 'food' or suf == 'augmentation' or suf == 'snapshot_stats':
                continue

            pref_apl_ = pref.split('.')
            if len(pref_apl_) > 1:
                apl = pref_apl_[1]

            if apl not in apl_lists:
                apl_lists[apl] = []
            apl_lists[apl].append((suf, temp_comment))
            temp_comment = ""

with open(os.path.join(args.simcpath, 'engine', 'class_modules', 'apl', inc_file), 'w') as inc:
    for apl in apl_lists.keys():
        apl_var = apl
        if apl_var == 'default':
            apl_var = 'def'

        inc.write('action_priority_list_t* ' + apl_var + ' = get_action_priority_list( \"' + apl + '\" );\n')

    for apl in apl_lists.keys():
        apl_var = apl
        if apl_var == 'default':
            apl_var = 'def'

        inc.write('\n')
        for action in apl_lists[apl]:
            if action[1]:
                inc.write(apl_var + '->add_action( \"' + action[0] + '\",\"'+action[1]+'\" );\n')
            else:
                inc.write(apl_var + '->add_action( \"' + action[0] + '\" );\n')
