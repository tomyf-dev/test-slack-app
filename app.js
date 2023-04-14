const dotenv = require('dotenv')
const bolt = require('@slack/bolt')

dotenv.config()

const app = new bolt.App({
    port: process.env.APP_PORT || 3000,
    signingSecret: process.env.SLACK_SIGNING_SECRET || '',
    token: process.env.SLACK_BOT_TOKEN || '',
})

app.event('app_home_opened', async ({ event, client }) => {
    await client.views.publish({
      user_id: event.user,
      view: {
        type: 'home',
        callback_id: 'homem_view',
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: '*Welcome to your _App\'s Home_* :tada:',
            }
          },
          {
            type: 'divider',
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'This button won\'t do much for now but you can set up a listener for it using the `actions()` method and passing its unique `action_id`. See an example in the `examples` folder within your Bolt app.',
            }
          },
          {
            type: 'actions',
            elements: [
              {
                type: 'button',
                text: {
                  type: 'plain_text',
                  text: 'Click me!',
                }
              }
            ]
          }
        ]
      }
    })
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
  await ack()
  await say(`<@${body.user.id}> clicked the button`)
})

const startSlackApp = async () => {
  await app.start()

  console.log('⚡️ Bolt app is running!')
}

startSlackApp()
