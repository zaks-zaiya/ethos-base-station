# Setup javascript npm
cd javascript_ui
npm install
# Setup python environment
cd ../python_radio
python -m venv ./env
source ./env/bin/activate
pip3 install -r requirements.txt
# Install adafruit blinka
cd install_scripts
python raspi-blinka.py
echo Installation complete!