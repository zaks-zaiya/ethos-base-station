cd python_radio
. ./env/bin/activate
cd src
# Find and run all tests inside `tests` directory
python3 -m unittest discover tests -b
cd ../..