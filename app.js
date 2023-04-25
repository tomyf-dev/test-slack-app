const dotenv = require('dotenv')
const bolt = require('@slack/bolt')

dotenv.config()

const app = new bolt.App({
  port: process.env.APP_PORT || 3000,
  signingSecret: process.env.SLACK_SIGNING_SECRET || '',
  token: process.env.SLACK_BOT_TOKEN || '',
})

const startSlackApp = async () => {
  await app.start()
  console.log('⚡️ Bolt app is running!')
}

/**
 * Event
 */
app.event('app_home_opened', async ({ client, body, event, say }) => {
  await client.views.publish({
    user_id: event.user,
    view: {
      type: 'home',
      callback_id: 'home_view',
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
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `Hey there <@${event.user}>!`,
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

/**
 * Message
 */
app.message('hello', async ({ client, body, message, say }) => {
  await say({
    thread_ts: message.event_ts,
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

/**
 * Shortcut
 */
app.shortcut('open_modal', async ({ client, body, shortcut, ack }) => {
  await ack()
  await client.views.open({
    trigger_id: body.trigger_id,
    view: {
      type: 'modal',
      callback_id: 'modal_view',
      title: {
        type: 'plain_text',
        text: 'My App',
      },
      close: {
        type: 'plain_text',
        text: 'Close',
      },
      blocks: [
        {
          type: 'section',
          block_id: 'section_view_1',
          text: {
            type: 'mrkdwn',
            text: 'views update',
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Just a button',
            },
            action_id: 'modal_button_update',
          }
        },
        {
          type: 'section',
          block_id: 'section_view_2',
          text: {
            type: 'mrkdwn',
            text: 'views push',
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: 'Just a button',
            },
            action_id: 'modal_button_push',
          }
        }
      ]
    }
  })
})

/**
 * Action
 */
app.action('modal_button_update', async ({ client, body, action, ack }) => {
  await ack()
  await client.views.update({
    view_id: body.view.id,
    hash: body.view.hash,
    view: {
      type: 'modal',
      callback_id: 'modal_view',
      title: {
        type: 'plain_text',
        text: 'Submit an issue',
      },
      submit: {
        type: 'plain_text',
        text: 'Submit',
      },
      blocks: [
        {
          type: 'input',
          block_id: 'ticket_title',
          label: {
            type: 'plain_text',
            text: 'Ticket title',
          },
          element: {
            type: 'plain_text_input',
            action_id: 'ticket_title_value',
          }
        },
        {
          type: 'input',
          block_id: 'ticket_desc',
          label: {
            type: 'plain_text',
            text: 'Ticket description',
          },
          element: {
            type: 'plain_text_input',
            multiline: true,
            action_id: 'ticket_desc_value',
          }
        }
      ]
    }
  })
})

app.action('modal_button_push', async ({ client, body, action, ack }) => {
  await ack()
  await client.views.push({
    trigger_id: body.trigger_id,
    view: {
      type: 'modal',
      callback_id: 'modal_view',
      title: {
        type: 'plain_text',
        text: 'Submit an issue',
      },
      submit: {
        type: 'plain_text',
        text: 'Submit',
      },
      blocks: [
        {
          type: 'input',
          block_id: 'ticket_title',
          label: {
            type: 'plain_text',
            text: 'Ticket title',
          },
          element: {
            type: 'plain_text_input',
            action_id: 'ticket_title_value',
          }
        },
        {
          type: 'input',
          block_id: 'ticket_desc',
          label: {
            type: 'plain_text',
            text: 'Ticket description',
          },
          element: {
            type: 'plain_text_input',
            multiline: true,
            action_id: 'ticket_desc_value',
          }
        }
      ]
    }
  })
})

/**
 * View
 */
app.view('modal_view', async ({ client, body, view, ack }) => {
  await ack()
})

startSlackApp()
