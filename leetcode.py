import time
from selenium import webdriver
from bs4 import BeautifulSoup
from webdriver_manager.chrome import ChromeDriverManager

driver = webdriver.Chrome(ChromeDriverManager().install())

urls = []
titles = []

for i in range(1,45,1):

    driver.get("https://leetcode.com/problemset/all/?page="+str(i))

    time.sleep(5)

    html = driver.page_source

    soup = BeautifulSoup(html, 'html.parser')

    all_ques_div = soup.findAll("a", {"class": "h-5 hover:text-primary-s dark:hover:text-dark-primary-s"})

    for ques in all_ques_div:
        urls.append("https://leetcode.com"+ques['href'])
        st = ques.text
        newstring = ''.join([i for i in st if not i.isdigit()])
        titles.append(newstring.replace(". ",""))
        if(len(urls)==6): # for now, we need only 6 samples
            break

with open("lt_url.txt", "w+") as f:
    f.write('\n'.join(urls))

with open("lt_title.txt", "w+") as f:
    f.write('\n'.join(titles))