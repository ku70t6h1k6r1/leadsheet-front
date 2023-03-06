# -*- coding: utf-8 -*-

from flask import Flask, render_template,redirect, url_for, session, Response
import pickle

class MusicXML:
    def __init__(self, app):
        @app.route("/musicxml/test")
        def musicxml_test():
            #with open('D:/work/workspace/20220615_pkl2xml/pickled.pkl', 'rb') as f:
            #    score = pickle.load(f)
            #return render_template('music.xml')

            return Response(
                render_template("test.xml"),
                mimetype="application/xml"
            )