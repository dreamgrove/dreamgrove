import requests
import time
import argparse

parser = argparse.ArgumentParser()
parser.add_argument('apikey', type=str, help='raidbots apikey')
#parser.add_argument('-t', '--targets', type=int, nargs='?', default=1, const=1, help='set desired sim targets')
args = parser.parse_args()
apikey = args.apikey
#with open('apikey', 'r') as fp: apikey = fp.read()
#targets = str(args.targets)

post_url = 'https://mimiron.raidbots.com/sim'
get_url = 'https://mimiron.raidbots.com/api/job/'
report_url = 'https://mimiron.raidbots.com/simbot/report/'
clean_url = 'https://www.raidbots.com/reports/'

profile = apl = combo = sets = ""
jso = {}

with open('sandbag.txt', 'r') as fp:
    profile = fp.read()

with open('balance.txt', 'r') as fp:
    apl = fp.read()

with open('leg_x_cov.txt', 'r') as fp:
    combo = fp.read()

sets = open('talent_profiles.txt', 'r')
betabot = open('by_talent.html', 'w')
betabot.write('<html><script>function newlink(e) {if (e.target.tagName === \'A\') {parent.setTitle(e.target.textContent.substring(0, 15));}} document.addEventListener(\'click\', newlink, false);</script><style>body {margin-left:0; margin-right:0} a {color:#FF7D0A; text-decoration:none; font-family:monospace; font-size:large;}</style><body><div style=\"display: grid; grid-template-columns: repeat(5, 1fr);\"><div style=\"display:inline-block;\">\n')

for line in sets:
    if line == '\n':
        html = '</div><div style=\"display: inline-block;\">\n'
        betabot.write(html)
        continue

    splits = line.split('=', 1)
    talent = splits[-1]
    name = splits[0].split('.')[-1]
    simc = profile + '\ntarget_error=0.1\n' + talent + '\n' + apl + '\n' + 'name=' + name + '\n\n' + combo

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
                if results:
                    break
            continue
        except:
            continue

    dps_list = []
    for actor in results['sim']['players']:
        dps_list.append(actor['collected_data']['dps']['mean'])

    dps_max = max(dps_list)
    name = name.strip('\"')
    html = '<div><a href=\"' + clean_url + simID + '/index.html\">' + name + ' ' + f'{dps_max:.2f}' + '</a></div>\n'
    betabot.write(html)
    jso[name] = simID

betabot.write('</div></div></body></html>\n')
betabot.close()
sets.close()

with open('jso.js', 'w') as fp:
    fp.write('var jso =' + str(jso) + ';')
