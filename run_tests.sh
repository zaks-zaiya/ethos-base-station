# RUN JS TESTS
cd javascript_ui
echo "-----\nTesting Javascript UI:\n-----"
npm run test:unit:ci
cd ..

# RUN PYTHON TESTS
cd python_radio
. ./env/bin/activate
cd src
# Find and run all tests inside `tests` directory
echo "-----\nTesting Python Radio Module:\n-----"
python3 -m unittest discover tests -b
cd ../..