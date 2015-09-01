#! /bin/sh


######################################################################
#
#  Point Cloud server running script
#  author: Jae Yong Lee
#
######################################################################

# get script running directory
#DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

#check whether server is already running
if ps aux | grep -i point-cloud-server/venv/bin/python | grep -v grep > /dev/null
then
    echo "server is already running"
else
    echo "server is not running... starting server"
    #echo "adding path"
    #export PATH=$PATH:/home/hao/VisualSFM/vsfm/bin
    #export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/hao/VisualSFM/vsfm/bin
    . venv/bin/activate ; python run.py
fi
exit 0
