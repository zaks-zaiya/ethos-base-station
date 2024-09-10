# Start docker (for CouchDB)
# Use `start_docker silent` to 'mute' terminal output
start_docker() {
    if [ "$1" = "silent" ]; then
        docker-compose up > /dev/null 2>&1 &
    else
        docker-compose up &
    fi
}

# Function to wait for CouchDB to start
wait_for_couchdb() {
    for _ in {1..15}; do # Try for 15 seconds
        if curl -s -u admin:password http://localhost:5984/ >/dev/null; then
            return 0
        fi
        sleep 1
    done
    echo "CouchDB did not start in time"
    exit 1
}

# Create test user on DB
create_test_user() {
    curl -X PUT http://localhost:5984/_users/org.couchdb.user:999 \
         -H "Accept: application/json" \
         -H "Content-Type: application/json" \
         -u admin:password \
         -d '{"name": "999", "password": "12345", "roles": [], "type": "user"}'
}

# Function to check if user database exists
wait_for_user_db() {
    local db_name="userdb-393939"
    echo "Waiting for database $db_name to be set up..."
    for _ in {1..15}; do
        if curl -s -u admin:password http://localhost:5984/_all_dbs | grep -q "\"$db_name\""; then
            echo "Database $db_name is ready."
            return 0
        fi
        sleep 1
    done
    echo "Database $db_name did not become ready in time."
    exit 1
}

# Setup a view on CouchDB to return info about:
# Average humidity
# Average core temp delta
# Min temperature
# Max temperature
create_sensor_view() {
    local db_name="userdb-393939"
    curl -X PUT http://localhost:5984/$db_name/_design/sensor_view \
         -H "Accept: application/json" \
         -H "Content-Type: application/json" \
         -u admin:password \
         -d '{
             "views": {
                 "daily_aggregates": {
                     "map": "function (doc) { if (doc.type === '\''sensor'\'' && doc.time) { var dateKey = doc.time.split('\''T'\'')[0]; emit(dateKey, { humidity: doc.humidity, coreTemperatureDelta: doc.coreTemperatureDelta, temperature: doc.temperature }); } }",
                     "reduce": "function (keys, values, rereduce) { var result = { count: 0, humiditySum: 0, coreTempDeltaSum: 0, minTemp: null, maxTemp: null }; values.forEach(function (value) { if (rereduce) { result.count += value.count; result.humiditySum += value.humiditySum; result.coreTempDeltaSum += value.coreTempDeltaSum; result.minTemp = Math.min(result.minTemp, value.minTemp); result.maxTemp = Math.max(result.maxTemp, value.maxTemp); } else { result.count += 1; if (value.humidity !== undefined) { result.humiditySum += value.humidity; } if (value.coreTemperatureDelta !== undefined) { result.coreTempDeltaSum += value.coreTemperatureDelta; } if (value.temperature !== undefined) { if (result.minTemp === null || value.temperature < result.minTemp) { result.minTemp = value.temperature; } if (result.maxTemp === null || value.temperature > result.maxTemp) { result.maxTemp = value.temperature; } } } }); return result; }"
                 }
             }
         }'
}

create_sensor_view_with_retry() {
    local retries=10
    for i in $(seq 1 $retries); do
        create_sensor_view && return 0
        echo "Retrying to create sensor view ($i/$retries)..."
        sleep 2
    done
    echo "Failed to create sensor view after $retries attempts."
    exit 1
}

# Start python server
# Use `start_python silent` to 'mute' terminal output
start_python() {
    cd python_radio
    . ./env/bin/activate
    if [ "$1" = "silent" ]; then
        python3 src/main.py > /dev/null 2>&1 &
    else
        python3 src/main.py &
    fi
    python_pid=$! # Store PID of the last background process
    cd ..
}

cleanup() {
    kill $python_pid  # Kill Python process
    docker-compose down  # Bring down docker container and reset database
}