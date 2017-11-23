import { ID } from './id';

export class Topic {
    id: number;
    properties: {
        name: string;
        description: string;
        status: string;
    }
    parents: number[];
    children: number[];
};