# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

- Ruby version

- System dependencies

- Configuration

- Database creation

- Database initialization

- How to run the test suite

- Services (job queues, cache servers, search engines, etc.)

- Deployment instructions

- ...

## Configure Stripe

### Install Stripe CLI

Stripe CLI is useful for authenticating locally in a development environment, and can be used to view error logs, monitor requests/responses from webhooks.

Taken from [Set up your development environment](https://docs.stripe.com/get-started/development-environment). Please refer to this website for up-to-date information if there is an issue with the following setup steps.

#### Debian/Ubuntu installation

1. Add Stripe CLI's CPG key to apt sources keyring:
   `curl -s https://packages.stripe.dev/api/security/keypair/stripe-cli-gpg/public | gpg --dearmor | sudo tee /usr/share/keyrings/stripe.gpg`

2. Add the CLI's apt repository to apt sources list: `echo "deb [signed-by=/usr/share/keyrings/stripe.gpg] https://packages.stripe.dev/stripe-cli-debian-local stable main" | sudo tee -a /etc/apt/sources.list.d/stripe.list`

3. Update apt package list: `sudo apt update`

4. Install Stripe CLI: `sudo apt install stripe`

In order to use the CLI, you must authenticate with: `stripe login` (note: this will prompt you to open a web browser to authenticate). As of the time of writing, you will need to reauthenticate the CLI every 90 days. You can test that the installation was successful by making a simple request, such as: `stripe products retrieve "PRODUCT_ID"`

### Setup Stripe API Keys

The Stripe test API key will be stored in Rails credentials and used for both development and production environments, for the purpose of demo'ing the project. The key is set within `config/application.rb`. You will need the master key to decrypt credentials.

### Setup ngrok for local endpoint testing

In order to test the local endpoint, set up `ngrok` for a unique url that can be added to the Stripe Dashboard Event Destination endpoint in order to test webhooks locally.

#### Install `ngrok`

##### Linux

Instructions taken from [ngrok Linux setup](https://dashboard.ngrok.com/get-started/setup/linux)

1. Install via `apt`:

```
curl -sSL https://ngrok-agent.s3.amazonaws.com/ngrok.asc \
	| sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \
	&& echo "deb https://ngrok-agent.s3.amazonaws.com buster main" \
	| sudo tee /etc/apt/sources.list.d/ngrok.list \
	&& sudo apt update \
	&& sudo apt install ngrok
```

2. Add auth token to `ngrok.yml` file: `ngrok config add-authtoken AUTH_TOKEN`

3. Run the following command to start the forwarding: `ngrok http --url=glad-promoted-falcon.ngrok-free.app 3000`. Please note that this needs to be running in order to test whether Stripe is sending events when triggering the API.

### Testing Stripe Webhooks

With an `ngrok` tunnel setup to `localhost`, and `stripe-cli` installed locally, run the command `ngrok http --url=glad-promoted-falcon.ngrok-free.app 3000` and then `stripe trigger payment_intent.succeeded` to test the Stripe Event Destination endpoint. Other useful `stripe` commands:

- `stripe listen` (monitor webhook events sent to the endpoint)
- `stripe logs tail` (monitor network responses to the Stripe endpoint)
