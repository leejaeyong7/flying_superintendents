from flask import Flask, render_template, request, flash, session, redirect, url_for, jsonify, send_file, Response
from flask.helpers import send_from_directory
from flask.ext.login import login_user, logout_user, current_user, login_required, fresh_login_required
from flask.ext.mail import Mail, Message
from werkzeug import secure_filename
from app import app, mail
from database import *
from login import login_manager
from app import files
from collections import OrderedDict
import json
import database
import subprocess
import os
import os.path
import files
import shutil
import time

#---------------------------------------------------------------------
#
#   
#   path traversal sub class
#
#---------------------------------------------------------------------
class pathClass:
    @staticmethod
    def addPath(pathname):
        currURL = current_user.getUserData()
        urlFile = open(currURL,'w+')
        urlFile.write(pathname)
        urlFile.close()

    @staticmethod
    def subPath():
        currURL = current_user.getUserData()
        urlFile = open(currURL,'r+')
        sub_dir = urlFile.read()
        urlFile.close()
        return sub_dir

# These are the extension that we are accepting to be uploaded
app.config['ALLOWED_EXTENSIONS'] = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif','json','mp4'])
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']
           
        
           
#---------------------------------------------------------------------
#
#   
#   login/basics
#
#---------------------------------------------------------------------
@app.route('/')
@app.route('/index')
def index():
	"""
	A function for handling requests to the index/main page.
	"""
	return render_template("login.html")


@app.route('/create-user', methods = ['POST'])
def create_user():
    email_name = request.form["inputEmail"]
    password = request.form["inputPassword"]
    db.session.add(User(email_name,password))
    db.session.commit()
    curr_dir = os.getcwd()
    curr_dir += '/app/static/user_data/' + str(email_name)
    os.makedirs(curr_dir)
    file = open(curr_dir + '/user.dat', 'w+')
    file.close()
    curr_dir += '/data/'
    os.makedirs(curr_dir)
    return render_template('request-sent.html')


@app.route('/create-firm', methods = ['POST'])
def create_firm():
    email_name = request.form["inputEmail"]
    password = request.form["inputPassword"]
    db.session.add(database.Firmtype(email_name))
    db.session.commit()
    """curr_dir = os.getcwd()
    curr_dir += '/app/static/user_data/' + str(email_name)
    os.makedirs(curr_dir)
    file = open(curr_dir + '/user.dat', 'w+')
    file.close()
    curr_dir += '/data/'
    os.makedirs(curr_dir)"""
    return 'success'


@app.route('/login', methods=['POST'])
def login():
    email_name = request.form["inputEmail"]
    password = request.form["inputPassword"]
    user = User.query.filter_by(email=email_name).first()
    if user is None:
        return redirect(url_for('index'))
    else:
        if user.check_password(password):
            login_user(user, False)
            return redirect(url_for("menu"))
        else:
            return redirect(url_for('index'))

@app.route('/change-password', methods=['POST'])
@login_required
def change_password():
    if request.method == 'POST':
        email_name = current_user.email
        oldPassword = request.form.get('oldPassword')
        newPassword = request.form.get('password')
        user = User.query.filter_by(email=email_name).first()
        if user is None:
            return redirect(url_for('index'))
        else:
            if user.check_password(oldPassword):
                user.set_password(newPassword)
                return 'success'
            else:
                return 'please type correct password'

	
	
@app.route('/request-access-page')
def request_access_page():
	"""
	A function for handling requests to the request-access page.
	"""
	return render_template("request-access.html")

@app.route('/request-access', methods=['POST'])
def request_access():
    email_name = request.form["inputEmail"]
    msg_str = request.form["inputMessage"]
    msg= Message(msg_str, sender=email_name, recipients=["sricker2@illinois.edu"])
    mail.send(msg)
    return render_template("request-sent.html")


#---------------------------------------------------------------------
#
#   
#   menu/viewer
#
#---------------------------------------------------------------------
"""
A function for handling requests to the menu page.
"""
@app.route('/menu')
@login_required
def menu():
    if current_user.is_authenticated():
        return render_template("menu.html")
    else:
        return redirect(url_for('index'))

@app.route('/viewer')
@login_required
def viewer():
    if current_user.is_authenticated():
        return render_template("viewer.html")
    else:
        return redirect(url_for('index'))

@app.route('/main')
@login_required
def main():
    if current_user.is_authenticated():
        return render_template("main.html")
    else:
        return redirect(url_for('index'))


@app.route('/account')
@login_required
def account():
    if current_user.is_authenticated():
        return render_template("account.html")
    else:
        return redirect(url_for('index'))

@app.route('/scheduler')
@login_required
def scheduler():
    if current_user.is_authenticated():
        return render_template("scheduler.html")
    else:
        return redirect(url_for('index'))
#---------------------------------------------------------------------
#
#   
#   script relateds
#
#---------------------------------------------------------------------
@app.route('/check')
@login_required
def check():
    return database.checkHash('test')

@app.route('/testdb')
@login_required
def testdb():
    if db.session.query("1").from_statement("SELECT 1").all():
        return 'It works.'
    else:
        return 'Something is broken.'

@app.route('/test')
@login_required
def test():
    print current_user.email
    return 'hi'

@app.route('/script_test')
@login_required
def script_test():
    return render_template("script_test.html")

@app.route('/run-vsfm', methods=['POST','GET'])
@login_required
def run_vsfm():
    #subprocess.call([os.getcwd()+'/scripts/run_vsfm.sh'])
    if request.method=='POST':
        folder_id = request.form.get('folder_id')
        if(folder_id==None):
            return 0
        else:
          sub_dir = pathClass.subPath() + folder_id + '/'
        vsfm_data = os.path.join(current_user.getFileDir(),sub_dir,'vsfm/vsfm.dat')
        if(not(os.path.exists(os.path.join(current_user.getFileDir(),sub_dir,'vsfm')))):
            os.makedirs(os.path.join(current_user.getFileDir(),sub_dir,'vsfm'))
        if(not(os.path.isfile(vsfm_data))):
            file = open(vsfm_data, 'w+')
            # write progress to data file
            file.write('100')
            file.close()
        else:
            file = open(vsfm_data, 'w+')
            file.write('100')
            file.close()
        file = open(vsfm_data, 'r+')
        progress = file.read()
        file.close()
        return progress

@app.route('/run-pmvs', methods=['POST','GET'])
@login_required
def run_pmvs():
    if request.method=='POST':
        folder_id = request.form.get('folder_id')
        if(folder_id==None):
            return 0
        else:
          sub_dir = pathClass.subPath() + folder_id + '/'
        #subprocess.call([os.getcwd()+'/scripts/run_pmvs.sh'])
        if(not(os.path.exists(os.path.join(current_user.getFileDir(),sub_dir,'pmvs')))):
            os.makedirs(os.path.join(current_user.getFileDir(),sub_dir,'pmvs'))
        pmvs_data = os.path.join(current_user.getFileDir(),sub_dir,'pmvs/pmvs.dat')
        if(not(os.path.isfile(pmvs_data))):
            file = open(pmvs_data, 'w+')
            file.write('100')
            file.close()
        else:
            file = open(pmvs_data, 'w+')
            file.write('100')
            file.close()
        file = open(pmvs_data, 'r+')
        progress = file.read()
        return progress

@app.route('/run-potree', methods=['POST','GET'])
@login_required
def run_potree():
    if request.method=='POST':
        folder_id = request.form.get('folder_id')
        if(folder_id==None):
            return 0
        else:
          sub_dir = pathClass.subPath() + folder_id + '/'
        #subprocess.call([os.getcwd()+'/scripts/run_potree.sh'])
        if(not(os.path.exists(os.path.join(current_user.getFileDir(),sub_dir,'potree')))):
            os.makedirs(os.path.join(current_user.getFileDir(),sub_dir,'potree'))
        potree_data = os.path.join(current_user.getFileDir(),sub_dir,'potree/potree.dat')
        if(not(os.path.isfile(potree_data))):
            file = open(potree_data, 'w+')
            file.write('100')
            file.close()
        else:
            file = open(potree_data, 'w+')
            file.write('100')
            file.close()
        file = open(potree_data, 'r+')
        progress = file.read()
        file.close();
        return progress


@app.route('/done-vsfm', methods=['POST'])
@login_required
def done_vsfm():
    if request.method=='POST':
        folder_id = request.form.get('folder_id')
        if(folder_id==None):
            sub_dir = pathClass.subPath()
        else:
          sub_dir = pathClass.subPath() + folder_id + '/'
        if(os.path.isfile(os.path.join(current_user.getFileDir(),sub_dir,'vsfm/vsfm.dat'))):
            file = open(os.path.join(current_user.getFileDir(),sub_dir,'vsfm/vsfm.dat'),'r+')
            checkVal = file.read()
            file.close()
            if(checkVal == '100'):
                return "true"
            else:
                return "false"
        else:
            return "false"

@app.route('/done-pmvs', methods=['POST'])
@login_required
def done_pmvs():
    if request.method=='POST':
        folder_id = request.form.get('folder_id')
        if(folder_id==None):
            sub_dir = pathClass.subPath()
        else:
          sub_dir = pathClass.subPath() + folder_id + '/'
        if( os.path.isfile(os.path.join(current_user.getFileDir(),sub_dir,'pmvs/pmvs.dat'))):
            file = open(os.path.join(current_user.getFileDir(),sub_dir,'pmvs/pmvs.dat'),'r+')
            checkVal = file.read()
            file.close()
            if(checkVal == '100'):
                return "true"
            else:
                return "false"
        else:
            return "false"

@app.route('/done-potree', methods=['POST'])
@login_required
def done_potree():
    if request.method=='POST':
        folder_id = request.form.get('folder_id')
        if(folder_id==None):
            sub_dir = pathClass.subPath()
        else:
          sub_dir = pathClass.subPath() + folder_id + '/'
        if(os.path.isfile(os.path.join(current_user.getFileDir(),sub_dir,'potree/potree.dat'))):
            file = open(os.path.join(current_user.getFileDir(),sub_dir,'potree/potree.dat'),'r+')
            checkVal = file.read()
            file.close()
            if(checkVal == '100'):
                return "true"
            else:
                return "false"
        else:
            return "false"

#---------------------------------------------------------------------
#
#   
#   file input/outputs helper functions
#
#---------------------------------------------------------------------
@app.route('/get-files')
@login_required
def get_files():
    if current_user.is_authenticated():
        curr_dir = current_user.getFileDir()
        sub_dir = pathClass.subPath()
        fileList = files.createFileList(curr_dir,sub_dir)
        return fileList
    else:
        return redirect(url_for('index'))

@app.route('/upload', methods=['POST'])
@login_required
def upload():
    if current_user.is_authenticated():
        if request.method=='POST':
            file = request.files.get('upload-file')
            sub_dir = pathClass.subPath()
            curr_dir = os.path.join(current_user.getFileDir(),sub_dir)
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(curr_dir, file.filename))
                name, ext = os.path.splitext(file.filename)
                filetypes = files.fileParser(ext)
                return jsonify({"filename": file.filename, "filetype": filetypes, "status":'<i class="glyphicon glyphicon-ok"></i>'})
    else:
	     return redirect(url_for('index'))       
	    
@app.route('/change-directory', methods = ['POST'])
@login_required
def change_directory(): 
    if request.method=='POST':
        newPath = request.form.get('newpath')
        if newPath == '..':
            sub_dir = pathClass.subPath()
            print sub_dir
            new_sub_dir = os.path.dirname(os.path.dirname(sub_dir))
            if new_sub_dir != '':
                new_sub_dir += '/'
                pathClass.addPath(new_sub_dir)
            else:
                pathClass.addPath(new_sub_dir)
            return new_sub_dir
        else:
            sub_dir = pathClass.subPath()
            print sub_dir
            sub_dir +=(newPath+'/')
            pathClass.addPath(sub_dir)
            return sub_dir
        

    
@app.route('/delete', methods=['POST'])
@login_required
def delete():
    if request.method=='POST':
        filesToDeleteInU = request.form.getlist('file_name')
        filesToDelete = [x.encode('UTF8') for x in filesToDeleteInU]
        for file in filesToDelete:
            sub_dir = pathClass.subPath()
            curr_dir = os.path.join(current_user.getFileDir(),sub_dir)
            filePath = os.path.join(curr_dir,file)
            if os.path.exists(filePath):
                os.remove(filePath)
        return 'success'

        
@app.route('/delete-directory', methods=['POST'])
@login_required
def delete_directory():
    if request.method=='POST':
        folderToDeleteInU = request.form.getlist('folder_name')
        folderToDelete = [x.encode('UTF8') for x in folderToDeleteInU]
        for folder in folderToDelete:
	        sub_dir = pathClass.subPath()
	        curr_dir = os.path.join(current_user.getFileDir(),sub_dir)
	        folderPath = os.path.join(curr_dir, folder)
	        if os.path.exists(folderPath):
                    shutil.rmtree(folderPath)
	        else:
	            print "no path"
        return 'success'



@app.route('/rename', methods=['POST'])
@login_required
def rename():
    if request.method=='POST':
        renameNameWE = request.form.get('rename-id')
        renameName, renameExt = os.path.splitext(renameNameWE)
        filesTorenameInU = request.form.getlist('file-name')
        filesTorename = [x.encode('UTF8') for x in filesTorenameInU]
        counter = 0;
        for file in filesTorename:
            sub_dir = pathClass.subPath()
            curr_dir = os.path.join(current_user.getFileDir(),sub_dir)
            filePath = os.path.join(curr_dir,file)
            if(counter ==0):
                newFilePath = os.path.join(curr_dir,(renameName+renameExt))
            else:
                newFilePath = os.path.join(curr_dir,(renameName+"("+str(counter)+")")+renameExt)
            if ~os.path.exists(newFilePath):
                os.rename(filePath,newFilePath)
                counter+=1
            else:
                while(os.path.exists(newFilePath)):
                    counter+=1
                    newFilePath = os.path.join(curr_dir,(renameName+"("+str(counter)+")")+renameExt)
                os.rename(filePath,newFilePath)
                counter+=1
    return "rename done"
                    
    
@app.route('/home-directory', methods=['POST'])
@login_required
def home_dir():
    if request.method=='POST':
        pathClass.addPath('')
        return 'success'
        
    
@app.route('/up-directory', methods=['POST'])
@login_required
def up_dir():
    if request.method=='POST':
        sub_dir = pathClass.subPath()
        sub_dir = os.path.dirname(os.path.dirname(sub_dir))
        if sub_dir != '':
            sub_dir += '/'
            pathClass.addPath(sub_dir)
        else:
            pathClass.addPath(sub_dir)
        return 'success'
    
    
@app.route('/current-time', methods=['GET'])
@login_required
def current_time():
    if request.method=='GET':
        return time.ctime();

    
@app.route('/username', methods=['GET'])
@login_required
def username():
    if request.method=='GET':
        return str(current_user.email)

    
@app.route('/create-directory', methods=['POST'])
@login_required
def create_directory():
    if request.method=='POST':
        new_dir = request.form.get('newfolder_id')
        sub_dir = pathClass.subPath()
        curr_dir = os.path.join(current_user.getFileDir(),sub_dir,new_dir)
        if(os.path.exists(curr_dir)):
            print "already exists"
        else:
            os.makedirs(curr_dir)
        return 'success'


@app.route('/move-files', methods = ['POST'])
@login_required
def move_dir():
    if request.method=='POST':
        new_dir = request.form.getlist('filelist')#('dataArray')
        destination = request.form.get('destination')#('dataArray')
        sub_dir = pathClass.subPath()
        destination = os.path.join(current_user.getFileDir(),sub_dir,destination)
        for files in new_dir:
            fileName = os.path.join(current_user.getFileDir(),sub_dir,files)
            shutil.move(fileName,os.path.join(destination,files))
        return 'success'
        

    """
@app.route('/get-dir', methods = ['GET'])
@login_required
def get_dir():
    return current_user.getFileDir()
"""

    

#---------------------------------------------------------------------
#
#   
#   db handling functions
#
#---------------------------------------------------------------------



@app.route('/set-db', methods = ['POST'])
@login_required
def set_db():
    if request.method == 'POST':
        js =  request.form.get('jsonDBData')
        jsonDBData = json.loads(js)
        for tableName, tableData in jsonDBData.iteritems():
            current_user.set(tableName, tableData)
    return 'success'

@app.route('/get-db', methods = ['GET'])
@login_required
def get_db():
    if request.method == 'GET':
        dbName = request.args.get('table')
        objectID = request.args.get('id')
        table = eval(dbName)
        #if dbName == "User":
            #return "failure"
        if(objectID == None):
            #print table.__table__.foreign_keys
            dbDict =  [(v.__dict__) for v in table.query.all()]
            dbTable = {dbName:{counter+1:{k:str(v) for (k,v) in dbd.iteritems()  if '_' not in k} for counter, dbd in enumerate(dbDict)}}
            return json.dumps(dbTable)
        else:
            dbData = table.query.filter_by(id= objectID).all()
            if(not dbData):
                return "failure"
            else:
                dbDict = table.query.filter_by(id= objectID).first().__dict__
            
                return json.dumps({i:dbDict[i] for i in dbDict if i[0]!='_'})

        #return jsonify(dbDict)
@app.route('/get-db-columns', methods = ['GET'])
@login_required
def get_db_columns():
    if request.method == 'GET':
        dbName = request.args.get('table')
        table = eval(dbName)
        if dbName == "User":
            return "failure"
        tableDict = OrderedDict()
        for i in table.__table__.columns:
            if i.name is not 'id':
                if i.foreign_keys:
                    for j in i.foreign_keys:
                        tableDict[j.parent.name] = j.target_fullname
                else:
                    tableDict[i.name] = str(i.type)
#        print tableDict
        return json.dumps(tableDict)
#        return "success"


@app.route('/update-db', methods = ['POST'])
@login_required
def update_db():
    if request.method == 'POST':
        current_user.update('Organization',2,dict(phoneNumber = 2177777777))
        """
        js =  request.form.get('jsonDBData')
        jsonDBData = json.loads(js)
        for tableName, tableData in jsonDBData.iteritems():
            current_user.set(tableName, tableData)
        """
    return 'success'


#---------------------------------------------------------------------
#
#   
#   etc
#
#---------------------------------------------------------------------
    
@app.route('/get-imgs', methods = ['GET'])
@login_required
def get_image_dir():    
    if request.args.get('type')== '1':
        return send_file(os.path.join(current_user.getImageDir(),'file.png'), mimetype='image/png')
    elif request.args.get('type')=='2':
        return send_file(os.path.join(current_user.getImageDir(),'folder.png'), mimetype='image/png')
    elif request.args.get('type')=='3':
        return send_file(os.path.join(current_user.getImageDir(),'video.png'), mimetype='image/png')
    elif request.args.get('type')!=None:
        sub_dir = pathClass.subPath()
        return send_file(os.path.join(current_user.getFileDir(),sub_dir,request.args.get('type')), mimetype='image')
    
@app.route('/allowed-extension', methods = ['GET'])
@login_required
def allowed_extension():
	return ', '.join(list(app.config['ALLOWED_EXTENSIONS']));
    

