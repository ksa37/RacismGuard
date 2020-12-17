#!/usr/bin/env python
# coding: utf-8
import re
import os
import sys
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

def twint_search(dirname, keyword, start, end, json_name, limit):
    
    c = twint.Config()

    c.Limit = limit
    #c.Username = "realDonaldTrump"
    #c.Search = keyword
    c.Since = start 
    c.Until = end
    c.Output = json_name
    c.Popular_tweets = True
    c.Store_json = True
    c.Hide_output = True
    c.Debug = True
    
twint.run.Search(c)