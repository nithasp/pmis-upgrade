export interface IBaseSection {
   id: number | string;
   title?: string;
   description?: string;
   typeSection: string;
   typeSectionDes: string;
   isRequired: boolean;
   no: number;
}

export interface IBaseQuestion {
   id: number;
   question: string;
   typeQuestion: string;
   typeQuestionDes: string;
   no: number;
   options?: IOption[];
   isDelete?: boolean;
}

export interface IOption {
   id?: number;
   no?: number;
   optionName: string;
   isDelete?: boolean;
}

export interface ISurveyDetailSection extends IBaseSection {
   questions?: ISurveyDetailQuestion[];
   satisfactionMin?: number;
   satisfactionDesMin?: string;
   satisfactionMax?: number;
   satisfactionDesMax?: string;
   isDelete?: boolean;
}

export interface ISurveyDetailQuestion extends IBaseQuestion {}

export interface ISurveyPayloadSection extends IBaseSection {
   questions?: ISurveyPayloadQuestion[];
}

export interface ISurveyPayloadQuestion extends IBaseQuestion {
   section_id?: number;
}

export interface ISendEmailSurveySection extends IBaseSection {
   questions?: ISendEmailSurveyQuestion[];
}

export interface ISendEmailSurveyQuestion extends IBaseQuestion {}

export interface ISurveyList {
   id: number;
   name: string;
   publishDate: string;
   endDate: string;
}

export interface ISurveyDetail {
   id?: number;
   name: string;
   description: string;
   publishSchedule?: boolean;
   publishDate?: string;
   endDate?: string;
   sections: ISurveyDetailSection[];
}

export interface ISurveyPayload {
   name: any;
   description: string;
   publishSchedule: boolean;
   publishDate: string;
   endDate: string;
   sections: ISurveyPayloadSection[];
}

export interface ISendEmailSurvey {
   id: number;
   name: string;
   description: string;
   publishSchedule: boolean;
   publishDate: string;
   endDate: string;
   sections: ISendEmailSurveySection[];
}

export interface ISurveyFilter {
   beginDate: string;
   endDate: string;
   page: number;
   limit: number;
   Order: {
      column: string
      dir: string
   }[]
}
