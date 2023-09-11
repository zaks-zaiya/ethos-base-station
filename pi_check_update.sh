# TODO: Might need to update git with full path to run from cron (e.g. `git` -> `/usr/local/bin/git`)

# Change to correct repository
# This is needed as it is run from cron
cd /home/pi/ethos-raspberry-pi

# Check for changes in the remote repository
git fetch

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse @{u})

# Check if there are any new changes
if [ $LOCAL != $REMOTE ]; then
    # Pull the changes
    git pull

    # Rebuild Electron app
    sh pi_build.sh

    # Restart services
    sudo systemctl restart ethos-electron-app.service
    sudo systemctl restart ethos-python-server.service
fi
