const Imap = require('imap');
const { simpleParser } = require('mailparser');

const config = {
    user: 'michael.krasnovskyi@gmail.com',
    password: 'bkan atqt zasd wmqg',
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
};

const fetchOptions = { bodies: '' };

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getLastNEmails(n) {
    return new Promise((resolve, reject) => {
        const imap = new Imap(config);

        imap.once('ready', function () {
            imap.openBox('INBOX', true, async function (err, box) {
                if (err) {
                    reject(err);
                    return;
                }

                await sleep(10000);

                imap.search(['ALL'], function (err, results) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    const f = imap.fetch(results.slice(-n), fetchOptions);

                    const emails = [];
                    let emailCount = 0;

                    f.on('message', function (msg, seqno) {
                        msg.on('body', function (stream, info) {
                            simpleParser(stream, (err, parsed) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }

                                emails.push(parsed);
                                emailCount++;

                                if (emailCount === results.slice(-n).length) {
                                    imap.end();
                                    resolve(emails);
                                }
                            });
                        });
                    });

                    f.once('error', function (err) {
                        reject(err);
                    });

                    f.once('end', function () {
                        if (emailCount < results.slice(-n).length) {
                            // If the fetch ended but not all emails are processed, wait for them
                            const checkEmails = setInterval(() => {
                                if (emailCount === results.slice(-n).length) {
                                    clearInterval(checkEmails);
                                    resolve(emails);
                                }
                            }, 100);
                        }
                    });
                });
            });
        });

        imap.once('error', function (err) {
            reject(err);
        });

        imap.once('end', function () {
            console.log('Connection ended');
        });

        imap.connect();
    });
}

export async function getMailWithSubjectAndRecipient(subject, recipient) {
    return new Promise((resolve, reject) => {
        const imap = new Imap(config);

        imap.once('ready', function () {
            imap.openBox('INBOX', true, async function (err, box) {
                if (err) {
                    reject(err);
                    return;
                }

                // Pause before search
                await sleep(10000);

                imap.search(['ALL'], function (err, results) {
                    if (err) {
                        reject(err);
                        return;
                    }

                    const f = imap.fetch(results, fetchOptions);

                    let foundEmails = [];
                    let emailCount = 0;

                    f.on('message', function (msg, seqno) {
                        msg.on('body', function (stream, info) {
                            simpleParser(stream, (err, parsed) => {
                                if (err) {
                                    reject(err);
                                    return;
                                }

                                const to = parsed.to.value.map(v => v.address).join(', ');

                                if (parsed.subject === subject && to.includes(recipient)) {
                                    foundEmails.push(parsed);
                                }
                                emailCount++;

                                if (emailCount === results.length) {
                                    imap.end();
                                    if (foundEmails.length > 0) {
                                        foundEmails.sort((a, b) => new Date(b.date) - new Date(a.date));
                                        resolve(foundEmails[0].text || foundEmails[0].html || null);
                                    } else {
                                        resolve(null);
                                    }
                                }
                            });
                        });
                    });

                    f.once('error', function (err) {
                        reject(err);
                    });

                    f.once('end', function () {
                        if (emailCount < results.length) {
                            // If the fetch ended but not all emails are processed, wait for them
                            const checkEmails = setInterval(() => {
                                if (emailCount === results.length) {
                                    clearInterval(checkEmails);
                                    if (foundEmails.length > 0) {
                                        foundEmails.sort((a, b) => new Date(b.date) - new Date(a.date));
                                        resolve(foundEmails[0].text || foundEmails[0].html || null);
                                    } else {
                                        resolve(null);
                                    }
                                }
                            }, 100);
                        }
                    });
                });
            });
        });

        imap.once('error', function (err) {
            reject(err);
        });

        imap.once('end', function () {
            console.log('Connection ended');
        });

        imap.connect();
    });
}

async function main() {
    try {
        // Get last N emails
        const n = 5;
        const lastNEmails = await getLastNEmails(n);
        console.log(`Last ${n} Emails:`);
        lastNEmails.forEach((email, index) => {
            console.log(`Email ${index + 1} Subject:`, email.subject);
        });

        // Search by recipient and subject
        const subject = 'SendTestEmail.com - Testing Email ID: 684705d0125a5eb32c4f4456a4bd63b5';
        const recipient = 'michael.krasnovskyi+testEmail01@gmail.com';
        const emailText = await getMailWithSubjectAndRecipient(subject, recipient);
        if (emailText) {
            console.log('Found Email Text:', emailText);
        } else {
            console.log('Email with specified subject and recipient not found.');
        }
    } catch (error) {
        console.error('Error fetching email:', error);
    }
}

main();