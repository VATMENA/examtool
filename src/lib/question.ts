export interface Question {
	version: "v1";
	type: string;
	canBeAutomaticallyGraded: boolean;
}

export interface AnsweredQuestion {
	question: Question;
}

// Multiple-choice
export interface MultipleChoiceQuestion extends Question {
	type: "multiple-choice";
	question: string;
	choices: MultipleChoiceAnswerOption[];
	canBeAutomaticallyGraded: true;
}
export interface MultipleChoiceAnswerOption {
	text: string;
	isCorrect: boolean;
}
export interface AnsweredMultipleChoiceQuestion extends AnsweredQuestion {
	selectedOption: number;
}