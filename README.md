# website
Vectronic website

## Environment Setup

`brew install hugo`
`npm install`

## Development

`export APPROVED_COMMENTS_FORM_ID=<value>`
`export NETLIFY_API_AUTH=<value>`
`export SLACK_PENDING_COMMENTS_WEBHOOK_URL=<value>`
`npx netlify-lambda serve src/functions`
`hugo server -w`


