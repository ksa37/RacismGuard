import string
import re
import json
import urllib.request
from nltk.corpus import twitter_samples, stopwords
from nltk.tokenize import TweetTokenizer
from nltk.stem import PorterStemmer
from nltk import classify, NaiveBayesClassifier
from nltk.classify.scikitlearn import SklearnClassifier 
from sklearn.svm import SVC
from random import shuffle
from bs4 import BeautifulSoup


stopwords_english = stopwords.words('english')
stemmer = PorterStemmer()

target_url = 'http://www.rsdb.org/full'
html = urllib.request.urlopen(target_url).read()
soup = BeautifulSoup(html, 'html.parser')

table = soup.find('table')
trs = table.find_all('tr')
temp = []
for idx, tr in enumerate(trs): 
    if idx > 0:
        tds = tr.find_all('td')
        sequence = tds[0].text.strip() 
        temp.append(sequence)

pos_tweets = twitter_samples.strings('positive_tweets.json')
neg_tweets = twitter_samples.strings('negative_tweets.json') + temp

#print(len(neg_tweets))

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
 
test_set = pos_tweets_set[:1000] + neg_tweets_set[:1500]
train_set = pos_tweets_set[1000:] + neg_tweets_set[1500:]

NBclassifier = NaiveBayesClassifier.train(train_set)
NBaccuracy = classify.accuracy(NBclassifier, test_set)

SVCclassifier = SklearnClassifier(SVC())
SVCclassifier.train(train_set)
#SVCclassifier.train(train_set)
SVCaccuracy = classify.accuracy(SVCclassifier, test_set)
#print (NBaccuracy, SVCaccuracy)

custom_tweet = "ching chang chong"
custom_tweet_set = bag_of_words(custom_tweet)
#print (NBclassifier.classify(custom_tweet_set)) 

prob_result = NBclassifier.prob_classify(custom_tweet_set)
#print (prob_result) 
print (prob_result.max()) 
print (prob_result.prob("pos")) 
print (prob_result.prob("neg"))






