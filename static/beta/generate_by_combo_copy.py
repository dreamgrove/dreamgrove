import requests
import time
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('apikey', type=str, help='raidbots apikey')
parser.add_argument('-t', '--targets', type=int, nargs='?', default=1, const=1, help='set desired sim targets')
args = parser.parse_args()
apikey = args.apikey
targets = str(args.targets)

post_url = 'https://mimiron.raidbots.com/sim'
get_url = 'https://mimiron.raidbots.com/api/job/'
report_url = 'https://mimiron.raidbots.com/simbot/report/'

profile = apl = sets = mplus = ""

covs = []
legs = {}

with open('leg_x_cov.txt', 'r') as fp:
    while line_ := fp.readline():
        if line_[0] == '#':
            continue
        split_ = line_.split('=')
        if split_[0] == 'covenant':
            covs.append(split_[1].strip('\"\n'))
            continue
        if line_ == '\n':
            line_1 = fp.readline()
            if line_1[0] == '#':
                continue
            key_ = line_1.split(',')[0].split('-')[-1]
            line_2 = fp.readline()
            if line_2[0] == '#':
                continue
            value_ = line_2.split('=')[-1]
            legs[key_] = int(value_)
            continue

with open('sandbag.txt', 'r') as fp:
    profile = fp.read()

with open('balance.txt', 'r') as fp:
    apl = fp.read()

with open('talent_copies.txt', 'r') as fp:
    sets = fp.read()

with open('mplus.txt', 'r') as fp:
    mplus = fp.read()

buffer = {}

for cov in covs:
    for leg, bonus in legs.items():
        name = cov + ' - ' + leg
        if args.targets == 0:
            target_str = 'target_error=0.2\n' + mplus
        else:
            target_str = 'target_error=0.1\ndesired_targets=' + targets

        simc = profile + '\ntalents=0000000\ncovenant=' + cov + '\n\ntabard=,id=31405,bonus_id=' + str(bonus) + '\n\nname=\"' + name + '\"\n\n' + target_str + '\n\n' + apl + sets

        while True:
            time.sleep(5) 

            try:
                post = requests.post(post_url, json={'type': 'advanced', 'apiKey': apikey, 'advancedInput': simc})
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
                if (status['job']['state'] == 'complete'):
                    data = requests.get(sim_url + '/data.json')
                    results = data.json()
                    break
                continue
            except:
                continue

        dps_list = {}
        for actor in results['sim']['profilesets']['results']:
            dps_list[actor['name']] = actor['mean']

        dps_max = max(dps_list, key=dps_list.get)
        name2 = cov.rjust(9,'$') + '-' + leg.ljust(7,'$')
        html = '<div><a href=\"chart.html?simid=' + simID + '\" target=\"simframe\">' + name2.replace('$', '&nbsp;') + '|' + str(dps_max).replace('_', '&nbsp;') + ' ' + f'{dps_list[dps_max]:.2f}' + '</a></div>\n'
        buffer[html] = dps_list[dps_max]

sorted_buf = sorted(buffer.items(), key=lambda x: x[1], reverse=True)

betabot = open('by_combo_' + targets + '.html', 'w')
betabot.write('<html><style>body {margin-left:0; margin-right:0} a {color:#FF7D0A; text-decoration:none; font-family:monospace; font-size:large;}</style><body>\n')

for buf in sorted_buf:
    betabot.write(buf[0])

betabot.write('</body></html>\n')
betabot.close()
