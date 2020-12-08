import re
import os
import sys
import json
import pandas as pd
from pathlib import Path
from os import mkdir, path
import scrap
import datetime as dt
import model

def main():
	accountId = sys.argv[1]
    # account_list = scrap.get_following(accountId)
    # scrap.twint_loop(accountId, account_list, 20) 

	# print(accountId)

	DATA_DIR = Path(f"./data/{scrap.name_cleaning(accountId)}") 
	json_files = [pos_json for pos_json in os.listdir(DATA_DIR) if pos_json.endswith('.json')]

	df_list= []

	for file_name in json_files:
		temp_df = pd.read_json(DATA_DIR / file_name, lines=True)
		df_list.append(temp_df)

	df = pd.concat(df_list, sort=False) 
	new_df = df.sort_values(by='created_at', ascending=False)
	# cut_df = new_df.head(50)
	unclassified = new_df[["link", "created_at", "username", "tweet"]]
	# unclassified = new_df[["link", "created_at", "username", "tweet"]].to_json(orient="records")
	classified = []

	count = 0
	
	test_set, train_set = model.make_sets()
	NBclassifier = model.train(test_set, train_set)

	for index, row in unclassified.iterrows():
		if count == 20:
			break
		if model.classify(row['tweet'], NBclassifier):
			data = {}
			data['tweet'] = row['tweet']
			data['created_at'] = row['created_at'].strftime('%Y-%m-%d %H:%M:%S')
			data['link'] = row['link']
			data['username'] = row['username']
		# json_data = json.dumps(data)
	# 	# print(row)
	# 	break
			classified.append(data)
			count += 1

	# print("{test: 'test'}")
	print(classified)
	# parsed = json.loads(result)
	# data = json.dumps(parsed, indent=2)
	# print (data)
	pass

if __name__ == '__main__':
    main()
