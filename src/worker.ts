export interface Env {
	DKIMPrivateKey: string;
}

interface EmailAddress {
	email: string;
	name?: string;
}

interface Personalization {
	to: [EmailAddress, ...EmailAddress[]];
	from?: EmailAddress;
	dkim_domain?: string;
	dkim_private_key?: string;
	dkim_selector?: string;
	reply_to?: EmailAddress;
	cc?: EmailAddress[];
	bcc?: EmailAddress[];
	subject?: string;
	headers?: Record<string, string>;
}

interface ContentItem {
	type: string;
	value: string;
}

interface MailSendBody {
	personalizations: [Personalization, ...Personalization[]];
	from: EmailAddress;
	reply_to?: EmailAddress;
	subject: string;
	content: [ContentItem, ...ContentItem[]];
	headers?: Record<string, string>;
}

export default {
	async scheduled(event, env, ctx) {
		const toEmailAddress: EmailAddress = {
			email: 'a@qqey.net',
		};
		const fromEmailAddress: EmailAddress = {
			email: 'noreply@qqey.net',
			name: 'noreply',
		};
		const personalization: Personalization = {
			to: [toEmailAddress],
			from: fromEmailAddress,
			dkim_domain: 'qqey.net',
			dkim_selector: 'mailchannels',
			dkim_private_key: env.DKIMPrivateKey,
		};
		const now = new Date().getTime();
		const content: ContentItem = {
			type: 'text/plain',
			value: `こんにちは。現在時刻をお知らせします。${now}`,
		};
		const payload = {
			personalizations: [personalization],
			from: fromEmailAddress,
			subject: 'cronmailからのお知らせ',
			content: [content],
		};
		const response = await fetch('https://api.mailchannels.net/tx/v1/send', {
			method: 'POST',
			headers: {
				'content-type': 'application/json',
			},
			body: JSON.stringify(payload),
		});
		console.log('Done', response.status);
	},
};
