import requests
import time

post_url = 'https://mimiron.raidbots.com/sim'
get_url = 'https://mimiron.raidbots.com/api/job/'
report_url = 'https://mimiron.raidbots.com/simbot/report/'

profile = apl = combo = api = sets = ""

with open('apikey', 'r') as fp:
    api = fp.read()

with open('sandbag.txt', 'r') as fp:
    profile = fp.read()

with open('balance.txt', 'r') as fp:
    apl = fp.read()

with open('leg_x_cov.txt', 'r') as fp:
    combo = fp.read()

sets = open('talent_profiles.txt', 'r')
betabot = open('by_talent.html', 'w')
betabot.write('<html><body><style>a {text-decoration:none; font-family:monospace;}</style><div style=\"columns:6;\"><div style=\"display:inline-block;\">\n')

for line in sets:
    if line == '\n':
        html = '</div><div style=\"display: inline-block;\">\n'
        betabot.write(html)
        continue

    splits = line.split('=', 1)
    talent = splits[-1]
    name = splits[0].split('.')[-1]
    simc = profile + '\ntarget_error=0.1\n' + talent + '\n' + apl + '\n' + 'name=' + name + '\n\n' + combo

    post = requests.post(post_url, json={'type': 'advanced', 'apiKey': api, 'advancedInput': simc})
    reply = post.json()
    simID = reply['simId']

    sim_url = report_url + simID
    print(sim_url)

    while True:
        get = requests.get(get_url + simID)
        status = get.json()
        time.sleep(5)
        if (status['job']['state'] == 'complete'):
            break

    data = requests.get(sim_url + '/data.json')
    result = data.json()

    dps_list = []
    for actor in result['sim']['players']:
        dps_list.append(actor['collected_data']['dps']['mean'])

    dps_max = max(dps_list)
    html = '<div><a href="' + sim_url + '/index.html">' + name.strip('\"') + ' ' + f'{dps_max:.2f}' + '</a></div>\n'
    betabot.write(html)

betabot.write('</div></div></body></html>\n')
betabot.close()
sets.close()
