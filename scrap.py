#!/usr/bin/env python
# coding: utf-8
import re
import os
import sys
import json
import twint
import datetime
import pandas as pd
import nest_asyncio
from pathlib import Path
from tqdm.auto import tqdm
from os import mkdir, path
from datetime import timedelta

def name_cleaning(word):
    cleaned = re.sub('[^0-9a-zA-Zㄱ-ㅎ가-힣]', '', word)
    return cleaned

def twint_search(accountId, dirname, keyword, start, end, json_name, limit):
    
    c = twint.Config()

    c.Limit = limit
    c.Username = 'realDonaldTrump'
    # c.Search = keyword
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

def twint_loop(accountId, keyword, start, end, limit=50):
    
    dirname = './data/'+name_cleaning(accountId)
    
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
        print("account name : ", accountId)
        twint_search(accountId, dirname, keyword, start, end, json_name, limit)

if __name__ == '__main__':
    nest_asyncio.apply()
    accountId = sys.argv[1]
    Keyword = 'china'
    # twint_loop(accountId, Keyword, '2020-11-24', '2020-12-01', limit=50)        

    DATA_DIR = Path(f"./data/{name_cleaning(accountId)}") 
    json_files = [pos_json for pos_json in os.listdir(DATA_DIR) if pos_json.endswith('.json')]

    df_list= []
    for file_name in tqdm(json_files):
        temp_df = pd.read_json(DATA_DIR / file_name, lines=True)
        df_list.append(temp_df)
        
    df = pd.concat(df_list, sort=False) 
    # df[["created_at", "id", "tweet", "retweets_count"]].tail()
    result = df[["link", "created_at", "username", "tweet"]][:6].to_json(orient="records")

    print(result)
    parsed = json.loads(result)
    data = json.dumps(parsed, indent=4)
    # print (data)