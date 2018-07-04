# website
Vectronic website

## Environment Setup

`brew install hugo`
`npm install`

## Development

`export NETLIFY_API_AUTH=<value>`
`export NETLIFY_APPROVED_COMMENTS_FORM_ID=<value>`
`export SLACK_COMMENT_WEBHOOK_URL=<value>`
`export SENDINBLUE_API_AUTH=<value>`
`export SENDINBLUE_LIST_ID=<value>`
`export VECTRONIC_FUNCTION_AUTH=<value>`
`npx netlify-lambda serve src/functions`
`hugo server -w --disableFastRender --ignoreCache`


