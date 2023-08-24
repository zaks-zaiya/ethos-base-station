# Start docker (for CouchDB)
docker-compose up &

# Run python
cd python_radio
# Use dot as alias for 'source'
. ./env/bin/activate
python3 src/main.py &
python_pid=$! # Store PID of the last background process
cd ..

# Serve test page
cd javascript_ui
yarn test:serve
cd ..

# After tests, shut down processes
kill $python_pid # Kill Python process
# docker-compose down # Bring down docker container and reset database
