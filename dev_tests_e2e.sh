# Start docker (for CouchDB)
docker-compose up > /dev/null 2>&1 & # redirect all output away from console and stop blocking

# Run python
cd python_radio
# Use dot as alias for 'source'
. ./env/bin/activate
python3 src/main.py > /dev/null 2>&1 & # redirect all output away from console and stop blocking
python_pid=$! # Store PID of the last background process
cd ..

# Give time for everything to start up
echo "Starting tests in 10 seconds"
sleep 10

# Run tests
cd javascript_ui
yarn test:e2e:ci
cd ..

# After tests, shut down processes
kill $python_pid # Kill Python process
# docker-compose down # Bring down docker container and reset database
