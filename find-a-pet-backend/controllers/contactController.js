const nodemailer = require('nodemailer');

const sendContactEmail = async (req, res) => {
  const { name, email, message } = req.body;

  console.log('📨 Recibido desde el frontend:', { name, email, message });

  const transporter = nodemailer.createTransport({
    host: 'mail.spacemail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM, // más seguro para depurar
    to: process.env.EMAIL_FROM,
    subject: 'Nuevo mensaje de contacto',
    html: `
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Correo:</strong> ${email}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${message}</p>
    `
  };

  try {
    console.log('🚀 Enviando correo desde:', process.env.EMAIL_FROM);
    await transporter.sendMail(mailOptions);
    console.log('✅ Correo enviado exitosamente');
    res.status(200).json({ msg: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.error('❌ Error al enviar el mensaje:', error);
    res.status(500).json({ msg: 'Error al enviar el mensaje', error: error.message });
  }
};

module.exports = { sendContactEmail };
