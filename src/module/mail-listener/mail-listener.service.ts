import { Injectable, OnModuleInit } from '@nestjs/common';
import * as Imap from 'imap';
import { simpleParser } from 'mailparser';
import { TicketService } from '../ticket/ticket.service';

@Injectable()
export class MailListenerService implements OnModuleInit {
    private imap: Imap;

    onModuleInit() {
        this.startListening();
    }

    constructor(
        private readonly ticketService: TicketService
    ) { }
    startListening() {
        this.imap = new Imap({
            user: 'dummy@email',
            password: 'password',
            host: 'host',
            port: 993,
            tls: true,
        });

        this.imap.once('ready', () => {
            console.log('✅ IMAP connection ready');
            this.openInbox(() => {
                // Listen for new mail after inbox is opened
                this.imap.on('mail', (numNewMsgs) => {
                    console.log(`📥 ${numNewMsgs} new mail received`);
                    this.fetchLatestEmail();
                });
            });
        });

        this.imap.once('error', (err) => {
            console.error('❌ IMAP Error:', err);
        });

        this.imap.once('end', () => {
            console.warn('⚠️ IMAP Connection ended');
        });

        this.imap.connect();
    }

    openInbox(callback: () => void) {
        this.imap.openBox('INBOX', false, (err, box) => {
            if (err) {
                console.error('❌ Failed to open inbox:', err);
                return;
            }
            console.log('📂 INBOX opened');
            callback();
        });
    }

    fetchLatestEmail() {
        this.imap.search(['UNSEEN'], (err, results) => {
            if (err) {
                console.error('❌ Search error:', err);
                return;
            }

            if (!results || results.length === 0) {
                console.log('ℹ️ No unseen messages');
                return;
            }

            const latest = results[results.length - 1]; // Ambil email terbaru

            const fetch = this.imap.fetch(latest, {
                bodies: '',
                struct: true,
            });

            fetch.on('message', (msg, seqno) => {
                console.log(`📨 New Message #${seqno}`);
                msg.on('body', async (stream) => {
                    try {
                        const parsed = await simpleParser(stream);
                        console.log(`📧 From: ${parsed.from?.text}`);
                        console.log(`📨 To: ${(parsed.to as any)?.text}`);
                        console.log(`📝 Subject: ${parsed.subject}`);
                        console.log(`📅 Date: ${parsed.date}`);
                        console.log(`📄 Text Body: ${parsed.text}`);
                        console.log(`📄 HTML Body: ${parsed.html}`);

                        if (parsed.attachments?.length) {
                            parsed.attachments.forEach((att, i) => {
                                console.log(`📎 Attachment #${i + 1}: ${att.filename}`);
                            });
                        }

                        this.ticketService.store({
                            category: 1,
                            fungsiId: 1,
                            message: parsed.text,
                            subject: parsed.subject,
                            userOrdererId: "1",
                            priority: "low"
                        }, null, true)
                    } catch (err) {
                        console.error('❌ Parsing error:', err);
                    }
                });

                msg.once('end', () => {
                    console.log('✅ Finished processing new message');
                });
            });

            fetch.once('error', (err) => {
                console.error('❌ Fetch error:', err);
            });
        });
    }
}
