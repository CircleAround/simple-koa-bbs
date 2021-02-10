const { ValidationError } = require('sequelize')
const db = require('../models')
const Post = db.post
const mail = require('../lib/mail')
const nodemailer = require('nodemailer')

async function renderTop(ctx, post = {}, error = null) {
  const query = ctx.request.query
  const title = query.title
  const posts = await Post.latest(title ? { title } : {})  
  await ctx.render('top', {
    error: error,
    test: new Date(),
    posts: posts,
    post: post,
  })
}  

const index = async ctx => {
  // send mail with defined transport object
  let info = await mail.mailer().sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: "bar@example.com, baz@example.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

  return await renderTop(ctx)
}

const create = async ctx => {
  const post = { userId: ctx.state.currentUser.id, ...ctx.request.body }
  const entity = Post.build(post)
  try {
    await entity.save()
    ctx.redirect('/')
  } catch (e) {
    if(e instanceof ValidationError) {
      console.log(e)
      return renderTop(ctx, entity, e)
    }

    throw e
  }
}

module.exports = { index, create }
