# Open quasar program in new window
cd javascript_ui
npm start & # Ensure that process does not block python script
cd ..

# Run python
cd python_radio
source ./env/bin/activate
python3 src/main.py