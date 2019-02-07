#!/bin/sh

# Find the line host_ip: X.X.X.X and replace it with the docker host ip on the yml file
sed -i -e 's/X.X.X.X/'$DOCKER_HOST_IP'/g' app/config.json

# Run the application
npm start
