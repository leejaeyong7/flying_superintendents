#!flask/bin/python
from app import app
from flask import g
from app import files

#app.run(debug = True);
app.run(host='0.0.0.0', port=5000, debug=False)
