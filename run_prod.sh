# Open quasar program in new window
cd javascript_ui
'./dist/electron/Packaged/Ethos Heat Monitor-linux-armv7l/Ethos Heat Monitor' & # Ensure that process does not block python script
cd ..

# Run python
cd python_radio
# Use dot as alias for 'source'
. ./env/bin/activate
python3 src/main.py production