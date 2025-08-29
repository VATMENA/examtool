import { pgTable, integer, varchar, unique, serial, boolean, json } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const user = pgTable('user', {
	id: integer('id').primaryKey(),
	name_first: varchar('name_first').notNull(),
	name_last: varchar('name_last').notNull(),
});

export const userRelations = relations(user, ({ many }) => ({
	facilityRole: many(facilityRole),
}));

export const session = pgTable('session', {
	id: varchar('id').primaryKey(),
	secretHash: varchar('secretHash').notNull(),
	createdAt: integer('createdAt').notNull(),
	userId: integer('userId').references(() => user.id).notNull(),
});

export const facilityRole = pgTable('facilityRole', {
	id: serial('id').primaryKey(),
	userId: integer('userId').references(() => user.id).notNull(),
	facilityId: varchar('facilityId').notNull(),
	role: integer('role').notNull().default(0),
}, (t) => [
	unique().on(t.userId, t.facilityId)
]);

export const facilityRoleRelations = relations(facilityRole, ({ one }) => ({
	user: one(user, {
		fields: [facilityRole.userId],
		references: [user.id]
	})
}));

export const exam = pgTable('exam', {
	id: serial('id').primaryKey(),

	name: varchar('name').notNull(),
	description: varchar('description').notNull(),

	isRestricted: boolean('isRestricted').notNull(),

	facilityId: varchar('facilityId').notNull(),

	examTimeAlotted: integer('examTimeAlotted'),

	examQuestionCount: integer('examQuestionCount').notNull(),
});

export const examRelations = relations(exam, ({ many }) => ({
	questions: many(examAvailableQuestion),
}));

export const examAvailableQuestion = pgTable('examAvailableQuestion', {
	id: serial('id').primaryKey(),
	examId: integer('examId').references(() => exam.id).notNull(),
	questionData: json('questionData').notNull(),
});

export const examAvailableQuestionRelations = relations(examAvailableQuestion, ({ one }) => ({
	exam: one(exam, {
		fields: [examAvailableQuestion.examId],
		references: [exam.id]
	})
}));

export const auditLogEntry = pgTable('auditLogEntry', {
	id: serial('id').primaryKey(),
	timestamp: integer('timestamp').notNull(),
	userId: integer('userId').notNull(),
	action: varchar('action').notNull(),
	data: json('data').notNull(),
	facilityId: varchar('facilityId').notNull(),
});

export const examAdministration = pgTable('examAdministration', {
	id: serial('id').primaryKey(),

	examId: integer('examId').references(() => exam.id).notNull(),
	userId: integer('userId').references(() => user.id).notNull(),

	examData: json('examData').notNull(),

	startedAt: integer('startedAt').notNull(),
	timeExpiresAt: integer('timeExpiresAt').notNull(),

	isSubmitted: boolean('isSubmitted').notNull(),

	points: integer('points').notNull(),
	pointsAvailable: integer('pointsAvailable').notNull(),
});