# Start docker (for CouchDB)
docker-compose up & # Ensure that process does not block

# Open quasar program in new window
cd javascript_ui
yarn start & # Ensure that process does not block
cd ..

# Wait for DB to start
# sleep 5
# Create test user on DB
curl -X PUT http://localhost:5984/_users/org.couchdb.user:999 \
     -H "Accept: application/json" \
     -H "Content-Type: application/json" \
     -u admin:password \
     -d '{"name": "999", "password": "12345", "roles": [], "type": "user"}'

# Run python
cd python_radio
# Use dot as alias for 'source'
. ./env/bin/activate
python3 src/main.py

# Clear docker instance
docker-compose down