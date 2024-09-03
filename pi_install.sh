echo "Setting up JavaScript npm..."
cd javascript_ui
yarn install
cd ..

echo "Setting up Python environment..."
cd python_radio
python3 -m venv ./env
# Use dot as alias for 'source'
. ./env/bin/activate
sudo pip3 install -r requirements.txt

echo "Installing adafruit blinka..."
cd install_scripts
sudo python3 raspi-blinka.py

cd ../..

sh pi_setup.sh

echo "Installation complete!"
