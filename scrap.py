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

def get_following(accountId):
    nest_asyncio.apply()

    t = twint.Config()
    t.Username = accountId
    t.Pandas = True
    t.Hide_output = True

    try:
        twint.run.Following(t)
        Following_df = twint.storage.panda.Follow_df
        following_list = Following_df.rename_axis('following').values[0][0]

    except (KeyboardInterrupt, SystemExit):
        raise

    return following_list

def twint_search(accountId, dirname, json_name, limit):
    
    c = twint.Config()

    c.Limit = limit
    c.Username = accountId
    # c.Search = keyword
    # c.Since = start 
    # c.Until = end
    c.Output = json_name
    # c.Popular_tweets = True
    c.Store_json = True
    c.Hide_output = True
    c.Debug = True
    c.Resume = f'{dirname}/save_endpoint/save_endpoint_{accountId}.txt'

    try:
        twint.run.Search(c)

    except (KeyboardInterrupt, SystemExit):
        raise

    except:
        pass
        # print(f"Problem with {accountId}.")

def twint_loop(accountId, accountList, limit):
    
    dirname = './data/'+name_cleaning(accountId)
    
    try:
        mkdir(dirname)
        mkdir(f'{dirname}/save_endpoint')
        # print("Directory" , dirname ,  "Created ")
    except FileExistsError:
        pass
        # print("Directory" , dirname ,  "already exists")
       
    # daterange = pd.date_range(start, end)
    
    # for start_date in daterange:

        # start = start_date.strftime("%Y-%m-%d")
        # end = (start_date + timedelta(days=1)).strftime("%Y-%m-%d")

    for accountId in accountList:
        json_name = accountId + ".json"
        json_name = path.join(dirname, json_name)

        # print(f'Getting {accountId} ')
        # print("account name : ", accountId)
        twint_search(accountId, dirname, json_name, limit)

if __name__ == '__main__':
    nest_asyncio.apply()
    accountId = sys.argv[1]
    
    # account_list = get_following(accountId)
    # twint_loop(accountId, account_list, 20)        

    # DATA_DIR = Path(f"./data/{name_cleaning(accountId)}") 
    # json_files = [pos_json for pos_json in os.listdir(DATA_DIR) if pos_json.endswith('.json')]

    # df_list= []

    # for file_name in json_files:
    #     temp_df = pd.read_json(DATA_DIR / file_name, lines=True)
    #     df_list.append(temp_df)

    # df = pd.concat(df_list, sort=False) 
    # new_df = df.sort_values(by='created_at', ascending=False)
    # cut_df = new_df.head(50)
    # result = cut_df[["link", "created_at", "username", "tweet"]].to_json(orient="records")

    # # print("{test: 'test'}")
    # print(result)
    # parsed = json.loads(result)
    # data = json.dumps(parsed, indent=2)
    # print (data)