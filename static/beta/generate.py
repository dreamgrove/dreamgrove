import requests
import json
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
betabot = open('betabot.html', 'w')
betabot.write('<html><body><ul>\n')

for line in sets:
    splits = line.split('=', 1)
    talent = splits[-1]
    name = splits[0].split('.')[-1]
    simc = profile + '\n\n' + talent + '\n' + apl + '\n' + 'name=' + name + '\n\n' + combo

    post = requests.post(post_url, json={'type': 'advanced', 'apiKey': api, 'advancedInput': simc})
    reply = post.json()
    simID = reply['simId']

    html = '<li><a href="' + report_url + simID + '/index.html">' + name.strip('\"') + '</a></li>\n'
    print(html)
    betabot.write(html)

    while True:
        get = requests.get(get_url + simID)
        status = get.json()
        time.sleep(10)
        if (status['job']['state'] == 'complete'):
            break

betabot.write('</ul></body></html>\n')
betabot.close()
sets.close()