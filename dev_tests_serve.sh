# Start docker (for CouchDB)
docker-compose up &

# Run python
cd python_radio
# Use dot as alias for 'source'
. ./env/bin/activate
python3 src/main.py &
python_pid=$! # Store PID of the last background process
cd ..

# Wait for DB to start
# sleep 5
# Create test user on DB
curl -X PUT http://localhost:5984/_users/org.couchdb.user:999 \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -u admin:password \
     -d '{"name": "999", "password": "12345", "roles": [], "type": "user"}'

# Serve test page
cd javascript_ui
yarn test:serve
cd ..

# After tests, shut down processes
kill $python_pid # Kill Python process
docker-compose down # Bring down docker container and reset database
