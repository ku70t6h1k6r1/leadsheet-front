# -*- coding: utf-8 -*-
from flask import Flask, render_template,redirect, url_for, request, make_response, jsonify, flash, session, Blueprint, send_file
from flask_bootstrap import Bootstrap
#from flask_cors import CORS, cross_origin

from models import app
import os


app.config['SECRET_KEY'] = os.urandom(24)
app.config['DEBUG'] = True


from views.debug import Debug
from views.musicxml import MusicXML
from views.user.index import UserIndex



bootstrap = Bootstrap(app)
#CORS(app, resources={r"/*": {"origins": "*"}}) 


Debug(app)
MusicXML(app)
UserIndex(app)

if __name__ == "__main__":
    app.run() #port=4005