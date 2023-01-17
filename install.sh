# Setup javascript npm
cd javascript_ui
npm install
# Setup python environment
cd ../python_radio
python -m venv ./env
source ./env/bin/activate
pip3 install -r requirements.txt
echo Installation complete!