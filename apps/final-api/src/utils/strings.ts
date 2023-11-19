export const escapeString = (text: string): string => {
	return text
		.replace(/_/g, '\\_')
		.replace(/\*/g, '\\*')
		.replace(/\[/g, '\\[')
		.replace(/\]/g, '\\]')
		.replace(/\(/g, '\\(')
		.replace(/\)/g, '\\)')
		.replace(/~/g, '\\~')
		.replace(/`/g, '\\`')
		.replace(/>/g, '\\>')
		.replace(/#/g, '\\#')
		.replace(/\+/g, '\\+')
		.replace(/-/g, '\\-')
		.replace(/=/g, '\\=')
		.replace(/\|/g, '\\|')
		.replace(/\{/g, '\\{')
		.replace(/\}/g, '\\}')
		.replace(/\./g, '\\.')
		.replace(/!/g, '\\!');
};
