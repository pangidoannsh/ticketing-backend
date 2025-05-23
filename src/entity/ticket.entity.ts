import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, OneToOne, Generated, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Category } from "./category.entity";
import { Feedback } from "./feedback.entity";
import { TicketMessage } from "./ticket-message.entity";
import { User } from "./user.entity";
import { Fungsi } from "./fungsi.entity";
import { TicketHistory } from "./ticket-history.entity";
import { TicketAssignment } from "./ticket-assignment.entity";

@Entity()
export class Ticket {
    @PrimaryGeneratedColumn({
        type: 'bigint'
    })
    id: number

    @Column()
    @Generated("uuid")
    slug: string

    @ManyToOne(() => User, user => user.ticketUpdater, { onDelete: 'SET NULL' })
    userUpdate: User

    @ManyToOne(() => User, user => user.ticketOrderer, { eager: true })
    userOrderer: User

    @Column({ nullable: true })
    userEmail: string

    @ManyToOne(() => Category, category => category.ticket, { eager: true, onDelete: 'CASCADE' })
    category: Category

    @ManyToOne(() => Fungsi, fungsi => fungsi.ticket, { eager: true, onDelete: 'SET NULL' })
    fungsi: Fungsi;

    @OneToOne(() => Feedback, feedback => feedback.ticket)
    feedback: Feedback

    @Column()
    subject: string

    @Column({ nullable: true })
    fileAttachment: string


    @Column({
        type: "enum",
        name: "status",
        nullable: false,
        enumName: "ticket_status",
        enum: ["open", "process", "feedback", "done", "expired"],
        default: "open"
    })
    status: string

    @Column({
        type: "enum",
        name: "priority",
        nullable: false,
        enumName: "priority_type",
        enum: ["low", "medium", "high"],
        default: "low"
    })
    priority: string

    @Column()
    expiredAt: Date

    @UpdateDateColumn({
        type: "datetime"
    })
    updatedAt: Date

    @CreateDateColumn({
        type: 'datetime'
    })
    createdAt: Date

    @Column({ nullable: true })
    finishAt: Date;

    @OneToMany(() => TicketMessage, ticketMessage => ticketMessage.ticket)
    ticketMessage: TicketMessage[]

    @OneToMany(() => TicketHistory, history => history.ticket)
    history: TicketHistory[]

    @OneToMany(() => TicketAssignment, assignment => assignment.ticket)
    assignment: TicketAssignment[]
}