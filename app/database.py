from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import UserMixin
from werkzeug import generate_password_hash, check_password_hash
from app import app
from datetime import datetime
import os
import os.path

db = SQLAlchemy(app)


class User(db.Model, UserMixin):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.String(120), unique=True)
    pwdhash = db.Column(db.String(160))

    def __init__(self, email, password):
        self.email = email.lower()
        self.set_password(password)
        db.session.commit()

    def set_password(self, password):
        self.pwdhash = generate_password_hash(password)
        db.session.commit()

    def check_password(self, password):
        return check_password_hash(self.pwdhash, password)

    def getFileDir(self):
        curr_dir = os.getcwd()
        curr_dir += '/app/static/user_data/' + str(self.email) + '/data/'
        print curr_dir
        return curr_dir

    def getUserData(self):
        curr_dir = os.getcwd()
        curr_dir += '/app/static/user_data/' + str(self.email) + '/user.dat'
        return curr_dir

    def getImageDir(self):
        curr_dir = os.getcwd()
        curr_dir += '/app/static/img/'
        return curr_dir

    def checkHash(password):
        return generate_password_hash(password)

    def set(self, tableName,tableValues):
        targetTable = eval(tableName)
        #targetTable.__init__(**tableValues)
        #target = eval(table+'.'+column)
        db.session.add(targetTable(**tableValues))
        db.session.commit()

    def getColumns(self, tableName):
        targetTable = eval(tableName)
        print targetTable.values()

class Project(db.Model):
    __tablename__ = 'project'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(120))
    userID = db.Column(db.Integer, db.ForeignKey('users.id'))
    projectAddress = db.Column(db.String(300))
    projectFaxNumber = db.Column(db.BigInteger)
    projectPhoneNumber = db.Column(db.BigInteger)
    responsibleIndividual = db.Column(db.Integer, db.ForeignKey('personnel.id'))
    users = db.relationship('User')
    personnel = db.relationship('Personnel')
    LinkToProjectInfor = db.Column(db.String(300))
    
    def __init__(self, name, userID, projectAddress, projectFaxNumber, projectPhoneNumber, responsibleIndividual, LinkToProjectInfor):
        self.name = name
        self.userID = userID
        self.projectAddress = projectAddress
        self.projectFaxNumber = projectFaxNumber
        self.projectPhoneNumber = projectPhoneNumber
        self.responsibleIndividual = responsibleIndividual
        self.LinkToProjectInfor = LinkToProjectInfor
        db.session.commit()


class Organization(db.Model):
    __tablename__ = 'organization'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(120))
    address = db.Column(db.String(120))
    phoneNumber = db.Column(db.BigInteger)
    firmtypeID = db.Column(db.Integer, db.ForeignKey('firmtype.id'))
    firmtype = db.relationship('Firmtype')

    def __init__(self, name, address, phoneNumber, firmtypeID):
        self.name = name
        self.address = address
        self.phoneNumber = phoneNumber
        self.firmtypeID = firmtypeID
        db.session.commit()

class Firmtype(db.Model):
    __tablename__ = 'firmtype'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(120))

    def __init__(self, name):
        self.name = name
        db.session.commit()

class Personnel(db.Model):
    __tablename__ = 'personnel'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(120))
    phoneNumber = db.Column(db.BigInteger)
    emailAddress = db.Column(db.String(120))
    role = db.Column(db.String(120))
    organizationID = db.Column(db.Integer, db.ForeignKey('organization.id'))
    organization = db.relationship('Organization')

    def __init__(self, name, phoneNumber, emailAddress, role, organizationID):
        self.name = name
        self.phoneNumber = phoneNumber
        self.emailAddress = emailAddress
        self.role = role
        self.organizationID = organizationID
        db.session.commit()



class Schedule(db.Model):
    __tablename__ = 'schedule'
    id = db.Column(db.Integer, primary_key = True)
    projectID = db.Column(db.Integer, db.ForeignKey('project.id'))
    project = db.relationship('Project')

    def __init__(self, projectID, task):
        self.projectID = projectID
        db.session.commit()

class Task(db.Model):
    __tablename__ = 'task'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(120))
    scheduleID = db.Column(db.Integer, db.ForeignKey('schedule.id'))
    requestor = db.Column(db.Integer, db.ForeignKey('personnel.id'))
    personCommitted = db.Column(db.Integer, db.ForeignKey('personnel.id'))
    responsibleSubs = db.Column(db.Integer, db.ForeignKey('organization.id'))
    startDate = db.Column(db.DateTime)
    endDate = db.Column(db.DateTime)
    actualStartDate = db.Column(db.DateTime)
    duration = db.Column(db.Float)
    taskPredecessor = db.Column(db.Integer, db.ForeignKey('task.id'))
    taskSuccessor = db.Column(db.Integer, db.ForeignKey('task.id'))
    taskConstraints = db.Column(db.Integer, db.ForeignKey('constraints.id'))
    taskPerformance = db.Column(db.Integer, db.ForeignKey('performance.id'))
    taskAnticipated = db.Column(db.Integer)
    taskPerformanceVariance = db.Column(db.Integer, db.ForeignKey('performanceVariance.id')) 
    taskRepeated = db.Column(db.Integer)
    elements =  db.Column(db.Integer, db.ForeignKey('objects.id'))
    organization = db.relationship('Organization')
    #personnel = db.relationship('Personnel')
    #personnel = db.relationship('Personnel')
    constraints = db.relationship('Constraints')
    constraints = db.relationship('Performance')
    performanceVariance = db.relationship('PerformanceVariance')
    objects = db.relationship('Objects')
    schedule = db.relationship('Schedule')
    #task = db.relationship('Task')
    #task = db.relationship('Task')
    def __init__(self, name, scheduleID, requestor, personCommitted, responsibleSubs, startDate, endDate, actualStartDate, duration, taskPredecessor, taskSuccessor, taskConstraints, taskPerformance, taskAnticipated, taskPerformanceVariance,taskRepeated, elements
):
        self.name = name
        self.scheduleID = scheduleID
        self.requestor = requestor
        self.personCommitted = personCommitted
        self.responsibleSubs = responsibleSubs
        self.startDate = datetime.fromtimestamp(startDate/1000.00)
        self.endDate = datetime.fromtimestamp(endDate/1000.00)
        self.actualStartDate = datetime.fromtimestamp(actualStartDate/1000.00)
        self.duration = duration
        self.taskPredecessor = taskPredecessor
        self.taskSuccessor = taskSuccessor
        self.taskConstraints = taskConstraints
        self.taskPerformance = taskPerformance
        self.taskAnticipated = taskAnticipated
        self.taskPerformanceVariance = taskPerformanceVariance
        self.taskRepeated = taskRepeated
        self.elements =  elements
        db.session.commit()

class Constraints(db.Model):
    __tablename__ = 'constraints'
    id = db.Column(db.Integer, primary_key = True)
    relatedID = db.Column(db.Integer)
    description = db.Column(db.String(1000))
    responsibleIndividual = db.Column(db.Integer, db.ForeignKey('personnel.id'))
    initiateDate = db.Column(db.DateTime) 
    promiseDate = db.Column(db.DateTime) 
    completeDate = db.Column(db.DateTime) 
    revisePromiseCompletion = db.Column(db.Integer, db.ForeignKey('promise.id'))
    constraintVariance = db.Column(db.Integer, db.ForeignKey('performanceVariance.id')) 
    Personnel = db.relationship('Personnel')
    promise = db.relationship('Promise')
    performanceVariance = db.relationship('PerformanceVariance')

    def __init__(self, relatedID,description,responsibleIndividual,initiateDate,promiseDate,completeDate,revisePromiseCompletion,constraintVariance):
        self.relatedID = relatedID
        self.description = description
        self.responsibleIndividual = responsibleIndividual
        self.initiateDate = datetime.fromtimestamp(initiateDate/1000.00)
        self.promiseDate = datetime.fromtimestamp(promiseDate/1000.00)
        self.completeDate = datetime.fromtimestamp(completeDate/1000.00)
        self.revisePromiseCompletion = revisePromiseCompletion
        self.constraintVariance = constraintVariance
        db.session.commit()


class Promise(db.Model):
    __tablename__ = 'promise'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(120))

    def __init__(self, name):
        self.name = name
        db.session.commit()

class Performance(db.Model):
    __tablename__ = 'performance'
    id = db.Column(db.Integer, primary_key = True)
    scheduleID = db.Column(db.Integer, db.ForeignKey('schedule.id'))
    ppc = db.Column(db.Float)
    taskMadeReady = db.Column(db.Float)
    maturityLevel = db.Column(db.Float)
    variance = db.Column(db.Float)
    status = db.Column(db.Integer, db.ForeignKey('taskStatus.id'))
    taskStatus = db.relationship('TaskStatus')

    def __init__(self, scheduleID, ppc, taskMadeReady, maturityLevel, variance, status):
        self.scheduleID = scheduleID
        self.ppc = ppc
        self.taskMadeReady = taskMadeReady
        self.maturityLevel = maturityLevel
        self.variance = variance
        self.status = status
        db.session.commit()

class PerformanceVariance(db.Model):
    __tablename__ = 'performanceVariance'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(120))
    def __init__(self, name):
        self.name = name
        db.session.commit()


class TaskStatus(db.Model):
    __tablename__ = 'taskStatus'
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(120))
    def __init__(self, name):
        self.name = name
        db.session.commit()

class Objects(db.Model):
    __tablename__ = 'objects'
    id = db.Column(db.Integer, primary_key = True)
    projectID = db.Column(db.Integer, db.ForeignKey('project.id'))
    name = db.Column(db.String(120))

    def __init__(self,  projectID, name):
        self.projectID = projectID
        self.name = name
        db.session.commit()

class IFCElement(db.Model):
    __tablename__ = 'ifcelement'
    id = db.Column(db.Integer, primary_key = True)
    objectsID = db.Column(db.Integer, db.ForeignKey('objects.id'))
    name = db.Column(db.String(120))
    type = db.Column(db.String(120))
    pos = db.Column(db.Float())

    def __init(self,objectsID, name, type, pos ):
        self.name = name
        self.objectsID = objectsID
        self.type = type
        self.pos = pos
        db.session.commit()

class Location(db.Model):
    __tablename__ = 'location'
    id = db.Column(db.Integer, primary_key = True)
    objectsID = db.Column(db.Integer, db.ForeignKey('objects.id'))
    name = db.Column(db.String(120))
    type = db.Column(db.String(120))
    pos = db.Column(db.Float())

    def __init(self,objectsID, name, type, pos ):
        self.name = name
        self.objectsID = objectsID
        self.type = type
        self.pos = pos
        db.session.commit()

    














