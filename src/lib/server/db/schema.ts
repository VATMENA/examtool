import { pgTable, integer, varchar, unique, serial, boolean } from 'drizzle-orm/pg-core';
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
});