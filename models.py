# -*- coding: utf-8 -*-
import os
from flask import Flask
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
load_dotenv(override=True)


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://{}:{}@{}:{}/{}?charset=utf8mb4'.format(
    os.getenv('SQLUSER'), 
    os.getenv('SQLPASS'),
    os.getenv('SQLURL'),
    os.getenv('SQLPORT'), 
    os.getenv('SQLSCHEMA')
    )
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model):
    user_id = db.Column(db.String(50),  nullable=False, primary_key=True, autoincrement=False)
    user_name = db.Column(db.String(20), nullable=False, unique=True)
    user_email = db.Column(db.String(10), nullable=False, unique=True)
    user_password = db.Column(db.String(50), nullable=False)
    user_createAt = db.Column(db.DateTime, nullable=False)
    user_updateAt = db.Column(db.DateTime, nullable=False)

class Score(db.Model):
    score_id = db.Column(db.String(50),  nullable=False, primary_key=True, autoincrement=False)
    score_name = db.Column(db.String(100), nullable=False)
    score_status = db.Column(db.String(50), nullable=False)
    score_info = db.Column(db.Text, nullable=False)
    score_info_version = db.Column(db.Integer,  nullable=False)
    score_createAt = db.Column(db.DateTime, nullable=False)
    score_updateAt = db.Column(db.DateTime, nullable=False)

class Score_info(db.Model):
    score_info_version = db.Column(db.Integer,  nullable=False, primary_key=True, autoincrement=True)
    score_info_template = db.Column(db.Text, nullable=False)

class Score_status(db.Model):
    score_status = db.Column(db.String(50),  nullable=False, primary_key=True, autoincrement=False)
    score_status_name = db.Column(db.String(100), nullable=False)

class Score_branch(db.Model):
    score_id = db.Column(db.String(50),  nullable=False, primary_key=True, autoincrement=False)
    score_id_pre = db.Column(db.String(50),  nullable=True)

class Score_like(db.Model):
    score_like_id = db.Column(db.Integer,  nullable=False, primary_key=True, autoincrement=True)
    score_id = db.Column(db.String(50),  nullable=False)
    user_id = db.Column(db.String(50), nullable=False)
    score_like_createAt = db.Column(db.DateTime, nullable=False)


class Collection(db.Model):
    collection_id = db.Column(db.String(50),  nullable=False, primary_key=True, autoincrement=False)
    collection_name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.String(50), nullable=False)
    collection_status = db.Column(db.String(50), nullable=False)
    collection_createAt = db.Column(db.DateTime, nullable=False)
    collection_updateAt = db.Column(db.DateTime, nullable=False)


class Collection_status(db.Model):
    collection_status = db.Column(db.String(50),  nullable=False, primary_key=True, autoincrement=False)
    collection_status_name = db.Column(db.String(100), nullable=False)