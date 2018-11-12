# website
Vectronic website

## Environment Setup

Clone the repository locally.
 
Working from the root of the project, install required software (assuming MacOS):

```
brew install hugo
npm install
```

## Development

Define the following environment variables (these are described further below):
```
export NETLIFY_API_AUTH=<value>
export NETLIFY_APPROVED_COMMENTS_FORM_ID=<value>
export SLACK_COMMENT_WEBHOOK_URL=<value>
export SENDINBLUE_API_AUTH=<value>
export SENDINBLUE_LIST_ID=<value>
export VECTRONIC_FUNCTION_AUTH=<value>
```

Then:

`npm run build`

or

`npm run watch`


## Slack Configuration

#### Channels

Configure four channels:

* `#vectronic-comment` - Used to view comments submitted to posts on the website and either accept or reject them.
* `#vectronic-contact` - Used to view messages submitted via the website contact form.
* `#vectronic-subscribe` - Used to simply monitor subscriptions via the website.
 (a Netlify Function is used to automatically add subscription to a SendInBlue contact list).
* `#vectronic-deployment` - Used to view success or failure of Netlify deployments.

#### Contact App

Configure a new `vectronic-contact` app which has a Webhook posting to the `#vectronic-contact` channel. 

This will be used by a Slack Integration form notification configured in Netlify.

#### Subscribe App

Configure a new `vectronic-subscribe` app which has a Webhook posting to the `#vectronic-subscribe` channel. 

This will be used by a Slack Integration form notification configured in Netlify.

#### Comment App

Configure a new `vectronic-comment` app which has a Webhook posting to the `#vectronic-comment` channel. 

This will be used by the `comment-submitted` Netlify Function triggered when a new comment is stored in the `pending-comments` form.

As outlined further below, this webhook URL is exposed to the Netlify Function by configuring the Netlify environment variable `SLACK_COMMENT_WEBHOOK_URL`. 

The Command App also needs to have Interactivity configured so that a user can approve or delete the comment from Slack.
The Request URL needs to be configured to submit the user action to the Netlify Function handling this e.g.:

    https://vectronic.netlify.com/.netlify/functions/comment-action?VECTRONIC_FUNCTION_AUTH=<shared key>

Where the shared key is defined further below.

#### Deployment App

Configure a new `vectronic-deployment` app which has a Webhook posting to the `#vectronic-deployment` channel. 

This will be used by Slack Integration deploy notifications in Netlify.


## SendInBlue Configuration

#### Contact Fields

Ensure contacts are configured to have the following fields:

* `EMAIL`
* `LASTNAME`
* `FIRSTNAME`

#### Contact List

Create a list of contacts which will be added to each time someone subscribes. 
This will be used when configuring the Netlify `SENDINBLUE_LIST_ID` environment variable further below.

#### API Key

Create an API Key which will be used to manage the list of contacts when a subscription is processed via a Netlify Function. 
This will be used when configuring the Netlify `SENDINBLUE_API_AUTH` environment variable further below.


## Netlify Configuration

The configuration uses Netlify Forms and Functions Add-ons. These are both free for low volume usage.

#### One Time Only Table Creation

The form tables in Netlify are only added when initially submitting a form. The `pending-comments` and `approved-comments`
tables need to exist before they can be further referenced in configuration, so there is a need to do one off 
configuration for these.

##### Pending Comments

A test post needs to be created and a comment submitted on the post. This will result in the `pending-comments` form 
table appearing in the Netlify admin UI.

##### Approved Comments 
Entries in the `approved-comments` form table are only added via Slack webhook calls to the Netlify API. But this 
table needs to be created in Netlify first. 

The easiest way to do this is uncomment the `approved-comments` form in `comments.html`. 
After submitting to this form once, the `approved-comments` form table will appear in the Netlify admin UI. 
The form element in the HTML can then be commented out again. 

#### User Account Level OAuth Token

At the user account level in Netlify, create a new OAuth application personal access token called `vectronic-comments-management`.

This will be used when making Netlify API calls from Slack and Netlify Functions.   

#### Build Environment Variables

The following need to be defined:

* `NETLIFY_API_AUTH` - The `vectronic-comments-management` personal access token configured in Netlify OAuth 
applications section. 
* `NETLIFY_APPROVED_COMMENTS_FORM_ID` -  ID of the `approved-comments` form created in Netlify.
The value for this can be ascertained from the Netlify URL when navigating to `Account -> Site -> Forms -> approved-comments`.
* `SLACK_COMMENT_WEBHOOK_URL` - Incoming webhook URL for the comment app configured in Slack. 
* `SENDINBLUE_API_AUTH` - API key configured in SendInBlue.
* `SENDINBLUE_LIST_ID` - ID of a contact list configured in SendInBlue.
* `VECTRONIC_FUNCTION_AUTH` - This can be any shared secret key. It is used to prevent public access to the Netlify Functions. 

#### Build Hooks

Define a build hook which will be used to automatically rebuild the site when a new comment is approved.

#### Post Processing

Configure the following entry before `</head>` to inject Google analytics:

```
<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=<google-analytics-id>"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '<google-analytics-id>', { 'anonymize_ip': true });
</script>
```

Configure the following entry before `</body>` to add Google analytics events for external links: 

```
<script>
let outboundLinks = document.getElementsByTagName('a');
for (i = 0; i < outboundLinks.length; i++) {
	let outboundLink = outboundLinks[i];
	if (outboundLink.rel === "external") {
		outboundLink.onclick = function() {
		    if (window.ga && ga.create) {
                gtag('event', 'click', {
                    'event_category': 'outbound',
                    'event_label': outboundLink.href,
                    'transport_type': 'beacon',
                    'event_callback': function() {
                        document.location = outboundLink.href;
                    }
                });
            }
            else {
                document.location = outboundLink.href;
            }
			return false;
		}
	}
}
</script>
```

#### Asset Optimization

Configure the following optimizations:

* URLs: *Pretty URLs*
* CSS: *Bundle & Minify*
* JS: *Bundle & Minify*
* Images: *Lossless compression*

#### Deploy Notifications

Configure the following Slack Integrations:

* On deployment failure post to the `vectronic-deployment` app webhook configred in Slack.
* On deployment success post to the `vectronic-deployment` app webhook configred in Slack. This integration is just to 
be able to view subscription activity.

#### Domain Management

Configuration for Domains and HTTPS is based on standard Netlify instructions.

#### Form Notifications

Configure the following Slack Integrations:

* On `New form submission` to the `contact` form, post to the `vectronic-contact` app webhook configred in Slack.
* On `New form submission` to the `subscribe` form, post to the `vectronic-subscribe` app webhook configred in Slack. 
This integration is just to be able to view subscription activity.

Configure the following Outgoing Webhooks:

* On `New form submission` to the `subscribe` form, post to the `subscription` function passing the shared secret 
configured in Nelify e.g. 

        https://vectronic.netlify.com/.netlify/functions/subscription?VECTRONIC_FUNCTION_AUTH=<shared_secret>
* On `New form submission` to the `pending-comments` form, post to the `comment-submitted` function passing the shared 
secret configured in Nelify e.g. 

        https://vectronic.netlify.com/.netlify/functions/comment-submitted?VECTRONIC_FUNCTION_AUTH=<shared_secret>
* On `New form submission` to the `approved-comments` form, post to the build hook configured in Netlify.
