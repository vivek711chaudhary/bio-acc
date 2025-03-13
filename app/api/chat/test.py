import requests

BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAK2qzwEAAAAA6wLe3E2%2BUWHGVxlGO%2F%2Bjj4ArClA%3D0ZfkOugIeaETELGUjYnZExPedPgHsCLK6mPiquRBK61azddd47"
TWITTER_API_URL = "https://api.twitter.com/2/tweets/search/recent"

def fetch_desc_tweets():
    headers = {"Authorization": f"Bearer {BEARER_TOKEN}"}
    params = {"query": "#DeSci OR Hetu Protocol", "max_results": 10}
    
    response = requests.get(TWITTER_API_URL, headers=headers, params=params)
    if response.status_code == 200:
        return response.json()["data"]
    else:
        return None

tweets = fetch_desc_tweets()
print(tweets)
for tweet in tweets:
    print(f"Tweet: {tweet['text']}")
