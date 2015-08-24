#! /bin/sh
if ps aux | grep -i /home/raamac/Documents/point-cloud-server/venv/bin/python | grep -v grep > /dev/null
then
    echo "server is already running"
else
    echo "server is not running... starting server"

    echo "adding path"
    export PATH=$PATH:/home/hao/VisualSFM/vsfm/bin
    export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/home/hao/VisualSFM/vsfm/bin
    cd /home/raamac/Documents/point-cloud-server/
    . /home/raamac/Documents/point-cloud-server/venv/bin/activate ; python /home/raamac/Documents/point-cloud-server/run.py
fi
exit 0
