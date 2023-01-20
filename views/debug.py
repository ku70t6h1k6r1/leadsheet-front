# -*- coding: utf-8 -*-

from musicxml.musicxml import Musicxml 
from flask import Flask, request, make_response, jsonify, render_template,redirect, url_for, session
import json


class Debug:
    def __init__(self, app):
        @app.route("/")
        def index():
            return redirect(url_for("user"))
            #return "INDEX"

        @app.route("/input")
        def input():
            return render_template('input.html')

        @app.route("/input-api", methods=['GET', 'POST'])
        def inputApi():
            score = request.form.get('score') 
            score = json.loads(score)
            Musicxml.final(score, "./test-files/test.xml")
            print(score)
            #print(type(score))
            
            #for pitch, line in enumerate(score):
            #    for beat, g in enumerate(line):
            #        if g:
            #            print(f"pitch:{pitch} beat:{beat} {g}")
            res = make_response(jsonify({"score":score }),200)
            return res

        @app.route("/xml")
        def xml():
            return render_template('debug.html')
