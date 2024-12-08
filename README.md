# README

## Development

### Clone the project locally

`git clone git@github.com:dacraw/dairy-free-eats.git` (note, ssh needs to be enabled)

### Install Ruby gems

`bundle install`

### Setup the Postgres DB

`rails db:setup`

_Refer to the `database.yml` file with regards to configuring your development Postgres database. Specifically, note the use of `host: localhost` if you have an issue creating the database._

### Install frontend dependencies

`yarn`

### Start the app

`bin/dev`

Visit `localhost:3000` to view the app. Run `rails c` to view the Rails console.

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

### Testing Stripe Webhook Endpoint (Development)

In a separate terminal window, run the command:

```
stripe listen --forward-to localhost:3000/stripe/events
```

This will forward any webhook events to the development environment (note the port number). Since the test api key is being used in the deployed site as well, there is metadata logic encoded that will determine whether the environment is development or production, and forward the webhook event properly.

## Features

This app uses `solid_queue` and `solid_cable` to work around the need for `redis`, meaning jobs and websockets will be managed by the database.

ActiveJob leverages Solid Queue for several processes, such as sending emails when the admin changes an order status and creating notifications to be broadcasted to users

ActionCable powered GraphQL subscriptions rely on Solid Cable to manage new order message broadcasts. When a user creates an order, they gain access to the order's chat, which allows them to communicate with admins on the status of their order. Once an order is `completed`, user access to the chat is lost. However, an admin may view the chat for any order ever created through the Admin Dashboard.

You may demo admin functionality while logged out by clicking on the "User Account" icon in the header navigation, then selecting "Admin Demo". You will be redirected to the Admin Dashboard page, where you may set order statuses and view chat rooms for every order (regardless of its status).
