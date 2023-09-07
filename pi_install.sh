echo "Setting up JavaScript npm..."
cd javascript_ui
yarn install
cd ..

echo "Setting up Python environment..."
cd python_radio
python3 -m venv ./env
source ./env/bin/activate
pip3 install -r requirements.txt
cd ..

echo "Installing adafruit blinka..."
cd install_scripts
sudo python3 raspi-blinka.py
cd ..

echo "Installing services..."
sudo cp systemd_services/ethos-electron-app.service /etc/systemd/system/
sudo cp systemd_services/ethos-python-server.service /etc/systemd/system/

echo "Reloading systemd and enabling services..."
sudo systemctl daemon-reload
sudo systemctl enable ethos-electron-app.service
sudo systemctl enable ethos-python-server.service

echo "Setting up cron job for auto-updating..."
echo "WARNING: This will overwrite any existing cron jobs!"
# Update will occur randomly between 2-3am
echo "0 2 * * * sleep $((RANDOM % 3600)) && ~/ethos-raspberry-pi/pi_check_update.sh" > /tmp/mycron
crontab /tmp/mycron
rm /tmp/mycron

echo "Installation complete!"
