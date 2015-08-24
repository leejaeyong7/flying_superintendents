# Flying_Superintendents

Version control for flying superintendents web app.

# Install guide

## Prerequisites
1. Python 2.7.x
  1. Linux install -1
    * $ sudo apt-get install python
    * please note that python 2.7.x not python3 is the one that works
2. OpenCV
  1. Linux install -1
    * $ sudo apt-get install libopencv-dev python-opencv
  2. Linux install -2 (manual)
    * http://docs.opencv.org/doc/tutorials/introduction/linux_install/linux_install.html
3. Redis IO
  1. Linux install -1
    * $ sudo apt-get install redis-server
  2. Linux install -2 (manual)
    * $ wget http://download.redis.io/releases/redis-3.0.3.tar.gz
    * $ tar xzf redis-3.0.3.tar.gz
    * $ cd redis-3.0.3
    * $ make
4. MySQL
  1. Linux install -1
    * $ sudo apt-get install  mysql-server
5. Git
  1. Linux install -1
    * $ sudo apt-get install  git

 
## Installation process
1. Setup git
  * cd [destination folder]
  * git clone https://github.com/leejaeyong7/flying_superintendents.git
  * cd flying_superintendents
2. Setup mysql
  * [sudo] mysql_install_db --user=root --basedir=[install PATH] --datadir=[desired DATA PATH]
  * systemctl start mysqld.service
  * echo “create database point_cloud_server” | mysql -u root
3. Install pip
  * [sudo] apt-get install python-pip
4. Install virtualenv
  * [sudo] pip install vitrualenv
  * virtualenv venv
  * . venv/bin/activate
5. Install dependencies
  * (venv)pip install -r requirements.txt

## ETC
1. Binary files
  * login.mp4 from raamc (file size too large for git)
