// src/lib/turnstile.ts
// مكتبة للتحقق من Cloudflare Turnstile Token

export async function verifyTurnstileToken(token: string): Promise<boolean> {
    const secretKey = process.env.TURNSTILE_SECRET_KEY;
    
    if (!secretKey) {
        console.error('TURNSTILE_SECRET_KEY is not configured');
        return false;
    }

    try {
        const response = await fetch(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    secret: secretKey,
                    response: token,
                }),
            }
        );

        const data = await response.json();
        
        // تسجيل النتيجة للتطوير
        if (process.env.NODE_ENV === 'development') {
            console.log('Turnstile verification result:', data);
        }

        return data.success === true;
    } catch (error) {
        console.error('Error verifying Turnstile token:', error);
        return false;
    }
}

export function getTurnstileErrorMessage(errorCodes?: string[]): string {
    if (!errorCodes || errorCodes.length === 0) {
        return 'فشل في التحقق من أنك لست روبوت';
    }

    const errorMessages: Record<string, string> = {
        'missing-input-secret': 'مفتاح سري مفقود',
        'invalid-input-secret': 'مفتاح سري غير صحيح',
        'missing-input-response': 'رمز التحقق مفقود',
        'invalid-input-response': 'رمز التحقق غير صحيح',
        'bad-request': 'طلب غير صحيح',
        'timeout-or-duplicate': 'انتهت صلاحية التحقق أو مكرر',
        'internal-error': 'خطأ داخلي، يرجى المحاولة مرة أخرى'
    };

    // عرض أول رسالة خطأ معروفة
    for (const code of errorCodes) {
        if (errorMessages[code]) {
            return errorMessages[code];
        }
    }

    return 'فشل في التحقق من أنك لست روبوت';
}