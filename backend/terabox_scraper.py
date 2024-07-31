from bs4 import BeautifulSoup
import requests
import time


# email: justinebanks580@gmail.com -> L+TdusEhLam6GRhloKoJRWDKIbnokG3eo+SAqoHF58+ZEPoFZSlm7/mrVnriwuNRKUpCWEqK0g7tGGRCUNMLxE7gB692npOgjuwxwuvaVTg=
# pwd  : L*V*L*R*4*5*              -> xYEp7yxLdZ53aMseTKX2X2cZQcB2dXWuztyex0bxkhQK1Xa1eSEQGz4-Wl6khQd_NHUugvNPSP3H7VnvJPOQuUFMt__-_W6R5IRERBISP0FFCYLNankxhTfB-8yUoN1jnW6PuY1Gkgr-0IdR8jUzleb-nPAQviY4Pfn0YQPmBc=

terabox_url = "https://www.terabox.com/main?category=all"
web_page = requests.get(terabox_url)

soup = BeautifulSoup(web_page.text, "html.parser")


images = soup.find_all("img") # class_="u-image__inner"

print(web_page.url)