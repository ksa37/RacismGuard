import twint
c = twint.Config()

c.Limit = 50
c.Search = 'corona'
c.Since = '2020-04-23'
c.Until = '2020-04-24'
c.Output = 'covid19_sample_tweet.json'
c.Popular_tweets = True
c.Store_json = True
c.Hide_output = True

twint.run.Search(c)