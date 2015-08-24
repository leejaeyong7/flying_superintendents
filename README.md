# Flying_Superintendents

Version control for flying superintendents web app.

# Install guide

## Prerequisites
1. Python 2.7.x
  1. Linux install -1
    * $ sudo apt-get install python
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
1. Setup mysql
  * echo “create database point_cloud_server” | mysql -u root
2. Install pip
  * [sudo] easy_install pip
3. Install virtualenv
  * [sudo] pip install vitrualenv
  * cd [destination folder]
  * virtualenv venv
  * . venv/bin/activate
4. Setup git
  * git clone https://github.com/leejaeyong7/flying_superintendents.git

## ETC
1. Binary files
  * login.mp4 from raamc (file size too large for git)
