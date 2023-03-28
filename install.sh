# Setup javascript npm
cd javascript_ui
npm install
# Setup python environment
cd ../python_radio
python3 -m venv ./env
source ./env/bin/activate
pip3 install -r requirements.txt
# Install adafruit blinka
cd install_scripts
python3 raspi-blinka.py
echo Installation complete!