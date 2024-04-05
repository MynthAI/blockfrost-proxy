#!/usr/bin/env bash

max_attempts=5
attempt=1

check_epoch() {
  epoch=$(curl -m 5 -s http://localhost:3000/api/blockfrost/Preview/epochs/latest/parameters | jq '.epoch')

  if [ -z "$epoch" ] || [ "$epoch" = "null" ]; then
    return 1
  fi

  if [ "$epoch" -gt 133 ]; then
    echo "Endpoint is working"
    return 0
  else
    echo "Endpoint not working"
    return 1
  fi
}

while [ $attempt -le $max_attempts ]; do
  echo "Attempt $attempt of $max_attempts..."
  if check_epoch; then
    echo "Success!"
    exit 0
  else
    echo "The check failed or the endpoint is not ready. Retrying in 2 seconds..."
    sleep 2
    ((attempt++))
  fi
done

echo "Failed after $max_attempts attempts."
exit 1
