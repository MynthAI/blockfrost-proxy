# Blockfrost Proxy

This service is a middleman between your app and Blockfrost. It sends
your requests to Blockfrost, gets the data back, and then sends it to
you. The main point is to hide your Blockfrost API key so you can still
use Blockfrost’s tools without letting everyone see your key.

## Usage

The Blockfrost Proxy is published as a container at
`quay.io/mynth/blockfrost-proxy`. Running requires access to a Vault
server for querying the Blockfrost API key. If your Vault server is
running locally, you can use:

``` sh
docker run \
    --add-host host.docker.internal:host-gateway \
    -e VAULT_CLI_TOKEN="$VAULT_CLI_TOKEN" \
    -e VAULT_CLI_URL=http://host.docker.internal:8200 \
    quay.io/mynth/blockfrost-proxy:latest
```

## Prerequisites

  - [node](https://nodejs.org/download/release/v18.18.2/) (\>=18.18)
  - Vault (see below section)
  - [Docker](https://docs.docker.com/engine/install/) (optional)

## Testing

To test locally, start the service

``` sh
npm run start
```

Then run the test:

``` sh
$ bin/test.sh
Attempt 1 of 5...
Endpoint is working
Success!
```

To test the container, build then run the container:

``` sh
npm run docker:build
npm run docker:run
```

Then run the test:

``` sh
$ bin/test.sh
Attempt 1 of 5...
Endpoint is working
Success!
```

## Setting Up Vault Secrets

This project utilizes Vault for secure storage of secrets. To set it up
on your computer, follow the steps provided on the [Local
Vault](https://github.com/MynthAI/local-vault) page. Afterward, proceed
to install [Vault Helper](https://github.com/MynthAI/vault-helper).

To view the list of secrets that require setup, execute the command
below:

``` bash
vault-helper template secrets
```

To set up the secrets, use `vault-cli set -p <secret-name>`. Reach out
to a team member to obtain the values for each secret.
