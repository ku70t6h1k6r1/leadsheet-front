# -*- coding: utf-8 -*-

from flask import render_template


class UserIndex():
    def __init__(self, app):
        @app.route("/user") 
        def user():

            return render_template(
                'user/index.html'
                )