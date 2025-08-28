import { pgTable, integer, varchar } from 'drizzle-orm/pg-core';

export const user = pgTable('user', {
	id: integer('id').primaryKey(),
	name_first: varchar('name_first').notNull(),
	name_last: varchar('name_last').notNull(),
	role: integer('role').notNull().default(0),
});

export const session = pgTable('session', {
	id: varchar('id').primaryKey(),
	secretHash: varchar('secretHash').notNull(),
	createdAt: integer('createdAt').notNull(),
	userId: integer('userId').references(() => user.id).notNull(),
});

