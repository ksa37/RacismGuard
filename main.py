import re
import os
import sys
import json
import pandas as pd
from pathlib import Path
from os import mkdir, path
import scrap
import model

def main():
	accountId = sys.argv[1]
    # account_list = scrap.get_following(accountId)
    # scrap.twint_loop(accountId, account_list, 20) 

	print(accountId)

    DATA_DIR = Path(f"./data/{name_cleaning(accountId)}") 
    json_files = [pos_json for pos_json in os.listdir(DATA_DIR) if pos_json.endswith('.json')]

    df_list= []

    for file_name in json_files:
        temp_df = pd.read_json(DATA_DIR / file_name, lines=True)
        df_list.append(temp_df)

    df = pd.concat(df_list, sort=False) 
    new_df = df.sort_values(by='created_at', ascending=False)
    cut_df = new_df.head(50)
    result = cut_df[["link", "created_at", "username", "tweet"]].to_json(orient="records")

    # print("{test: 'test'}")
    # print(result)
    parsed = json.loads(result)
    data = json.dumps(parsed, indent=2)
    # print (data)
	pass

if __name__ == '__main__':
    main()
