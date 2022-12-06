# -*- coding: utf-8 -*-

from flask import Flask, render_template,redirect, url_for, session

class Debug:
    def __init__(self, app):
        @app.route("/")
        def index():
            return redirect(url_for("user"))

        @app.route("/input")
        def input():
            return render_template('input.html')

        @app.route("/xml")
        def xml():
            return render_template('debug.html')
