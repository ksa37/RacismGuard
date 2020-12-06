#!/usr/bin/env python
# coding: utf-8

# In[1]:


get_ipython().system('pip install --user --upgrade git+https://github.com/twintproject/twint.git@origin/master#egg=twint')
get_ipython().system('pip install nest_asyncio    ')


# In[41]:


import twint
import pandas as pd
import nest_asyncio
import os
from os import mkdir, path
import datetime
from datetime import timedelta
import re
from pathlib import Path
from tqdm.auto import tqdm



nest_asyncio.apply()

def name_cleaning(word):
    cleaned = re.sub('[^0-9a-zA-Zㄱ-ㅎ가-힣]', '', word)
    return cleaned

def twint_search(dirname, keyword, start, end, json_name, limit):
    
    c = twint.Config()

    c.Limit = limit
    c.Username = "realDonaldTrump"
    c.Search = keyword
    c.Since = start 
    c.Until = end
    c.Output = json_name
    c.Popular_tweets = True
    c.Store_json = True
    c.Hide_output = True
    c.Debug = True
    c.Resume = f'{dirname}/save_endpoint/save_endpoint_{start}.txt'

    try:
        twint.run.Search(c)
    
    except (KeyboardInterrupt, SystemExit):
        raise

    except:
        print(f"Problem with {start}.")

def twint_loop(keyword, start, end, limit=50):
    
    dirname = name_cleaning(keyword)
    
    try:
        mkdir(dirname)
        mkdir(f'{dirname}/save_endpoint')
        print("Directory" , dirname ,  "Created ")
    except FileExistsError:
        print("Directory" , dirname ,  "already exists")
       
    daterange = pd.date_range(start, end)
    
    for start_date in daterange:

        start = start_date.strftime("%Y-%m-%d")
        end = (start_date + timedelta(days=1)).strftime("%Y-%m-%d")

        json_name = "".join(start.split("-")) + ".json"
        json_name = path.join(dirname, json_name)

        print(f'Getting {start} ')
        twint_search(dirname, keyword, start, end, json_name, limit)

Keyword = 'china'
twint_loop(Keyword, '2020-11-24', '2020-12-01', limit=50)        

DATA_DIR = Path(f"./{name_cleaning(Keyword)}") 
json_files = [pos_json for pos_json in os.listdir(DATA_DIR) if pos_json.endswith('.json')]

df_list= []
for file_name in tqdm(json_files):
    temp_df = pd.read_json(DATA_DIR / file_name, lines=True)
    df_list.append(temp_df)
    
df = pd.concat(df_list, sort=False)
df[["created_at", "id", "tweet", "retweets_count"]].tail()

#df = pd.read_json('sample.json', lines=True)
#df[["created_at", "id", "tweet", "retweets_count"]].head()


# In[54]:


import string
import re
from nltk.corpus import twitter_samples, stopwords
from nltk.tokenize import TweetTokenizer
from nltk.stem import PorterStemmer
from nltk import classify, NaiveBayesClassifier
from nltk.classify.scikitlearn import SklearnClassifier 
from sklearn.svm import SVC
from random import shuffle

stopwords_english = stopwords.words('english')
stemmer = PorterStemmer()

pos_tweets = twitter_samples.strings('positive_tweets.json')
neg_tweets = twitter_samples.strings('negative_tweets.json')
all_tweets = twitter_samples.strings('tweets.20150430-223406.json')

emoticons = set([
    ':L', ':-/', '>:/', ':S', '>:[', ':@', ':-(', ':[', ':-||', '=L', ':<',
    ':-[', ':-<', '=\\', '=/', '>:(', ':(', '>.<', ":'-(", ":'(", ':\\', ':-c',
    ':c', ':{', '>:\\', ';(',':-)', ':)', ';)', ':o)', ':]', ':3', ':c)', ':>', '=]', '8)', '=)', ':}',
    ':^)', ':-D', ':D', '8-D', '8D', 'x-D', 'xD', 'X-D', 'XD', '=-D', '=D',
    '=-3', '=3', ':-))', ":'-)", ":')", ':*', ':^*', '>:P', ':-P', ':P', 'X-P',
    'x-p', 'xp', 'XP', ':-p', ':p', '=p', ':-b', ':b', '>:)', '>;)', '>:-)',
    '<3'
    ])
 
def clean_tweets(tweet):
   
    tweet = re.sub(r'\$\w*', '', tweet)
    tweet = re.sub(r'^RT[\s]+', '', tweet)
    tweet = re.sub(r'https?:\/\/.*[\r\n]*', '', tweet)
    tweet = re.sub(r'#', '', tweet)

    tokenizer = TweetTokenizer(preserve_case=False, strip_handles=True, reduce_len=True)
    tweet_tokens = tokenizer.tokenize(tweet)
 
    tweets_clean = []    
    for word in tweet_tokens:
        if (word not in stopwords_english and 
              word not in emoticons and 
                word not in string.punctuation): 
            stem_word = stemmer.stem(word) 
            tweets_clean.append(stem_word)
 
    return tweets_clean

def bag_of_words(tweet):
    words = clean_tweets(tweet)
    words_dictionary = dict([word, True] for word in words)    
    return words_dictionary

pos_tweets_set = []
for tweet in pos_tweets:
    pos_tweets_set.append((bag_of_words(tweet), 'pos')) 

neg_tweets_set = []
for tweet in neg_tweets:
    neg_tweets_set.append((bag_of_words(tweet), 'neg'))    

shuffle(pos_tweets_set)
shuffle(neg_tweets_set)
 
test_set = pos_tweets_set[:1000] + neg_tweets_set[:1000]
train_set = pos_tweets_set[1000:] + neg_tweets_set[1000:]

NBclassifier = NaiveBayesClassifier.train(train_set)
NBaccuracy = classify.accuracy(NBclassifier, test_set)

SVCclassifier = SklearnClassifier(SVC())
SVCclassifier.train(train_set)
#SVCclassifier.train(train_set)
SVCaccuracy = classify.accuracy(SVCclassifier, test_set)
print (NBaccuracy, SVCaccuracy)

custom_tweet = "ching chang chong"
custom_tweet_set = bag_of_words(custom_tweet)
print (NBclassifier.classify(custom_tweet_set)) 

prob_result = NBclassifier.prob_classify(custom_tweet_set)
print (prob_result) 
print (prob_result.max()) 
print (prob_result.prob("pos")) 
print (prob_result.prob("neg"))


# In[55]:


from bs4 import BeautifulSoup
import urllib.request
target_url = 'http://www.rsdb.org/full'
html = urllib.request.urlopen(target_url).read()
soup = BeautifulSoup(html, 'html.parser')
print(soup)


# In[ ]:




