import json
import os
import time


def fileParser(ext):
    if ext == '.png' or ext == '.jpg' or ext == '.jpeg':
        return 'Image'
    elif ext == '.mp4':
        return 'Video'
    else:
        return'File'

def createFileList(curdir,subdir):
    files = []
    directory = os.path.join(curdir,subdir)
    if(subdir != ''):
        files.append({"filename": "..", "filetype": 'Folder', "filedate": ""})
        for file in os.listdir(directory):
            name, ext = os.path.splitext(file)
            type = 'Folder'
            if os.path.isfile(os.path.join(directory, file)):
                type = fileParser(ext)
            date = time.ctime(os.path.getctime(os.path.join(directory, file)))
            f = {"filename": name+ext, "filetype": type, "filedate": date}
            files.append(f)
    else:
        for file in os.listdir(directory):
            name, ext = os.path.splitext(file)
            type = 'Folder'
            if os.path.isfile(os.path.join(directory, file)):
                type = fileParser(ext)
            date = time.ctime(os.path.getctime(os.path.join(directory, file)))
            f = {"filename": name+ext, "filetype": type, "filedate": date}
            files.append(f)

    return json.dumps(files, sort_keys=True, indent=4, separators=(',', ': '))
