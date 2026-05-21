import urllib.request
import re

url = "https://unsplash.com/photos/dubai-united-arab-emirates-november-08-2021-a-fascinating-cityscape-of-skyscrapers-in-dubai-uae-6l4BcKqypV0"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
html = urllib.request.urlopen(req).read().decode('utf-8')

match = re.search(r'<meta property="og:image" content="([^"]+)"', html)
if match:
    print(match.group(1))
else:
    print("Not found")
