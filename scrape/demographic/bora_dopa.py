from bs4 import BeautifulSoup
import os
import requests
import time

os.chdir('./dataset')

base_url = 'https://stat.bora.dopa.go.th/new_stat'
url = base_url + '/webPage/statByMooBan.php'
reqs = requests.get(url, verify=False)
soup = BeautifulSoup(reqs.text, 'html.parser')
file_type = '.xls'
file_links = []

for link in soup.find_all('a'):
    file_sub_link = str(link.get('href')).replace("..", "")
    if file_type in file_sub_link:
        if "3_" in file_sub_link:
            file_full_link = base_url + file_sub_link
            file_links.append(file_full_link)

for file_link in file_links:
    file_name = file_link.split("/")[6]
    time.sleep(10)
    with open(file_name, 'wb') as file:
        print(f"Fetching file {file_link}")
        response = requests.get(file_link, verify=False)
        file.write(response.content)
        print(f"File {file_link} succesfully saved to {file_name}")