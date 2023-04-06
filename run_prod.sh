# Open quasar program in new window
cd javascript_ui
npm run build & # Ensure that process does not block python script
'./dist/electron/Packaged/Ethos Heat Monitor-linux-armv7l/Ethos Heat Monitor'
cd ..

# Run python
cd python_radio
source ./env/bin/activate
python3 src/main.py