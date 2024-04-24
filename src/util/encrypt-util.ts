import crypto from 'crypto';

function encrypt(plainText: string) {

    const initVector = crypto.randomBytes(12).toString('base64');

    let cipherText = "";
    
    if (process.env.ENCRYPT_KEY) {
        
        const cipher = crypto.createCipheriv(
            'aes-256-gcm',
            Buffer.from(process.env.ENCRYPT_KEY, 'base64'),
            Buffer.from(initVector, 'base64')
        );

        cipherText = cipher.update(plainText, 'utf8', 'base64');
        cipherText += cipher.final('base64');

    }
    
    // const tag = cipher.getAuthTag();

    return { cipherText, initVector }

}

function decrypt(cipherText: string, initVector: string) {

    let plainText = "";

    if (process.env.ENCRYPT_KEY) {

        const decipher = crypto.createDecipheriv(
            'aes-256-gcm',
            Buffer.from(process.env.ENCRYPT_KEY, 'base64'),
            Buffer.from(initVector, 'base64')
        );
        
        // decipher.setAuthTag(Buffer.from(tag, 'base64'));
        
        plainText = decipher.update(cipherText, 'base64', 'utf8');

    }
    
    // plainText += decipher.final('utf8');
    
    return plainText;

}

export { encrypt, decrypt };
