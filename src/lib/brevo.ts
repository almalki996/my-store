// src/lib/brevo.ts
// مكتبة إرسال الإيميلات باستخدام Brevo (SendinBlue)

import * as brevo from '@getbrevo/brevo';

// إعداد API
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY || '');

export interface EmailData {
  to: string;
  toName?: string;
  subject: string;
  htmlContent: string;
  textContent?: string;
}

export async function sendEmail(emailData: EmailData): Promise<boolean> {
  try {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    // المستقبل
    sendSmtpEmail.to = [{
      email: emailData.to,
      name: emailData.toName || 'عميل عزيز'
    }];
    
    // المرسل
    sendSmtpEmail.sender = {
      email: 'noreply@sofoit.uno',
      name: 'متجر SofoIT'
    };
    
    // المحتوى
    sendSmtpEmail.subject = emailData.subject;
    sendSmtpEmail.htmlContent = emailData.htmlContent;
    
    if (emailData.textContent) {
      sendSmtpEmail.textContent = emailData.textContent;
    }
    
    // إرسال الإيميل
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    
    console.log('Email sent successfully:', result.response?.statusCode);
    return true;
    
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// إيميل ترحيب للمستخدمين الجدد
export async function sendWelcomeEmail(userEmail: string, userName: string): Promise<boolean> {
  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .button { display: inline-block; background: #6366f1; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 مرحباً بك في متجر SofoIT</h1>
        </div>
        <div class="content">
          <h2>أهلاً وسهلاً ${userName}!</h2>
          <p>نحن سعداء جداً لانضمامك إلى عائلة متجر SofoIT. تم إنشاء حسابك بنجاح ويمكنك الآن الاستمتاع بتجربة تسوق مميزة.</p>
          
          <h3>🌟 ما يمكنك فعله الآن:</h3>
          <ul>
            <li>تصفح منتجاتنا المتنوعة</li>
            <li>إضافة المنتجات المفضلة لسلة التسوق</li>
            <li>الاستفادة من العروض الخاصة</li>
            <li>تتبع طلباتك بسهولة</li>
          </ul>
          
          <div style="text-align: center;">
            <a href="https://store.sofoit.uno" class="button">🛒 ابدأ التسوق الآن</a>
          </div>
          
          <p>إذا كان لديك أي استفسار، لا تتردد في التواصل معنا!</p>
        </div>
        <div class="footer">
          <p>© 2024 متجر SofoIT - جميع الحقوق محفوظة</p>
          <p>store.sofoit.uno | دعم فني: support@sofoit.uno</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: userEmail,
    toName: userName,
    subject: '🎉 مرحباً بك في متجر SofoIT - حسابك جاهز!',
    htmlContent,
    textContent: `مرحباً ${userName}! تم إنشاء حسابك بنجاح في متجر SofoIT. يمكنك الآن التسوق على store.sofoit.uno`
  });
}

// إيميل استعادة كلمة المرور
export async function sendPasswordResetEmail(userEmail: string, userName: string, resetToken: string): Promise<boolean> {
  const resetUrl = `https://store.sofoit.uno/reset-password?token=${resetToken}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #ef4444, #f97316); color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🔒 استعادة كلمة المرور</h1>
        </div>
        <div class="content">
          <h2>مرحباً ${userName}</h2>
          <p>تلقينا طلباً لاستعادة كلمة المرور لحسابك في متجر SofoIT.</p>
          
          <div style="text-align: center;">
            <a href="${resetUrl}" class="button">🔑 استعادة كلمة المرور</a>
          </div>
          
          <div class="warning">
            <strong>⚠️ تنبيه أمني:</strong>
            <ul>
              <li>هذا الرابط صالح لمدة 30 دقيقة فقط</li>
              <li>إذا لم تطلب استعادة كلمة المرور، تجاهل هذا الإيميل</li>
              <li>لا تشارك هذا الرابط مع أحد</li>
            </ul>
          </div>
          
          <p><strong>الرابط لا يعمل؟</strong> انسخ الرابط التالي ولصقه في المتصفح:</p>
          <p style="word-break: break-all; background: #f8f9fa; padding: 10px; border-radius: 5px; font-family: monospace;">
            ${resetUrl}
          </p>
        </div>
        <div class="footer">
          <p>© 2024 متجر SofoIT - جميع الحقوق محفوظة</p>
          <p>store.sofoit.uno | دعم فني: support@sofoit.uno</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: userEmail,
    toName: userName,
    subject: '🔒 استعادة كلمة المرور - متجر SofoIT',
    htmlContent,
    textContent: `مرحباً ${userName}! لاستعادة كلمة المرور، اذهب إلى: ${resetUrl} (الرابط صالح لمدة 30 دقيقة)`
  });
}

// إيميل تأكيد الطلب
export async function sendOrderConfirmationEmail(userEmail: string, userName: string, orderDetails: any): Promise<boolean> {
  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #10b981, #06b6d4); color: white; padding: 30px 20px; text-align: center; }
        .content { padding: 30px 20px; }
        .order-info { background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>✅ تم تأكيد طلبك</h1>
        </div>
        <div class="content">
          <h2>شكراً لك ${userName}!</h2>
          <p>تم استلام طلبك بنجاح وسيتم معالجته في أقرب وقت.</p>
          
          <div class="order-info">
            <h3>📦 تفاصيل الطلب:</h3>
            <p><strong>رقم الطلب:</strong> ${orderDetails.id || 'N/A'}</p>
            <p><strong>تاريخ الطلب:</strong> ${new Date().toLocaleDateString('ar-SA')}</p>
            <p><strong>إجمالي المبلغ:</strong> ${orderDetails.total || 'N/A'} ريال</p>
          </div>
          
          <p>سنرسل لك تحديثات حول حالة طلبك عبر البريد الإلكتروني.</p>
        </div>
        <div class="footer">
          <p>© 2024 متجر SofoIT - جميع الحقوق محفوظة</p>
          <p>store.sofoit.uno | دعم فني: support@sofoit.uno</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({
    to: userEmail,
    toName: userName,
    subject: `✅ تأكيد الطلب #${orderDetails.id || 'جديد'} - متجر SofoIT`,
    htmlContent,
    textContent: `شكراً ${userName}! تم تأكيد طلبك. رقم الطلب: ${orderDetails.id || 'جديد'}`
  });
}