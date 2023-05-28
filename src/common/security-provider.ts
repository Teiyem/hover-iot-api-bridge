import crypto from 'crypto';

export class SecurityProvider {
    private readonly algorithm: string;
    private readonly key: string;

    constructor() {
        this.algorithm = 'aes-256-cbc';
        this.key = "#aVk4%tkd%TevT@+&?enn@dUyP6JzzN!"; // TODO In Prod Move to Vault Or Env
    }

    /**
     * Encrypts a string.
     * @param data - The data to be encrypted.
     * @returns The encrypted data.
     */
    public encrypt(data: string): string {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(this.algorithm, this.key, iv);
        const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
        return iv.toString('base64') + ']' + encrypted.toString('base64');
    }

    /**
     * Decrypts a string.
     * @param data - The data to be decrypted.
     * @returns The decrypted string data.
     * @throws An error if the data is invalid.
     */
    public decrypt(data: string): string {
        const split = data.split(']');
        if (split.length !== 2) {
            throw new Error('Invalid data');
        }
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, Buffer.from(split[0], 'base64'));
        const decrypted = Buffer.concat([decipher.update(Buffer.from(split[1], 'base64')), decipher.final()]);
        return decrypted.toString();
    }
}
