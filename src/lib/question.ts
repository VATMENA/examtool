export interface Question {
	version: "v1";
	type: string;
	canBeAutomaticallyGraded: boolean;
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