const dotenv = require('dotenv')
const bolt = require('@slack/bolt')

dotenv.config()

const app = new bolt.App({
    port: process.env.APP_PORT || 3000,
    signingSecret: process.env.SLACK_SIGNING_SECRET || '',
    token: process.env.SLACK_BOT_TOKEN || '',
})

app.message('hello', async ({ message, say }) => {
  await say({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `Hey there <@${message.user}>!`,
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'Click Me',
          },
          action_id: 'button_click',
        }
      }
    ],
    text: `Hey there <@${message.user}>!`,
  })
})

app.action('button_click', async ({ body, ack, say }) => {
  await ack();
  await say(`<@${body.user.id}> clicked the button`);
})

const startSlackApp = async () => {
  await app.start()

  console.log('⚡️ Bolt app is running!')
}

startSlackApp()
