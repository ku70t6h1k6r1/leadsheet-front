# -*- coding: utf-8 -*-
from models import db
from models import User
from models import Score, Score_info, Score_status, Score_branch, Score_like
from models import Collection, Collection_status
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
import pickle
load_dotenv(override=True)

class Migrations:
    def reset_db(self):
        print(os.getenv('SQLURL'))
        print("バックアップしましたか？本番環境では必ずしてください。(yes/no)")
        input_db = input()
        print(input_db)
        if input_db == "yes":      
            db.drop_all()
            db.create_all()
            print("done")
            return True
        else:
            print("No Acttion")
            return False

    def dump_all_tables(self):
        us = User.query.all()
        ss = Score.query.all()
        sis = Score_info.query.all()
        sss = Score_status.query.all()
        sbs = Score_branch.query.all()
        sls = Score_like.query.all()
        cs = Collection.query.all()
        css = Collection_status.query.all()


        db_data = {
            "User" : us,
            "Score" : ss,
            "Score_info" : sis,
            "Score_status" : sss,
            "Score_branch" : sbs,
            "Score_like" : sls,
            "Collection" : cs, 
            "Collection_status" : css
        }

        #DUMPED
        dt_str = datetime.now().strftime("%Y%m%d_%H%M%S")
        pkl_path = "./db_bk/db_all_{}.pkl".format(dt_str)
        with open(pkl_path, 'wb') as f:
            pickle.dump(db_data, f)

if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(description='MIGRATIONS')
    parser.add_argument('-m', '--mode', type=str, default='test')
    parser.add_argument('-p', '--pkl', type=str, default='')
    parser.add_argument('-d', '--data', type=str, default='')
    args = parser.parse_args()

    migObj = Migrations()
    if args.mode == "reset":
        migObj.reset_db()